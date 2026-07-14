const http = require('https');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const url = 'https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz';
const outputJsonPath = path.join(__dirname, '..', 'nse-instruments.json');
const outputCsvPath = path.join(__dirname, '..', 'nse-instruments.csv');

console.log('Downloading NSE instrument list from Upstox assets...');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

http.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: Status ${res.statusCode}`);
    process.exit(1);
  }

  const gunzip = zlib.createGunzip();
  res.pipe(gunzip);

  let buffer = '';
  gunzip.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
  });

  gunzip.on('end', () => {
    console.log('Download complete. Parsing database...');
    try {
      const data = JSON.parse(buffer);
      console.log(`Loaded ${data.length} instruments.`);

      // Save complete JSON
      fs.writeFileSync(outputJsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✔ Saved full database to ${path.basename(outputJsonPath)}`);

      // Generate and save summarized CSV
      const csvLines = [];
      csvLines.push('"instrument_key","trading_symbol","name","isin","segment","instrument_type"');

      for (const item of data) {
        const key = item.instrument_key || '';
        const symbol = item.trading_symbol || '';
        const name = item.name || '';
        const isin = item.isin || '';
        const segment = item.segment || '';
        const type = item.instrument_type || '';

        // Escape double quotes by doubling them
        const esc = (val) => val.replace(/"/g, '""');

        csvLines.push(`"${esc(key)}","${esc(symbol)}","${esc(name)}","${esc(isin)}","${esc(segment)}","${esc(type)}"`);
      }

      fs.writeFileSync(outputCsvPath, csvLines.join('\n') + '\n', 'utf8');
      console.log(`✔ Saved summarized list to ${path.basename(outputCsvPath)}`);

      console.log('\nDone! Both files are available in your workspace.');
    } catch (e) {
      console.error('Failed to parse or write files:', e);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Network error during download:', err);
  process.exit(1);
});
