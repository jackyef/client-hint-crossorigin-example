const Koa = require('koa');
const fs = require('fs');
const https = require('https');

const app = new Koa();

app.use(async (ctx) => {
  ctx.set('Accept-CH', 'ect'); // request browsers to send these client hints if the browser support it
  ctx.set('Accept-CH-Lifetime', '60'); // Determine how long the browser should keep sending the previously requested client hints, in seconds.

  /**
   * Allowing send client hints to different origins
   */
  ctx.set('Feature-Policy', 'ch-ect https://localhost:3001');

  ctx.body = `
    <html>
      <head>
        <title>Test client hints</title>
      </head>
      <body>
        This is image below will be different depending on the client hint sent by this browser.
        <img src="https://localhost:3001/some-image.png">
      </body>
    </html>
  `;
})

const httpsServer = https.createServer({
  key: fs.readFileSync('./.ssl/key.pem', 'utf8'),
  cert: fs.readFileSync('./.ssl/cert.pem', 'utf8')
}, app.callback());

httpsServer.listen(3000);

console.log('web-server is listening on port 3000');
