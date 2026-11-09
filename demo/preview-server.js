// Local preview only: serves index.html with the fake MyGeotab API at http://127.0.0.1:8771/?demo=1
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

http.createServer((req, res) => {
  if (!req.url.startsWith('/?') && req.url !== '/') { res.statusCode = 404; res.end('Not found'); return; }
  const mock = fs.readFileSync(path.join(__dirname, 'mock-mygeotab.js'), 'utf8');
  const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  res.setHeader('content-type', 'text/html;charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(page.replace('</body>', () => `<script>${mock}</script></body>`));
}).listen(8771, '127.0.0.1', () => console.log('Demo at http://127.0.0.1:8771/?demo=1'));
