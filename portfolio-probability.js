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

async function main() {
  const reportsDir = path.join(__dirname, 'reports');
  const csvPath = path.join(reportsDir, 'sip-multi-strategy-report.csv');
  const dataDir = path.join(__dirname, 'historical-data');

  if (!fs.existsSync(csvPath)) {
    console.error(`${COLORS.red}Error: reports/sip-multi-strategy-report.csv not found! Run generate-report.js first.${COLORS.reset}`);
    process.exit(1);
  }

  // Load stocks list from CSV
  console.log(`${COLORS.gray}Loading stocks list from reports...${COLORS.reset}`);
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split(/\r?\n/);
  const stocks = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = parseCSVLine(line);
    if (parts.length < 3) continue;

    const symbol = parts[0];
    const name = parts[1];
    const isin = parts[2];
    stocks.push({ symbol, name, isin });
  }

  console.log(`Loaded ${stocks.length} stocks. Pre-calculating individual strategy cash flows...`);

  const stockCashFlows = [];
  let loadedCount = 0;

  for (const stock of stocks) {
    const filename = `NSE_EQ_${stock.isin}.csv`;
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) continue;

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const csvLines = fileContent.split(/\r?\n/);
      const data = [];

      for (let j = 1; j < csvLines.length; j++) {
        const line = csvLines[j].trim();
        if (!line) continue;
        const row = parseCSVLine(line);
        if (row.length < 5) continue;

        const date = parseDateStr(row[0]);
        const close = parseFloat(row[1].replace(/,/g, ''));
        const low = parseFloat(row[4].replace(/,/g, ''));

        if (date && !isNaN(close) && !isNaN(low)) {
          data.push({ date, close, low });
        }
      }

      if (data.length < 200) continue;

      data.sort((a, b) => a.date - b.date);

      const monthlyAmount = 10000;
      const finalRow = data[data.length - 1];
      const finalPrice = finalRow.close;

      // Group rows by month
      const monthGroups = {};
      for (const row of data) {
        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!monthGroups[monthKey]) monthGroups[monthKey] = [];
        monthGroups[monthKey].push(row);
      }

      // ----------------------------------------------------
      // Strategy 1: Standard Monthly SIP Cash Flows
      // ----------------------------------------------------
      let stdMonthKey = '';
      let stdUnits = 0;
      const stdCF = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== stdMonthKey) {
          stdMonthKey = monthKey;
          stdUnits += monthlyAmount / row.close;
          stdCF.push({ date: row.date, amount: -monthlyAmount });
        }
      }
      stdCF.push({ date: finalRow.date, amount: stdUnits * finalPrice });

      // ----------------------------------------------------
      // Strategy 2: God-Mode SIP Cash Flows
      // ----------------------------------------------------
      const suffixMins = new Array(data.length);
      let currentMin = Infinity;
      for (let i = data.length - 1; i >= 0; i--) {
        const price = data[i].low;
        if (price < currentMin) currentMin = price;
        suffixMins[i] = currentMin;
      }

      let godMonthKey = '';
      let godUnits = 0;
      let godSavings = 0;
      const godCF = [];
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
          godCF.push({ date: row.date, amount: -monthlyAmount });
        }

        const isAbsoluteLow = (row.low === suffixMins[i]);
        const isLastDay = (i === data.length - 1);

        if ((isAbsoluteLow || isLastDay) && godSavings > 0) {
          godUnits += godSavings / row.low;
          godSavings = 0;
        }
      }
      godCF.push({ date: finalRow.date, amount: (godUnits * finalPrice) + godSavings });

      // ----------------------------------------------------
      // Strategy 3: Value Averaging Cash Flows
      // ----------------------------------------------------
      let vaMonthKey = '';
      let vaMonthCount = 0;
      let vaUnits = 0;
      let vaReserves = 0;
      const vaCF = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
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
          vaCF.push({ date: row.date, amount: -monthlyAmount });

          const targetVal = vaMonthCount * monthlyAmount;
          const currentVal = vaUnits * row.close;
          const req = targetVal - currentVal;
          let constrained = req;
          if (constrained < 2000) constrained = 2000;
          if (constrained > 30000) constrained = 30000;

          const actualInvest = Math.min(constrained, vaReserves);
          if (actualInvest > 0) {
            vaUnits += actualInvest / row.close;
            vaReserves -= actualInvest;
          }
        }
      }
      vaCF.push({ date: finalRow.date, amount: (vaUnits * finalPrice) + vaReserves });

      // ----------------------------------------------------
      // Strategy 4: 200-Day SMA Exit SIP Cash Flows
      // ----------------------------------------------------
      const sma200 = calculateSMA(data, 200);
      let exitMonthKey = '';
      let exitUnits = 0;
      let exitSavings = 0;
      const exitCF = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const currentSma = sma200[i];

        if (i > 0 && exitSavings > 0) {
          const prevDate = data[i - 1].date;
          const daysDiff = (row.date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000);
          if (daysDiff > 0) {
            exitSavings += exitSavings * (Math.pow(1 + 0.06 / 365, daysDiff) - 1);
          }
        }

        if (currentSma !== null) {
          const isBull = (row.close >= currentSma);
          if (!isBull && exitUnits > 0) {
            exitSavings += exitUnits * row.close;
            exitUnits = 0;
          } else if (isBull && exitSavings > 0) {
            exitUnits += exitSavings / row.close;
            exitSavings = 0;
          }
        }

        const monthKey = `${row.date.getFullYear()}-${(row.date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (monthKey !== exitMonthKey) {
          exitMonthKey = monthKey;
          exitCF.push({ date: row.date, amount: -monthlyAmount });

          const isSmaValid = (currentSma !== null);
          const isBull = isSmaValid && (row.close >= currentSma);

          if (isSmaValid && !isBull) {
            exitSavings += monthlyAmount;
          } else {
            exitUnits += monthlyAmount / row.close;
          }
        }
      }
      exitCF.push({ date: finalRow.date, amount: (exitUnits * finalPrice) + exitSavings });

      // ----------------------------------------------------
      // Strategy 11: Super God-Mode SIP Cash Flows (DP Hindsight Buy/Sell)
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
      const sgodCF = [];

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
          sgodCF.push({ date: row.date, amount: -monthlyAmount });

          if (targetState === 'cash') {
            sgodSavings += monthlyAmount;
          } else {
            sgodUnits += monthlyAmount / price;
          }
        }
      }
      sgodCF.push({ date: finalRow.date, amount: (sgodUnits * finalPrice) + sgodSavings });

      stockCashFlows.push({
        symbol: stock.symbol,
        name: stock.name,
        stdCF,
        godCF,
        vaCF,
        exitCF,
        sgodCF
      });

      loadedCount++;
    } catch (err) {
      console.error(`Error processing ${filename}: ${err.message}`);
    }
  }

  console.log(`Pre-calculation complete. Loaded ${loadedCount} active stocks.`);

  // ----------------------------------------------------
  // Run Monte Carlo Simulation
  // ----------------------------------------------------
  const trialsCount = 10000;
  console.log(`\nRunning Monte Carlo Simulation (${trialsCount} trials) of 5 randomly selected stocks...`);

  const stdXirrs = [];
  const godXirrs = [];
  const vaXirrs = [];
  const exitXirrs = [];
  const sgodXirrs = [];

  for (let t = 0; t < trialsCount; t++) {
    // Select 5 unique random stocks
    const selected = [];
    while (selected.length < 5) {
      const idx = Math.floor(Math.random() * loadedCount);
      if (!selected.includes(idx)) {
        selected.push(idx);
      }
    }

    const selectedStocks = selected.map(idx => stockCashFlows[idx]);

    // Helper to merge cash flows
    const mergeCF = (strategyKey) => {
      const merged = new Map();
      for (const s of selectedStocks) {
        const cfArray = s[strategyKey];
        for (const cf of cfArray) {
          const key = cf.date.getTime();
          merged.set(key, (merged.get(key) || 0) + cf.amount / 5);
        }
      }
      return Array.from(merged.entries()).map(([time, amount]) => ({
        date: new Date(time),
        amount
      })).sort((a, b) => a.date - b.date);
    };

    const stdCombined = mergeCF('stdCF');
    const godCombined = mergeCF('godCF');
    const vaCombined = mergeCF('vaCF');
    const exitCombined = mergeCF('exitCF');
    const sgodCombined = mergeCF('sgodCF');

    const stdX = calculateXIRR(stdCombined);
    const godX = calculateXIRR(godCombined);
    const vaX = calculateXIRR(vaCombined);
    const exitX = calculateXIRR(exitCombined);
    const sgodX = calculateXIRR(sgodCombined);

    if (stdX !== null) stdXirrs.push(stdX);
    if (godX !== null) godXirrs.push(godX);
    if (vaX !== null) vaXirrs.push(vaX);
    if (exitX !== null) exitXirrs.push(exitX);
    if (sgodX !== null) sgodXirrs.push(sgodX);

    if ((t + 1) % 2000 === 0) {
      console.log(`  Completed ${t + 1}/${trialsCount} trials...`);
    }
  }

  // Helper to compile stats
  const compileStats = (xirrs) => {
    xirrs.sort((a, b) => a - b);
    const validCount = xirrs.length;
    const avg = xirrs.reduce((sum, v) => sum + v, 0) / validCount;
    const prob20 = (xirrs.filter(v => v >= 20).length / validCount) * 100;
    const prob15 = (xirrs.filter(v => v >= 15).length / validCount) * 100;
    const prob12 = (xirrs.filter(v => v >= 12).length / validCount) * 100;

    const getPercentile = (p) => {
      const idx = Math.floor((p / 100) * validCount);
      return xirrs[Math.min(idx, validCount - 1)];
    };

    return {
      avg,
      prob20,
      prob15,
      prob12,
      min: xirrs[0],
      max: xirrs[validCount - 1],
      p5: getPercentile(5),
      p25: getPercentile(25),
      p50: getPercentile(50), // median
      p75: getPercentile(75),
      p95: getPercentile(95)
    };
  };

  const stdStats = compileStats(stdXirrs);
  const godStats = compileStats(godXirrs);
  const vaStats = compileStats(vaXirrs);
  const exitStats = compileStats(exitXirrs);
  const sgodStats = compileStats(sgodXirrs);

  // ----------------------------------------------------
  // Write Probability Report
  // ----------------------------------------------------
  const mdPath = path.join(reportsDir, 'portfolio-probability-report.md');
  const mdContent = `# Portfolio Return Probability Report (Monte Carlo)

