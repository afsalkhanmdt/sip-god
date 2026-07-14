# Nifty 50 & Nifty 500 SIP Simulator

A collection of Node.js-based simulators and data tools to evaluate Systematic Investment Plan (SIP) returns on the Nifty 50 Index and individual Nifty 500 constituent stocks using historical daily candle data spanning up to **26 years (2000 to 2026)**.

---

## 🏆 SIP Strategy Performance Leaderboard

Below are the backtesting results compiled across **268 active Nifty 500 stocks** comparing 11 distinct investment strategies. All models assume a monthly capital budget of **₹10,000** (or weekly equivalent of **₹2,500**), with idle cash held in savings compounding daily at **6.0% per annum**.

| Rank | Strategy Name | Average XIRR | Average Portfolio Value | Average Outperformance vs. Benchmark |
| :---: | :--- | :---: | :---: | :---: |
| **#1** | **Super God-Mode SIP (Dynamic Hindsight)** | **688.20%** | ₹3.04 × 10²⁹ | **+672.05% CAGR** (Mathematical Upper Bound) |
| **#2** | **God-Mode SIP (Lifetime Hindsight)** | **21.16%** | ₹5,64,47,111 | **+5.01% CAGR** (+73.7% Portfolio Value) |
| **#3** | **Monthly Low-Day SIP (Monthly Low)** | **17.02%** | ₹3,57,27,420 | **+0.87% CAGR** (+10.0% Portfolio Value) |
| **#4** | **Standard Monthly SIP (1st Close)** | **16.15%** | ₹3,24,93,766 | **Benchmark** |
| **#5** | **Mid-Month Monthly SIP (15th Close)** | **16.13%** | ₹3,21,57,452 | **-0.02% CAGR** (-1.0% Portfolio Value) |
| **#6** | **Weekly SIP (Every 5 Days Close)** | **16.11%** | ₹3,25,35,971 | **-0.05% CAGR** (+0.1% Portfolio Value) |
| **#7** | **10% Dip Strategy (250-day peak)** | **15.94%** | ₹3,10,90,811 | **-0.21% CAGR** (-4.3% Portfolio Value) |
| **#8** | **RSI Buy-the-Dip (RSI < 35)** | **15.57%** | ₹2,91,46,303 | **-0.58% CAGR** (-10.3% Portfolio Value) |
| **#9** | **200-Day SMA Buy-the-Dip** | **15.42%** | ₹2,79,93,631 | **-0.74% CAGR** (-13.8% Portfolio Value) |
| **#10** | **Value Averaging SIP (Target 10k)** | **15.12%** | ₹2,46,51,062 | **-1.03% CAGR** (-24.1% Portfolio Value) |
| **#11** | **200-Day SMA Exit SIP (Stop-Loss)** | **14.76%** | ₹2,87,20,645 | **-1.40% CAGR** (-11.6% Portfolio Value) |

---

## 🔍 Key Financial Takeaways

*   **Super God-Mode SIP**: Represents the absolute theoretical upper bound of profit-taking backtests. By solving the optimal asset switching path using Dynamic Programming with perfect hindsight, it compound-trades the swings of the stock price curve, only buying stock when it will grow faster than the 6% bank interest, and selling at local peaks to compound cash.
*   **Cash Drag beats Indicator-based Timing**: Interestingly, both the **200-Day SMA Buy-the-Dip** (15.42% XIRR), the **RSI Buy-the-Dip** (15.57% XIRR), and the **10% Dip Strategy** (15.94% XIRR) underperform the simple **Standard Monthly SIP** (16.15% XIRR). This is a classic demonstration of **cash drag**: when markets are in steady bull runs, money accumulates in savings earning only 6% while missing out on rapid equity compounding.
*   **Trend-Following Exit Strategies (SMA Exit)**:
    - **200-Day SMA Exit SIP (Stop-Loss Exit)** achieves **14.76% XIRR**.
    - By liquidating stock holdings when prices fall below the 200 SMA and parking proceeds in bank savings, it protects capital during prolonged structural bear runs. While the average index CAGR is slightly lower due to whipsaws (exiting on minor dips and buying back higher), it provides crucial downside risk mitigation.
*   **Value Averaging (VA)**:
    - **Value Averaging SIP** yields **15.12% average XIRR**.
    - Adjusts monthly investments dynamically to buy more units when prices fall and less when they rise, keeping the portfolio on a target growth path.
*   **Day of Month & Frequency Independence**: Moving the monthly investment date from the 1st (16.15% XIRR) to the 15th (16.13% XIRR), or running a Weekly SIP (16.11% XIRR) has virtually zero material impact on long-term returns.

---

## 🛠️ Simulator Files

The project has seven standalone simulator scripts located in the root directory:

