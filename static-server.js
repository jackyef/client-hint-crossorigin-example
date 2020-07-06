const Koa = require('koa');
const send = require('koa-send');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = new Koa();

const opts = {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'max-age=60');
  },
}

app.use(async (ctx, next) => {
  if (ctx.path === '/some-image.png') {
    ctx.set('Access-Control-Allow-Origin', '*'); // allow CORS
    ctx.set('Access-Control-Allow-Headers', 'ect'); // allow headers for the CH
    ctx.set('Vary', 'ECT'); // tell browsers that the response might vary depending on this request header

    const ect = ctx.get('ECT');

    console.log('received ECT', { ect });

    if (ect === '2g') {
      await send(ctx, './images/300x300.png', opts);
    } else if (ect === '3g') {
      await send(ctx, './images/700x700.png', opts);
    } else if (ect === '4g') {      
      await send(ctx, './images/900x900.png', opts);
    }else {
      // ect does not exist yet
      await send(ctx, './images/500x500.png', opts);
    }

  } else {
    return next();
  }
});


const httpsServer = https.createServer({
  key: fs.readFileSync('./.ssl/key.pem', 'utf8'),
  cert: fs.readFileSync('./.ssl/cert.pem', 'utf8')
}, app.callback());

httpsServer.listen(3001);

console.log('Static assets server is listening on port 3001');
