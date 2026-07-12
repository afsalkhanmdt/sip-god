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
${COLORS.bright}${COLORS.cyan}Nifty 50 God-Mode SIP Return Calculator${COLORS.reset}

Calculates returns using a strategy where cash is allocated monthly to a savings account earning 6%
and only invested on "absolute low" days where the market never falls below that level again.

${COLORS.bright}Usage:${COLORS.reset}
  node god.js [options]

${COLORS.bright}Options:${COLORS.reset}
  --amount, -a <number>      Monthly investment amount (default: 10000)
  --price, -p <close|open|low>   Price column to buy index at (default: low)
  --start, -s <date>         Start date for simulation (DD/MM/YYYY or YYYY-MM-DD)
  --end, -e <date>           End date for simulation (DD/MM/YYYY or YYYY-MM-DD)
  --report, -r <yearly|monthly> Report breakdown type (default: yearly)
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
  let priceType = 'low';
  let startDateLimit = new Date(1996, 0, 1);
  let endDateLimit = new Date(2026, 6, 30); // Jun 30, 2026
  let reportType = 'yearly';

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
    } else if (arg === '--report' || arg === '-r') {
      reportType = args[++i].toLowerCase();
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      return;
    }
  }

  const csvPath = path.join(__dirname, 'nifty-data.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`${COLORS.red}Error: nifty-data.csv file not found in the current directory!${COLORS.reset}`);
    process.exit(1);
  }

  // Load and Parse CSV
  console.log(`${COLORS.gray}Parsing nifty-data.csv...${COLORS.reset}`);
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
    const openPrice = parseFloat(row[2].replace(/,/g, ''));
    const lowPrice = parseFloat(row[4].replace(/,/g, ''));

    if (date && !isNaN(closePrice) && !isNaN(lowPrice)) {
      data.push({
        date,
        close: closePrice,
        open: isNaN(openPrice) ? closePrice : openPrice,
        low: lowPrice
      });
    }
  }

  if (data.length === 0) {
    console.error(`${COLORS.red}Error: No valid trading data found in nifty-data.csv!${COLORS.reset}`);
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

  // Pre-calculate Suffix Minimum prices to identify absolute lows
  const suffixMins = new Array(filteredData.length);
  let currentMin = Infinity;
  for (let i = filteredData.length - 1; i >= 0; i--) {
    const row = filteredData[i];
    const price = priceType === 'open' ? row.open : (priceType === 'low' ? row.low : row.close);
    if (price < currentMin) {
      currentMin = price;
    }
    suffixMins[i] = currentMin;
  }

  // Run God SIP Simulation
  let currentMonthKey = '';
  const investments = [];
  const cashFlows = [];
  const dailyStates = [];
  let totalUnits = 0;
  let totalInvested = 0;
  let savingsBalance = 0;
  let totalInterestEarned = 0;

  for (let i = 0; i < filteredData.length; i++) {
    const row = filteredData[i];
    const price = priceType === 'open' ? row.open : (priceType === 'low' ? row.low : row.close);

    // 1. Accrue Interest from previous trading day to current trading day
    if (i > 0 && savingsBalance > 0) {
      const prevDate = filteredData[i - 1].date;
      const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
      if (daysDiff > 0) {
        // Compound daily interest rate based on 6% annual rate
        const interest = savingsBalance * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
        savingsBalance += interest;
        totalInterestEarned += interest;
      }
    }

    // 2. Monthly Allocation (First Trading Day of the Month)
    const year = row.date.getFullYear();
    const month = row.date.getMonth() + 1;
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

    if (monthKey !== currentMonthKey) {
      currentMonthKey = monthKey;
      savingsBalance += monthlyAmount;
      totalInvested += monthlyAmount;
      // Record user's cash flow for XIRR
      cashFlows.push({
        date: row.date,
        amount: -monthlyAmount
      });
    }

    // 3. Check for absolute low (or last day of simulation) to invest savings balance
    const isAbsoluteLow = (price === suffixMins[i]);
    const isLastDay = (i === filteredData.length - 1);

    if ((isAbsoluteLow || isLastDay) && savingsBalance > 0) {
      const unitsBought = savingsBalance / price;
      totalUnits += unitsBought;

      investments.push({
        date: row.date,
        price: price,
        amount: savingsBalance,
        unitsBought: unitsBought,
        cumulativeInvested: totalInvested,
        cumulativeUnits: totalUnits,
        wasAbsoluteLow: isAbsoluteLow,
        wasLastDay: isLastDay
      });

      savingsBalance = 0;
    }

    // 4. Record daily state for reporting and year-end lookups
    dailyStates.push({
      date: row.date,
      price: price,
      savingsBalance: savingsBalance,
      totalUnits: totalUnits,
      totalInvested: totalInvested
    });
  }

  // Valuation at the end of simulation
  const valuationRow = filteredData[filteredData.length - 1];
  const finalPrice = valuationRow.close; // Valuation is always close price
  const portfolioValue = (totalUnits * finalPrice) + savingsBalance;
  const totalProfit = portfolioValue - totalInvested;
  const absoluteReturn = (totalProfit / totalInvested) * 100;

  // Final XIRR calculation
  const finalCashFlows = [...cashFlows];
  finalCashFlows.push({
    date: valuationRow.date,
    amount: portfolioValue
  });
  const xirr = calculateXIRR(finalCashFlows);

  // Time calculations
  const firstInvDate = filteredData[0].date;
  const lastValDate = valuationRow.date;
  const durationMs = lastValDate.getTime() - firstInvDate.getTime();
  const durationYears = durationMs / (365 * 24 * 60 * 60 * 1000);

  // Print Header Dashboard
  console.log('\n' + '='.repeat(90));
  console.log(`${COLORS.bright}${COLORS.cyan}                    NIFTY 50 GOD-MODE SIP PERFORMANCE REPORT${COLORS.reset}`);
  console.log('='.repeat(90));
  console.log(`  ${COLORS.bright}Monthly Investment :${COLORS.reset} ${formatCurrency(monthlyAmount)}`);
  console.log(`  ${COLORS.bright}Interest Rate      :${COLORS.reset} 6% per annum (on cash in savings)`);
  console.log(`  ${COLORS.bright}Investment Rule    :${COLORS.reset} Only invest when market is at an absolute future low`);
  console.log(`  ${COLORS.bright}Price Reference    :${COLORS.reset} ${priceType.toUpperCase()} Price`);
  console.log(`  ${COLORS.bright}Simulation Period  :${COLORS.reset} ${formatDate(actualStartDate)} to ${formatDate(actualEndDate)} (${durationYears.toFixed(2)} years)`);
  console.log('='.repeat(90));

  // Performance Summary
  const profitColor = totalProfit >= 0 ? COLORS.green : COLORS.red;
  console.log(`\n  ${COLORS.bright}${COLORS.yellow}SIP PERFORMANCE SUMMARY:${COLORS.reset}`);
  console.log('  ' + '-'.repeat(86));
  console.log(`  ${COLORS.bright}Total Amount Allocated     :${COLORS.reset} ${formatCurrency(totalInvested)}`);
  console.log(`  ${COLORS.bright}Total Savings Interest     :${COLORS.reset} ${COLORS.green}${formatCurrency(totalInterestEarned)}${COLORS.reset}`);
  console.log(`  ${COLORS.bright}Final Portfolio Value      :${COLORS.reset} ${formatCurrency(portfolioValue)}`);
  console.log(`  ${COLORS.bright}  - Value in Nifty 50 Units:${COLORS.reset} ${formatCurrency(totalUnits * finalPrice)}`);
  console.log(`  ${COLORS.bright}  - Value in Savings Cash  :${COLORS.reset} ${formatCurrency(savingsBalance)}`);
  console.log(`  ${COLORS.bright}Total Profit / Loss        :${COLORS.reset} ${profitColor}${formatCurrency(totalProfit)}${COLORS.reset}`);
  console.log(`  ${COLORS.bright}Absolute Return            :${COLORS.reset} ${profitColor}${absoluteReturn.toFixed(2)}%${COLORS.reset}`);
  console.log(`  ${COLORS.bright}Annualized Return (XIRR)   :${COLORS.reset} ${profitColor}${xirr !== null ? xirr.toFixed(2) + '%' : 'N/A'}${COLORS.reset}`);
  console.log('  ' + '-'.repeat(86));
  console.log(`  ${COLORS.bright}Total Nifty 50 Units Bought:${COLORS.reset} ${totalUnits.toFixed(4)} units`);
  console.log(`  ${COLORS.bright}Number of Buy Events       :${COLORS.reset} ${investments.length} times`);
  console.log(`  ${COLORS.bright}Initial Nifty 50 Price     :${COLORS.reset} ${formatCurrency(filteredData[0].close, true)} (${formatDate(filteredData[0].date)})`);
  console.log(`  ${COLORS.bright}Final Nifty 50 Price       :${COLORS.reset} ${formatCurrency(finalPrice, true)} (${formatDate(valuationRow.date)})`);
  console.log(`  ${COLORS.bright}Index Absolute Growth      :${COLORS.reset} ${((finalPrice - filteredData[0].close) / filteredData[0].close * 100).toFixed(2)}%`);
  console.log('  ' + '-'.repeat(86));

  // Performance Breakdown
  // Performance Breakdown
  if (reportType === 'monthly') {
    console.log(`\n  ${COLORS.bright}${COLORS.yellow}MONTH-BY-MONTH PERFORMANCE BREAKDOWN:${COLORS.reset}`);
    console.log('  ' + '-'.repeat(105));
    console.log(`  ${COLORS.bright}${'Month'.padEnd(8)}${'Invested (Mo)'.padEnd(15)}${'Invested (Cum)'.padEnd(16)}${'Nifty Val'.padEnd(15)}${'Savings Bal'.padEnd(15)}${'Portfolio Value'.padEnd(18)}${'Abs. Return'.padEnd(13)}XIRR${COLORS.reset}`);
    console.log('  ' + '-'.repeat(105));

    // Generate list of all month keys (YYYY-MM) in chronological order
    const monthKeys = [];
    for (let i = 0; i < filteredData.length; i++) {
      const row = filteredData[i];
      const year = row.date.getFullYear();
      const month = row.date.getMonth() + 1;
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      if (!monthKeys.includes(monthKey)) {
        monthKeys.push(monthKey);
      }
    }

    for (const mKey of monthKeys) {
      const [yr, mo] = mKey.split('-').map(Number);
      // Find the last trading day of this month
      let monthEndRow = null;
      for (let j = filteredData.length - 1; j >= 0; j--) {
        const rDate = filteredData[j].date;
        if (rDate.getFullYear() === yr && (rDate.getMonth() + 1) === mo) {
          monthEndRow = filteredData[j];
          break;
        }
      }
      if (!monthEndRow) continue;

      // Find state at the end of this month
      const stateAtMonthEnd = dailyStates.find(state => state.date.getTime() === monthEndRow.date.getTime());
      if (!stateAtMonthEnd) continue;

      const cumInvested = stateAtMonthEnd.totalInvested;
      const cumUnits = stateAtMonthEnd.totalUnits;
      const moEndSavingsBalance = stateAtMonthEnd.savingsBalance;
      const moEndPrice = monthEndRow.close;
      const moPortfolioValue = (cumUnits * moEndPrice) + moEndSavingsBalance;

      // Invested in this month specifically
      const thisMoInvested = cashFlows
        .filter(cf => {
          const d = cf.date;
          return d.getFullYear() === yr && (d.getMonth() + 1) === mo;
        })
        .reduce((sum, cf) => sum + Math.abs(cf.amount), 0);

      const moProfit = moPortfolioValue - cumInvested;
      const moAbsReturn = (moProfit / cumInvested) * 100;

      // Cash flows for this month's end XIRR
      const moCashFlows = cashFlows
        .filter(cf => cf.date <= monthEndRow.date)
        .map(cf => ({ date: cf.date, amount: cf.amount }));
      moCashFlows.push({
        date: monthEndRow.date,
        amount: moPortfolioValue
      });

      const moXirr = calculateXIRR(moCashFlows);

      const moAbsStr = (moAbsReturn >= 0 ? '+' : '') + moAbsReturn.toFixed(1) + '%';
      const moXirrStr = moXirr !== null ? (moXirr >= 0 ? '+' : '') + moXirr.toFixed(1) + '%' : 'N/A';

      const absColor = moAbsReturn >= 0 ? COLORS.green : COLORS.red;
      const xirrColor = (moXirr !== null && moXirr >= 0) ? COLORS.green : COLORS.red;

      const formattedMonth = `${mo.toString().padStart(2, '0')}/${yr}`;

      console.log(`  ${formattedMonth.padEnd(8)}` +
        `${formatCurrency(thisMoInvested).padEnd(15)}` +
        `${formatCurrency(cumInvested).padEnd(16)}` +
        `${formatCurrency(cumUnits * moEndPrice).padEnd(15)}` +
        `${formatCurrency(moEndSavingsBalance).padEnd(15)}` +
        `${formatCurrency(moPortfolioValue).padEnd(18)}` +
        `${absColor}${moAbsStr.padEnd(13)}${COLORS.reset}` +
        `${xirrColor}${moXirrStr}${COLORS.reset}`
      );
    }
    console.log('  ' + '-'.repeat(105) + '\n');
  } else {
    console.log(`\n  ${COLORS.bright}${COLORS.yellow}YEAR-BY-YEAR PERFORMANCE BREAKDOWN:${COLORS.reset}`);
    console.log('  ' + '-'.repeat(103));
    console.log(`  ${COLORS.bright}${'Year'.padEnd(6)}${'Invested (Yr)'.padEnd(15)}${'Invested (Cum)'.padEnd(16)}${'Nifty Val'.padEnd(15)}${'Savings Bal'.padEnd(15)}${'Portfolio Value'.padEnd(18)}${'Abs. Return'.padEnd(13)}XIRR${COLORS.reset}`);
    console.log('  ' + '-'.repeat(103));

    const startYear = actualStartDate.getFullYear();
    const endYear = actualEndDate.getFullYear();

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

      if (!yearEndRow || yearEndRow.date < actualStartDate) {
        continue;
      }

      // Find the state at the end of the year
      const stateAtYearEnd = dailyStates.find(state => state.date.getTime() === yearEndRow.date.getTime());
      if (!stateAtYearEnd) continue;

      const cumInvested = stateAtYearEnd.totalInvested;
      const cumUnits = stateAtYearEnd.totalUnits;
      const yrEndSavingsBalance = stateAtYearEnd.savingsBalance;
      const yrEndPrice = yearEndRow.close;
      const yrPortfolioValue = (cumUnits * yrEndPrice) + yrEndSavingsBalance;

      // Invested in this year specifically
      const actualThisYrInvested = cashFlows
        .filter(cf => cf.date.getFullYear() === yr && cf.date <= yearEndRow.date)
        .reduce((sum, cf) => sum + Math.abs(cf.amount), 0);

      const yrProfit = yrPortfolioValue - cumInvested;
      const yrAbsReturn = (yrProfit / cumInvested) * 100;

      // Cash flows for this year's end XIRR
      const yrCashFlows = cashFlows
        .filter(cf => cf.date <= yearEndRow.date)
        .map(cf => ({ date: cf.date, amount: cf.amount }));
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
        `${formatCurrency(actualThisYrInvested).padEnd(15)}` +
        `${formatCurrency(cumInvested).padEnd(16)}` +
        `${formatCurrency(cumUnits * yrEndPrice).padEnd(15)}` +
        `${formatCurrency(yrEndSavingsBalance).padEnd(15)}` +
        `${formatCurrency(yrPortfolioValue).padEnd(18)}` +
        `${absColor}${yrAbsStr.padEnd(13)}${COLORS.reset}` +
        `${xirrColor}${yrXirrStr}${COLORS.reset}`
      );
    }
    console.log('  ' + '-'.repeat(103) + '\n');
  }
}

main();