### 1. Standard Monthly SIP (`normal-sip.js`)
Invests a fixed monthly sum on the first trading day of each calendar month.
```bash
node normal-sip.js
```

### 2. God-Mode SIP (`god.js`)
An optimal, perfect-hindsight strategy representing the absolute limit of buying the dip: accumulates cash in a 6% savings account and sweeps only on absolute lifetime future lows.
```bash
node god.js
```

### 3. Super God-Mode SIP (`super-god.js`)
Dynamic Programming perfect-hindsight solver that switches daily between stock and bank savings, executing buys only when stock return beats the 6% hurdle rate, and selling at peaks.
```bash
node super-god.js
```

### 4. Percentage-Dip SIP (`dip-sip.js`)
Triggers a buy whenever the close price drops by $X\%$ (default: 10%) from its rolling peak (default: 250 trading days).
```bash
node dip-sip.js
```

### 5. Value Averaging SIP (`va-sip.js`)
Adjusts monthly investments to keep the stock portfolio value on a target growth path, storing cash surpluses in reserves and drawing on them in market drops.
```bash
node va-sip.js
```

### 6. RSI Buy-the-Dip SIP (`rsi-sip.js`)
Triggers a buy when the 14-day RSI falls below a trigger value (default: 35).
```bash
node rsi-sip.js
```

### 7. SMA Exit SIP (`sma-exit-sip.js`)
Liquidates stock holdings and holds cash in bank savings (compounding at 6%) when the close price falls below the 200 SMA, sweeping back into equity when the trend recovers.
```bash
node sma-exit-sip.js
```

---

## 📥 Historical Data Downloaders

Use these tools to compile historical daily candle datasets from Upstox:

### 1. NSE Master Database Downloader
```bash
node scratch/download-nse-list.js
```

### 2. Single Stock Downloader
```bash
node download-historical.js --symbol NSE_EQ\|INF204KB14I2 --token "your_access_token"
```

### 3. Nifty 500 Bulk Downloader
```bash
node download-all-historical.js --token "your_access_token" --nifty500
```

---

## 📈 Analysis & Comparative Reports

### Multi-Strategy Report Generator
Runs all 11 investment models across all downloaded constituent stocks, compiling XIRR returns and final valuations.
```bash
# Generate report for Nifty 500 constituents
node generate-report.js
```

### Monte Carlo Portfolio Probability Calculator
Runs 10,000 trials of randomly chosen 5-stock portfolios, compiling their combined cash flows and XIRRs to determine the exact probability distributions of returns.
```bash
# Run Monte Carlo simulation for 5-stock portfolios
node portfolio-probability.js
```

### Generated Outputs
*   **Comparative Markdown Summary**: [reports/sip-multi-strategy-report.md](file:///Users/afsalkhan/Documents/poc/sip-god/reports/sip-multi-strategy-report.md)
*   **Raw CSV Spreadsheet**: [reports/sip-multi-strategy-report.csv](file:///Users/afsalkhan/Documents/poc/sip-god/reports/sip-multi-strategy-report.csv)
*   **Monte Carlo Return Probability Report**: [reports/portfolio-probability-report.md](file:///Users/afsalkhan/Documents/poc/sip-god/reports/portfolio-probability-report.md)

---

## 📋 Full Directory Map
```text
sip-god/
├── nifty-data.csv                # Nifty 50 index historical data (1996 - 2026)
├── nse-instruments.json          # Master NSE instrument JSON database
├── nse-instruments.csv           # Master NSE instrument CSV index
├── normal-sip.js                 # Standard SIP Simulator
├── god.js                        # God-Mode Hindsight Simulator
├── super-god.js                  # Super God-Mode DP Solver Simulator
├── dip-sip.js                    # Percentage-Dip Simulator
├── va-sip.js                     # Value Averaging Simulator
├── rsi-sip.js                    # RSI Buy-the-Dip Simulator
├── sma-exit-sip.js               # SMA Stop-Loss Exit Simulator
├── download-historical.js        # Single Stock Downloader utility
├── download-all-historical.js    # Bulk Stock Downloader utility
├── generate-report.js            # Strategy Report Generator
├── portfolio-probability.js      # Monte Carlo Probability Calculator
├── historical-data/              # Directory containing individual stock CSV datasets
│   └── download-progress.json    # Tracking progress of bulk download runs
├── reports/                      # Backtesting output reports folder
│   ├── sip-multi-strategy-report.csv   # Comparative CSV results spreadsheet
│   ├── sip-multi-strategy-report.md    # Comparative Markdown rankings
│   └── portfolio-probability-report.md  # Monte Carlo XIRR probability report
└── scratch/                      # Workspace helper scratch scripts
    ├── download-nse-list.js      # Script to download NSE master directory
    └── search-instrument.js      # Utility to search symbols in master database
```
