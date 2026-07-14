# SIP Strategy Comparison Report

Comparative backtesting results across **422 Nifty 500 stocks** evaluating 7 distinct SIP strategies.
All cash flows simulate a monthly capital budget of **₹10,000** (or weekly equivalent of **₹2,500**).

---

## 🏆 Strategy Performance Leaderboard (Averages Across All Stocks)

The table below ranks the 7 investment models by their average annualized return (XIRR) across all tested stocks:

| Rank | Strategy Name | Average XIRR | Average Portfolio Value | Average Outperformance vs. Std |
| :---: | :--- | :---: | :---: | :---: |
| **#1** | God-Mode SIP (Lifetime Hindsight) | **22.66%** | ₹7,02,54,337 | **+6.21% CAGR** (+94.3%) |
| **#2** | Monthly Low-Day SIP (Monthly Low) | **17.39%** | ₹3,99,49,262 | **+0.94% CAGR** (+10.5%) |
| **#3** | Standard Monthly SIP (1st Close) | **16.45%** | ₹3,61,56,320 | Benchmark |
| **#4** | Mid-Month Monthly SIP (15th Close) | **16.42%** | ₹3,57,29,529 | **+-0.03% CAGR** (+-1.2%) |
| **#5** | Weekly SIP (Every 5 Days Close) | **16.38%** | ₹3,60,57,650 | **+-0.07% CAGR** (+-0.3%) |
| **#6** | 10% Dip Strategy (250-day rolling peak, 6% Cash) | **16.19%** | ₹3,40,85,564 | **+-0.26% CAGR** (+-5.7%) |
| **#7** | 200-Day SMA Buy-the-Dip (6% Cash) | **15.72%** | ₹3,13,94,400 | **+-0.73% CAGR** (+-13.2%) |

---

## 🔍 Key Insights from the Comparison

1. **Perfect Hindsight Timing Wins (By far)**: God-mode timing achieves **22.66% average CAGR** (average value **₹7.02 Crores**), outperforming standard monthly SIP (**16.45% CAGR**) by **+6.21% CAGR** (a **+123.8%** absolute portfolio increase).
2. **Monthly Perfect Timing**: If you could time the absolute low of every calendar month perfectly, you would earn **17.39% average CAGR** (a **+0.94% CAGR** premium over standard SIP, resulting in **+27.2%** extra wealth).
3. **10% Dip Strategy vs. 200-day SMA Buy-the-Dip**: 
   - The **10% Dip Strategy (rolling 250-day peak)** yields **15.93% average CAGR**. While it performs slightly better than the 200 SMA trigger, it still *underperforms* the Standard Monthly SIP (**16.45% CAGR**).
   - This occurs due to **cash drag**: when the market is rising, cash compounds at 6% in savings while missing out on rapid equity compounding. The "dip-buying" executing at lower prices is mathematically negated by buying at absolute price points that are higher than earlier monthly prices.
4. **Weekly vs. Monthly Frequency**: Running a weekly SIP yields **16.38% XIRR**, almost identical to standard monthly SIP (**16.45%**). Weekly dollar-cost-averaging does *not* improve returns.
5. **Day of Month Choice**: Investing on the 1st of the month vs. the 15th of the month has virtually zero impact on long-term terminal wealth.

---

## 📋 Full Stock Comparisons

The table lists all analyzed stocks, sorted alphabetically by symbol.

