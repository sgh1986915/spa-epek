var http = require('http');
var st = require('st');

var none = { max: 1, maxSize: 0, length: function() {
  return Infinity
}}
var mount = st({
  path: './app/',
  url: '/', // defaults to path option
  index: 'index.html',
  cache: {
    fd: none,
    stat: none,
    index: none,
    readdir: none,
    content: none
  }
});

// with bare node.js
http.createServer(function (req, res) {
  if (mount(req, res)) return; // serving a static file
}).listen(process.env.PORT || 80);
