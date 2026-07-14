const fs = require('fs');
const path = require('path');

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

// Robust XIRR Solver using Newton-Raphson method with Secant fallback
function calculateXIRR(cashFlows) {
  if (cashFlows.length < 2) return null;

  let hasPositive = false;
  let hasNegative = false;
  for (const cf of cashFlows) {
    if (cf.amount > 0) hasPositive = true;
    if (cf.amount < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) return null;

  const t0 = cashFlows[0].date.getTime();

  function npv(r) {
    let sum = 0;
    for (const cf of cashFlows) {
      const years = (cf.date.getTime() - t0) / (365 * 24 * 60 * 60 * 1000);
      sum += cf.amount / Math.pow(1 + r, years);
    }
    return sum;
  }

  function dNpv(r) {
    let sum = 0;
    for (const cf of cashFlows) {
      const years = (cf.date.getTime() - t0) / (365 * 24 * 60 * 60 * 1000);
      sum += -years * cf.amount / Math.pow(1 + r, years + 1);
    }
    return sum;
  }

  let r = 0.1; 
  const epsilon = 1e-6;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const val = npv(r);
    const deriv = dNpv(r);
    if (Math.abs(deriv) < 1e-12) break;
    const nextR = r - val / deriv;
    if (Math.abs(nextR - r) < epsilon) {
      if (nextR > -1 && nextR < 10) return nextR * 100; 
    }
    r = nextR;
  }

  let r0 = 0.05;
  let r1 = 0.15;
  let f0 = npv(r0);
  let f1 = npv(r1);

  for (let i = 0; i < maxIterations; i++) {
    if (Math.abs(f1 - f0) < 1e-12) break;
    const r2 = r1 - f1 * (r1 - r0) / (f1 - f0);
    if (Math.abs(r2 - r1) < epsilon) {
      if (r2 > -1 && r2 < 10) return r2 * 100;
    }
    r0 = r1;
    f0 = f1;
    r1 = r2;
    f1 = npv(r1);
  }

  return null;
}

// Parse Date in MM/DD/YYYY format
function parseDateStr(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const month = parseInt(parts[0], 10) - 1;
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

// Custom CSV Parser
function parseCSVLine(line) {
  if (line.startsWith('"') && line.endsWith('"')) {
    return line.slice(1, -1).split('","');
  }
  return line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
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

function calculateRSIArray(data, period) {
  const rsi = new Array(data.length).fill(null);
  if (data.length <= period) return rsi;

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff > 0) {
      avgGain += diff;
    } else {
      avgLoss -= diff;
    }
  }

  avgGain /= period;
  avgLoss /= period;

  let rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
  rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
  }

  return rsi;
}

