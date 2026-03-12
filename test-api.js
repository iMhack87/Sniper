const https = require('https');
https.get('https://api.dexscreener.com/latest/dex/search?q=0x025CB455894D93ce6f65Bd1085aa81D41078a5d5', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(data), null, 2)));
});
