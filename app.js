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
          for (i = 0; i<3;i++){
            io.emit('response',response.outputs[0].data.concepts[i].name);
          }
        },
        function(err){
          console.log(err);
        }
      );
    });
});
http.listen(8000, () => {
  console.log("View at localhost:8000");
});