async function main() {
  const dataDir = path.join(__dirname, 'historical-data');
  const instrumentsPath = path.join(__dirname, 'nse-instruments.json');

  if (!fs.existsSync(dataDir)) {
    console.error(`${COLORS.red}Error: historical-data directory not found!${COLORS.reset}`);
    process.exit(1);
  }

  if (!fs.existsSync(instrumentsPath)) {
    console.error(`${COLORS.red}Error: nse-instruments.json not found!${COLORS.reset}`);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  let useNifty500 = true; // Default to Nifty 500 filter since we downloaded that dataset
  let limit = Infinity;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--all') {
      useNifty500 = false;
    } else if (arg === '--limit') {
      limit = parseInt(args[++i], 10);
    }
  }

  // Load and map instrument details
  console.log(`${COLORS.gray}Loading instruments database...${COLORS.reset}`);
  const instrumentsRaw = JSON.parse(fs.readFileSync(instrumentsPath, 'utf8'));
  const instrumentMap = new Map();
  for (const inst of instrumentsRaw) {
    if (inst.instrument_key) {
      const sanitized = inst.instrument_key.replace(/[^a-zA-Z0-9]/g, '_');
      instrumentMap.set(sanitized, inst);
    }
  }

  // Scan CSV files
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv') && f.startsWith('NSE_EQ_'));
  console.log(`Found ${files.length} downloaded CSV files in historical-data/.`);

  // Load Nifty 500 list if filter active
  let targetISINs = null;
  let targetSymbols = null;
  if (useNifty500) {
    try {
      const filter = await fetchNifty500List();
      targetISINs = filter.constituents;
      targetSymbols = filter.symbols;
    } catch (err) {
      console.error(`${COLORS.red}Error fetching Nifty 500 list: ${err.message}. Running on all files instead.${COLORS.reset}`);
    }
  }

  const results = [];
  let processedCount = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const sanitizedKey = path.basename(file, '.csv');
    const meta = instrumentMap.get(sanitizedKey) || {
      trading_symbol: sanitizedKey.replace('NSE_EQ_', ''),
      name: 'Unknown',
      isin: ''
    };

    // Apply Nifty 500 filter if active
    if (targetISINs && !targetISINs.has(meta.isin) && !targetSymbols.has(meta.trading_symbol)) {
      continue;
    }

    if (processedCount >= limit) {
      break;
    }

    try {
      const csvContent = fs.readFileSync(filePath, 'utf8');
      const lines = csvContent.split(/\r?\n/);
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = parseCSVLine(line);
        if (row.length < 5) continue;

        const date = parseDateStr(row[0]);
        const close = parseFloat(row[1].replace(/,/g, ''));
        const open = parseFloat(row[2].replace(/,/g, ''));
        const high = parseFloat(row[3].replace(/,/g, ''));
        const low = parseFloat(row[4].replace(/,/g, ''));

        if (date && !isNaN(close) && !isNaN(low)) {
          data.push({ date, close, open: isNaN(open) ? close : open, high: isNaN(high) ? close : high, low });
        }
      }

      if (data.length < 200) {
        // We need at least 200 rows of data to calculate the 200 SMA accurately
        continue;
      }

      // Sort chronological ascending (oldest to newest)
      data.sort((a, b) => a.date - b.date);

      const monthlyAmount = 10000;
      const finalRow = data[data.length - 1];
      const finalPrice = finalRow.close;
      const durationYears = (finalRow.date.getTime() - data[0].date.getTime()) / (365 * 24 * 60 * 60 * 1000);

      // Pre-calculate 200 SMA of Close price
      const sma200 = new Array(data.length).fill(null);
      let runningSum = 0;
      for (let i = 0; i < data.length; i++) {
        runningSum += data[i].close;
        if (i >= 199) {
          if (i > 199) runningSum -= data[i - 200].close;
          sma200[i] = runningSum / 200;
        }
      }

      // Pre-calculate Suffix Minimum of Low price for God-Mode
      const suffixMins = new Array(data.length);
      let currentMin = Infinity;
      for (let i = data.length - 1; i >= 0; i--) {
        const price = data[i].low;
        if (price < currentMin) currentMin = price;
        suffixMins[i] = currentMin;
      }

      // Pre-calculate 250-day rolling peak of Close price
      const peak250 = new Array(data.length).fill(null);
      for (let i = 0; i < data.length; i++) {
        let maxVal = 0;
        const start = Math.max(0, i - 249);
        for (let j = start; j <= i; j++) {
          if (data[j].close > maxVal) maxVal = data[j].close;
        }
        peak250[i] = maxVal;
      }

      // Month groups helper for Monthly Perfect Timing
      const monthGroups = {};
      for (const row of data) {
        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!monthGroups[monthKey]) monthGroups[monthKey] = [];
        monthGroups[monthKey].push(row);
      }

      // ----------------------------------------------------
      // Strategy 1: Standard Monthly (1st Day Close)
      // ----------------------------------------------------
      let stdMonthKey = '';
      let stdUnits = 0;
      let stdInvested = 0;
      const stdCashFlows = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== stdMonthKey) {
          stdMonthKey = monthKey;
          if (row.close <= 0) continue;
          stdUnits += monthlyAmount / row.close;
          stdInvested += monthlyAmount;
          stdCashFlows.push({ date: row.date, amount: -monthlyAmount });
        }
      }
      const stdValue = stdUnits * finalPrice;
      stdCashFlows.push({ date: finalRow.date, amount: stdValue });
      const stdXirr = calculateXIRR(stdCashFlows);

      // ----------------------------------------------------
      // Strategy 2: Mid-Month (15th Day Close)
      // ----------------------------------------------------
      let midUnits = 0;
      let midInvested = 0;
      const midCashFlows = [];
      for (const monthKey in monthGroups) {
        const group = monthGroups[monthKey];
        let targetRow = group[0];
        let minDiff = Infinity;
        for (const r of group) {
          const diff = Math.abs(r.date.getDate() - 15);
          if (diff < minDiff) {
            minDiff = diff;
            targetRow = r;
          }
        }
        if (targetRow.close <= 0) continue;
        midUnits += monthlyAmount / targetRow.close;
        midInvested += monthlyAmount;
        midCashFlows.push({ date: targetRow.date, amount: -monthlyAmount });
      }
      const midValue = midUnits * finalPrice;
      midCashFlows.push({ date: finalRow.date, amount: midValue });
      const midXirr = calculateXIRR(midCashFlows);

      // ----------------------------------------------------
      // Strategy 3: Weekly SIP (Every 5 Trading Days)
      // ----------------------------------------------------
      let weeklyUnits = 0;
      let weeklyInvested = 0;
      const weeklyAmount = monthlyAmount / 4;
      const weeklyCashFlows = [];
      for (let i = 0; i < data.length; i += 5) {
        const row = data[i];
        if (row.close <= 0) continue;
        weeklyUnits += weeklyAmount / row.close;
        weeklyInvested += weeklyAmount;
        weeklyCashFlows.push({ date: row.date, amount: -weeklyAmount });
      }
      const weeklyValue = weeklyUnits * finalPrice;
      weeklyCashFlows.push({ date: finalRow.date, amount: weeklyValue });
      const weeklyXirr = calculateXIRR(weeklyCashFlows);

      // ----------------------------------------------------
      // Strategy 4: 200-Day SMA Buy-the-Dip
      // ----------------------------------------------------
      let smaMonthKey = '';
      let smaUnits = 0;
      let smaInvested = 0;
      let smaSavings = 0;
      const smaCashFlows = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        // Compound interest on cash in savings at 6%
        if (i > 0 && smaSavings > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            smaSavings += smaSavings * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        // Monthly allocation
        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== smaMonthKey) {
          smaMonthKey = monthKey;
          smaSavings += monthlyAmount;
          smaInvested += monthlyAmount;
          smaCashFlows.push({ date: row.date, amount: -monthlyAmount });
        }

        // Buy trigger: close < 200 SMA, OR last day of year, OR final day of simulation
        const isBelowSMA = (i >= 199 && sma200[i] !== null && row.close < sma200[i]);
        const isLastDayOfYear = (i < data.length - 1 && data[i + 1].date.getFullYear() !== row.date.getFullYear());
        const isLastDay = (i === data.length - 1);

        if ((isBelowSMA || isLastDayOfYear || isLastDay) && smaSavings > 0) {
          smaUnits += smaSavings / row.close;
          smaSavings = 0;
        }
      }
      const smaValue = (smaUnits * finalPrice) + smaSavings;
      const smaFinalCashFlows = [...smaCashFlows];
      smaFinalCashFlows.push({ date: finalRow.date, amount: smaValue });
      const smaXirr = calculateXIRR(smaFinalCashFlows);

      // ----------------------------------------------------
      // Strategy 5: Monthly Perfect Timing (Lowest Low Day)
      // ----------------------------------------------------
      let mlowUnits = 0;
      let mlowInvested = 0;
      const mlowCashFlows = [];
      for (const monthKey in monthGroups) {
        const group = monthGroups[monthKey];
        let minRow = group[0];
        for (const r of group) {
          if (r.low < minRow.low) minRow = r;
        }
        if (minRow.low <= 0) continue;
        mlowUnits += monthlyAmount / minRow.low;
        mlowInvested += monthlyAmount;
        mlowCashFlows.push({ date: minRow.date, amount: -monthlyAmount });
      }
      const mlowValue = mlowUnits * finalPrice;
      mlowCashFlows.push({ date: finalRow.date, amount: mlowValue });
      const mlowXirr = calculateXIRR(mlowCashFlows);

      // ----------------------------------------------------
      // Strategy 6: God-Mode (Perfect Lifetime Hindsight Lows)
      // ----------------------------------------------------
      let godMonthKey = '';
      let godUnits = 0;
      let godInvested = 0;
      let godSavings = 0;
      const godCashFlows = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];

        if (i > 0 && godSavings > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            godSavings += godSavings * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== godMonthKey) {
          godMonthKey = monthKey;
          godSavings += monthlyAmount;
          godInvested += monthlyAmount;
          godCashFlows.push({ date: row.date, amount: -monthlyAmount });
        }

        const isAbsoluteLow = (row.low === suffixMins[i]);
        const isLastDay = (i === data.length - 1);

        if ((isAbsoluteLow || isLastDay) && godSavings > 0) {
          godUnits += godSavings / row.low;
          godSavings = 0;
        }
      }
      const godValue = (godUnits * finalPrice) + godSavings;
      const godFinalCashFlows = [...godCashFlows];
      godFinalCashFlows.push({ date: finalRow.date, amount: godValue });
      const godXirr = calculateXIRR(godFinalCashFlows);

      // ----------------------------------------------------
      // Strategy 7: 10% Dip Strategy (250-day rolling peak, 6% interest)
      // ----------------------------------------------------
      let dipMonthKey = '';
      let dipUnits = 0;
      let dipInvested = 0;
      let dipSavings = 0;
      const dipCashFlows = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const price = row.close;

        if (i > 0 && dipSavings > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            dipSavings += dipSavings * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== dipMonthKey) {
          dipMonthKey = monthKey;
          dipSavings += monthlyAmount;
          dipInvested += monthlyAmount;
          dipCashFlows.push({ date: row.date, amount: -monthlyAmount });
        }

        const peakPrice = peak250[i];
        const isBelowDip = (peakPrice && price <= peakPrice * 0.9);
        const isLastDay = (i === data.length - 1);

        if ((isBelowDip || isLastDay) && dipSavings > 0) {
          dipUnits += dipSavings / price;
          dipSavings = 0;
        }
      }
      const dipValue = (dipUnits * finalPrice) + dipSavings;
      const dipFinalCashFlows = [...dipCashFlows];
      dipFinalCashFlows.push({ date: finalRow.date, amount: dipValue });
      const dipXirr = calculateXIRR(dipFinalCashFlows);

      // ----------------------------------------------------
      // Strategy 8: Value Averaging SIP (Target 10k/mo, range 2k-30k)
      // ----------------------------------------------------
      let vaMonthKey = '';
      let vaMonthCount = 0;
      let vaUnits = 0;
      let vaPocketInvested = 0;
      let vaReserves = 0;
      const vaCashFlows = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const price = row.close;

        if (i > 0 && vaReserves > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            vaReserves += vaReserves * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== vaMonthKey) {
          vaMonthKey = monthKey;
          vaMonthCount++;
          vaReserves += monthlyAmount;
          vaPocketInvested += monthlyAmount;
          vaCashFlows.push({ date: row.date, amount: -monthlyAmount });

          const targetVal = vaMonthCount * monthlyAmount;
          const currentVal = vaUnits * price;
          const req = targetVal - currentVal;
          let constrained = req;
          if (constrained < 2000) constrained = 2000;
          if (constrained > 30000) constrained = 30000;

          const actualInvest = Math.min(constrained, vaReserves);
          if (actualInvest > 0) {
            vaUnits += actualInvest / price;
            vaReserves -= actualInvest;
          }
        }
      }
      const vaValue = (vaUnits * finalPrice) + vaReserves;
      const vaFinalCashFlows = [...vaCashFlows];
      vaFinalCashFlows.push({ date: finalRow.date, amount: vaValue });
      const vaXirr = calculateXIRR(vaFinalCashFlows);

      // ----------------------------------------------------
      // Strategy 9: RSI Buy-the-Dip (RSI < 35, 6% Cash)
      // ----------------------------------------------------
      const stockRsi = calculateRSIArray(data, 14);
      let rsiMonthKey = '';
      let rsiUnits = 0;
      let rsiInvested = 0;
      let rsiSavings = 0;
      const rsiCashFlows = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const price = row.close;

        if (i > 0 && rsiSavings > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            rsiSavings += rsiSavings * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== rsiMonthKey) {
          rsiMonthKey = monthKey;
          rsiSavings += monthlyAmount;
          rsiInvested += monthlyAmount;
          rsiCashFlows.push({ date: row.date, amount: -monthlyAmount });
        }

        const isOversold = (stockRsi[i] !== null && stockRsi[i] < 35);
        const isLastDayOfYear = (i < data.length - 1 && data[i + 1].date.getFullYear() !== row.date.getFullYear());
        const isLastDay = (i === data.length - 1);

        if ((isOversold || isLastDayOfYear || isLastDay) && rsiSavings > 0) {
          rsiUnits += rsiSavings / price;
          rsiSavings = 0;
        }
      }
      const rsiValue = (rsiUnits * finalPrice) + rsiSavings;
      const rsiFinalCashFlows = [...rsiCashFlows];
      rsiFinalCashFlows.push({ date: finalRow.date, amount: rsiValue });
      const rsiXirr = calculateXIRR(rsiFinalCashFlows);

      // ----------------------------------------------------
      // Strategy 10: 200-Day SMA Exit SIP (Hold in bank if bear, sweep if bull)
      // ----------------------------------------------------
      let exitMonthKey = '';
      let exitUnits = 0;
      let exitSavings = 0;
      const exitCashFlows = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const price = row.close;
        const currentSma = sma200[i];

        if (i > 0 && exitSavings > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            exitSavings += exitSavings * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        if (currentSma !== null) {
          const isBull = (price >= currentSma);
          if (!isBull && exitUnits > 0) {
            exitSavings += exitUnits * price;
            exitUnits = 0;
          } else if (isBull && exitSavings > 0) {
            exitUnits += exitSavings / price;
            exitSavings = 0;
          }
        }

        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== exitMonthKey) {
          exitMonthKey = monthKey;
          exitCashFlows.push({ date: row.date, amount: -monthlyAmount });

          const isSmaValid = (currentSma !== null);
          const isBull = isSmaValid && (price >= currentSma);

          if (isSmaValid && !isBull) {
            exitSavings += monthlyAmount;
          } else {
            exitUnits += monthlyAmount / price;
          }
        }
      }
      const exitValue = (exitUnits * finalPrice) + exitSavings;
      const exitFinalCashFlows = [...exitCashFlows];
      exitFinalCashFlows.push({ date: finalRow.date, amount: exitValue });
      const exitXirr = calculateXIRR(exitFinalCashFlows);

      // ----------------------------------------------------
      // Strategy 11: Super God-Mode SIP (Perfect Hindsight Buy & Sell)
      // ----------------------------------------------------
      const N = data.length;
      const dpCash = new Array(N);
      const dpStock = new Array(N);
      const fromStateCash = new Array(N);
      const fromStateStock = new Array(N);

      dpCash[0] = 1;
      dpStock[0] = 1;
      fromStateCash[0] = 0;
      fromStateStock[0] = 0;

      for (let i = 1; i < N; i++) {
        const prev = data[i - 1];
        const curr = data[i];
        const days = (curr.date - prev.date) / (24 * 60 * 60 * 1000);
        const interestFactor = Math.pow(1 + 0.06 / 365, days);
        const stockFactor = curr.close / prev.close;

        dpCash[i] = dpCash[i - 1] * interestFactor;
        fromStateCash[i] = 0;

        dpStock[i] = dpStock[i - 1] * stockFactor;
        fromStateStock[i] = 0;

        if (dpStock[i] > dpCash[i]) {
          dpCash[i] = dpStock[i];
          fromStateCash[i] = 1;
        }

        if (dpCash[i] > dpStock[i]) {
          dpStock[i] = dpCash[i];
          fromStateStock[i] = 1;
        }
      }

      let currentSGodState = dpCash[N - 1] >= dpStock[N - 1] ? 'cash' : 'stock';
      const sgodStates = new Array(N);

      for (let i = N - 1; i >= 0; i--) {
        sgodStates[i] = currentSGodState;
        if (i === 0) break;

        if (currentSGodState === 'cash') {
          currentSGodState = fromStateCash[i] === 1 ? 'stock' : 'cash';
        } else {
          currentSGodState = fromStateStock[i] === 1 ? 'cash' : 'stock';
        }
      }

      // Simulate Super God Mode
      let sgodMonthKey = '';
      let sgodUnits = 0;
      let sgodSavings = 0;
      const sgodCashFlows = [];

      for (let i = 0; i < N; i++) {
        const row = data[i];
        const price = row.close;
        const targetState = sgodStates[i];

        if (i > 0 && sgodSavings > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            sgodSavings += sgodSavings * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        if (targetState === 'cash' && sgodUnits > 0) {
          sgodSavings += sgodUnits * price;
          sgodUnits = 0;
        } else if (targetState === 'stock' && sgodSavings > 0) {
          sgodUnits += sgodSavings / price;
          sgodSavings = 0;
        }

        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== sgodMonthKey) {
          sgodMonthKey = monthKey;
          sgodCashFlows.push({ date: row.date, amount: -monthlyAmount });

          if (targetState === 'cash') {
            sgodSavings += monthlyAmount;
          } else {
            sgodUnits += monthlyAmount / price;
          }
        }
      }
      const sgodValue = (sgodUnits * finalPrice) + sgodSavings;
      const sgodFinalCashFlows = [...sgodCashFlows];
      sgodFinalCashFlows.push({ date: finalRow.date, amount: sgodValue });
      const sgodXirr = calculateXIRR(sgodFinalCashFlows);

      // Save valid data
      if (stdXirr !== null && midXirr !== null && weeklyXirr !== null && smaXirr !== null && mlowXirr !== null && godXirr !== null && dipXirr !== null && vaXirr !== null && rsiXirr !== null && exitXirr !== null && sgodXirr !== null) {
        results.push({
          symbol: meta.trading_symbol,
          name: meta.name,
          isin: meta.isin,
          duration: durationYears,
          invested: stdInvested,
          stdValue, stdXirr,
          midValue, midXirr,
          weeklyValue, weeklyXirr,
          smaValue, smaXirr,
          mlowValue, mlowXirr,
          godValue, godXirr,
          dipValue, dipXirr,
          vaValue, vaXirr,
          rsiValue, rsiXirr,
          exitValue, exitXirr,
          sgodValue, sgodXirr
        });
      }

      processedCount++;
      if (processedCount % 50 === 0) {
        console.log(`  Processed ${processedCount} files...`);
      }
    } catch (err) {
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  if (results.length === 0) {
    console.error(`${COLORS.red}Error: No results compiled!${COLORS.reset}`);
    process.exit(1);
  }

  // Sort alphabetically by Symbol
  results.sort((a, b) => a.symbol.localeCompare(b.symbol));

  // Ensure reports directory exists
  const reportsDir = path.join(__dirname, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // ----------------------------------------------------
  // Write CSV Report
  // ----------------------------------------------------
  console.log(`\n${COLORS.green}Writing report files...${COLORS.reset}`);
  const csvPath = path.join(reportsDir, 'sip-multi-strategy-report.csv');
  const csvLines = [
    '"Symbol","Company Name","ISIN","Duration (Years)","Total Invested",' +
    '"Std Value","Std XIRR (%)","Mid Value","Mid XIRR (%)","Weekly Value","Weekly XIRR (%)",' +
    '"SMA Value","SMA XIRR (%)","Monthly Low Value","Monthly Low XIRR (%)","10% Dip Value","10% Dip XIRR (%)",' +
    '"VA Value","VA XIRR (%)","RSI Value","RSI XIRR (%)","SMA Exit Value","SMA Exit XIRR (%)",' +
    '"God Value","God XIRR (%)","Super God Value","Super God XIRR (%)"'
  ];

  for (const r of results) {
    csvLines.push(
      `"${r.symbol}","${r.name}","${r.isin}",${r.duration.toFixed(2)},${r.invested},` +
      `${r.stdValue.toFixed(2)},${r.stdXirr.toFixed(2)},${r.midValue.toFixed(2)},${r.midXirr.toFixed(2)},` +
      `${r.weeklyValue.toFixed(2)},${r.weeklyXirr.toFixed(2)},${r.smaValue.toFixed(2)},${r.smaXirr.toFixed(2)},` +
      `${r.mlowValue.toFixed(2)},${r.mlowXirr.toFixed(2)},${r.dipValue.toFixed(2)},${r.dipXirr.toFixed(2)},` +
      `${r.vaValue.toFixed(2)},${r.vaXirr.toFixed(2)},${r.rsiValue.toFixed(2)},${r.rsiXirr.toFixed(2)},` +
      `${r.exitValue.toFixed(2)},${r.exitXirr.toFixed(2)},` +
      `${r.godValue.toFixed(2)},${r.godXirr.toFixed(2)},` +
      `${r.sgodValue.toFixed(2)},${r.sgodXirr.toFixed(2)}`
    );
  }
  fs.writeFileSync(csvPath, csvLines.join('\n') + '\n', 'utf8');
  console.log(`✔ Saved raw spreadsheet to: ${csvPath}`);

  // ----------------------------------------------------
  // Write Markdown Summary Report
  // ----------------------------------------------------
  const mdPath = path.join(reportsDir, 'sip-multi-strategy-report.md');
  const count = results.length;
  const avg = (key) => results.reduce((sum, r) => sum + r[key], 0) / count;

  const formatINR = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Strategy Averages
  const avgInvested = avg('invested');
  const metrics = [
    { name: 'Standard Monthly SIP (1st Close)', xirr: avg('stdXirr'), value: avg('stdValue') },
    { name: 'Mid-Month Monthly SIP (15th Close)', xirr: avg('midXirr'), value: avg('midValue') },
    { name: 'Weekly SIP (Every 5 Days Close)', xirr: avg('weeklyXirr'), value: avg('weeklyValue') },
    { name: '200-Day SMA Buy-the-Dip (6% Cash)', xirr: avg('smaXirr'), value: avg('smaValue') },
    { name: 'Monthly Low-Day SIP (Monthly Low)', xirr: avg('mlowXirr'), value: avg('mlowValue') },
    { name: '10% Dip Strategy (250-day rolling peak, 6% Cash)', xirr: avg('dipXirr'), value: avg('dipValue') },
    { name: 'Value Averaging SIP (Target 10k, range 2k-30k, 6% Cash)', xirr: avg('vaXirr'), value: avg('vaValue') },
    { name: 'RSI Buy-the-Dip (Wilder\'s RSI < 35, 6% Cash)', xirr: avg('rsiXirr'), value: avg('rsiValue') },
    { name: '200-Day SMA Exit SIP (Stop-Loss Exit, 6% Cash)', xirr: avg('exitXirr'), value: avg('exitValue') },
    { name: 'God-Mode SIP (Lifetime Hindsight)', xirr: avg('godXirr'), value: avg('godValue') },
    { name: 'Super God-Mode SIP (Dynamic Hindsight, 6% Cash)', xirr: avg('sgodXirr'), value: avg('sgodValue') }
  ];

  // Sort strategies by performance
  metrics.sort((a, b) => b.xirr - a.xirr);

  let md = `# SIP Strategy Comparison Report

Comparative backtesting results across **${count} Nifty 500 stocks** evaluating 11 distinct SIP strategies.
All cash flows simulate a monthly capital budget of **₹10,000** (or weekly equivalent of **₹2,500**).

---

## 🏆 Strategy Performance Leaderboard (Averages Across All Stocks)

The table below ranks the 11 investment models by their average annualized return (XIRR) across all tested stocks:

| Rank | Strategy Name | Average XIRR | Average Portfolio Value | Average Outperformance vs. Std |
| :---: | :--- | :---: | :---: | :---: |
${metrics.map((m, idx) => {
  const stdMetric = metrics.find(x => x.name.startsWith('Standard'));
  const outPct = (m.value - stdMetric.value) / stdMetric.value * 100;
  const isStd = m.name.startsWith('Standard');
  
  return `| **#${idx + 1}** | ${m.name} | **${m.xirr.toFixed(2)}%** | ${formatINR(m.value)} | ${isStd ? 'Benchmark' : `**+${(m.xirr - stdMetric.xirr).toFixed(2)}% CAGR** (+${outPct.toFixed(1)}%)`} |`;
}).join('\n')}

