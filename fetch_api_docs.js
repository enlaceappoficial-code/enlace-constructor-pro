const https = require('https');
https.get('https://www.chilecompra.cl/api/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Basic HTML stripping
    const text = data.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                     .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                     .replace(/<[^>]+>/g, ' ')
                     .replace(/\s+/g, ' ');
    const apiIndex = text.toLowerCase().indexOf('api');
    console.log(text.substring(apiIndex, apiIndex + 2000));
  });
});
