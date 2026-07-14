const fs = require('fs');
const path = require('path');

// Colors for terminal formatting
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function printHelp() {
  console.log(`
${COLORS.bright}${COLORS.cyan}Upstox Bulk Historical Candle Downloader${COLORS.reset}

Batch downloads historical daily candle data starting from 1996 for all NSE equities.
Tracks progress in 'historical-data/download-progress.json' and is fully resume-able.

${COLORS.bright}Usage:${COLORS.reset}
  node download-all-historical.js [options]

${COLORS.bright}Options:${COLORS.reset}
  -t, --token <token>        Upstox API Bearer Access Token (Required, or set UPSTOX_ACCESS_TOKEN env var)
  -s, --start <date>         Start date in YYYY-MM-DD format (default: 1996-01-01)
  -e, --end <date>           End date in YYYY-MM-DD format (default: today)
  --delay <ms>               Delay in milliseconds between requests (default: 500)
  --limit <number>           Maximum number of instruments to download (useful for testing)
  --nifty500                 Filter to only download Nifty 500 constituents
  -h, --help                 Show this help screen

${COLORS.bright}Example:${COLORS.reset}
  node download-all-historical.js --token "your_access_token" --nifty500
`);
}

function formatDateYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toMMDDYYYY(datePart) {
  const [y, m, d] = datePart.split('-');
  return `${m}/${d}/${y}`;
}

function formatVolume(vol) {
  if (vol === undefined || vol === null || isNaN(vol)) return '0';
  if (vol >= 1000000000) {
    return (vol / 1000000000).toFixed(2) + 'B';
  }
  if (vol >= 1000000) {
    return (vol / 1000000).toFixed(2) + 'M';
  }
  if (vol >= 1000) {
    return (vol / 1000).toFixed(2) + 'K';
  }
  return vol.toString();
}

function getChunks(startDateStr, endDateStr, chunkYears = 9) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid start or end date format. Use YYYY-MM-DD.');
  }
  
  const chunks = [];
  let currentEnd = new Date(end);
  
  while (currentEnd >= start) {
    let chunkStart = new Date(currentEnd);
    chunkStart.setFullYear(chunkStart.getFullYear() - chunkYears);
    
    if (chunkStart < start) {
      chunkStart = new Date(start);
    }
    
    const fromDateStr = formatDateYYYYMMDD(chunkStart);
    const toDateStr = formatDateYYYYMMDD(currentEnd);
    
    chunks.push({
      fromDate: fromDateStr,
      toDate: toDateStr
    });
    
    const nextEnd = new Date(chunkStart);
    nextEnd.setDate(nextEnd.getDate() - 1);
    currentEnd = nextEnd;
  }
  
  return chunks;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchCandlesWithRetry(instrument, toDate, fromDate, token, retries = 3) {
  const url = `https://api.upstox.com/v2/historical-candle/${encodeURIComponent(instrument)}/day/${toDate}/${fromDate}`;
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers });
      
      if (res.status === 429) {
        console.log(`    ${COLORS.yellow}[Rate Limited - HTTP 429] Waiting 10 seconds (Attempt ${attempt}/${retries})...${COLORS.reset}`);
        await sleep(10000);
        continue;
      }
      
      if (res.status === 401 || res.status === 403) {
        throw new Error(`AUTH_ERROR: API returned HTTP ${res.status}. Token may be invalid or expired.`);
      }

      if (!res.ok) {
        let errorMsg = '';
        try {
          const errData = await res.json();
          errorMsg = JSON.stringify(errData);
          if (errData.errors && errData.errors.some(e => e.errorCode === 'UDAPI100011' || e.message.includes('Instrument key'))) {
            const insErr = new Error(`INVALID_KEY: ${errData.errors[0].message}`);
            insErr.statusCode = res.status;
            throw insErr;
          }
        } catch (e) {
          if (e.message.startsWith('INVALID_KEY')) throw e;
          errorMsg = await res.text();
        }
        
        throw new Error(`API returned HTTP ${res.status}: ${errorMsg || res.statusText}`);
      }
      
      const json = await res.json();
      if (json.status !== 'success' || !json.data || !json.data.candles) {
        throw new Error(`Unexpected API response format: ${JSON.stringify(json)}`);
      }
      
      return json.data.candles;
    } catch (err) {
      if (err.message.startsWith('AUTH_ERROR') || err.message.startsWith('INVALID_KEY')) {
        throw err;
      }
      
      if (attempt === retries) {
        throw err;
      }
      
      console.log(`    ${COLORS.yellow}Connection error (Attempt ${attempt}/${retries}): ${err.message}. Retrying in 3s...${COLORS.reset}`);
      await sleep(3000);
    }
  }
}