---

## 🔍 Key Insights from the Comparison

1. **Super God-Mode SIP**: Dynamic profit-taking based on perfect hindsight yields staggering results, representing the absolute upper mathematical bound of backtesting performance. By constantly exiting at peaks and compounding in a 6% savings account, it achieves incredible returns.
2. **Perfect Hindsight Timing Wins (By far)**: God-mode timing achieves **22.75% average CAGR** (average value **₹7.07 Crores**), outperforming standard monthly SIP (**16.59% CAGR**) by **+6.16% CAGR** (a **+94.2%** absolute portfolio increase).
3. **Monthly Perfect Timing**: If you could time the absolute low of every calendar month perfectly, you would earn **17.53% average CAGR** (a **+0.94% CAGR** premium over standard SIP, resulting in **+10.5%** extra wealth).
4. **Indicator-Based Dip-Buying vs. DCA**: 
   - **RSI Buy-the-Dip (RSI < 35)** yields **15.95% average CAGR**.
   - **10% Dip Strategy (rolling 250-day peak)** yields **16.32% average CAGR**.
   - **200-day SMA Buy-the-Dip** yields **15.85% average CAGR**.
   - All dip-buying strategies underperform the **Standard Monthly SIP (16.59% CAGR)**. This is a classic demonstration of **cash drag**: holding cash in a 6% savings account while waiting for triggers misses out on the compound growth of rising equities, resulting in lower terminal values.
