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

// Formatter for Indian Rupees
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const currencyFormatterDecimal = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatCurrency(val, showDecimals = false) {
  return showDecimals ? currencyFormatterDecimal.format(val) : currencyFormatter.format(val);
}

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// Custom CSV Parser
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
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

// Robust XIRR Solver
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

function calculateSMA(data, period) {
  const sma = new Array(data.length).fill(null);
  if (data.length < period) return sma;

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  sma[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    sum = sum - data[i - period].close + data[i].close;
    sma[i] = sum / period;
  }
  return sma;
}

function printHelp() {
  console.log(`
${COLORS.bright}${COLORS.cyan}200-Day SMA Exit SIP Return Calculator${COLORS.reset}

Calculates returns using a trend-following stop-loss strategy. All stock holdings are sold
and parked in a savings account at 6% interest when the price falls below the 200-day SMA,
and bought back (swept) when the price rises back above the 200 SMA.

${COLORS.bright}Usage:${COLORS.reset}
  node sma-exit-sip.js [options]

${COLORS.bright}Options:${COLORS.reset}
  --amount, -a <number>      Monthly investment amount (default: 10000)
  --interest, -i <rate>      Savings interest rate per annum on cash (default: 0.06 / 6%)
  --period, -p <number>      Simple Moving Average period (default: 200)
  --start, -s <date>         Start date for simulation (DD/MM/YYYY or YYYY-MM-DD)
  --end, -e <date>           End date for simulation (DD/MM/YYYY or YYYY-MM-DD)
  --file, -f <path>          Path to custom CSV index/stock data file (default: nifty-data.csv)
  --report, -r <yearly|monthly> Report breakdown type (default: yearly)
  --help, -h                 Show this help screen
`);
}

function parseCLIDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      } else if (parts[0].length === 4) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function main() {
  const args = process.argv.slice(2);
  let monthlyAmount = 10000;
  let smaPeriod = 200;
  let annualInterest = 0.06;
  let startDateLimit = new Date(1996, 0, 1);
  let endDateLimit = new Date(2026, 7, 30);
  let csvFile = 'nifty-data.csv';
  let isDefaultFile = true;
  let reportType = 'yearly';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--amount' || arg === '-a') {
      monthlyAmount = parseFloat(args[++i]);
    } else if (arg === '--period' || arg === '-p') {
      smaPeriod = parseInt(args[++i], 10);
    } else if (arg === '--interest' || arg === '-i') {
      annualInterest = parseFloat(args[++i]);
    } else if (arg === '--start' || arg === '-s') {
      startDateLimit = parseCLIDate(args[++i]);
    } else if (arg === '--end' || arg === '-e') {
      endDateLimit = parseCLIDate(args[++i]);
    } else if (arg === '--file' || arg === '-f') {
      csvFile = args[++i];
      isDefaultFile = false;
    } else if (arg === '--report' || arg === '-r') {
      reportType = args[++i].toLowerCase();
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      return;
    }
  }

  const csvPath = isDefaultFile ? path.join(__dirname, csvFile) : path.resolve(csvFile);
  if (!fs.existsSync(csvPath)) {
    console.error(`${COLORS.red}Error: File not found at ${csvPath}!${COLORS.reset}`);
    process.exit(1);
  }

  console.log(`${COLORS.gray}Parsing ${path.basename(csvPath)}...${COLORS.reset}`);
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split(/\r?\n/);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCSVLine(line);
    if (row.length < 5) continue;

    const date = parseDateStr(row[0]);
    const closePrice = parseFloat(row[1].replace(/,/g, ''));

    if (date && !isNaN(closePrice)) {
      data.push({ date, close: closePrice });
    }
  }

  if (data.length === 0) {
    console.error(`${COLORS.red}Error: No valid data found in CSV!${COLORS.reset}`);
    process.exit(1);
  }

  // Sort chronological ascending
  data.sort((a, b) => a.date - b.date);

  // Calculate SMA
  const sma = calculateSMA(data, smaPeriod);
  for (let i = 0; i < data.length; i++) {
    data[i].sma = sma[i];
  }

  // Apply date filters
  let filteredData = data;
  if (startDateLimit) filteredData = filteredData.filter(row => row.date >= startDateLimit);
  if (endDateLimit) filteredData = filteredData.filter(row => row.date <= endDateLimit);

  if (filteredData.length === 0) {
    console.error(`${COLORS.red}Error: No data found for specified date range!${COLORS.reset}`);
    process.exit(1);
  }

  const actualStartDate = filteredData[0].date;
  const actualEndDate = filteredData[filteredData.length - 1].date;

  // Run Simulation
  let currentMonthKey = '';
  const transactions = [];
  const cashFlows = [];
  const dailyStates = [];

  let totalUnits = 0;
  let totalPocketInvested = 0;
  let savingsBalance = 0;
  let totalInterestEarned = 0;

  for (let i = 0; i < filteredData.length; i++) {
    const row = filteredData[i];
    const price = row.close;
    const currentSma = row.sma;

    // 1. Daily Compound Interest on bank cash
    if (i > 0 && savingsBalance > 0) {
      const prevDate = filteredData[i - 1].date;
      const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
      if (daysDiff > 0) {
        const interest = savingsBalance * (Math.pow(1 + annualInterest / 365, daysDiff) - 1);
        savingsBalance += interest;
        totalInterestEarned += interest;
      }
    }

    // 2. Trend Evaluator (Exit/Entry triggers)
    // Only execute checks when SMA is valid
    if (currentSma !== null) {
      const isBullMarket = (price >= currentSma);

      if (!isBullMarket && totalUnits > 0) {
        // Stop loss: Sell all stock, hold in bank
        const proceeds = totalUnits * price;
        savingsBalance += proceeds;
        transactions.push({
          type: 'SELL (Stop Loss)',
          date: row.date,
          price: price,
          units: totalUnits,
          proceeds: proceeds,
          savingsAfter: savingsBalance
        });
        totalUnits = 0;
      } else if (isBullMarket && savingsBalance > 0) {
        // Re-entry: Sweep savings balance back into stock
        const unitsBought = savingsBalance / price;
        totalUnits += unitsBought;
        transactions.push({
          type: 'BUY (Re-entry Sweep)',
          date: row.date,
          price: price,
          amountSpent: savingsBalance,
          unitsBought: unitsBought,
          totalUnitsAfter: totalUnits
        });
        savingsBalance = 0;
      }
    }

    // 3. Monthly Capital Allocation
    const year = row.date.getFullYear();
    const month = row.date.getMonth() + 1;
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

    if (monthKey !== currentMonthKey) {
      currentMonthKey = monthKey;
      totalPocketInvested += monthlyAmount;
      cashFlows.push({ date: row.date, amount: -monthlyAmount });

      // Determine where the new monthly capital goes
      const isSmaValid = (currentSma !== null);
      const isBull = isSmaValid && (price >= currentSma);

      if (isSmaValid && !isBull) {
        // Bear Market: Park in bank
        savingsBalance += monthlyAmount;
      } else {
        // Bull Market or SMA not yet calculated: Buy stock units directly
        totalUnits += monthlyAmount / price;
      }
    }

    dailyStates.push({
      date: row.date,
      price: price,
      savingsBalance: savingsBalance,
      totalUnits: totalUnits,
      totalPocketInvested: totalPocketInvested
    });
  }

  // End calculations
  const finalPrice = filteredData[filteredData.length - 1].close;
  const portfolioValue = (totalUnits * finalPrice) + savingsBalance;
  const totalProfit = portfolioValue - totalPocketInvested;
  const absoluteReturn = (totalProfit / totalPocketInvested) * 100;

  const finalCashFlows = [...cashFlows];
  finalCashFlows.push({ date: actualEndDate, amount: portfolioValue });
  const xirr = calculateXIRR(finalCashFlows);

  const durationMs = actualEndDate.getTime() - actualStartDate.getTime();
  const durationYears = durationMs / (365 * 24 * 60 * 60 * 1000);

  // Print Header Dashboard
  console.log('\n' + '='.repeat(90));
  console.log(`${COLORS.bright}${COLORS.cyan}                  200-DAY SMA EXIT SIP PERFORMANCE REPORT${COLORS.reset}`);
  console.log('='.repeat(90));
  console.log(`  ${COLORS.bright}Monthly Contribution :${COLORS.reset} ${formatCurrency(monthlyAmount)} monthly`);
  console.log(`  ${COLORS.bright}Stop-Loss indicator  :${COLORS.reset} Daily Price < ${smaPeriod}-day SMA`);
  console.log(`  ${COLORS.bright}Bank Interest Rate   :${COLORS.reset} ${(annualInterest * 100).toFixed(1)}% per annum`);
  console.log(`  ${COLORS.bright}Simulation Period    :${COLORS.reset} ${formatDate(actualStartDate)} to ${formatDate(actualEndDate)} (${durationYears.toFixed(2)} years)`);
  console.log('='.repeat(90));

  // Print Summary
  const profitColor = totalProfit >= 0 ? COLORS.green : COLORS.red;
  console.log(`\n  ${COLORS.bright}${COLORS.yellow}SMA EXIT PERFORMANCE SUMMARY:${COLORS.reset}`);
  console.log('  ' + '-'.repeat(86));
  console.log(`  ${COLORS.bright}Total User Cash Contributed:${COLORS.reset} ${formatCurrency(totalPocketInvested)}`);
  console.log(`  ${COLORS.bright}Total Interest on Cash     :${COLORS.reset} ${formatCurrency(totalInterestEarned)}`);
  console.log(`  ${COLORS.bright}Final Portfolio Value      :${COLORS.reset} ${formatCurrency(portfolioValue)}`);
  console.log(`    - Value in Stock Units   :${COLORS.reset} ${formatCurrency(totalUnits * finalPrice)}`);
  console.log(`    - Value in Bank Cash     :${COLORS.reset} ${formatCurrency(savingsBalance)}`);
  console.log(`  ${COLORS.bright}Total Profit / Loss        :${COLORS.reset} ${profitColor}${formatCurrency(totalProfit)}${COLORS.reset}`);
  console.log(`  ${COLORS.bright}Absolute Return            :${COLORS.reset} ${profitColor}${absoluteReturn.toFixed(2)}%${COLORS.reset}`);
  console.log(`  ${COLORS.bright}Annualized Return (XIRR)   :${COLORS.reset} ${profitColor}${xirr !== null ? xirr.toFixed(2) + '%' : 'N/A'}${COLORS.reset}`);
  console.log('  ' + '-'.repeat(86));
  console.log(`  ${COLORS.bright}Total Stock Units Held     :${COLORS.reset} ${totalUnits.toFixed(4)} units`);
  console.log(`  ${COLORS.bright}Total Sell Events Triggered:${COLORS.reset} ${transactions.filter(t => t.type.startsWith('SELL')).length} times`);
  console.log(`  ${COLORS.bright}Initial Stock Price        :${COLORS.reset} ${formatCurrency(filteredData[0].close, true)} (${formatDate(filteredData[0].date)})`);
  console.log(`  ${COLORS.bright}Final Stock Price          :${COLORS.reset} ${formatCurrency(finalPrice, true)} (${formatDate(actualEndDate)})`);
  console.log(`  ${COLORS.bright}Stock Absolute Growth      :${COLORS.reset} ${((finalPrice - filteredData[0].close) / filteredData[0].close * 100).toFixed(2)}%`);
  console.log('  ' + '-'.repeat(86));

  // Year breakdown
  console.log(`\n  ${COLORS.bright}${COLORS.yellow}YEAR-BY-YEAR PERFORMANCE BREAKDOWN:${COLORS.reset}`);
  console.log('  ' + '-'.repeat(102));
  console.log(`  ${COLORS.bright}${'Year'.padEnd(6)}${'Contr (Yr)'.padEnd(15)}${'Contr (Cum)'.padEnd(16)}${'Stock Val'.padEnd(15)}${'Bank Cash'.padEnd(15)}${'Portfolio Val'.padEnd(18)}${'Abs. Ret'.padEnd(12)}XIRR${COLORS.reset}`);
  console.log('  ' + '-'.repeat(102));

  const startYear = actualStartDate.getFullYear();
  const endYear = actualEndDate.getFullYear();

  for (let yr = startYear; yr <= endYear; yr++) {
    const endOfYear = new Date(yr, 11, 31, 23, 59, 59);
    let yearEndState = null;
    for (let j = dailyStates.length - 1; j >= 0; j--) {
      if (dailyStates[j].date <= endOfYear) {
        yearEndState = dailyStates[j];
        break;
      }
    }

    if (!yearEndState || yearEndState.date < actualStartDate) continue;

    const cashFlowsForYear = cashFlows.filter(cf => cf.date <= yearEndState.date);
    const yearPortfolioVal = (yearEndState.totalUnits * yearEndState.price) + yearEndState.savingsBalance;
    const yearProfit = yearPortfolioVal - yearEndState.totalPocketInvested;
    const yearAbsReturn = (yearProfit / yearEndState.totalPocketInvested) * 100;

    const yearCashFlows = [...cashFlowsForYear];
    yearCashFlows.push({ date: yearEndState.date, amount: yearPortfolioVal });
    const yearXirr = calculateXIRR(yearCashFlows);

    let yearInvested = 0;
    if (yr === startYear) {
      yearInvested = yearEndState.totalPocketInvested;
    } else {
      const prevYearEnd = new Date(yr - 1, 11, 31, 23, 59, 59);
      let prevYearState = null;
      for (let j = dailyStates.length - 1; j >= 0; j--) {
        if (dailyStates[j].date <= prevYearEnd) {
          prevYearState = dailyStates[j];
          break;
        }
      }
      yearInvested = prevYearState ? (yearEndState.totalPocketInvested - prevYearState.totalPocketInvested) : yearEndState.totalPocketInvested;
    }

    const yrStr = yr.toString();
    const contrYr = formatCurrency(yearInvested).padEnd(15);
    const contrCum = formatCurrency(yearEndState.totalPocketInvested).padEnd(16);
    const stockVal = formatCurrency(yearEndState.totalUnits * yearEndState.price).padEnd(15);
    const bankCashVal = formatCurrency(yearEndState.savingsBalance).padEnd(15);
    const portVal = formatCurrency(yearPortfolioVal).padEnd(18);
    const absRet = ((yearProfit >= 0 ? '+' : '') + yearAbsReturn.toFixed(1) + '%').padEnd(12);
    const xirrStr = yearXirr !== null ? (yearXirr >= 0 ? '+' : '') + yearXirr.toFixed(1) + '%' : 'N/A';

    console.log(`  ${yrStr}  ${contrYr}${contrCum}${stockVal}${bankCashVal}${portVal}${absRet}${xirrStr}`);
  }
  console.log('  ' + '-'.repeat(102) + '\n');
}

main();