| Symbol | Company Name | Duration | Std XIRR | Mid-Mo XIRR | Weekly XIRR | 200 SMA XIRR | 10% Dip XIRR | Mo Low XIRR | God XIRR |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **3MINDIA** | 3M INDIA LIMITED | 23.5 Yrs | 20.44% | 20.37% | 20.34% | 19.50% | 20.05% | **20.94%** | **22.21%** |
| **AAVAS** | AAVAS FINANCIERS LIM | 7.8 Yrs | -1.36% | -1.77% | -1.61% | -2.71% | -1.55% | **0.73%** | **13.45%** |
| **ABB** | ABB INDIA LIMITED | 23.5 Yrs | 19.60% | 19.54% | 19.38% | 18.34% | 19.19% | **20.13%** | **21.83%** |
| **ABCAPITAL** | ADITYA BIRLA CAPITAL | 8.9 Yrs | 25.44% | 25.57% | 25.57% | 25.91% | 25.64% | **27.80%** | **39.10%** |
| **ACC** | ACC LIMITED | 23.5 Yrs | 4.22% | 4.19% | 4.07% | 3.61% | 4.13% | **4.81%** | **7.61%** |
| **ADANIENSOL** | ADANI ENERGY SOLUTIO | 11.0 Yrs | 39.81% | 39.86% | 39.54% | 37.54% | 39.01% | **41.86%** | **43.96%** |
| **ADANIGREEN** | ADANI GREEN ENERGY L | 8.1 Yrs | 51.40% | 51.16% | 50.54% | 46.23% | 50.29% | **55.19%** | **59.26%** |
| **ADANIPORTS** | ADANI PORT & SEZ LTD | 18.6 Yrs | 18.94% | 18.98% | 19.04% | 19.08% | 18.93% | **19.95%** | **22.78%** |
| **ADANIPOWER** | ADANI POWER LTD | 16.9 Yrs | 29.41% | 29.55% | 29.64% | 29.68% | 29.42% | **30.74%** | **40.85%** |
| **ADVENZYMES** | ADVANCED ENZYME TECH | 10.0 Yrs | 4.19% | 4.23% | 4.22% | 4.05% | 4.14% | **6.02%** | **16.53%** |
| **AEGISLOG** | AEGIS LOGISTICS LIMI | 23.5 Yrs | 35.86% | 35.74% | 35.60% | 33.67% | 35.83% | **36.70%** | **38.93%** |
| **AIAENG** | AIA ENGINEERING LIMI | 20.6 Yrs | 18.62% | 18.59% | 18.60% | 17.79% | 18.53% | **19.54%** | **22.48%** |
| **AJANTPHARM** | AJANTA PHARMA LIMITE | 23.5 Yrs | 36.39% | 36.39% | 36.43% | 35.73% | 36.37% | **37.27%** | **39.48%** |
| **ALKEM** | ALKEM LABORATORIES L | 10.6 Yrs | 13.77% | 13.75% | 13.75% | 13.27% | 13.87% | **14.89%** | **16.37%** |
| **AMBUJACEM** | AMBUJA CEMENTS LTD | 23.5 Yrs | 9.48% | 9.47% | 9.36% | 8.90% | 9.27% | **10.06%** | **12.70%** |
| **APLAPOLLO** | APL APOLLO TUBES LTD | 14.6 Yrs | 40.72% | 40.72% | 40.76% | 40.04% | 40.50% | **41.89%** | **43.46%** |
| **APLLTD** | ALEMBIC PHARMA LTD | 14.8 Yrs | 14.04% | 13.84% | 13.74% | 12.30% | 14.03% | **15.10%** | **16.96%** |
| **APOLLOHOSP** | APOLLO HOSPITALS ENT | 23.5 Yrs | 22.11% | 22.07% | 22.05% | 21.16% | 22.14% | **22.61%** | **23.28%** |
| **APOLLOTYRE** | APOLLO TYRES LTD | 23.5 Yrs | 14.49% | 14.42% | 14.41% | 14.10% | 14.46% | **15.17%** | **19.09%** |
| **ARE&M** | AMARA RAJA ENERGY MO | 23.5 Yrs | 23.60% | 23.54% | 23.42% | 22.48% | 23.56% | **24.28%** | **25.91%** |
| **ASHOKA** | ASHOKA BUILDCON LTD | 15.8 Yrs | 5.45% | 5.39% | 5.45% | 5.34% | 5.47% | **6.63%** | **14.32%** |
| **ASIANPAINT** | ASIAN PAINTS LIMITED | 23.5 Yrs | 20.55% | 20.53% | 20.47% | 19.94% | 20.12% | **20.98%** | **21.66%** |
| **ASTERDM** | ASTER DM HEALTHCARE  | 8.4 Yrs | 30.96% | 31.04% | 31.25% | 31.45% | 30.77% | **33.00%** | **39.83%** |
| **ASTRAL** | ASTRAL LIMITED | 19.3 Yrs | 35.50% | 35.46% | 35.42% | 34.14% | 35.22% | **36.77%** | **42.94%** |
| **ASTRAZEN** | ASTRAZENECA PHARMA I | 23.5 Yrs | 18.22% | 18.20% | 18.11% | 16.92% | 17.49% | **18.76%** | **20.03%** |
| **ATUL** | ATUL LTD | 23.5 Yrs | 25.23% | 25.23% | 25.18% | 24.36% | 25.19% | **26.09%** | **29.49%** |
| **AUBANK** | AU SMALL FINANCE BAN | 9.0 Yrs | 17.57% | 17.32% | 17.43% | 17.47% | 17.72% | **19.47%** | **27.23%** |
| **AUROPHARMA** | AUROBINDO PHARMA LTD | 23.5 Yrs | 20.87% | 20.84% | 20.79% | 19.98% | 20.78% | **21.68%** | **27.97%** |
| **AVANTIFEED** | AVANTI FEEDS LIMITED | 11.3 Yrs | 16.29% | 16.02% | 16.12% | 16.04% | 16.02% | **17.94%** | **22.25%** |
| **AXISBANK** | AXIS BANK LIMITED | 23.5 Yrs | 18.07% | 17.96% | 17.95% | 16.36% | 18.03% | **18.66%** | **20.04%** |
| **BAJAJ-AUTO** | BAJAJ AUTO LIMITED | 18.1 Yrs | 18.22% | 18.18% | 18.11% | 17.66% | 18.03% | **19.18%** | **21.51%** |
| **BAJAJCON** | BAJAJ CONSUMER CARE  | 15.9 Yrs | 12.72% | 12.79% | 12.79% | 12.46% | 12.66% | **13.64%** | **20.32%** |
| **BAJAJELEC** | BAJAJ ELECT.LTD | 18.7 Yrs | 7.68% | 7.59% | 7.57% | 7.37% | 7.39% | **8.77%** | **13.28%** |
| **BAJAJFINSV** | BAJAJ FINSERV LTD. | 18.1 Yrs | 27.41% | 27.45% | 27.47% | 28.12% | 27.41% | **28.58%** | **31.14%** |
| **BAJAJHLDNG** | BAJAJ HOLDINGS & INV | 23.5 Yrs | 17.70% | 17.73% | 17.70% | 16.84% | 17.48% | **18.31%** | **21.93%** |
| **BAJFINANCE** | BAJAJ FINANCE LIMITE | 23.5 Yrs | 38.91% | 38.98% | 38.83% | 37.60% | 38.90% | **39.45%** | **44.22%** |
| **BALKRISIND** | BALKRISHNA IND. LTD | 20.5 Yrs | 23.61% | 23.70% | 23.71% | 23.47% | 23.58% | **24.70%** | **30.53%** |
| **BALMLAWRIE** | BALMER LAWRIE & CO L | 23.5 Yrs | 10.55% | 10.55% | 10.39% | 9.76% | 10.58% | **11.20%** | **13.64%** |
| **BALRAMCHIN** | BALRAMPUR CHINI MILL | 23.5 Yrs | 15.33% | 15.26% | 15.21% | 14.16% | 15.26% | **16.07%** | **19.08%** |
| **BANDHANBNK** | BANDHAN BANK LIMITED | 8.3 Yrs | -4.61% | -4.60% | -4.53% | -4.21% | -4.52% | **-2.18%** | **15.84%** |
| **BANKBARODA** | BANK OF BARODA | 23.5 Yrs | 8.68% | 8.64% | 8.57% | 8.14% | 8.67% | **9.44%** | **14.93%** |
| **BANKINDIA** | BANK OF INDIA | 23.5 Yrs | 2.46% | 2.48% | 2.41% | 2.36% | 2.44% | **3.32%** | **14.03%** |
| **BASF** | BASF INDIA LTD | 23.5 Yrs | 15.00% | 14.95% | 14.93% | 14.46% | 15.03% | **15.57%** | **17.05%** |
| **BATAINDIA** | BATA INDIA LTD | 23.5 Yrs | 12.98% | 12.89% | 12.77% | 11.55% | 12.98% | **13.71%** | **15.70%** |
| **BBTC** | BOMBAY BURMAH TRADIN | 23.5 Yrs | 21.95% | 21.85% | 21.76% | 20.36% | 22.00% | **22.75%** | **25.11%** |
| **BDL** | BHARAT DYNAMICS LIMI | 8.3 Yrs | 36.48% | 36.76% | 36.79% | 37.63% | 36.67% | **38.94%** | **47.92%** |
| **BEL** | BHARAT ELECTRONICS L | 23.5 Yrs | 23.13% | 23.12% | 23.02% | 22.18% | 23.13% | **23.74%** | **26.43%** |
| **BEML** | BEML LIMITED | 23.5 Yrs | 14.48% | 14.46% | 14.32% | 13.02% | 14.45% | **15.26%** | **22.81%** |
| **BERGEPAINT** | BERGER PAINTS (I) LT | 23.5 Yrs | 22.94% | 22.83% | 22.75% | 20.96% | 22.78% | **23.48%** | **24.65%** |
| **BHARATFORG** | BHARAT FORGE LTD | 23.5 Yrs | 18.02% | 17.95% | 17.90% | 16.90% | 17.76% | **18.65%** | **23.52%** |
| **BHARTIARTL** | BHARTI AIRTEL LIMITE | 23.5 Yrs | 16.52% | 16.55% | 16.50% | 14.17% | 16.42% | **17.10%** | **18.17%** |
| **BHEL** | BHEL | 23.5 Yrs | 12.11% | 12.14% | 12.05% | 11.34% | 11.90% | **12.82%** | **23.59%** |
| **BIOCON** | BIOCON LIMITED. | 22.3 Yrs | 13.75% | 13.74% | 13.78% | 13.61% | 13.67% | **14.45%** | **18.65%** |
| **BIRLACORPN** | BIRLA CORPORATION LT | 23.5 Yrs | 11.47% | 11.35% | 11.12% | 8.89% | 11.40% | **12.22%** | **15.28%** |
| **BLISSGVS** | BLISS GVS PHARMA LTD | 16.0 Yrs | 22.32% | 22.33% | 22.41% | 22.46% | 22.33% | **23.52%** | **27.21%** |
| **BLUEDART** | BLUE DART EXPRESS LT | 23.5 Yrs | 14.50% | 14.39% | 14.22% | 12.58% | 14.36% | **15.05%** | **16.37%** |
| **BLUESTARCO** | BLUE STAR LIMITED | 23.5 Yrs | 21.80% | 21.75% | 21.61% | 19.91% | 21.08% | **22.29%** | **23.56%** |
| **BOMDYEING** | BOMBAY DYEING & MFG. | 23.5 Yrs | 5.57% | 5.47% | 5.34% | 4.51% | 5.33% | **6.50%** | **11.86%** |
| **BOSCHLTD** | BOSCH LIMITED | 23.5 Yrs | 16.33% | 16.28% | 16.27% | 14.09% | 15.13% | **16.72%** | **17.85%** |
| **BPCL** | BHARAT PETROLEUM COR | 23.5 Yrs | 14.56% | 14.59% | 14.47% | 13.94% | 14.55% | **15.62%** | **20.43%** |
| **BRIGADE** | BRIGADE ENTER. LTD | 18.5 Yrs | 19.21% | 19.18% | 19.29% | 19.50% | 19.18% | **20.34%** | **24.75%** |
| **BRITANNIA** | BRITANNIA INDUSTRIES | 23.5 Yrs | 21.70% | 21.68% | 21.68% | 21.54% | 21.54% | **22.14%** | **23.02%** |
| **BSE** | BSE LIMITED | 9.4 Yrs | 70.31% | 70.51% | 70.65% | 69.09% | 70.00% | **72.47%** | **86.67%** |
| **CANBK** | CANARA BANK | 23.5 Yrs | 7.79% | 7.78% | 7.77% | 7.37% | 7.74% | **8.57%** | **17.72%** |
| **CANFINHOME** | CAN FIN HOMES LTD | 23.5 Yrs | 26.18% | 26.16% | 26.18% | 25.82% | 26.08% | **26.70%** | **28.21%** |
| **CAPLIPOINT** | CAPLIN POINT LAB LTD | 12.1 Yrs | 29.88% | 29.72% | 29.27% | 27.91% | 28.67% | **31.57%** | **36.86%** |
| **CARBORUNIV** | CARBORUNDUM UNIVERSA | 23.5 Yrs | 20.04% | 19.83% | 19.75% | 17.65% | 19.53% | **20.60%** | **21.76%** |
| **CARERATING** | CARE RATINGS LIMITED | 13.6 Yrs | 9.93% | 9.90% | 10.00% | 9.82% | 9.77% | **11.10%** | **24.22%** |
| **CASTROLIND** | CASTROL INDIA LIMITE | 18.9 Yrs | 5.17% | 5.22% | 5.16% | 4.85% | 4.67% | **5.90%** | **9.72%** |
| **CCAVENUE** | AVENUESAI LIMITED | 10.3 Yrs | 0.23% | -0.12% | 0.09% | 0.17% | -0.23% | **2.63%** | **14.41%** |
| **CCL** | CCL PRODUCTS (I) LTD | 22.2 Yrs | 25.63% | 25.57% | 25.49% | 24.93% | 25.08% | **26.43%** | **32.64%** |
| **CDSL** | CENTRAL DEPO SER (I) | 9.0 Yrs | 35.52% | 35.38% | 35.55% | 34.16% | 34.75% | **37.12%** | **42.89%** |
| **CEATLTD** | CEAT LIMITED | 23.5 Yrs | 23.13% | 23.07% | 23.02% | 22.41% | 23.07% | **23.86%** | **27.49%** |
| **CEMPRO** | CEMINDIA PROJECTS LI | 23.5 Yrs | 26.54% | 26.61% | 26.57% | 26.15% | 26.56% | **27.37%** | **34.06%** |
| **CENTURYPLY** | CENTURY PLYBOARDS (I | 20.3 Yrs | 19.85% | 19.95% | 19.91% | 19.11% | 19.84% | **20.82%** | **25.17%** |
| **CERA** | CERA SANITARYWARE LT | 18.7 Yrs | 28.05% | 27.94% | 27.35% | 27.47% | 27.99% | **29.15%** | **31.43%** |
| **CESC** | CESC LTD | 23.5 Yrs | 14.41% | 14.32% | 14.07% | 11.90% | 14.26% | **15.18%** | **16.91%** |
| **CGPOWER** | CG POWER AND IND SOL | 23.5 Yrs | 26.60% | 26.54% | 26.34% | 24.39% | 26.35% | **27.32%** | **37.43%** |
| **CHAMBLFERT** | CHAMBAL FERTILIZERS  | 23.5 Yrs | 14.75% | 14.74% | 14.72% | 14.36% | 14.71% | **15.40%** | **17.36%** |
| **CHENNPETRO** | CHENNAI PETROLEUM CO | 23.5 Yrs | 14.65% | 14.64% | 14.60% | 14.12% | 14.44% | **15.37%** | **24.32%** |
| **CHOLAFIN** | CHOLAMANDALAM IN & F | 23.5 Yrs | 27.41% | 27.31% | 27.33% | 26.46% | 27.00% | **28.22%** | **34.84%** |
| **CHOLAHLDNG** | CHOLAMANDALAM FIN HO | 8.8 Yrs | 19.36% | 19.31% | 19.48% | 19.42% | 19.32% | **21.30%** | **31.33%** |
| **CIEINDIA** | CIE AUTOMOTIVE INDIA | 18.9 Yrs | 12.30% | 12.30% | 12.38% | 12.24% | 12.32% | **13.38%** | **20.28%** |
| **CIPLA** | CIPLA LTD | 23.5 Yrs | 11.74% | 11.73% | 11.69% | 11.32% | 11.74% | **12.33%** | **13.88%** |
| **COALINDIA** | COAL INDIA LTD | 15.7 Yrs | 6.70% | 6.75% | 6.77% | 6.83% | 6.75% | **7.62%** | **17.84%** |
| **COCHINSHIP** | COCHIN SHIPYARD LIMI | 8.9 Yrs | 35.57% | 35.78% | 35.93% | 35.43% | 35.49% | **37.45%** | **45.63%** |
| **COLPAL** | COLGATE PALMOLIVE LT | 23.5 Yrs | 13.68% | 13.67% | 13.59% | 13.53% | 13.64% | **14.15%** | **15.02%** |
| **CONCOR** | CONTAINER CORP OF IN | 23.5 Yrs | 9.41% | 9.37% | 9.19% | 8.21% | 9.07% | **9.92%** | **11.54%** |
| **COROMANDEL** | COROMANDEL INTERNTL. | 23.5 Yrs | 24.43% | 24.39% | 24.27% | 22.71% | 24.22% | **25.10%** | **25.92%** |
| **CREDITACC** | CREDITACCESS GRAMEEN | 7.9 Yrs | 17.19% | 17.07% | 17.06% | 15.93% | 17.35% | **20.08%** | **27.14%** |
| **CRISIL** | CRISIL LTD | 23.5 Yrs | 19.58% | 19.52% | 19.36% | 18.30% | 19.23% | **20.03%** | **20.96%** |
| **CROMPTON** | CROMPT GREA CON ELEC | 10.2 Yrs | -0.54% | -0.40% | -0.55% | -0.68% | -0.51% | **0.92%** | **7.89%** |
| **CUB** | CITY UNION BANK LTD | 23.5 Yrs | 20.40% | 20.30% | 20.28% | 19.35% | 20.03% | **20.97%** | **22.01%** |
| **CUMMINSIND** | CUMMINS INDIA LTD | 23.5 Yrs | 21.32% | 21.30% | 21.25% | 20.56% | 21.24% | **21.91%** | **24.50%** |
| **CYIENT** | CYIENT LIMITED | 23.5 Yrs | 14.57% | 14.59% | 14.44% | 13.58% | 14.55% | **15.36%** | **18.70%** |
| **DABUR** | DABUR INDIA LTD | 23.5 Yrs | 14.49% | 14.46% | 14.33% | 13.31% | 14.37% | **15.06%** | **16.03%** |
| **DBCORP** | D.B.CORP LTD | 16.5 Yrs | 0.99% | 0.97% | 1.00% | 1.10% | 0.99% | **1.96%** | **14.54%** |
| **DBL** | DILIP BUILDCON LIMIT | 9.9 Yrs | 2.12% | 1.98% | 2.08% | 1.23% | 1.91% | **4.34%** | **18.34%** |
| **DCAL** | DISHMAN CARBO AMCIS  | 8.8 Yrs | 3.87% | 3.42% | 3.73% | 4.28% | 4.01% | **6.95%** | **22.82%** |
| **DCBBANK** | DCB BANK LIMITED | 19.7 Yrs | 8.90% | 8.87% | 8.89% | 8.72% | 8.93% | **9.93%** | **14.97%** |
| **DCMSHRIRAM** | DCM SHRIRAM LIMITED | 23.5 Yrs | 19.97% | 19.84% | 19.71% | 17.88% | 19.52% | **20.55%** | **23.12%** |
| **DEEPAKFERT** | DEEPAK FERTILIZERS & | 23.5 Yrs | 18.72% | 18.72% | 18.67% | 17.85% | 18.51% | **19.41%** | **24.00%** |
| **DEEPAKNTR** | DEEPAK NITRITE LTD | 15.8 Yrs | 34.89% | 35.00% | 35.03% | 34.31% | 34.45% | **35.81%** | **37.25%** |
| **DIVISLAB** | DIVI S LABORATORIES  | 23.4 Yrs | 24.59% | 24.49% | 24.36% | 22.49% | 23.65% | **25.27%** | **26.17%** |
| **DIXON** | DIXON TECHNO (INDIA) | 8.8 Yrs | 48.65% | 48.95% | 48.89% | 45.79% | 48.02% | **51.13%** | **59.26%** |
| **DLF** | DLF LIMITED | 19.0 Yrs | 10.13% | 10.14% | 10.15% | 10.33% | 10.10% | **11.26%** | **18.73%** |
| **DMART** | AVENUE SUPERMARTS LI | 9.3 Yrs | 12.10% | 11.92% | 11.78% | 10.77% | 11.67% | **13.51%** | **15.28%** |
| **DRREDDY** | DR. REDDY S LABORATO | 16.5 Yrs | 8.91% | 8.92% | 8.93% | 8.71% | 9.07% | **9.56%** | **12.16%** |
| **ECLERX** | ECLERX SERVICES LTD | 18.5 Yrs | 22.39% | 22.42% | 22.37% | 23.94% | 22.40% | **23.58%** | **29.20%** |
| **EDELWEISS** | EDELWEISS FIN SERV L | 18.6 Yrs | 10.99% | 11.04% | 11.05% | 11.29% | 10.97% | **12.12%** | **17.51%** |
| **EICHERMOT** | EICHER MOTORS LTD | 23.5 Yrs | 31.93% | 31.96% | 31.89% | 30.89% | 31.80% | **32.68%** | **35.92%** |
| **EIDPARRY** | EID PARRY INDIA LTD | 23.5 Yrs | 15.76% | 15.65% | 15.48% | 14.08% | 15.19% | **16.35%** | **18.45%** |
| **EIHOTEL** | EIH LIMITED | 23.5 Yrs | 10.49% | 10.45% | 10.44% | 9.91% | 10.31% | **11.03%** | **14.80%** |
| **ELGIEQUIP** | ELGI EQUIPMENTS LTD | 23.5 Yrs | 21.03% | 20.99% | 20.99% | 20.20% | 20.92% | **21.71%** | **24.90%** |
| **EMAMILTD** | EMAMI LIMITED | 20.0 Yrs | 10.33% | 10.36% | 10.32% | 10.31% | 10.23% | **11.27%** | **14.60%** |
| **ENDURANCE** | ENDURANCE TECHNO. LT | 9.7 Yrs | 14.37% | 14.50% | 14.45% | 13.29% | 13.84% | **16.01%** | **22.87%** |
| **ENGINERSIN** | ENGINEERS INDIA LTD | 23.5 Yrs | 9.31% | 9.29% | 9.28% | 8.89% | 9.24% | **10.02%** | **14.18%** |
| **EPL** | EPL LIMITED | 23.5 Yrs | 13.97% | 13.98% | 13.99% | 13.59% | 14.03% | **14.78%** | **21.28%** |
| **ERIS** | ERIS LIFESCIENCES LI | 9.0 Yrs | 14.82% | 14.89% | 15.06% | 14.74% | 14.79% | **16.62%** | **23.44%** |
| **ESCORTS** | ESCORTS KUBOTA LIMIT | 23.5 Yrs | 21.64% | 21.60% | 21.66% | 21.17% | 21.65% | **22.44%** | **26.88%** |
| **EXIDEIND** | EXIDE INDUSTRIES LTD | 23.5 Yrs | 15.67% | 15.60% | 15.39% | 14.13% | 15.56% | **16.22%** | **17.26%** |
| **FDC** | FDC LIMITED | 23.5 Yrs | 12.59% | 12.59% | 12.56% | 11.84% | 12.55% | **13.20%** | **15.70%** |
| **FEDERALBNK** | FEDERAL BANK LTD | 26.5 Yrs | 17.90% | 17.88% | 17.86% | 18.07% | 17.90% | **18.58%** | **20.35%** |
| **FINCABLES** | FINOLEX CABLES LTD | 23.5 Yrs | 18.75% | 18.71% | 18.69% | 18.03% | 18.69% | **19.43%** | **23.87%** |
| **FINEORG** | FINE ORGANIC IND. LT | 8.0 Yrs | 15.27% | 15.04% | 15.11% | 13.26% | 14.98% | **17.00%** | **19.98%** |
| **FINPIPE** | FINOLEX INDUSTRIES L | 23.5 Yrs | 14.44% | 14.44% | 14.41% | 13.83% | 14.35% | **15.15%** | **19.59%** |
| **FORTIS** | FORTIS HEALTHCARE LT | 19.2 Yrs | 17.15% | 17.19% | 17.21% | 16.96% | 17.17% | **17.95%** | **20.26%** |
| **FSL** | FIRSTSOURCE SOLU. LT | 19.4 Yrs | 18.57% | 18.59% | 18.69% | 18.56% | 18.55% | **19.75%** | **27.22%** |
| **GAIL** | GAIL (INDIA) LTD | 23.5 Yrs | 10.66% | 10.69% | 10.42% | 8.92% | 10.53% | **11.40%** | **14.30%** |
| **GALAXYSURF** | GALAXY SURFACTANTS L | 8.4 Yrs | 0.44% | 0.52% | 0.39% | 0.92% | 0.27% | **2.16%** | **12.33%** |
| **GAYAPROJ** | GAYATRI PROJECTS LTD | 14.9 Yrs | 2.47% | 2.35% | 0.96% | 2.73% | 2.26% | **4.17%** | **22.00%** |
| **GESHIP** | THE GE SHPG.LTD | 23.5 Yrs | 13.33% | 13.32% | 13.22% | 12.23% | 13.04% | **13.96%** | **17.16%** |
| **GFLLIMITED** | GFL LIMITED | 23.5 Yrs | 5.88% | 5.66% | 5.45% | 3.90% | 5.57% | **6.61%** | **13.43%** |
| **GHCL** | GHCL LIMITED | 23.5 Yrs | 13.60% | 13.57% | 13.54% | 13.12% | 13.53% | **14.22%** | **18.27%** |
| **GICRE** | GENERAL INS CORP OF  | 8.7 Yrs | 11.59% | 11.81% | 11.97% | 11.63% | 11.47% | **13.81%** | **24.54%** |
| **GILLETTE** | GILLETTE INDIA LTD | 23.5 Yrs | 11.95% | 11.92% | 11.93% | 11.48% | 11.89% | **12.46%** | **14.21%** |
| **GLAXO** | GLAXOSMITHKLINE PHAR | 23.5 Yrs | 8.54% | 8.52% | 8.46% | 7.80% | 8.05% | **9.00%** | **10.63%** |
| **GLENMARK** | GLENMARK PHARMACEUTI | 23.5 Yrs | 18.99% | 18.95% | 18.73% | 15.76% | 18.89% | **19.58%** | **22.39%** |
| **GMDCLTD** | GUJARAT MINERAL DEV  | 23.5 Yrs | 16.41% | 16.35% | 16.25% | 15.04% | 16.29% | **17.09%** | **22.38%** |
| **GMRAIRPORT** | GMR AIRPORTS LIMITED | 19.9 Yrs | 12.92% | 12.98% | 13.00% | 12.84% | 12.90% | **13.94%** | **20.21%** |
| **GODFRYPHLP** | GODFREY PHILLIPS IND | 23.5 Yrs | 20.52% | 20.49% | 20.47% | 20.01% | 20.42% | **21.04%** | **22.86%** |
| **GODREJAGRO** | GODREJ AGROVET LIMIT | 8.7 Yrs | 0.90% | 0.95% | 0.91% | 1.25% | 1.05% | **2.45%** | **10.94%** |
| **GODREJCP** | GODREJ CONSUMER PROD | 23.5 Yrs | 19.14% | 19.12% | 19.10% | 17.92% | 18.23% | **19.67%** | **20.53%** |
| **GODREJIND** | GODREJ INDUSTRIES LT | 23.5 Yrs | 22.80% | 22.72% | 22.68% | 20.02% | 22.58% | **23.58%** | **24.89%** |
| **GODREJPROP** | GODREJ PROPERTIES LT | 16.5 Yrs | 16.57% | 16.64% | 16.60% | 16.45% | 16.61% | **17.40%** | **21.15%** |
| **GPPL** | GUJARAT PIPAVAV PORT | 15.9 Yrs | 5.92% | 5.90% | 5.94% | 5.48% | 5.75% | **6.87%** | **13.32%** |
| **GRANULES** | GRANULES INDIA LIMIT | 21.1 Yrs | 30.11% | 30.14% | 30.19% | 29.87% | 30.06% | **31.03%** | **36.29%** |
| **GRAPHITE** | GRAPHITE INDIA LTD | 23.5 Yrs | 16.83% | 16.71% | 16.59% | 15.06% | 16.20% | **17.46%** | **20.05%** |
| **GRASIM** | GRASIM INDUSTRIES LT | 23.5 Yrs | 14.46% | 14.42% | 14.34% | 13.67% | 14.05% | **14.98%** | **18.40%** |
| **GREAVESCOT** | GREAVES COTTON LTD. | 21.9 Yrs | 10.63% | 10.65% | 10.61% | 9.93% | 10.35% | **11.49%** | **17.82%** |
| **GRINDWELL** | GRINDWELL NORTON LIM | 19.8 Yrs | 21.28% | 21.33% | 21.32% | 20.95% | 21.30% | **21.99%** | **24.13%** |
| **GSFC** | GUJ STATE FERT & CHE | 23.5 Yrs | 11.21% | 11.16% | 11.01% | 9.69% | 11.18% | **11.98%** | **16.00%** |
| **GUJALKALI** | GUJARAT ALKALIES & C | 23.5 Yrs | 11.06% | 11.00% | 10.86% | 9.87% | 10.98% | **11.79%** | **14.51%** |
| **GUJENERGY** | GUJARAT ENERGY LIMIT | 23.5 Yrs | 13.99% | 13.98% | 13.91% | 13.20% | 13.98% | **14.55%** | **16.32%** |
| **GULFOILLUB** | GULF OIL LUB. IND. L | 12.0 Yrs | 7.84% | 7.75% | 7.70% | 7.30% | 7.63% | **8.96%** | **16.51%** |
| **GVPIL** | GE POWER INDIA LIMIT | 23.5 Yrs | 7.99% | 7.91% | 7.79% | 7.38% | 7.97% | **8.77%** | **18.54%** |
| **GVT&D** | GE VERNOVA T&D INDIA | 18.0 Yrs | 28.28% | 28.28% | 28.47% | 28.04% | 28.26% | **29.36%** | **41.37%** |
| **HAL** | HINDUSTAN AERONAUTIC | 8.3 Yrs | 42.59% | 42.44% | 42.95% | 42.18% | 42.60% | **44.62%** | **50.90%** |
| **HATSUN** | HATSUN AGRO PRODUCT  | 12.1 Yrs | 11.27% | 11.17% | 11.06% | 9.98% | 10.22% | **12.18%** | **15.17%** |
| **HAVELLS** | HAVELLS INDIA LIMITE | 23.5 Yrs | 28.34% | 28.22% | 28.17% | 25.67% | 28.05% | **28.90%** | **30.30%** |
| **HCLTECH** | HCL TECHNOLOGIES LTD | 23.5 Yrs | 17.28% | 17.30% | 17.24% | 16.41% | 17.28% | **18.01%** | **21.76%** |
| **HDFCAMC** | HDFC AMC LIMITED | 7.9 Yrs | 18.18% | 18.14% | 18.29% | 16.60% | 17.84% | **20.04%** | **26.84%** |
| **HDFCBANK** | HDFC BANK LTD | 23.5 Yrs | 16.75% | 16.71% | 16.69% | 16.08% | 16.47% | **17.29%** | **18.12%** |
| **HDFCLIFE** | HDFC LIFE INS CO LTD | 8.7 Yrs | 0.41% | 0.39% | 0.28% | 0.49% | 0.66% | **1.82%** | **7.62%** |
| **HEG** | HEG LTD | 23.5 Yrs | 18.52% | 18.44% | 18.41% | 17.31% | 18.47% | **19.19%** | **22.03%** |
| **HEIDELBERG** | HEIDELBERGCEMENT (I) | 23.5 Yrs | 10.19% | 10.11% | 10.06% | 9.52% | 10.18% | **11.10%** | **14.56%** |
| **HERITGFOOD** | HERITAGE FOODS LTD | 23.5 Yrs | 17.31% | 17.25% | 17.22% | 16.53% | 17.16% | **18.04%** | **21.74%** |
| **HEROMOTOCO** | HERO MOTOCORP LIMITE | 23.5 Yrs | 11.85% | 11.85% | 11.75% | 10.71% | 11.88% | **12.62%** | **14.35%** |
| **HFCL** | HFCL LIMITED | 23.5 Yrs | 17.80% | 17.78% | 17.87% | 17.89% | 17.79% | **18.66%** | **23.33%** |
| **HINDALCO** | HINDALCO  INDUSTRIES | 23.5 Yrs | 13.66% | 13.63% | 13.65% | 13.25% | 13.55% | **14.39%** | **20.17%** |
| **HINDCOPPER** | HINDUSTAN COPPER LTD | 16.5 Yrs | 18.74% | 18.77% | 18.78% | 18.81% | 18.74% | **19.93%** | **33.73%** |
| **HINDPETRO** | HINDUSTAN PETROLEUM  | 23.5 Yrs | 14.03% | 14.08% | 14.11% | 13.79% | 14.04% | **14.92%** | **21.43%** |
| **HINDUNILVR** | HINDUSTAN UNILEVER L | 23.5 Yrs | 12.11% | 12.14% | 12.13% | 12.07% | 12.05% | **12.62%** | **13.75%** |
| **HINDZINC** | HINDUSTAN ZINC LIMIT | 23.5 Yrs | 17.28% | 17.61% | 17.70% | 17.95% | 17.46% | **18.09%** | **20.55%** |
| **HONAUT** | HONEYWELL AUTOMATION | 23.5 Yrs | 21.45% | 21.46% | 21.40% | 21.22% | 21.34% | **22.10%** | **23.67%** |
| **HSCL** | HIMADRI SPECIALITY C | 19.4 Yrs | 24.94% | 24.92% | 24.91% | 24.44% | 24.95% | **26.09%** | **32.31%** |
| **HUDCO** | HSG & URBAN DEV CORP | 9.2 Yrs | 27.10% | 27.28% | 27.38% | 26.65% | 26.97% | **29.22%** | **40.23%** |
| **IBULLSLTD** | INDIABULLS LIMITED | 14.9 Yrs | 6.90% | 6.87% | 6.74% | 7.13% | 6.95% | **8.92%** | **22.13%** |
| **ICICIBANK** | ICICI BANK LTD. | 23.5 Yrs | 15.93% | 15.92% | 15.90% | 15.14% | 15.82% | **16.57%** | **19.24%** |
| **ICICIGI** | ICICI LOMBARD GIC LI | 8.8 Yrs | 7.99% | 7.91% | 7.87% | 7.65% | 8.16% | **9.39%** | **13.16%** |
| **ICICIPRULI** | ICICI PRU LIFE INS C | 9.8 Yrs | 2.17% | 2.22% | 2.11% | 2.59% | 2.17% | **3.65%** | **11.45%** |
| **ICRA** | ICRA LIMITED | 19.3 Yrs | 10.47% | 10.52% | 10.50% | 10.09% | 10.33% | **11.33%** | **14.56%** |
| **IDFCFIRSTB** | IDFC FIRST BANK LIMI | 10.7 Yrs | 8.20% | 8.22% | 8.29% | 8.15% | 8.27% | **9.96%** | **21.52%** |
| **IEX** | INDIAN ENERGY EXC LT | 8.7 Yrs | 6.40% | 6.14% | 6.12% | 5.81% | 6.64% | **8.04%** | **14.03%** |
| **IFBIND** | IFB INDUSTRIES LTD | 23.5 Yrs | 26.85% | 26.73% | 26.55% | 25.90% | 26.83% | **27.99%** | **29.47%** |
| **IFCI** | IFCI LTD | 23.5 Yrs | 11.19% | 11.19% | 11.17% | 10.81% | 11.19% | **12.09%** | **24.44%** |
| **IGL** | INDRAPRASTHA GAS LTD | 22.6 Yrs | 13.11% | 13.17% | 13.14% | 12.81% | 13.02% | **13.79%** | **15.19%** |
| **INDHOTEL** | THE INDIAN HOTELS CO | 23.5 Yrs | 16.24% | 16.22% | 16.20% | 15.47% | 15.95% | **16.84%** | **20.40%** |
| **INDIACEM** | THE INDIA CEMENTS LI | 23.5 Yrs | 10.57% | 10.59% | 10.48% | 10.00% | 10.62% | **11.37%** | **15.20%** |
| **INDIANB** | INDIAN BANK | 19.4 Yrs | 14.77% | 14.76% | 14.76% | 14.43% | 14.77% | **15.81%** | **27.13%** |
| **INDIGO** | INTERGLOBE AVIATION  | 10.7 Yrs | 21.02% | 20.96% | 21.04% | 21.34% | 21.14% | **22.62%** | **27.48%** |
| **INDOCO** | INDOCO REMEDIES LTD. | 21.5 Yrs | 9.76% | 9.80% | 9.77% | 9.34% | 9.76% | **10.59%** | **15.41%** |
| **INDOSTAR** | INDOSTAR CAPITAL FIN | 8.2 Yrs | 3.21% | 3.25% | 3.31% | 3.58% | 3.37% | **5.84%** | **21.53%** |
| **INDUSINDBK** | INDUSIND BANK LIMITE | 23.5 Yrs | 15.23% | 15.17% | 15.11% | 14.28% | 15.05% | **16.03%** | **19.61%** |
| **INDUSTOWER** | INDUS TOWERS LIMITED | 13.5 Yrs | 6.48% | 6.40% | 6.47% | 6.42% | 6.42% | **7.72%** | **16.66%** |
| **INFY** | INFOSYS LIMITED | 23.5 Yrs | 10.01% | 10.11% | 10.04% | 9.54% | 10.00% | **10.67%** | **12.33%** |
| **INOXWIND** | INOX WIND LIMITED | 11.3 Yrs | 18.30% | 18.34% | 18.37% | 17.14% | 18.28% | **20.55%** | **41.13%** |
| **INTELLECT** | INTELLECT DESIGN ARE | 11.6 Yrs | 18.71% | 18.70% | 18.65% | 17.31% | 18.43% | **20.76%** | **37.64%** |
| **IOC** | INDIAN OIL CORP LTD | 23.5 Yrs | 9.34% | 9.31% | 9.19% | 8.47% | 9.28% | **10.09%** | **12.99%** |
| **IPCALAB** | IPCA LABORATORIES LT | 23.5 Yrs | 21.17% | 21.18% | 21.06% | 19.90% | 21.19% | **21.82%** | **23.64%** |
| **IRB** | IRB INFRA DEV LTD. | 18.4 Yrs | 8.64% | 8.58% | 8.63% | 8.60% | 8.65% | **9.83%** | **21.04%** |
| **IRCON** | IRCON INTERNATIONAL  | 7.8 Yrs | 18.97% | 19.04% | 19.15% | 18.40% | 18.77% | **21.10%** | **26.75%** |
| **ITC** | ITC LTD | 23.5 Yrs | 9.01% | 8.99% | 8.95% | 8.43% | 8.54% | **9.49%** | **10.94%** |
| **ITDC** | INDIA TOUR. DEV. CO. | 9.5 Yrs | 12.77% | 12.40% | 12.61% | 12.42% | 12.56% | **14.96%** | **27.75%** |
| **ITI** | ITI LTD | 23.5 Yrs | 14.76% | 14.73% | 14.73% | 14.55% | 14.75% | **15.61%** | **20.40%** |
| **J&KBANK** | J & K BANK LTD. | 23.5 Yrs | 10.04% | 10.03% | 10.01% | 9.38% | 10.03% | **10.79%** | **21.86%** |
| **JAICORPLTD** | JAI CORP LIMITED | 23.5 Yrs | 12.75% | 12.79% | 12.66% | 10.57% | 12.69% | **13.58%** | **15.24%** |
| **JAMNAAUTO** | JAMNA AUTO IND LTD | 15.6 Yrs | 19.68% | 19.66% | 19.70% | 19.39% | 19.57% | **20.78%** | **26.27%** |
| **JBCHEPHARM** | J B CHEMICALS AND PH | 23.5 Yrs | 27.60% | 27.61% | 27.62% | 27.13% | 27.57% | **28.36%** | **32.56%** |
| **JINDALSAW** | JINDAL SAW LIMITED | 23.5 Yrs | 14.59% | 14.56% | 14.54% | 13.63% | 14.58% | **15.39%** | **19.79%** |
| **JINDALSTEL** | JINDAL STEEL LIMITED | 23.5 Yrs | 18.68% | 18.59% | 18.54% | 18.25% | 18.39% | **19.43%** | **23.14%** |
| **JKCEMENT** | JK CEMENT LIMITED | 20.3 Yrs | 24.27% | 24.30% | 24.28% | 23.85% | 24.30% | **25.29%** | **31.00%** |
| **JKLAKSHMI** | JK LAKSHMI CEMENT LT | 23.5 Yrs | 21.04% | 21.07% | 21.00% | 21.01% | 13.11% | **21.23%** | **22.44%** |
| **JKPAPER** | JK PAPER LIMITED | 21.1 Yrs | 15.35% | 15.33% | 15.34% | 15.18% | 15.30% | **16.02%** | **20.39%** |
| **JKTYRE** | JK TYRE & INDUSTRIES | 23.5 Yrs | 19.92% | 19.89% | 19.88% | 19.67% | 18.27% | **20.53%** | **25.01%** |
| **JMFINANCIL** | JM FINANCIAL LIMITED | 23.5 Yrs | 34.28% | 34.21% | 34.25% | 34.31% | 8.75% | **34.32%** | **34.40%** |
| **JSL** | JINDAL STAINLESS LIM | 22.7 Yrs | 20.81% | 20.81% | 20.87% | 20.57% | 20.86% | **21.71%** | **27.86%** |
| **JSWDULUX** | JSW DULUX LIMITED | 23.5 Yrs | 11.82% | 11.82% | 11.73% | 11.37% | 11.80% | **12.33%** | **13.20%** |
| **JSWENERGY** | JSW ENERGY LIMITED | 16.5 Yrs | 19.47% | 19.51% | 19.49% | 19.14% | 19.32% | **20.56%** | **27.11%** |
| **JSWSTEEL** | JSW STEEL LIMITED | 21.3 Yrs | 20.40% | 20.38% | 20.43% | 20.32% | 20.43% | **21.39%** | **25.83%** |
| **JUBLFOOD** | JUBILANT FOODWORKS L | 16.4 Yrs | 11.90% | 11.84% | 11.78% | 10.78% | 11.70% | **13.00%** | **15.94%** |
| **JUBLPHARMA** | JUBILANT PHARMOVA LT | 23.5 Yrs | 11.91% | 11.82% | 11.84% | 9.88% | 11.23% | **12.52%** | **17.89%** |
| **JUSTDIAL** | JUSTDIAL LTD. | 13.1 Yrs | 0.32% | 0.29% | 0.28% | 0.46% | 0.33% | **1.90%** | **13.37%** |
| **JYOTHYLAB** | JYOTHY LABS LIMITED | 18.6 Yrs | 9.09% | 9.06% | 9.06% | 9.99% | 8.99% | **10.20%** | **13.75%** |
| **KAJARIACER** | KAJARIA CERAMICS LTD | 23.5 Yrs | 26.60% | 26.47% | 26.49% | 23.62% | 26.29% | **27.26%** | **28.35%** |
| **KANSAINER** | KANSAI NEROLAC PAINT | 23.5 Yrs | 13.13% | 13.03% | 12.88% | 11.61% | 12.55% | **13.63%** | **15.84%** |
| **KARURVYSYA** | KARUR VYSYA BANK LTD | 23.5 Yrs | 16.89% | 16.83% | 16.84% | 16.18% | 16.78% | **17.48%** | **22.04%** |
| **KEC** | KEC INTL. LIMITED | 20.4 Yrs | 12.68% | 12.67% | 12.66% | 12.29% | 12.60% | **13.78%** | **20.28%** |
| **KEI** | KEI INDUSTRIES LTD. | 20.3 Yrs | 38.04% | 38.06% | 38.17% | 37.41% | 38.03% | **39.19%** | **48.38%** |
| **KIOCL** | KIOCL LIMITED | 9.6 Yrs | 25.96% | 25.43% | 17.86% | 17.51% | 15.61% | **27.28%** | **35.10%** |
| **KIRLOSENG** | KIRLOSKAR OIL ENG LT | 15.6 Yrs | 26.74% | 26.78% | 26.90% | 26.32% | 26.63% | **27.75%** | **37.87%** |
| **KNRCON** | KNR CONSTRU LTD. | 18.4 Yrs | 16.94% | 16.98% | 16.99% | 18.46% | 16.89% | **18.44%** | **24.32%** |
| **KOLTEPATIL** | KOLTE PATIL DEV. LTD | 18.6 Yrs | 12.77% | 12.75% | 12.79% | 12.93% | 12.76% | **14.05%** | **18.10%** |
| **KOTAKBANK** | KOTAK MAHINDRA BANK  | 23.5 Yrs | 21.15% | 21.07% | 21.06% | 19.54% | 21.20% | **21.76%** | **22.81%** |
| **KPIL** | KALPATARU PROJECT IN | 23.5 Yrs | 23.12% | 23.02% | 22.92% | 20.37% | 22.96% | **23.87%** | **25.40%** |
| **KPRMILL** | KPR MILL LTD. | 18.9 Yrs | 34.40% | 34.29% | 34.46% | 33.99% | 34.38% | **35.65%** | **40.95%** |
| **KRBL** | KRBL LIMITED | 23.5 Yrs | 21.01% | 20.88% | 20.90% | 19.58% | 20.79% | **21.83%** | **24.97%** |
| **KSCL** | KAVERI SEED CO. LTD. | 18.8 Yrs | 15.85% | 15.90% | 15.88% | 15.54% | 15.91% | **16.90%** | **19.36%** |
| **KTKBANK** | KARNATAKA BANK LIMIT | 23.5 Yrs | 11.22% | 11.12% | 11.12% | 10.73% | 11.19% | **11.89%** | **16.42%** |
| **LALPATHLAB** | DR. LAL PATH LABS LT | 10.6 Yrs | 14.55% | 14.51% | 14.49% | 14.14% | 14.64% | **15.83%** | **18.67%** |
| **LAURUSLABS** | LAURUS LABS LIMITED | 9.6 Yrs | 42.89% | 42.97% | 43.09% | 42.10% | 42.72% | **44.80%** | **51.53%** |
| **LEMONTREE** | LEMON TREE HOTELS LT | 8.3 Yrs | 14.39% | 14.27% | 14.54% | 14.80% | 14.53% | **17.06%** | **31.84%** |
| **LICHSGFIN** | LIC HOUSING FINANCE  | 23.5 Yrs | 15.08% | 14.95% | 14.92% | 13.18% | 15.06% | **16.03%** | **18.34%** |
| **LINDEINDIA** | LINDE INDIA LIMITED | 23.5 Yrs | 25.03% | 25.01% | 24.91% | 24.12% | 24.97% | **25.65%** | **26.83%** |
| **LMW** | LMW LIMITED | 23.5 Yrs | 17.36% | 17.19% | 17.21% | 14.64% | 16.96% | **17.85%** | **21.81%** |
| **LT** | LARSEN & TOUBRO LTD. | 23.5 Yrs | 17.58% | 17.56% | 17.54% | 15.79% | 17.16% | **18.44%** | **22.51%** |
| **LTF** | L&T FINANCE LIMITED | 14.9 Yrs | 16.43% | 16.42% | 16.49% | 16.46% | 16.32% | **17.47%** | **23.37%** |
| **LTM** | LTM LIMITED | 10.0 Yrs | 13.46% | 13.35% | 13.28% | 11.36% | 13.15% | **14.66%** | **18.28%** |
| **LTTS** | L&T TECHNOLOGY SER.  | 9.8 Yrs | 10.33% | 10.43% | 10.32% | 9.41% | 10.65% | **11.78%** | **16.07%** |
| **LUPIN** | LUPIN LIMITED | 23.5 Yrs | 18.47% | 18.33% | 18.37% | 16.75% | 17.92% | **19.08%** | **20.14%** |
| **LUXIND** | LUX INDUSTRIES LIMIT | 10.6 Yrs | 0.67% | 0.57% | 0.54% | 0.13% | 0.09% | **2.26%** | **11.50%** |
| **M&M** | MAHINDRA & MAHINDRA  | 23.5 Yrs | 20.60% | 20.53% | 20.55% | 18.75% | 20.45% | **21.20%** | **23.78%** |
| **M&MFIN** | M&M FIN. SERVICES LT | 20.3 Yrs | 12.02% | 12.02% | 12.02% | 11.75% | 11.99% | **12.85%** | **16.00%** |
| **MAHABANK** | BANK OF MAHARASHTRA | 22.3 Yrs | 8.58% | 8.65% | 8.64% | 8.44% | 8.54% | **9.35%** | **19.67%** |
| **MAHLOG** | MAHINDRA LOGISTIC LI | 8.7 Yrs | -1.89% | -2.07% | -2.02% | -1.76% | -1.98% | **0.06%** | **13.77%** |
| **MAHSCOOTER** | MAHARASHTRA SCOOTERS | 23.5 Yrs | 24.74% | 24.78% | 24.72% | 23.55% | 24.59% | **25.46%** | **31.09%** |
| **MAHSEAMLES** | MAHARASHTRA SEAMLESS | 23.5 Yrs | 11.13% | 11.08% | 11.08% | 10.49% | 11.10% | **11.76%** | **15.67%** |
| **MANAPPURAM** | MANAPPURAM FINANCE L | 16.0 Yrs | 19.32% | 19.42% | 19.43% | 18.86% | 19.21% | **20.70%** | **27.62%** |
| **MARICO** | MARICO LIMITED | 23.5 Yrs | 22.65% | 22.58% | 22.57% | 21.50% | 22.60% | **23.17%** | **23.55%** |
| **MARUTI** | MARUTI SUZUKI INDIA  | 23.0 Yrs | 16.85% | 16.83% | 16.80% | 16.51% | 16.66% | **17.48%** | **19.32%** |
| **MASFIN** | MAS FINANCIAL SERV L | 8.7 Yrs | 6.95% | 6.74% | 6.90% | 7.33% | 6.67% | **8.82%** | **15.15%** |
| **MFSL** | MAX FINANCIAL SERV L | 23.5 Yrs | 19.39% | 19.32% | 19.31% | 17.80% | 19.39% | **20.08%** | **21.45%** |
| **MGL** | MAHANAGAR GAS LTD. | 10.0 Yrs | 2.31% | 2.27% | 2.33% | 2.21% | 1.95% | **3.76%** | **9.57%** |
| **MHRIL** | MAHINDRA HOLIDAYS LT | 17.0 Yrs | 3.38% | 3.37% | 3.38% | 3.34% | 3.38% | **4.24%** | **12.02%** |
| **MINDACORP** | MINDA CORPORATION LT | 14.3 Yrs | 20.65% | 20.60% | 20.64% | 18.71% | 18.90% | **21.74%** | **30.06%** |
| **MMTC** | MMTC LIMITED | 16.5 Yrs | 4.70% | 4.67% | 4.69% | 4.84% | 4.70% | **5.96%** | **20.01%** |
| **MOIL** | MOIL LIMITED | 15.6 Yrs | 6.60% | 6.58% | 6.63% | 6.61% | 6.62% | **7.48%** | **13.86%** |
| **MOTHERSON** | SAMVRDHNA MTHRSN INT | 23.5 Yrs | 23.75% | 23.54% | 23.46% | 21.36% | 23.51% | **24.32%** | **25.83%** |
| **MOTILALOFS** | MOTILAL OSWAL FIN LT | 18.8 Yrs | 25.41% | 25.44% | 25.47% | 25.16% | 25.30% | **26.54%** | **31.00%** |
| **MPHASIS** | MPHASIS LIMITED | 23.5 Yrs | 13.89% | 13.88% | 13.88% | 13.34% | 13.81% | **14.62%** | **16.56%** |
| **MRF** | MRF LTD | 23.5 Yrs | 21.24% | 21.14% | 21.14% | 20.52% | 21.18% | **21.80%** | **24.51%** |
| **MRPL** | MRPL | 23.5 Yrs | 8.64% | 8.59% | 8.60% | 7.83% | 8.45% | **9.37%** | **17.14%** |
| **MUTHOOTFIN** | MUTHOOT FINANCE LIMI | 15.2 Yrs | 25.62% | 25.58% | 25.68% | 25.74% | 25.66% | **26.83%** | **30.64%** |
| **NAM-INDIA** | NIPPON L I A M LTD | 8.7 Yrs | 28.89% | 29.04% | 29.05% | 28.08% | 28.72% | **31.11%** | **38.48%** |
| **NATCOPHARM** | NATCO PHARMA LTD. | 23.5 Yrs | 21.48% | 21.39% | 21.39% | 20.19% | 21.49% | **22.31%** | **26.76%** |
| **NATIONALUM** | NATIONAL ALUMINIUM C | 23.5 Yrs | 13.39% | 13.40% | 13.40% | 12.94% | 13.41% | **14.11%** | **19.20%** |
| **NAUKRI** | INFO EDGE (I) LTD | 19.7 Yrs | 21.41% | 21.40% | 21.41% | 20.87% | 21.39% | **22.23%** | **24.46%** |
| **NAVINFLUOR** | NAVIN FLUORINE INT.  | 19.1 Yrs | 36.50% | 36.58% | 36.52% | 36.07% | 36.38% | **37.54%** | **43.41%** |
| **NBCC** | NBCC (INDIA) LIMITED | 14.3 Yrs | 20.87% | 20.73% | 20.72% | 18.84% | 20.54% | **22.09%** | **29.21%** |
| **NCC** | NCC LIMITED | 23.5 Yrs | 12.29% | 12.06% | 12.20% | 8.44% | 9.96% | **12.86%** | **18.75%** |
| **NESCO** | NESCO LTD. | 18.3 Yrs | 15.69% | 15.59% | 15.67% | 16.06% | 15.54% | **16.74%** | **18.67%** |
| **NFL** | NATIONAL FERT. LTD | 19.6 Yrs | 4.49% | 4.45% | 4.47% | 4.14% | 4.48% | **5.54%** | **15.63%** |
| **NH** | NARAYANA HRUDAYALAYA | 10.5 Yrs | 27.42% | 27.56% | 27.62% | 26.93% | 27.37% | **28.86%** | **33.45%** |
| **NHPC** | NHPC LTD | 16.9 Yrs | 11.44% | 11.47% | 11.48% | 11.37% | 11.45% | **12.15%** | **16.53%** |
| **NIACL** | THE NEW INDIA ASSU C | 8.7 Yrs | 4.10% | 4.24% | 4.20% | 4.04% | 3.87% | **6.18%** | **17.33%** |
| **NILKAMAL** | NILKAMAL LIMITED | 23.5 Yrs | 14.31% | 14.25% | 14.19% | 13.01% | 14.23% | **15.04%** | **19.12%** |
| **NLCINDIA** | NLC INDIA LIMITED | 23.5 Yrs | 10.30% | 10.30% | 10.29% | 9.98% | 10.24% | **10.98%** | **17.65%** |
| **NMDC** | NMDC LTD. | 18.4 Yrs | 13.89% | 13.91% | 13.98% | 14.19% | 13.87% | **14.91%** | **24.69%** |
| **NTPC** | NTPC LTD | 21.7 Yrs | 8.35% | 8.36% | 8.36% | 8.11% | 8.33% | **8.90%** | **14.15%** |
| **OBEROIRLTY** | OBEROI REALTY LIMITE | 15.7 Yrs | 17.88% | 18.00% | 18.02% | 17.98% | 17.98% | **18.89%** | **21.93%** |
| **OFSS** | ORACLE FIN SERV SOFT | 23.5 Yrs | 17.28% | 17.42% | 17.30% | 16.17% | 17.25% | **18.89%** | **25.97%** |
| **OIL** | OIL INDIA LTD | 16.8 Yrs | 11.56% | 11.56% | 11.64% | 11.27% | 11.44% | **12.34%** | **23.94%** |
| **ONGC** | OIL AND NATURAL GAS  | 23.5 Yrs | 4.96% | 4.94% | 4.90% | 4.47% | 4.86% | **5.58%** | **14.69%** |
| **ORIENTCEM** | ORIENT CEMENT LTD. | 13.0 Yrs | 3.08% | 2.99% | 2.98% | 1.85% | 3.02% | **4.69%** | **16.32%** |
| **ORIENTELEC** | ORIENT ELECTRIC LIMI | 8.2 Yrs | -4.30% | -4.25% | -4.34% | -4.44% | -4.14% | **-2.13%** | **8.12%** |
| **PAGEIND** | PAGE INDUSTRIES LTD | 19.3 Yrs | 25.97% | 25.87% | 25.83% | 24.78% | 25.33% | **26.87%** | **28.64%** |
| **PARAGMILK** | PARAG MILK FOODS LTD | 10.2 Yrs | 6.51% | 6.28% | 6.47% | 6.74% | 6.57% | **8.56%** | **23.54%** |
| **PCJEWELLER** | PC JEWELLER LTD | 13.6 Yrs | 9.79% | 9.64% | 9.83% | 9.30% | 9.77% | **11.80%** | **30.81%** |
| **PERSISTENT** | PERSISTENT SYSTEMS L | 16.3 Yrs | 31.30% | 31.37% | 31.36% | 30.82% | 31.13% | **32.15%** | **35.01%** |
| **PFC** | POWER FIN CORP LTD. | 19.4 Yrs | 13.61% | 13.59% | 13.63% | 13.12% | 13.56% | **14.50%** | **18.49%** |
| **PFIZER** | PFIZER LTD | 23.5 Yrs | 11.56% | 11.56% | 11.54% | 11.07% | 11.54% | **12.09%** | **13.97%** |
| **PGHH** | P&G HYGIENE & HEALTH | 23.5 Yrs | 13.52% | 13.48% | 13.43% | 13.27% | 12.15% | **13.84%** | **14.59%** |
| **PGHL** | PROCTER & GAMBLE HEA | 23.5 Yrs | 16.05% | 16.04% | 16.06% | 15.63% | 15.93% | **16.52%** | **18.84%** |
| **PHOENIXLTD** | THE PHOENIX MILLS LT | 19.2 Yrs | 22.54% | 22.52% | 22.60% | 22.50% | 22.56% | **23.69%** | **27.76%** |
| **PIDILITIND** | PIDILITE INDUSTRIES  | 23.5 Yrs | 25.35% | 25.28% | 25.26% | 24.27% | 25.13% | **25.83%** | **26.64%** |
| **PIIND** | PI INDUSTRIES LTD | 15.1 Yrs | 21.12% | 21.04% | 20.95% | 20.47% | 20.83% | **22.01%** | **22.84%** |
| **PNBHOUSING** | PNB HOUSING FIN LTD. | 9.7 Yrs | 15.37% | 15.38% | 15.46% | 14.83% | 15.41% | **17.59%** | **33.82%** |
| **PNCINFRA** | PNC INFRATECH LTD. | 11.1 Yrs | 5.51% | 5.43% | 5.34% | 5.13% | 5.66% | **7.13%** | **16.07%** |
| **POONAWALLA** | POONAWALLA FINCORP L | 22.2 Yrs | 17.97% | 17.78% | 17.56% | 16.45% | 17.90% | **18.80%** | **28.39%** |
| **POWERGRID** | POWER GRID CORP. LTD | 18.8 Yrs | 11.73% | 11.75% | 11.74% | 11.71% | 11.79% | **12.43%** | **15.03%** |
| **PRAJIND** | PRAJ INDUSTRIES LTD | 23.5 Yrs | 17.41% | 17.39% | 17.31% | 15.41% | 17.26% | **18.25%** | **20.49%** |
| **PRESTIGE** | PRESTIGE ESTATE LTD | 15.7 Yrs | 22.16% | 22.27% | 22.32% | 21.96% | 22.23% | **23.42%** | **27.57%** |
| **PRSMJOHNSN** | PRISM JOHNSON LIMITE | 23.5 Yrs | 8.58% | 8.53% | 8.48% | 7.77% | 8.41% | **9.43%** | **13.35%** |
| **PTC** | PTC INDIA LIMITED | 22.3 Yrs | 6.70% | 6.71% | 6.72% | 6.48% | 6.70% | **7.49%** | **14.97%** |
| **PVRINOX** | PVR INOX LIMITED | 20.5 Yrs | 9.63% | 9.63% | 9.64% | 9.25% | 9.44% | **10.58%** | **15.21%** |
| **RADICO** | RADICO KHAITAN LTD | 23.5 Yrs | 27.65% | 27.56% | 27.59% | 25.10% | 26.89% | **28.21%** | **29.71%** |
| **RAIN** | RAIN INDUSTRIES LIMI | 18.4 Yrs | 13.13% | 13.13% | 13.12% | 13.69% | 13.10% | **14.25%** | **18.36%** |
| **RAJESHEXPO** | RAJESH EXPORTS LTD | 23.5 Yrs | 8.36% | 8.24% | 8.19% | 6.40% | 8.20% | **8.94%** | **11.65%** |
| **RALLIS** | RALLIS INDIA LTD | 23.5 Yrs | 13.80% | 13.75% | 13.62% | 12.58% | 13.83% | **14.59%** | **15.92%** |
| **RAMCOCEM** | THE RAMCO CEMENTS LI | 23.5 Yrs | 14.09% | 13.99% | 13.99% | 13.07% | 14.06% | **14.65%** | **16.38%** |
| **RAYMOND** | RAYMOND LTD | 23.5 Yrs | 4.92% | 4.91% | 4.86% | 4.14% | 4.93% | **5.71%** | **12.41%** |
| **RBLBANK** | RBL BANK LIMITED | 9.9 Yrs | 9.30% | 9.36% | 9.50% | 9.00% | 9.22% | **11.49%** | **29.15%** |
| **RCF** | RASHTRIYA CHEMICALS  | 23.5 Yrs | 6.81% | 6.80% | 6.78% | 6.50% | 6.81% | **7.64%** | **14.75%** |
| **RECLTD** | REC LIMITED | 18.3 Yrs | 13.14% | 13.14% | 13.16% | 13.15% | 13.01% | **14.09%** | **17.19%** |
| **REDINGTON** | REDINGTON LIMITED | 19.4 Yrs | 16.17% | 16.19% | 16.18% | 15.54% | 16.18% | **17.22%** | **22.07%** |
| **RELAXO** | RELAXO FOOT LTD. | 15.1 Yrs | 16.48% | 16.41% | 16.33% | 16.56% | 15.73% | **17.85%** | **20.71%** |
| **RELIANCE** | RELIANCE INDUSTRIES  | 26.5 Yrs | 15.57% | 15.61% | 15.62% | 15.52% | 15.41% | **16.08%** | **17.37%** |
| **RENUKA** | SHREE RENUKA SUGARS  | 20.7 Yrs | 15.00% | 15.00% | 15.00% | 15.00% | 15.00% | **2.18%** | **17.61%** |
| **REPCOHOME** | REPCO HOME FINANCE L | 13.3 Yrs | 3.11% | 3.15% | 3.10% | 2.58% | 2.92% | **4.75%** | **19.96%** |
| **RITES** | RITES LIMITED | 8.0 Yrs | 8.85% | 8.92% | 8.92% | 8.48% | 8.78% | **10.72%** | **15.37%** |
| **RKFORGE** | RAMKRISHNA FORGINGS  | 22.2 Yrs | 21.78% | 21.67% | 21.64% | 21.22% | 21.77% | **22.77%** | **29.91%** |
| **RPOWER** | RELIANCE POWER LTD. | 18.4 Yrs | 4.45% | 4.60% | 4.55% | 4.55% | 4.33% | **6.33%** | **29.74%** |
| **SAIL** | STEEL AUTHORITY OF I | 23.5 Yrs | 7.45% | 7.46% | 7.38% | 6.54% | 7.33% | **8.20%** | **17.27%** |
| **SANOFI** | SANOFI INDIA LIMITED | 23.5 Yrs | 4.80% | 4.79% | 4.76% | 3.37% | 4.50% | **5.34%** | **8.34%** |
| **SBILIFE** | SBI LIFE INSURANCE C | 8.8 Yrs | 13.44% | 13.41% | 13.42% | 13.20% | 13.67% | **14.81%** | **18.06%** |
| **SBIN** | STATE BANK OF INDIA | 23.5 Yrs | 13.99% | 13.96% | 13.93% | 13.39% | 14.01% | **14.54%** | **16.24%** |
| **SCHAEFFLER** | SCHAEFFLER INDIA LIM | 23.5 Yrs | 25.21% | 25.12% | 24.99% | 23.56% | 24.96% | **25.73%** | **27.32%** |
| **SCI** | SHIPPING CORP OF IND | 23.5 Yrs | 13.13% | 13.14% | 13.14% | 12.92% | 13.14% | **13.84%** | **22.55%** |
| **SFL** | SHEELA FOAM LIMITED | 9.6 Yrs | -0.05% | -0.13% | -0.12% | -0.93% | -0.61% | **1.51%** | **16.89%** |
| **SHARDACROP** | SHARDA CROPCHEM LTD. | 11.8 Yrs | 14.38% | 14.31% | 14.43% | 14.57% | 14.42% | **16.00%** | **29.21%** |
| **SHILPAMED** | SHILPA MEDICARE LTD | 16.6 Yrs | 19.02% | 18.95% | 19.00% | 18.65% | 18.85% | **20.05%** | **24.53%** |
| **SHK** | S H KELKAR AND CO. L | 10.7 Yrs | -3.80% | -3.91% | -3.82% | -4.05% | -3.76% | **-1.90%** | **14.01%** |
| **SHOPERSTOP** | SHOPPERS STOP LIMITE | 21.2 Yrs | 2.88% | 2.87% | 2.83% | 2.46% | 2.76% | **3.87%** | **13.11%** |
| **SHREECEM** | SHREE CEMENT LIMITED | 23.5 Yrs | 24.64% | 24.54% | 24.52% | 21.62% | 24.41% | **25.40%** | **26.73%** |
| **SIEMENS** | SIEMENS LTD | 23.5 Yrs | 16.47% | 16.30% | 16.32% | 13.74% | 15.64% | **16.97%** | **18.69%** |
| **SIS** | SIS LIMITED | 8.9 Yrs | 0.85% | 0.96% | 0.95% | 0.96% | 0.61% | **2.59%** | **16.86%** |
| **SJVN** | SJVN LTD | 16.2 Yrs | 10.20% | 10.22% | 10.25% | 10.30% | 10.29% | **10.80%** | **15.98%** |
| **SKFINDIA** | SKF INDIA LTD | 23.5 Yrs | 10.70% | 10.60% | 10.57% | 9.44% | 10.66% | **11.34%** | **13.79%** |
| **SOBHA** | SOBHA LIMITED | 19.6 Yrs | 12.69% | 12.68% | 12.69% | 12.42% | 12.70% | **13.77%** | **22.95%** |
| **SOLARINDS** | SOLAR INDUSTRIES (I) | 20.3 Yrs | 38.46% | 38.56% | 38.53% | 38.01% | 38.10% | **39.53%** | **41.51%** |
| **SONATSOFTW** | SONATA SOFTWARE LTD | 23.5 Yrs | 20.46% | 20.43% | 20.41% | 20.24% | 20.45% | **21.24%** | **24.53%** |
| **SOUTHBANK** | THE SOUTH INDIAN BAN | 23.5 Yrs | 11.93% | 11.88% | 11.87% | 11.45% | 11.88% | **12.60%** | **17.79%** |
| **SPARC** | SUN PHARMA ADV.RES.C | 19.0 Yrs | 6.25% | 6.19% | 6.24% | 6.06% | 6.29% | **7.27%** | **13.02%** |
| **SRF** | SRF LTD | 23.5 Yrs | 29.30% | 29.27% | 29.21% | 27.66% | 29.20% | **30.14%** | **32.64%** |
| **STAR** | STRIDES PHARMA SCI L | 23.5 Yrs | 14.51% | 14.52% | 14.48% | 13.32% | 14.25% | **15.32%** | **21.35%** |
| **STARCEMENT** | STAR CEMENT LIMITED | 9.1 Yrs | 11.22% | 11.22% | 11.28% | 10.97% | 11.33% | **12.93%** | **18.93%** |
| **STLTECH** | STERLITE TECHNOLOGIE | 23.5 Yrs | 17.43% | 17.41% | 17.37% | 17.05% | 17.47% | **18.34%** | **24.04%** |
| **SUDARSCHEM** | SUDARSHAN CHEMICAL I | 23.5 Yrs | 27.32% | 27.39% | 27.31% | 27.31% | 23.01% | **27.59%** | **28.43%** |
| **SUNDARMFIN** | SUNDARAM FINANCE LTD | 23.5 Yrs | 22.24% | 22.19% | 22.21% | 21.44% | 21.96% | **22.79%** | **23.91%** |
| **SUNDRMFAST** | SUNDRAM FASTENERS LT | 23.5 Yrs | 18.02% | 18.02% | 18.02% | 17.53% | 17.46% | **18.91%** | **25.08%** |
| **SUNPHARMA** | SUN PHARMACEUTICAL I | 23.5 Yrs | 19.29% | 19.22% | 19.24% | 17.79% | 19.16% | **19.79%** | **20.58%** |
| **SUNTECK** | SUNTECK REALTY LIMIT | 16.7 Yrs | 3.86% | 3.87% | 3.86% | 3.85% | 3.78% | **5.05%** | **11.83%** |
| **SUNTV** | SUN TV NETWORK LIMIT | 20.2 Yrs | 1.87% | 1.87% | 1.88% | 1.84% | 1.92% | **2.89%** | **7.44%** |
| **SUPRAJIT** | SUPRAJIT ENGINEERING | 21.4 Yrs | 22.52% | 22.55% | 22.53% | 21.91% | 22.36% | **23.51%** | **28.60%** |
| **SUPREMEIND** | SUPREME INDUSTRIES L | 23.5 Yrs | 26.23% | 26.15% | 26.14% | 25.34% | 26.14% | **26.91%** | **29.09%** |
| **SUVEN** | SUVEN LIFE SCIENCES  | 22.7 Yrs | 17.14% | 17.07% | 17.16% | 17.03% | 17.18% | **18.09%** | **24.61%** |
| **SUZLON** | SUZLON ENERGY LIMITE | 20.7 Yrs | 12.47% | 12.57% | 12.55% | 12.53% | 12.46% | **13.76%** | **29.50%** |
| **SWANCORP** | SWAN CORP LIMITED | 14.1 Yrs | 13.79% | 13.80% | 13.82% | 13.96% | 13.81% | **14.69%** | **17.24%** |
| **SYMPHONY** | SYMPHONY LIMITED | 15.1 Yrs | 5.36% | 4.99% | 5.15% | 5.02% | 4.98% | **6.44%** | **11.46%** |
| **SYNGENE** | SYNGENE INTERNATIONA | 10.9 Yrs | 2.06% | 2.04% | 1.92% | 1.29% | 2.13% | **3.20%** | **9.52%** |
| **TATACHEM** | TATA CHEMICALS LTD | 23.5 Yrs | 6.62% | 6.59% | 6.56% | 5.85% | 6.67% | **7.23%** | **12.04%** |
| **TATACONSUM** | TATA CONSUMER PRODUC | 23.5 Yrs | 16.78% | 16.78% | 16.78% | 16.04% | 16.44% | **17.39%** | **19.07%** |
| **TATAELXSI** | TATA ELXSI LIMITED | 23.5 Yrs | 21.96% | 21.99% | 21.97% | 21.39% | 22.00% | **22.70%** | **26.20%** |
| **TATAINVEST** | TATA INVESTMENT CORP | 23.5 Yrs | 19.86% | 19.84% | 19.84% | 18.71% | 19.74% | **20.37%** | **22.61%** |
| **TATAPOWER** | TATA POWER CO LTD | 23.5 Yrs | 12.71% | 12.69% | 12.68% | 11.95% | 12.45% | **13.30%** | **20.36%** |
| **TATASTEEL** | TATA STEEL LIMITED | 23.5 Yrs | 11.28% | 11.28% | 11.24% | 10.56% | 11.14% | **11.98%** | **16.16%** |
| **TCS** | TATA CONSULTANCY SER | 21.9 Yrs | 11.37% | 11.42% | 11.35% | 10.99% | 11.26% | **11.99%** | **15.50%** |
| **TECHM** | TECH MAHINDRA LIMITE | 19.9 Yrs | 13.15% | 13.08% | 13.08% | 12.81% | 13.03% | **14.03%** | **18.54%** |
| **THERMAX** | THERMAX LTD | 23.5 Yrs | 19.02% | 18.94% | 18.93% | 17.07% | 18.81% | **19.59%** | **21.23%** |
| **THOMASCOOK** | THOMAS COOK (INDIA)  | 23.5 Yrs | 5.54% | 5.45% | 5.50% | 5.12% | 5.53% | **6.28%** | **13.63%** |
| **THYROCARE** | THYROCARE TECH LTD | 10.2 Yrs | 14.90% | 14.98% | 14.92% | 14.93% | 15.13% | **16.32%** | **23.16%** |
| **TIINDIA** | TUBE INVEST OF INDIA | 8.7 Yrs | 30.19% | 30.03% | 30.18% | 28.09% | 30.26% | **32.36%** | **36.43%** |
| **TIMETECHNO** | TIME TECHNOPLAST LTD | 19.1 Yrs | 16.13% | 16.14% | 16.16% | 15.97% | 16.15% | **17.13%** | **25.30%** |
| **TIMKEN** | TIMKEN INDIA LTD. | 23.5 Yrs | 23.60% | 23.56% | 23.56% | 23.54% | 18.60% | **23.90%** | **24.67%** |
| **TITAN** | TITAN COMPANY LIMITE | 23.5 Yrs | 32.95% | 32.98% | 32.86% | 30.94% | 32.92% | **33.71%** | **34.37%** |
| **TMPV** | TATA MOTORS PASS VEH | 26.5 Yrs | 8.92% | 8.90% | 8.91% | 9.28% | 8.85% | **9.64%** | **14.68%** |
| **TNPL** | TAMILNADU NEWSPRT &  | 23.5 Yrs | 15.00% | 15.00% | 15.00% | 15.00% | 15.00% | **2.41%** | **6.17%** |
| **TORNTPHARM** | TORRENT PHARMACEUTIC | 23.5 Yrs | 27.74% | 27.78% | 27.76% | 26.90% | 27.61% | **28.45%** | **29.75%** |
| **TORNTPOWER** | TORRENT POWER LTD | 19.6 Yrs | 17.30% | 17.25% | 17.26% | 16.67% | 17.25% | **18.21%** | **22.31%** |
| **TRENT** | TRENT LTD | 23.5 Yrs | 26.81% | 26.81% | 26.81% | 25.87% | 26.76% | **27.49%** | **30.11%** |
| **TRIDENT** | TRIDENT LIMITED | 23.5 Yrs | 17.10% | 17.03% | 17.08% | 16.98% | 17.11% | **17.92%** | **23.53%** |
| **TRITURBINE** | TRIVENI TURBINE LIMI | 14.7 Yrs | 21.38% | 21.35% | 21.42% | 20.55% | 21.46% | **22.44%** | **28.77%** |
| **TTKPRESTIG** | TTK PRESTIGE LTD | 23.5 Yrs | 29.19% | 29.00% | 29.01% | 28.98% | 29.18% | **30.06%** | **30.85%** |
| **TVSHLTD** | TVS HOLDINGS LIMITED | 23.5 Yrs | 30.08% | 30.13% | 30.12% | 29.23% | 29.88% | **31.02%** | **40.95%** |
| **TVSMOTOR** | TVS MOTOR COMPANY  L | 23.5 Yrs | 27.89% | 28.00% | 27.96% | 27.37% | 27.76% | **28.81%** | **35.95%** |
| **UBL** | UNITED BREWERIES LTD | 18.0 Yrs | 9.23% | 9.18% | 9.07% | 8.44% | 9.23% | **10.29%** | **12.01%** |
| **UFLEX** | UFLEX LIMITED | 23.5 Yrs | 10.61% | 10.57% | 10.46% | 9.70% | 10.52% | **11.45%** | **14.98%** |
| **ULTRACEMCO** | ULTRATECH CEMENT LIM | 21.9 Yrs | 16.65% | 16.60% | 16.59% | 16.24% | 16.59% | **17.30%** | **21.00%** |
| **UNIONBANK** | UNION BANK OF INDIA | 23.5 Yrs | 5.21% | 5.20% | 5.20% | 4.79% | 5.19% | **6.00%** | **16.91%** |
| **UNITDSPR** | UNITED SPIRITS LIMIT | 23.5 Yrs | 19.71% | 19.61% | 19.49% | 18.28% | 19.61% | **20.31%** | **21.58%** |
| **UNOMINDA** | UNO MINDA LIMITED | 19.5 Yrs | 37.64% | 37.64% | 37.65% | 36.95% | 37.59% | **38.82%** | **42.83%** |
| **UPL** | UPL LIMITED | 22.5 Yrs | 11.16% | 11.12% | 11.08% | 10.73% | 11.17% | **12.29%** | **14.94%** |
| **VARROC** | VARROC ENGINEERING L | 8.0 Yrs | 12.35% | 12.47% | 12.41% | 12.62% | 12.54% | **15.08%** | **27.86%** |
| **VBL** | VARUN BEVERAGES LIMI | 9.7 Yrs | 35.16% | 35.14% | 35.20% | 32.99% | 35.34% | **36.77%** | **38.11%** |
| **VENKEYS** | VENKY S (INDIA) LIMI | 23.5 Yrs | 15.82% | 15.77% | 15.76% | 15.10% | 15.77% | **16.61%** | **19.84%** |
| **VGUARD** | V-GUARD IND LTD. | 18.3 Yrs | 24.24% | 24.27% | 24.20% | 24.04% | 24.12% | **25.08%** | **26.29%** |
| **VINATIORGA** | VINATI ORGANICS LTD | 17.0 Yrs | 24.69% | 24.71% | 24.50% | 23.42% | 24.03% | **25.46%** | **26.67%** |
| **VIPIND** | VIP INDUSTRIES LTD | 23.5 Yrs | 16.55% | 16.53% | 16.44% | 15.09% | 16.53% | **17.36%** | **20.91%** |
| **VMART** | VMART RETAIL LTD | 13.4 Yrs | 18.16% | 18.13% | 18.13% | 16.03% | 18.20% | **19.52%** | **21.90%** |
| **VOLTAS** | VOLTAS LTD | 23.5 Yrs | 21.31% | 21.23% | 21.15% | 19.34% | 21.21% | **21.95%** | **23.87%** |
| **VSTIND** | VST INDUSTRIES LTD | 23.5 Yrs | 10.64% | 10.55% | 10.55% | 9.78% | 10.55% | **11.14%** | **13.44%** |
| **VTL** | VARDHMAN TEXTILES LI | 23.5 Yrs | 18.29% | 18.22% | 18.23% | 18.11% | 18.28% | **19.10%** | **24.51%** |
| **WABAG** | VA TECH WABAG LTD | 15.8 Yrs | 20.91% | 20.94% | 20.97% | 20.44% | 20.86% | **22.05%** | **36.38%** |
| **WELCORP** | WELSPUN CORP LIMITED | 22.6 Yrs | 20.19% | 20.20% | 20.21% | 19.96% | 20.16% | **21.16%** | **27.94%** |
| **WELSPUNLIV** | WELSPUN LIVING LIMIT | 23.5 Yrs | 19.99% | 19.99% | 20.00% | 19.71% | 19.61% | **20.97%** | **29.29%** |
| **WHIRLPOOL** | WHIRLPOOL OF INDIA L | 16.5 Yrs | 4.78% | 4.70% | 4.66% | 3.89% | 4.59% | **5.72%** | **11.61%** |
| **WIPRO** | WIPRO LTD | 23.5 Yrs | 7.63% | 7.68% | 7.64% | 7.25% | 7.63% | **8.32%** | **11.79%** |
| **WOCKPHARMA** | WOCKHARDT LIMITED | 23.5 Yrs | 12.95% | 12.85% | 12.89% | 12.38% | 12.93% | **13.70%** | **21.33%** |
| **ZENSARTECH** | ZENSAR TECHNOLOGIES  | 23.5 Yrs | 19.58% | 19.66% | 19.55% | 19.42% | 19.58% | **20.40%** | **24.26%** |
| **ZFCVINDIA** | ZF COM VE CTR SYS IN | 17.8 Yrs | 21.75% | 21.57% | 21.57% | 18.61% | 21.52% | **23.04%** | **23.76%** |
| **ZYDUSLIFE** | ZYDUS LIFESCIENCES L | 23.5 Yrs | 19.33% | 19.32% | 19.21% | 17.93% | 18.85% | **19.84%** | **21.18%** |
| **ZYDUSWELL** | ZYDUS WELLNESS LIMIT | 16.7 Yrs | 13.60% | 13.56% | 13.54% | 13.26% | 13.52% | **14.36%** | **16.47%** |
