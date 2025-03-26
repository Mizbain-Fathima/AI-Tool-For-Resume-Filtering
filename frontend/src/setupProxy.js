// frontend/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '',
      },
      headers: {
        Connection: 'keep-alive'
      },
      onProxyReq: (proxyReq, req) => {
        if (req.body) {
          let bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    })
  );
};