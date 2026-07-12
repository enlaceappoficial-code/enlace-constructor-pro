const https = require('https');
https.get('https://www.chilecompra.cl/api/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Basic HTML stripping
    let text = data.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                     .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                     .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
                     .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
                     .replace(/<[^>]+>/g, ' \n')
                     .replace(/\n\s*\n/g, '\n');
    
    // Let's print the middle part
    console.log(text.substring(2000, 4500));
  });
});
