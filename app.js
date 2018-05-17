const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const clarifai = require('clarifai');
const clarifaiClient = new Clarifai.App({apiKey:'a9b4dedc69974ab3aba1dbdd1fc92cf4'});
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render('homepage.html');
});
io.on('connection',function(socket){
  console.log('user connected');
    socket.on('disconnect',() => {
      console.log('user disconnected');
    });
    socket.on('image', function(img){
      clarifaiClient.models.predict(clarifai.GENERAL_MODEL,{base64: img}).then(
        function(response){
            io.emit('response1',response.outputs[0].data.concepts[0].name);
            io.emit('response2',response.outputs[0].data.concepts[1].name);
            io.emit('response3',response.outputs[0].data.concepts[2].name);
            io.emit('response4',response.outputs[0].data.concepts[3].name);
        },
        function(err){
          console.log(err);
        }
      );
    });
});
http.listen(8080, () => {
  console.log("View at localhost:8080");
});
