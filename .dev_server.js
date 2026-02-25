const http = require('http');
const fs = require('fs');
const path = require('path');
const base = process.cwd();
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml' };
http.createServer((req,res)=>{
  const reqPath = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  const filePath = path.join(base, reqPath.replace(/^\/+/, ''));
  fs.readFile(filePath, (err,data)=>{
    if(err){res.statusCode=404;res.end('Not found'); return;}
    res.setHeader('Content-Type', mime[path.extname(filePath).toLowerCase()] || 'text/plain');
    res.end(data);
  });
}).listen(5500);
setInterval(()=>{}, 1 << 30);