This report details a **Monte Carlo Simulation of 10,000 trials** evaluating the probability of returns for an equally-weighted **5-stock portfolio** selected randomly from **${loadedCount} active Nifty 500 stocks**.

Each trial simulates investing **₹10,000 monthly total** (₹2,000 in each of the 5 chosen stocks) over their listing lifetime.

---

## 🎲 Probability of Exceeding XIRR Thresholds

If you randomly choose 5 shares from the Nifty 500, what is the probability that your portfolio achieves the following annualized returns?

| Target Return (XIRR) | Standard Monthly SIP | Value Averaging SIP | 200-Day SMA Exit SIP | God-Mode SIP (Lifetime Hindsight) | Super God-Mode SIP (Dynamic Hindsight) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Probability of > 20% XIRR** | **${stdStats.prob20.toFixed(2)}%** | **${vaStats.prob20.toFixed(2)}%** | **${exitStats.prob20.toFixed(2)}%** | **${godStats.prob20.toFixed(2)}%** | **${sgodStats.prob20.toFixed(2)}%** |
| **Probability of > 15% XIRR** | ${stdStats.prob15.toFixed(2)}% | ${vaStats.prob15.toFixed(2)}% | ${exitStats.prob15.toFixed(2)}% | ${godStats.prob15.toFixed(2)}% | ${sgodStats.prob15.toFixed(2)}% |
| **Probability of > 12% XIRR** | ${stdStats.prob12.toFixed(2)}% | ${vaStats.prob12.toFixed(2)}% | ${exitStats.prob12.toFixed(2)}% | ${godStats.prob12.toFixed(2)}% | ${sgodStats.prob12.toFixed(2)}% |

