const cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
}).listen(8081, 'localhost', function() {
    console.log('Local CORS proxy running on localhost:8081');
});
