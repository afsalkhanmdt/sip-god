# Nifty 50 & Nifty 500 SIP Simulator

A collection of Node.js-based simulators and data tools to evaluate Systematic Investment Plan (SIP) returns on the Nifty 50 Index and individual Nifty 500 constituent stocks using historical daily daily candle data spanning up to **26 years (2000 to 2026)**.

---

## 🏆 SIP Strategy Performance Leaderboard

Below are the backtesting results compiled across **422 active Nifty 500 stocks** comparing 7 distinct investment strategies. All models assume a monthly capital budget of **₹10,000** (or weekly equivalent of **₹2,500**), with idle cash held in savings compounding daily at **6.0% per annum**.

| Rank | Strategy Name | Average XIRR | Average Portfolio Value | Average Outperformance vs. Benchmark |
| :---: | :--- | :---: | :---: | :---: |
| **#1** | **God-Mode SIP (Lifetime Hindsight)** | **22.66%** | ₹7,02,54,337 | **+6.21% CAGR** (+94.3% Portfolio Value) |
| **#2** | **Monthly Low-Day SIP (Monthly Low)** | **17.39%** | ₹3,99,49,262 | **+0.94% CAGR** (+10.5% Portfolio Value) |
| **#3** | **Standard Monthly SIP (1st Close)** | **16.45%** | ₹3,61,56,320 | **Benchmark** |
| **#4** | **Mid-Month Monthly SIP (15th Close)** | **16.42%** | ₹3,57,29,529 | **-0.03% CAGR** (-1.2% Portfolio Value) |
| **#5** | **Weekly SIP (Every 5 Days Close)** | **16.38%** | ₹3,60,57,650 | **-0.07% CAGR** (-0.3% Portfolio Value) |
| **#6** | **10% Dip Strategy (250-day peak)** | **16.19%** | ₹3,40,85,564 | **-0.26% CAGR** (-5.7% Portfolio Value) |
| **#7** | **200-Day SMA Buy-the-Dip** | **15.72%** | ₹3,13,94,400 | **-0.73% CAGR** (-13.2% Portfolio Value) |

---

## 🔍 Key Financial Takeaways

*   **Cash Drag beats Indicator-based Timing**: Interestingly, both the **200-Day SMA Buy-the-Dip** strategy (15.72% XIRR) and the **10% Dip Strategy** (16.19% XIRR) underperform the simple **Standard Monthly SIP** (16.45% XIRR). This is due to **cash drag**: when markets are in steady bull runs, money accumulates in savings earning only 6% while missing out on rapid equity compounding. By the time a dip is triggered, the stock price is often significantly higher than standard monthly DCA prices.
*   **Day of Month Independence**: Moving the monthly investment date from the 1st of the month (16.45% XIRR) to the 15th (16.42% XIRR) results in a negligible difference, proving that long-term returns are independent of calendar days.
*   **Frequency Independence**: Investing ₹2,500 weekly (16.38% XIRR) vs. ₹10,000 monthly (16.45% XIRR) yields nearly identical returns, showing that monthly allocations are completely sufficient.
*   **The Monthly Timing Premium**: Perfecting timing within a calendar month (buying at the lowest low of the month) adds a **+0.94% CAGR** premium over standard monthly investments, adding **+₹38 Lakhs** to the average portfolio value.

---

## 🛠️ Simulator Files

The project has three standalone simulator scripts located in the root directory:

### 1. Standard Monthly SIP (`normal-sip.js`)
Invests a fixed monthly sum on the first trading day of each calendar month.
```bash
# Run default simulation on Nifty 50 index (1996 to 2026)
node normal-sip.js

# Run simulation on a custom downloaded stock CSV
node normal-sip.js --file historical-data/NSE_EQ_INE585B01010.csv
```

### 2. God-Mode SIP (`god.js`)
An optimal, perfect-hindsight strategy representing the absolute limit of buying the dip: accumulates cash in a 6% savings account and sweeps only on absolute lifetime future lows at the **Low** price.
```bash
# Run default god simulation (defaults to yearly report)
node god.js

# Run simulation on a custom downloaded stock CSV
node god.js --file historical-data/NSE_EQ_INE585B01010.csv
```