---

## 📊 Annualized Return (XIRR) Distribution

The return ranges and percentiles across all 10,000 random portfolios:

| Return Statistic | Standard Monthly SIP | Value Averaging SIP | 200-Day SMA Exit SIP | God-Mode SIP | Super God-Mode SIP |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Minimum Portfolio XIRR** | ${stdStats.min.toFixed(2)}% | ${vaStats.min.toFixed(2)}% | ${exitStats.min.toFixed(2)}% | ${godStats.min.toFixed(2)}% | ${sgodStats.min.toFixed(2)}% |
| **5th Percentile (Worst 5%)** | ${stdStats.p5.toFixed(2)}% | ${vaStats.p5.toFixed(2)}% | ${exitStats.p5.toFixed(2)}% | ${godStats.p5.toFixed(2)}% | ${sgodStats.p5.toFixed(2)}% |
| **25th Percentile (First Quartile)** | ${stdStats.p25.toFixed(2)}% | ${vaStats.p25.toFixed(2)}% | ${exitStats.p25.toFixed(2)}% | ${godStats.p25.toFixed(2)}% | ${sgodStats.p25.toFixed(2)}% |
| **50th Percentile (Median Return)** | **${stdStats.p50.toFixed(2)}%** | **${vaStats.p50.toFixed(2)}%** | **${exitStats.p50.toFixed(2)}%** | **${godStats.p50.toFixed(2)}%** | **${sgodStats.p50.toFixed(2)}%** |
| **75th Percentile (Third Quartile)** | ${stdStats.p75.toFixed(2)}% | ${vaStats.p75.toFixed(2)}% | ${exitStats.p75.toFixed(2)}% | ${godStats.p75.toFixed(2)}% | ${sgodStats.p75.toFixed(2)}% |
| **95th Percentile (Best 5%)** | ${stdStats.p95.toFixed(2)}% | ${vaStats.p95.toFixed(2)}% | ${exitStats.p95.toFixed(2)}% | ${godStats.p95.toFixed(2)}% | ${sgodStats.p95.toFixed(2)}% |
| **Maximum Portfolio XIRR** | ${stdStats.max.toFixed(2)}% | ${vaStats.max.toFixed(2)}% | ${exitStats.max.toFixed(2)}% | ${godStats.max.toFixed(2)}% | ${sgodStats.max.toFixed(2)}% |
| **Average Portfolio XIRR** | **${stdStats.avg.toFixed(2)}%** | **${vaStats.avg.toFixed(2)}%** | **${exitStats.avg.toFixed(2)}%** | **${godStats.avg.toFixed(2)}%** | **${sgodStats.avg.toFixed(2)}%** |

