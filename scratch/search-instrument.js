const http = require('https');
const zlib = require('zlib');

const url = 'https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

http.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: Status ${res.statusCode}`);
    return;
  }

  const gunzip = zlib.createGunzip();
  res.pipe(gunzip);

  let buffer = '';
  gunzip.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
  });

  gunzip.on('end', () => {
    try {
      const data = JSON.parse(buffer);
      console.log(`Loaded ${data.length} instruments.`);

      console.log('\nSearching for equity/ETF instruments containing "KOTAK" and "NIFTY" or "BANK"...');
      const results = data.filter(item => item.segment === 'NSE_EQ' && item.trading_symbol && (
        item.trading_symbol.includes('KOTAK') ||
        item.trading_symbol.includes('BEES')
      ));
      console.log(`Found ${results.length} matches.`);
      
      // Let's print the first 15 matches with symbol, name, and instrument_key
      const summary = results.map(item => ({
        symbol: item.trading_symbol,
        name: item.name,
        key: item.instrument_key,
        isin: item.isin
      })).slice(0, 15);
      
      console.log(JSON.stringify(summary, null, 2));
    } catch (e) {
      console.error('Failed to parse or search JSON:', e);
    }
  });
}).on('error', (err) => {
  console.error('Network error:', err);
});
