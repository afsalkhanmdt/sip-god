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

// Formatter for Indian Rupees (Lakhs/Crores grouping)
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

// Custom CSV Parser that handles double quotes and commas within numbers
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

// Robust XIRR Solver using Newton-Raphson method with Secant fallback
function calculateXIRR(cashFlows) {
  if (cashFlows.length < 2) return null;

  // Verify that we have both positive and negative cash flows
  let hasPositive = false;
  let hasNegative = false;
  for (const cf of cashFlows) {
    if (cf.amount > 0) hasPositive = true;
    if (cf.amount < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) return null;

  const t0 = cashFlows[0].date.getTime();

  // NPV function
  function npv(r) {
    let sum = 0;
    for (const cf of cashFlows) {
      const years = (cf.date.getTime() - t0) / (365 * 24 * 60 * 60 * 1000);
      sum += cf.amount / Math.pow(1 + r, years);
    }
    return sum;
  }

  // NPV Derivative function
  function dNpv(r) {
    let sum = 0;
    for (const cf of cashFlows) {
      const years = (cf.date.getTime() - t0) / (365 * 24 * 60 * 60 * 1000);
      sum += -years * cf.amount / Math.pow(1 + r, years + 1);
    }
    return sum;
  }

  // Newton-Raphson Solver
  let r = 0.1; // 10% initial guess
  const epsilon = 1e-6;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const val = npv(r);
    const deriv = dNpv(r);
    if (Math.abs(deriv) < 1e-12) break;
    const nextR = r - val / deriv;
    if (Math.abs(nextR - r) < epsilon) {
      if (nextR > -1 && nextR < 10) return nextR * 100; // Return percentage
    }
    r = nextR;
  }

  // Fallback: Secant Method
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

// Print CLI usage help
function printHelp() {
  console.log(`
${COLORS.bright}${COLORS.cyan}Nifty 50 SIP Return Calculator${COLORS.reset}

Calculates Systematic Investment Plan (SIP) returns using historical Nifty 50 CSV data.

${COLORS.bright}Usage:${COLORS.reset}
  node index.js [options]

${COLORS.bright}Options:${COLORS.reset}
  --amount, -a <number>      Monthly investment amount (default: 10000)
  --price, -p <close|open>   Price column to buy index at (default: close)
  --start, -s <date>         Start date for simulation (DD/MM/YYYY or YYYY-MM-DD)
  --end, -e <date>           End date for simulation (DD/MM/YYYY or YYYY-MM-DD)
  --file, -f <path>          Path to custom CSV index data file (default: nifty-data.csv)
  --help, -h                 Show this help screen
`);
}

// Parse Command Line Date
function parseCLIDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        // DD/MM/YYYY
        return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      } else if (parts[0].length === 4) {
        // YYYY/MM/DD
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

// Main execution function
function main() {
  const args = process.argv.slice(2);
  let monthlyAmount = 10000;
  let priceType = 'close';
  let startDateLimit = new Date(1996, 0, 1);
  let endDateLimit = new Date(2026, 7, 30);
  let csvFile = 'nifty-data.csv';
  let isDefaultFile = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--amount' || arg === '-a') {
      monthlyAmount = parseFloat(args[++i]);
    } else if (arg === '--price' || arg === '-p') {
      priceType = args[++i].toLowerCase();
    } else if (arg === '--start' || arg === '-s') {
      startDateLimit = parseCLIDate(args[++i]);
    } else if (arg === '--end' || arg === '-e') {
      endDateLimit = parseCLIDate(args[++i]);
    } else if (arg === '--file' || arg === '-f') {
      csvFile = args[++i];
      isDefaultFile = false;
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

  // Load and Parse CSV
  console.log(`${COLORS.gray}Parsing ${path.basename(csvPath)}...${COLORS.reset}`);
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split(/\r?\n/);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCSVLine(line);
    if (row.length < 3) continue;

    const date = parseDateStr(row[0]);
    const closePrice = parseFloat(row[1].replace(/,/g, ''));
    const openPrice = parseFloat(row[2].replace(/,/g, ''));

    if (date && !isNaN(closePrice)) {
      data.push({
        date,
        close: closePrice,
        open: isNaN(openPrice) ? closePrice : openPrice
      });
    }
  }

  if (data.length === 0) {
    console.error(`${COLORS.red}Error: No valid trading data found in data.csv!${COLORS.reset}`);
    process.exit(1);
  }

  // Sort chronological ascending (oldest to newest)
  data.sort((a, b) => a.date - b.date);

  // Apply date filters
  let filteredData = data;
  if (startDateLimit) {
    filteredData = filteredData.filter(row => row.date >= startDateLimit);
  }
  if (endDateLimit) {
    filteredData = filteredData.filter(row => row.date <= endDateLimit);
  }

  if (filteredData.length === 0) {
    console.error(`${COLORS.red}Error: No trading data found for the specified date range!${COLORS.reset}`);
    process.exit(1);
  }

  const actualStartDate = filteredData[0].date;
  const actualEndDate = filteredData[filteredData.length - 1].date;

  // Run SIP Simulation
  let currentMonthKey = '';
  const investments = [];
  let totalUnits = 0;
  let totalInvested = 0;

  for (let i = 0; i < filteredData.length; i++) {
    const row = filteredData[i];
    const year = row.date.getFullYear();
    const month = row.date.getMonth() + 1;
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

    if (monthKey !== currentMonthKey) {
      currentMonthKey = monthKey;

      const price = priceType === 'open' ? row.open : row.close;
      if (price <= 0) continue; // Safety check

      const unitsBought = monthlyAmount / price;
      totalUnits += unitsBought;
      totalInvested += monthlyAmount;

      investments.push({
        date: row.date,
        price: price,
        amount: monthlyAmount,
        unitsBought: unitsBought,
        cumulativeInvested: totalInvested,
        cumulativeUnits: totalUnits
      });
    }
  }

  if (investments.length === 0) {
    console.error(`${COLORS.red}Error: Could not perform any investments in the specified date range!${COLORS.reset}`);
    process.exit(1);
  }

  // Valuation at the end of simulation
  const valuationRow = filteredData[filteredData.length - 1];
  const finalPrice = valuationRow.close; // Valuation is always close price
  const portfolioValue = totalUnits * finalPrice;
  const totalProfit = portfolioValue - totalInvested;
  const absoluteReturn = (totalProfit / totalInvested) * 100;

  // XIRR Calculation
  const cashFlows = investments.map(inv => ({
    date: inv.date,
    amount: -inv.amount
  }));
  cashFlows.push({
    date: valuationRow.date,
    amount: portfolioValue
  });

  const xirr = calculateXIRR(cashFlows);

  // Time calculations
  const firstInvDate = investments[0].date;
  const lastValDate = valuationRow.date;
  const durationMs = lastValDate.getTime() - firstInvDate.getTime();
  const durationYears = durationMs / (365 * 24 * 60 * 60 * 1000);

  // Print Header Dashboard
  console.log('\n' + '='.repeat(80));
  console.log(`${COLORS.bright}${COLORS.cyan}                    NIFTY 50 SIP PERFORMANCE REPORT${COLORS.reset}`);
  console.log('='.repeat(80));
  console.log(`  ${COLORS.bright}Monthly Investment :${COLORS.reset} ${formatCurrency(monthlyAmount)}`);
  console.log(`  ${COLORS.bright}Investment Day     :${COLORS.reset} First trading day of the month`);
  console.log(`  ${COLORS.bright}Price Reference    :${COLORS.reset} ${priceType.toUpperCase()} Price`);
  console.log(`  ${COLORS.bright}Simulation Period  :${COLORS.reset} ${formatDate(actualStartDate)} to ${formatDate(actualEndDate)} (${durationYears.toFixed(2)} years)`);
  console.log('='.repeat(80));

  // Performance Summary
  const profitColor = totalProfit >= 0 ? COLORS.green : COLORS.red;
  console.log(`\n  ${COLORS.bright}${COLORS.yellow}SIP PERFORMANCE SUMMARY:${COLORS.reset}`);
  console.log('  ' + '-'.repeat(76));
  console.log(`  ${COLORS.bright}Total Amount Invested      :${COLORS.reset} ${formatCurrency(totalInvested)}`);
  console.log(`  ${COLORS.bright}Final Portfolio Value      :${COLORS.reset} ${formatCurrency(portfolioValue)}`);
  console.log(`  ${COLORS.bright}Total Profit / Loss        :${COLORS.reset} ${profitColor}${formatCurrency(totalProfit)}${COLORS.reset}`);
  console.log(`  ${COLORS.bright}Absolute Return            :${COLORS.reset} ${profitColor}${absoluteReturn.toFixed(2)}%${COLORS.reset}`);
  console.log(`  ${COLORS.bright}Annualized Return (XIRR)   :${COLORS.reset} ${profitColor}${xirr !== null ? xirr.toFixed(2) + '%' : 'N/A'}${COLORS.reset}`);
  console.log('  ' + '-'.repeat(76));
  console.log(`  ${COLORS.bright}Total Nifty 50 Units Bought:${COLORS.reset} ${totalUnits.toFixed(4)} units`);
  console.log(`  ${COLORS.bright}Average Buying Price       :${COLORS.reset} ${formatCurrency(totalInvested / totalUnits, true)}`);
  console.log(`  ${COLORS.bright}Initial Nifty 50 Price     :${COLORS.reset} ${formatCurrency(investments[0].price, true)} (${formatDate(investments[0].date)})`);
  console.log(`  ${COLORS.bright}Final Nifty 50 Price       :${COLORS.reset} ${formatCurrency(finalPrice, true)} (${formatDate(valuationRow.date)})`);
  console.log(`  ${COLORS.bright}Index Absolute Growth      :${COLORS.reset} ${((finalPrice - investments[0].price) / investments[0].price * 100).toFixed(2)}%`);
  console.log('  ' + '-'.repeat(76));

  // Year by Year breakdown
  console.log(`\n  ${COLORS.bright}${COLORS.yellow}YEAR-BY-YEAR PERFORMANCE BREAKDOWN:${COLORS.reset}`);
  console.log('  ' + '-'.repeat(76));
  console.log(`  ${COLORS.bright}${'Year'.padEnd(6)}${'Invested (Yr)'.padEnd(15)}${'Invested (Cum)'.padEnd(16)}${'Portfolio Value'.padEnd(18)}${'Abs. Return'.padEnd(13)}XIRR${COLORS.reset}`);
  console.log('  ' + '-'.repeat(76));

  const startYear = firstInvDate.getFullYear();
  const endYear = lastValDate.getFullYear();

  for (let yr = startYear; yr <= endYear; yr++) {
    // Find last trading day of this year
    const endOfYear = new Date(yr, 11, 31, 23, 59, 59);
    let yearEndRow = null;
    for (let j = filteredData.length - 1; j >= 0; j--) {
      if (filteredData[j].date <= endOfYear) {
        yearEndRow = filteredData[j];
        break;
      }
    }

    if (!yearEndRow || yearEndRow.date < firstInvDate) {
      continue;
    }

    // Find investments up to this date
    const yrInvestments = investments.filter(inv => inv.date <= yearEndRow.date);
    if (yrInvestments.length === 0) continue;

    const cumInvested = yrInvestments[yrInvestments.length - 1].cumulativeInvested;
    const cumUnits = yrInvestments[yrInvestments.length - 1].cumulativeUnits;
    const yrEndPrice = yearEndRow.close;
    const yrPortfolioValue = cumUnits * yrEndPrice;

    // Invested in this year specifically
    const thisYrInvested = yrInvestments
      .filter(inv => inv.date.getFullYear() === yr)
      .reduce((sum, inv) => sum + inv.amount, 0);

    const yrProfit = yrPortfolioValue - cumInvested;
    const yrAbsReturn = (yrProfit / cumInvested) * 100;

    // Cash flows for this year's end XIRR
    const yrCashFlows = yrInvestments.map(inv => ({
      date: inv.date,
      amount: -inv.amount
    }));
    yrCashFlows.push({
      date: yearEndRow.date,
      amount: yrPortfolioValue
    });

    const yrXirr = calculateXIRR(yrCashFlows);

    const yrAbsStr = (yrAbsReturn >= 0 ? '+' : '') + yrAbsReturn.toFixed(1) + '%';
    const yrXirrStr = yrXirr !== null ? (yrXirr >= 0 ? '+' : '') + yrXirr.toFixed(1) + '%' : 'N/A';

    const absColor = yrAbsReturn >= 0 ? COLORS.green : COLORS.red;
    const xirrColor = (yrXirr !== null && yrXirr >= 0) ? COLORS.green : COLORS.red;

    console.log(`  ${yr.toString().padEnd(6)}` +
      `${formatCurrency(thisYrInvested).padEnd(15)}` +
      `${formatCurrency(cumInvested).padEnd(16)}` +
      `${formatCurrency(yrPortfolioValue).padEnd(18)}` +
      `${absColor}${yrAbsStr.padEnd(13)}${COLORS.reset}` +
      `${xirrColor}${yrXirrStr}${COLORS.reset}`
    );
  }
  console.log('  ' + '-'.repeat(76) + '\n');
}

main();