async function fetchNifty500List() {
  const url = 'https://raw.githubusercontent.com/kprohith/nse-stock-analysis/master/ind_nifty500list.csv';
  console.log(`${COLORS.gray}Fetching Nifty 500 constituent list from GitHub raw...${COLORS.reset}`);
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Nifty 500 list: HTTP ${res.status}`);
  }
  
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const constituents = new Set();
  const symbols = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length >= 5) {
      const isin = parts[parts.length - 1].trim();
      const symbol = parts[parts.length - 3].trim();
      
      if (isin) constituents.add(isin);
      if (symbol) symbols.add(symbol);
    }
  }
  
  return { constituents, symbols };
}

async function main() {
  const args = process.argv.slice(2);
  let token = process.env.UPSTOX_ACCESS_TOKEN || '';
  let startDateStr = '1996-01-01';
  let endDateStr = '';
  let delayMs = 500;
  let limit = Infinity;
  let useNifty500 = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-t' || arg === '--token') {
      token = args[++i];
    } else if (arg === '-s' || arg === '--start') {
      startDateStr = args[++i];
    } else if (arg === '-e' || arg === '--end') {
      endDateStr = args[++i];
    } else if (arg === '--delay') {
      delayMs = parseInt(args[++i], 10);
    } else if (arg === '--limit') {
      limit = parseInt(args[++i], 10);
    } else if (arg === '--nifty500') {
      useNifty500 = true;
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      return;
    }
  }

  if (!token) {
    console.error(`${COLORS.red}Error: Bearer access token is required.${COLORS.reset}`);
    console.error(`Please provide it via --token / -t or set the UPSTOX_ACCESS_TOKEN environment variable.`);
    printHelp();
    process.exit(1);
  }

  // Load instruments list
  const instrumentsPath = path.join(__dirname, 'nse-instruments.json');
  if (!fs.existsSync(instrumentsPath)) {
    console.error(`${COLORS.red}Error: nse-instruments.json not found. Run "node scratch/download-nse-list.js" first!${COLORS.reset}`);
    process.exit(1);
  }

  console.log(`${COLORS.gray}Loading instrument list...${COLORS.reset}`);
  const instrumentsRaw = JSON.parse(fs.readFileSync(instrumentsPath, 'utf8'));
  const equities = instrumentsRaw.filter(item => item.segment === 'NSE_EQ' && item.instrument_key);
  console.log(`Loaded ${instrumentsRaw.length} total instruments, found ${equities.length} equities/ETFs (NSE_EQ).`);

  let filteredEquities = equities;
  if (useNifty500) {
    try {
      const { constituents, symbols } = await fetchNifty500List();
      filteredEquities = equities.filter(eq => constituents.has(eq.isin) || symbols.has(eq.trading_symbol));
      console.log(`Filtered to ${filteredEquities.length} instruments matching Nifty 500 list.`);
    } catch (err) {
      console.error(`${COLORS.red}Error loading Nifty 500 list: ${err.message}${COLORS.reset}`);
      process.exit(1);
    }
  }

  if (filteredEquities.length === 0) {
    console.error(`${COLORS.red}Error: No NSE_EQ instruments found in the list.${COLORS.reset}`);
    process.exit(1);
  }

  // Set default end date
  if (!endDateStr) {
    endDateStr = formatDateYYYYMMDD(new Date());
  }

  // Set up folders
  const outputDir = path.join(__dirname, 'historical-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load progress file
  const progressPath = path.join(outputDir, 'download-progress.json');
  let progress = {};
  if (fs.existsSync(progressPath)) {
    try {
      progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
    } catch (_) {}
  }

  const saveProgress = () => {
    try {
      fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2), 'utf8');
    } catch (err) {
      console.error(`${COLORS.red}Failed to save progress: ${err.message}${COLORS.reset}`);
    }
  };

  console.log(`${COLORS.bright}${COLORS.cyan}\nStarting Bulk Download...${COLORS.reset}`);
  console.log(`Output Directory  : ${outputDir}`);
  console.log(`Period            : ${startDateStr} to ${endDateStr}`);
  console.log(`Delay             : ${delayMs}ms`);
  if (limit !== Infinity) {
    console.log(`Limit             : ${limit} instruments`);
  }

  let chunks;
  try {
    chunks = getChunks(startDateStr, endDateStr, 9);
  } catch (err) {
    console.error(`${COLORS.red}Error: ${err.message}${COLORS.reset}`);
    process.exit(1);
  }

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  let processedThisSession = 0;

  for (const eq of filteredEquities) {
    const key = eq.instrument_key;

    // Check if already completed or failed in past runs
    if (progress[key]) {
      if (progress[key] === 'success') successCount++;
      if (progress[key] === 'failed') failedCount++;
      skippedCount++;
      continue;
    }

    if (processedThisSession >= limit) {
      console.log(`\nReached limit of ${limit} instruments. Stopping.`);
      break;
    }

    const sanitizedInstrument = key.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedInstrument}.csv`;
    const outputPath = path.join(outputDir, filename);

    console.log(`[${successCount + failedCount + 1}/${filteredEquities.length}] ${COLORS.blue}${eq.trading_symbol}${COLORS.reset} (${key})`);

    const candlesMap = new Map();
    let hasFailedChunk = false;
    let isInvalidKey = false;

    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      const chunk = chunks[chunkIdx];
      
      try {
        const candles = await fetchCandlesWithRetry(key, chunk.toDate, chunk.fromDate, token, 3);
        
        for (const candle of candles) {
          const [timestampStr, open, high, low, close, volume] = candle;
          if (!timestampStr) continue;
          
          const datePart = timestampStr.substring(0, 10);
          candlesMap.set(datePart, {
            datePart,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseInt(volume, 10)
          });
        }
      } catch (err) {
        if (err.message.startsWith('AUTH_ERROR')) {
          console.error(`\n${COLORS.red}Fatal: ${err.message}${COLORS.reset}`);
          saveProgress();
          process.exit(1);
        }
        
        if (err.message.startsWith('INVALID_KEY')) {
          isInvalidKey = true;
          console.log(`  ${COLORS.yellow}Invalid instrument key on Upstox API. Skipping.${COLORS.reset}`);
          break;
        }

        console.error(`  ${COLORS.red}Failed to fetch chunk ${chunk.fromDate} to ${chunk.toDate}: ${err.message}${COLORS.reset}`);
        hasFailedChunk = true;
        break; // skip this instrument if a chunk fails so we don't have incomplete datasets
      }

      if (chunkIdx < chunks.length - 1) {
        await sleep(delayMs);
      }
    }

    if (isInvalidKey) {
      progress[key] = 'failed';
      failedCount++;
      processedThisSession++;
      saveProgress();
      continue;
    }

    if (hasFailedChunk) {
      console.log(`  ${COLORS.yellow}Skipping due to transient errors. Will retry next run.${COLORS.reset}`);
      continue;
    }

    const uniqueCandles = Array.from(candlesMap.values());
    if (uniqueCandles.length === 0) {
      console.log(`  ${COLORS.yellow}No candle data available. Marking as failed.${COLORS.reset}`);
      progress[key] = 'failed';
      failedCount++;
      processedThisSession++;
      saveProgress();
      continue;
    }

    // Sort, compute change percentage, and reverse
    uniqueCandles.sort((a, b) => a.datePart.localeCompare(b.datePart));
    for (let i = 0; i < uniqueCandles.length; i++) {
      const current = uniqueCandles[i];
      if (i === 0) {
        current.changePercent = 0.00;
      } else {
        const prev = uniqueCandles[i - 1];
        current.changePercent = prev.close === 0 ? 0.00 : ((current.close - prev.close) / prev.close) * 100;
      }
    }
    uniqueCandles.reverse();

    // Generate CSV
    const csvLines = [];
    csvLines.push('"Date","Price","Open","High","Low","Vol.","Change %"');
    for (const candle of uniqueCandles) {
      const dateFormatted = toMMDDYYYY(candle.datePart);
      const closeStr = candle.close.toFixed(2);
      const openStr = candle.open.toFixed(2);
      const highStr = candle.high.toFixed(2);
      const lowStr = candle.low.toFixed(2);
      const volStr = formatVolume(candle.volume);
      const changeStr = (candle.changePercent >= 0 ? '+' : '') + candle.changePercent.toFixed(2) + '%';
      csvLines.push(`"${dateFormatted}","${closeStr}","${openStr}","${highStr}","${lowStr}","${volStr}","${changeStr}"`);
    }

    try {
      fs.writeFileSync(outputPath, csvLines.join('\n') + '\n', 'utf8');
      progress[key] = 'success';
      successCount++;
      processedThisSession++;
      console.log(`  ${COLORS.green}✔ Saved ${uniqueCandles.length} records to ${filename}.${COLORS.reset}`);
    } catch (err) {
      console.error(`  ${COLORS.red}❌ Failed to write file: ${err.message}${COLORS.reset}`);
    }

    // Auto-save progress file periodically
    if (processedThisSession % 10 === 0) {
      saveProgress();
    }

    await sleep(delayMs);
  }

  saveProgress();
  console.log(`\n${COLORS.bright}${COLORS.green}Bulk run summary:${COLORS.reset}`);
  console.log(`  Processed: ${processedThisSession}`);
  console.log(`  Total Active: ${successCount}`);
  console.log(`  Total Failed/Inactive: ${failedCount}`);
  console.log(`  Skipped (previously processed): ${skippedCount}`);
}

main().catch(err => {
  console.error(`\n${COLORS.red}Unhandled Bulk Downloader Error: ${err.message}${COLORS.reset}`);
  process.exit(1);
});
