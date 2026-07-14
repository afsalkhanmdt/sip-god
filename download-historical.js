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
${COLORS.bright}${COLORS.cyan}Upstox Historical Candle Downloader${COLORS.reset}

Downloads historical daily candle data from the Upstox API.
Handles pagination automatically in chunks to bypass the 10-year limit.

${COLORS.bright}Usage:${COLORS.reset}
  node download-historical.js [options]

${COLORS.bright}Options:${COLORS.reset}
  -t, --token <token>        Upstox API Bearer Access Token (Required, or set UPSTOX_ACCESS_TOKEN env var)
  -i, --instruments <keys>   Comma-separated list of Upstox instrument keys (default: NSE_EQ|INF174K01F59)
  -s, --start <date>         Start date in YYYY-MM-DD format (default: 30 years ago)
  -e, --end <date>           End date in YYYY-MM-DD format (default: today)
  -o, --output-dir <path>    Directory to save CSV files (default: current directory)
  --cookie <cookie_string>   Optional cookie string to send with requests
  --delay <ms>               Delay in milliseconds between requests (default: 500)
  -h, --help                 Show this help screen

${COLORS.bright}Example:${COLORS.reset}
  node download-historical.js --token "your_access_token" --instruments "NSE_EQ|INF174K01F59,NSE_EQ|INE002A01018"
`);
}

function formatDateYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Convert YYYY-MM-DD to MM/DD/YYYY
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
  
  if (start > end) {
    throw new Error('Start date must be before end date.');
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

async function fetchCandles(instrument, toDate, fromDate, token, cookie) {
  const url = `https://api.upstox.com/v2/historical-candle/${encodeURIComponent(instrument)}/day/${toDate}/${fromDate}`;
  
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  if (cookie) {
    headers['Cookie'] = cookie;
  }
  
  const res = await fetch(url, { headers });
  
  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text();
    } catch (_) {}
    throw new Error(`API returned HTTP ${res.status}: ${errorText || res.statusText}`);
  }
  
  const json = await res.json();
  if (json.status !== 'success' || !json.data || !json.data.candles) {
    throw new Error(`Unexpected API response format: ${JSON.stringify(json)}`);
  }
  
  return json.data.candles;
}

async function main() {
  const args = process.argv.slice(2);
  let instrumentsInput = 'NSE_EQ|INF174K01F59';
  let token = process.env.UPSTOX_ACCESS_TOKEN || '';
  let startDateStr = '';
  let endDateStr = '';
  let outputDir = '.';
  let cookieStr = '';
  let delayMs = 500;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-i' || arg === '--instruments') {
      instrumentsInput = args[++i];
    } else if (arg === '-t' || arg === '--token') {
      token = args[++i];
    } else if (arg === '-s' || arg === '--start') {
      startDateStr = args[++i];
    } else if (arg === '-e' || arg === '--end') {
      endDateStr = args[++i];
    } else if (arg === '-o' || arg === '--output-dir') {
      outputDir = args[++i];
    } else if (arg === '--cookie') {
      cookieStr = args[++i];
    } else if (arg === '--delay') {
      delayMs = parseInt(args[++i], 10);
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

  const instruments = instrumentsInput.split(',').map(s => s.trim()).filter(Boolean);
  if (instruments.length === 0) {
    console.error(`${COLORS.red}Error: No instruments specified.${COLORS.reset}`);
    process.exit(1);
  }

  // Set default dates if not provided
  const today = new Date();
  if (!endDateStr) {
    endDateStr = formatDateYYYYMMDD(today);
  }
  if (!startDateStr) {
    const thirtyYearsAgo = new Date(today);
    thirtyYearsAgo.setFullYear(today.getFullYear() - 30);
    startDateStr = formatDateYYYYMMDD(thirtyYearsAgo);
  }

  // Warning for pre-2000 dates
  const startYear = parseInt(startDateStr.split('-')[0], 10);
  if (startYear < 2000) {
    console.log(`${COLORS.yellow}Note: Upstox daily historical data is only available from January 2000 onwards.`);
    console.log(`Although starting from ${startDateStr}, the API will likely only return data from 2000-01-01.${COLORS.reset}\n`);
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`${COLORS.bright}${COLORS.cyan}Starting download...${COLORS.reset}`);
  console.log(`Date Range: ${startDateStr} to ${endDateStr}`);
  console.log(`Instruments to fetch: ${instruments.length}`);
  console.log(`Inter-request delay: ${delayMs}ms\n`);

  let chunks;
  try {
    chunks = getChunks(startDateStr, endDateStr, 9);
  } catch (err) {
    console.error(`${COLORS.red}Error: ${err.message}${COLORS.reset}`);
    process.exit(1);
  }

  for (const instrument of instruments) {
    const sanitizedInstrument = instrument.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedInstrument}.csv`;
    const outputPath = path.join(outputDir, filename);

    console.log(`${COLORS.bright}Instrument: ${COLORS.blue}${instrument}${COLORS.reset} -> ${COLORS.gray}${outputPath}${COLORS.reset}`);

    const candlesMap = new Map(); // key: YYYY-MM-DD, value: candle object

    for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
      const chunk = chunks[chunkIdx];
      console.log(`  [Chunk ${chunkIdx + 1}/${chunks.length}] Fetching from ${chunk.fromDate} to ${chunk.toDate}...`);
      
      try {
        const candles = await fetchCandles(instrument, chunk.toDate, chunk.fromDate, token, cookieStr);
        console.log(`    Received ${candles.length} candles.`);
        
        for (const candle of candles) {
          const [timestampStr, open, high, low, close, volume] = candle;
          if (!timestampStr) continue;
          
          const datePart = timestampStr.substring(0, 10); // YYYY-MM-DD
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
        console.error(`    ${COLORS.red}Failed to fetch chunk: ${err.message}${COLORS.reset}`);
      }

      // Respect rate limits by sleeping between requests
      if (chunkIdx < chunks.length - 1 || instruments.indexOf(instrument) < instruments.length - 1) {
        await sleep(delayMs);
      }
    }

    const uniqueCandles = Array.from(candlesMap.values());
    if (uniqueCandles.length === 0) {
      console.log(`  ${COLORS.yellow}No candles downloaded for ${instrument}. CSV will not be written.${COLORS.reset}\n`);
      continue;
    }

    // Sort oldest to newest to calculate daily change percentage
    uniqueCandles.sort((a, b) => a.datePart.localeCompare(b.datePart));

    // Calculate Change %
    for (let i = 0; i < uniqueCandles.length; i++) {
      const current = uniqueCandles[i];
      if (i === 0) {
        current.changePercent = 0.00;
      } else {
        const prev = uniqueCandles[i - 1];
        if (prev.close === 0) {
          current.changePercent = 0.00;
        } else {
          current.changePercent = ((current.close - prev.close) / prev.close) * 100;
        }
      }
    }

    // Sort newest to oldest for output compatibility
    uniqueCandles.reverse();

    // Generate CSV contents
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
      console.log(`  ${COLORS.green}✔ Successfully wrote ${uniqueCandles.length} records to ${filename}.${COLORS.reset}\n`);
    } catch (err) {
      console.error(`  ${COLORS.red}❌ Failed to write file: ${err.message}${COLORS.reset}\n`);
    }
  }

  console.log(`${COLORS.bright}${COLORS.green}Done!${COLORS.reset}`);
}

main().catch(err => {
  console.error(`${COLORS.red}Unhandled execution error: ${err.message}${COLORS.reset}`);
  process.exit(1);
});