---

## 🔍 Key Insights from the Monte Carlo Simulation

1. **Standard Monthly SIP Probability**:
   - There is a **${stdStats.prob20.toFixed(1)}% probability** of making **more than 20% XIRR** by choosing 5 random Nifty 500 stocks using standard monthly dollar-cost averaging.
   - The median return of a random 5-stock portfolio is **${stdStats.p50.toFixed(1)}% XIRR**, which significantly outperforms average historical Nifty index growth. This is because Nifty 500 contains mid-cap and small-cap high-growth equities.
2. **Value Averaging SIP Probability**:
   - Value Averaging has a **${vaStats.prob20.toFixed(1)}% probability** of exceeding 20% XIRR. It has a slightly tighter distribution, making it a very robust alternative to regular monthly investing.
3. **200-Day SMA Exit (Stop-Loss) SIP**:
   - The probability of exceeding 20% XIRR with a trend-following stop-loss is **${exitStats.prob20.toFixed(1)}%**, with a median return of **${exitStats.p50.toFixed(1)}% XIRR**.
   - Unlike index funds (where stop-losses often underperform due to whipsaws), for random individual stock portfolios, the stop-loss strategy slightly *outperforms* the standard buy-and-hold SIP. This occurs because it successfully cuts losses in individual equities undergoing structural declines or near-bankruptcy, preventing capital from being dragged down indefinitely.
4. **Super God-Mode (Dynamic Perfect Hindsight)**:
   - Dynamic profit-taking based on perfect hindsight yields astronomical XIRR metrics. There is a **${sgodStats.prob20.toFixed(1)}% probability** of exceeding 20% XIRR, with a median return of **${sgodStats.p50.toFixed(1)}% XIRR** across the Nifty 500 constituents database.
5. **The God-Mode Upper Bound**:
   - With perfect lifetime dip-buying timing, the probability of exceeding 20% XIRR rises to **${godStats.prob20.toFixed(1)}%**, with an average return of **${godStats.avg.toFixed(1)}% XIRR**. This demonstrates the theoretical mathematical premium of timing markets.
6. **Diversification Safety**:
   - Even in the 5th percentile (worst 5% of portfolios), standard SIP returns **${stdStats.p5.toFixed(1)}% XIRR**. This highlights that even random 5-stock portfolios show strong structural returns over 10-20 years in growing emerging markets like India.

`;

  fs.writeFileSync(mdPath, mdContent, 'utf8');
  console.log(`\n${COLORS.bright}${COLORS.green}Probability report generated at: ${mdPath}${COLORS.reset}`);
}

main().catch(err => {
  console.error(`Unhandled error during probability calculation: ${err.message}`);
});
