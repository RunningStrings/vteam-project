const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Prefix för alla API-anrop
    createProxyMiddleware({
      target: 'http://localhost:5000', // Backend-serverns URL
      changeOrigin: true, // Ändra värdet på 'Origin' för att matcha backend-servern
      //pathRewrite: { '^/api': '' }, // Ta bort '/api' från proxyns väg
    })
  );
};