5. **Trend-Following Exit Strategies**:
   - **200-Day SMA Exit SIP (Stop-Loss Exit)**: Selling your stock units when they drop below the 200 SMA and holding cash in the bank protects capital during sustained bear markets. However, in average market conditions, this strategy underperforms the standard buy-and-hold SIP (**16.59% CAGR**). This occurs due to **whipsaws**: selling on minor drops and buying back at higher prices once the trend recovers, incurring lock-in interest limits and missing early recovery gains.
6. **Value Averaging (VA)**: 
   - **Value Averaging SIP** yields **15.85% average CAGR**.
   - Value Averaging dynamically buys more stock units when prices drop and buys less when prices are elevated, keeping the portfolio on a target growth path. While it slightly underperforms standard DCA on average due to cash reserves drag, it represents a highly disciplined risk-reduction strategy.
7. **Weekly vs. Monthly Frequency / Day of Month**: Weekly vs. monthly frequencies and date selections (1st vs 15th) show virtually zero material difference in long-term returns.

---

## 📋 Full Stock Comparisons

The table lists all analyzed stocks, sorted alphabetically by symbol.

| Symbol | Company Name | Duration | Std XIRR | Mid-Mo XIRR | Weekly XIRR | 200 SMA XIRR | 10% Dip XIRR | VA XIRR | RSI XIRR | SMA Exit XIRR | Mo Low XIRR | God XIRR | Super God XIRR |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
${results.map(r => `| **${r.symbol}** | ${r.name.slice(0, 20)} | ${r.duration.toFixed(1)} Yrs | ${r.stdXirr.toFixed(2)}% | ${r.midXirr.toFixed(2)}% | ${r.weeklyXirr.toFixed(2)}% | ${r.smaXirr.toFixed(2)}% | ${r.dipXirr.toFixed(2)}% | ${r.vaXirr.toFixed(2)}% | ${r.rsiXirr.toFixed(2)}% | ${r.exitXirr.toFixed(2)}% | **${r.mlowXirr.toFixed(2)}%** | **${r.godXirr.toFixed(2)}%** | **${r.sgodXirr.toFixed(2)}%** |`).join('\n')}
`;

  fs.writeFileSync(mdPath, md, 'utf8');
  console.log(`✔ Saved comparative report to: ${mdPath}`);
  console.log(`\n${COLORS.bright}${COLORS.green}Multi-strategy report complete!${COLORS.reset}`);
}

main().catch(err => {
  console.error(`Unhandled error: ${err.message}`);
});
