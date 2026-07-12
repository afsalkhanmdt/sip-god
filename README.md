# NIFTY 50 SIP Simulator

A collection of Node.js-based simulators to evaluate Systematic Investment Plan (SIP) returns on the Nifty 50 Index using historical data. 

The repository simulates and compares two main investment strategies:
1. **Standard Monthly SIP (`index.js`)**: Invests capital on the first trading day of every month.
2. **God-Mode Perfect-Hindsight SIP (`god.js`)**: Holds monthly capital in a 6% savings account and only invests at the absolute future low points.

---

## 📈 Historical Performance Comparison
Below is the comparison of both strategies simulated over a **30.5-year period (01/01/1996 to 01/07/2026)** using Nifty 50 historical data with daily **Low** prices.

| Metric | Standard Monthly SIP (`index.js`) | God-Mode SIP (`god.js`) | Comparison / Difference |
| :--- | :--- | :--- | :--- |
| **Simulation Period** | 01/01/1996 to 01/07/2026 | 01/01/1996 to 01/07/2026 | 30.52 Years |
| **Total Amount Invested** | ₹36,70,000 | ₹36,70,000 | Identical Capital Allocated |
| **Savings Interest Earned** | ₹0 (No savings account) | ₹2,11,867 | **+₹2,11,867** |
| **Final Portfolio Value** | ₹3,20,56,292 | **₹4,33,05,507** | **+₹1,12,49,215 (+35.1%)** |
| **Total Nifty 50 Units Bought**| 1335.3534 units | **1803.9564 units** | **+468.60 units (+35.1%)** |
| **Number of Buy Events** | 366 times (Monthly) | **71 times** | **80% fewer trades** |
| **Absolute Return** | 773.47% | **1079.99%** | **+306.52% absolute return** |
| **Annualized Return (XIRR)** | 11.90% | **13.37%** | **+1.47% CAGR** |

---

## 🛠️ Investment Strategies Detailed

### 1. Standard Monthly SIP (`index.js`)
The classic monthly investment approach:
- Allocates a fixed monthly sum (default: ₹10,000) on the first trading day of each month.
- Immediately purchases Nifty 50 index units at the daily reference price (Open, Close, or Low).
- Compounds purely through index growth.

#### Usage:
```bash
# Run default simulation (₹10,000 monthly, 1996 to 2026)
node index.js

# Custom settings
node index.js --amount 15000 --price open --start 2000-01-01 --end 2025-12-31
```