### 3. Percentage-Dip SIP (`dip-sip.js`)
Accumulates monthly capital in a 6% savings account and triggers a buy whenever the close price drops by $X\%$ (default: 10%) from its rolling peak (default: 250 trading days).
```bash
# Run default 10% dip simulation on Nifty 50 index
node dip-sip.js

# Run 15% dip simulation on custom stock data with 500-day rolling window
node dip-sip.js --file historical-data/NSE_EQ_INE585B01010.csv --dip 15 --window 500
```

---

## 📥 Historical Data Downloaders

Use these tools to compile historical daily candle datasets from Upstox:

### 1. NSE Master Database Downloader
Downloads and extracts the entire NSE equity and derivative instrument directory from Upstox (~86,000 contracts).
```bash
node scratch/download-nse-list.js
```

### 2. Single Stock Downloader
Downloads up to 26+ years of daily candle data in 9-year chunks for any specific symbol/ISIN.
```bash
node download-historical.js --symbol NSE_EQ\|INF204KB14I2 --token "your_access_token"
```

### 3. Nifty 500 Bulk Downloader
Downloads daily candle files for all active constituents of the Nifty 500 in parallel with retries, backoffs, and progression resume checks.
```bash
node download-all-historical.js --token "your_access_token" --nifty500
```

---

## 📈 Analysis & Comparative Reports

### Multi-Strategy Report Generator
Runs all 7 investment models across all downloaded constituent stocks, compiling XIRR returns and final valuations.
```bash
# Generate report for all stocks matching the Nifty 500 constituents
node generate-report.js
```

### Generated Outputs
*   **Comparative Markdown Summary**: [reports/sip-multi-strategy-report.md](file:///Users/afsalkhan/Documents/poc/sip-god/reports/sip-multi-strategy-report.md)
*   **Raw CSV Spreadsheet**: [reports/sip-multi-strategy-report.csv](file:///Users/afsalkhan/Documents/poc/sip-god/reports/sip-multi-strategy-report.csv)

---

## 📁 Repository Structure

```text
sip-god/
├── nifty-data.csv                # Nifty 50 index historical data (1996 - 2026)
├── nse-instruments.json          # Master NSE instrument JSON database
├── nse-instruments.csv           # Master NSE instrument CSV index
├── normal-sip.js                 # Standard SIP Simulator
├── god.js                        # God-Mode Hindsight Simulator
├── dip-sip.js                    # Percentage-Dip Simulator
├── download-historical.js        # Single Stock Downloader utility
├── download-all-historical.js    # Bulk Stock Downloader utility
├── generate-report.js            # Strategy Report Generator
├── historical-data/              # Directory containing individual stock CSV datasets
│   └── download-progress.json    # Tracking progress of bulk download runs
├── reports/                      # Backtesting output reports folder
│   ├── sip-multi-strategy-report.csv  # Comparative CSV results spreadsheet
│   └── sip-multi-strategy-report.md   # Comparative Markdown rankings and takeaways
└── scratch/                      # Workspace helper scratch scripts
    ├── download-nse-list.js      # Script to download NSE master directory
    └── search-instrument.js      # Utility to search symbols in master database
```

---

## 🛠️ CLI Flags (Common Options)
Standalone simulator files support these standard command-line options:

*   `-a, --amount <number>`: Monthly investment amount in ₹ (default: `10000`)
*   `-p, --price <close|open|low>`: Reference daily price to execute purchases
*   `-s, --start <date>`: Date filter to start simulation in format `YYYY-MM-DD` or `DD/MM/YYYY`
*   `-e, --end <date>`: Date filter to end simulation in format `YYYY-MM-DD` or `DD/MM/YYYY`
*   `-f, --file <path>`: Path to custom CSV index/stock data file
*   `-r, --report <yearly|monthly>`: Report granularity (yearly or monthly detail table)
