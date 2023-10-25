const express = require('express');
 const proxy = require('express-http-proxy');
 const https = require('https');
 const http = require('http')
 const fs = require("fs"); 
 const path = require('path');

 const app = express();
 
 const options = { 
   key: fs.readFileSync("server.key"), 
   cert: fs.readFileSync("server.cert"), 
 }; 

 //app.use(express.static(path.join(__dirname, 'public')));

 app.all("/*", (req, res) => { 

   //const destinationUrl = req.query.url;
   //const destinationUrl = req.params[0];
   //console.log("Destination url: " + destinationUrl);

    console.log("Request URL: " + req.url);
    //const destinationUrl = encodeURIComponent(req.url)

    //const destinationUrl = req.url;
    //console.log(destinationUrl)
    //const proxyUrl = destinationUrl.startsWith("https://") ? destinationUrl : `http://${destinationUrl}`;

    const proxyMiddleware = proxy(req.url, {

      secure: false,
 
      errorHandler: (err, req, res) => {
          console.error('Proxy Error:', err);
          res.status(500).send('ERROR: Cannot proxy request successfully!.');            
      },
 
      proxyReqPathResolver: (req) => {
          //console.log(`Received request! ${req.originalUrl}`);
          return req.originalUrl;
      }, 
 
    });
    proxyMiddleware(req, res);
 })

 const httpsServer = https.createServer(options, app);
 const httpServer = http.createServer(app);

 httpServer.listen(80, () => {
  console.log('Http is running on port 80')
 })

 httpsServer.listen(443, () => {
   console.log(`Https is running on port 443`);
 });