### 2. God-Mode Perfect-Hindsight SIP (`god.js`)
An optimal, perfect-hindsight strategy representing the absolute limit of buying the dip:
- **Capital Accumulation**: A fixed monthly sum (default: ₹10,000) is allocated on the first trading day of the month into a savings cash account earning **6% per annum** (compounded daily).
- **Absolute Future Low Buy**: The simulator pre-calculates the suffix minimums of index prices. A purchase is triggered on day $t$ *only* if the price $P(t)$ is less than or equal to all future prices $P(t') \ge P(t)$ in the remaining simulation period (meaning the market will never drop below this price again).
- **Sweep Order**: On absolute future low days, all accumulated savings balance (including accrued interest) is swept to purchase Nifty 50 units.
- **Liquidation Clear**: On the final day of the simulation, any leftover savings cash is automatically invested.

#### Usage:
```bash
# Run default god simulation (defaults to yearly report)
node god.js

# Run monthly report breakdown showing the exact asset split (Nifty equity vs savings cash)
node god.js --report monthly

# Custom options
node god.js --amount 20000 --price close --start 2010-01-01 -r monthly
```

---

## 📊 Command Line Options
Both scripts support the following CLI flags:

- `--amount, -a <number>`: Monthly investment amount in ₹ (default: `10000`)
- `--price, -p <close|open|low>`: Index price reference to execute buys (default: `low` for `god.js`, `close` for `index.js`)
- `--start, -s <date>`: Date filter to start simulation in format `YYYY-MM-DD` or `DD/MM/YYYY`
- `--end, -e <date>`: Date filter to end simulation in format `YYYY-MM-DD` or `DD/MM/YYYY`
- `--report, -r <yearly|monthly>`: Report granularity (*only supported in `god.js`*)

---

## 💾 Data Source
The simulator parses historical index data from `nifty-data.csv` containing columns for `Date`, `Price` (Close), `Open`, `High`, and `Low`.

---

## 📋 God-Mode Console Output Example
Running `node god.js` displays the following console performance report:

```text
Parsing nifty-data.csv...

==========================================================================================
                    NIFTY 50 GOD-MODE SIP PERFORMANCE REPORT
==========================================================================================
  Monthly Investment : ₹10,000
  Interest Rate      : 6% per annum (on cash in savings)
  Investment Rule    : Only invest when market is at an absolute future low
  Price Reference    : LOW Price
  Simulation Period  : 01/01/1996 to 01/07/2026 (30.52 years)
==========================================================================================

  SIP PERFORMANCE SUMMARY:
  --------------------------------------------------------------------------------------
  Total Amount Allocated     : ₹36,70,000
  Total Savings Interest     : ₹2,11,867
  Final Portfolio Value      : ₹4,33,05,507
    - Value in Nifty 50 Units: ₹4,33,05,507
    - Value in Savings Cash  : ₹0
  Total Profit / Loss        : ₹3,96,35,507
  Absolute Return            : 1079.99%
  Annualized Return (XIRR)   : 13.37%
  --------------------------------------------------------------------------------------
  Total Nifty 50 Units Bought: 1803.9564 units
  Number of Buy Events       : 71 times
  Initial Nifty 50 Price     : ₹908.01 (01/01/1996)
  Final Nifty 50 Price       : ₹24,005.85 (01/07/2026)
  Index Absolute Growth      : 2543.79%
  --------------------------------------------------------------------------------------

  YEAR-BY-YEAR PERFORMANCE BREAKDOWN:
  -------------------------------------------------------------------------------------------------------
  Year  Invested (Yr)  Invested (Cum)  Nifty Val      Savings Bal    Portfolio Value   Abs. Return  XIRR
  -------------------------------------------------------------------------------------------------------
  1996  ₹1,20,000      ₹1,20,000       ₹1,43,110      ₹0             ₹1,43,110         +19.3%       +37.4%
  1997  ₹1,20,000      ₹2,40,000       ₹1,71,809      ₹1,23,968      ₹2,95,777         +23.2%       +21.5%
  1998  ₹1,20,000      ₹3,60,000       ₹4,21,620      ₹0             ₹4,21,620         +17.1%       +10.5%
  1999  ₹1,20,000      ₹4,80,000       ₹7,05,894      ₹1,23,952      ₹8,29,846         +72.9%       +28.2%
  2000  ₹1,20,000      ₹6,00,000       ₹6,02,474      ₹2,55,537      ₹8,58,011         +43.0%       +14.3%
  2001  ₹1,20,000      ₹7,20,000       ₹9,64,377      ₹20,145        ₹9,84,522         +36.7%       +10.3%
  2002  ₹1,20,000      ₹8,40,000       ₹9,95,747      ₹1,45,360      ₹11,41,108        +35.8%       +8.6%
  2003  ₹1,20,000      ₹9,60,000       ₹21,84,259     ₹30,296        ₹22,14,555        +130.7%      +20.3%
  2004  ₹1,20,000      ₹10,80,000      ₹26,27,402     ₹10,049        ₹26,37,451        +144.2%      +19.0%
  2005  ₹1,20,000      ₹12,00,000      ₹36,99,423     ₹50,741        ₹37,50,164        +212.5%      +21.6%
  2006  ₹1,20,000      ₹13,20,000      ₹51,72,971     ₹1,77,794      ₹53,50,765        +305.4%      +23.8%
  2007  ₹1,20,000      ₹14,40,000      ₹80,05,950     ₹3,12,812      ₹83,18,762        +477.7%      +26.8%
  2008  ₹1,20,000      ₹15,60,000      ₹44,37,849     ₹10,049        ₹44,47,898        +185.1%      +15.0%
  2009  ₹1,20,000      ₹16,80,000      ₹79,53,749     ₹40,497        ₹79,94,246        +375.8%      +20.2%
  2010  ₹1,20,000      ₹18,00,000      ₹93,81,235     ₹1,66,967      ₹95,48,202        +430.5%      +20.0%
  2011  ₹1,20,000      ₹19,20,000      ₹73,78,645     ₹0             ₹73,78,645        +284.3%      +15.2%
  2012  ₹1,20,000      ₹20,40,000      ₹95,46,450     ₹20,145        ₹95,66,595        +369.0%      +16.2%
  2013  ₹1,20,000      ₹21,60,000      ₹1,03,40,759   ₹20,147        ₹1,03,60,906      +379.7%      +15.5%
  2014  ₹1,20,000      ₹22,80,000      ₹1,36,81,178   ₹71,410        ₹1,37,52,588      +503.2%      +16.6%
  2015  ₹1,20,000      ₹24,00,000      ₹1,31,25,603   ₹1,99,789      ₹1,33,25,392      +455.2%      +15.0%
  2016  ₹1,20,000      ₹25,20,000      ₹1,37,98,885   ₹92,264        ₹1,38,91,149      +451.2%      +14.2%
  2017  ₹1,20,000      ₹26,40,000      ₹1,77,51,706   ₹2,21,877      ₹1,79,73,583      +580.8%      +15.1%
  2018  ₹1,20,000      ₹27,60,000      ₹1,83,11,109   ₹3,59,639      ₹1,86,70,748      +576.5%      +14.3%
  2019  ₹1,20,000      ₹28,80,000      ₹2,05,12,478   ₹5,05,844      ₹2,10,18,322      +629.8%      +14.2%
  2020  ₹1,20,000      ₹30,00,000      ₹2,47,03,019   ₹0             ₹2,47,03,019      +723.4%      +14.3%
  2021  ₹1,20,000      ₹31,20,000      ₹3,07,23,451   ₹71,413        ₹3,07,94,864      +887.0%      +14.8%
  2022  ₹1,20,000      ₹32,40,000      ₹3,22,47,079   ₹30,291        ₹3,22,77,370      +896.2%      +14.3%
  2023  ₹1,20,000      ₹33,60,000      ₹3,88,89,416   ₹0             ₹3,88,89,416      +1057.4%     +14.5%
  2024  ₹1,20,000      ₹34,80,000      ₹4,23,80,905   ₹61,055        ₹4,24,41,960      +1119.6%     +14.3%
  2025  ₹1,20,000      ₹36,00,000      ₹4,69,57,676   ₹81,817        ₹4,70,39,494      +1206.7%     +14.1%
  2026  ₹70,000        ₹36,70,000      ₹4,33,05,507   ₹0             ₹4,33,05,507      +1080.0%     +13.4%
  -------------------------------------------------------------------------------------------------------
```

