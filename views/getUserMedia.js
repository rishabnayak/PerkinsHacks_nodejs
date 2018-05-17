(function() {
  'use strict';
  const socket = io();
  var video = document.querySelector('video'), canvas;
  canvas = document.getElementById('canvas');
  // use MediaDevices API
  function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
  }
  // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  if (navigator.mediaDevices) {
    // access the web cam
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    // permission granted:
      .then(function(stream) {
        video.srcObject = stream;
        var rafId;
        var CANVAS_WIDTH = canvas.width;
        var CANVAS_HEIGHT = canvas.height;
        var context;
        var fps = 1;
        var now;
        var then = performance.now();
        var interval = 1000/fps;
        var delta
        context = canvas.getContext('2d');
        function drawVideoFrame(time) {
          rafId = requestAnimationFrame(drawVideoFrame);
          now = performance.now();
          delta = now - then;
          if (delta > interval){
            then = now - (delta % interval);
            context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            var data = canvas.toDataURL('image/jpeg');
            var img = data.split(",")[1];
            socket.emit('image',img);
          }
        };
        rafId = requestAnimationFrame(drawVideoFrame);
        socket.on('response1',function(write){
          document.getElementById('p1').innerHTML = write;
          var msg = new SpeechSynthesisUtterance(write);
        });
        socket.on('response2',function(write){
          document.getElementById('p2').innerHTML = write;
          var msg = new SpeechSynthesisUtterance(write);
          window.speechSynthesis.speak(msg);
        });
        socket.on('response3',function(write){
          document.getElementById('p3').innerHTML = write;
          var msg = new SpeechSynthesisUtterance(write);
        });
        socket.on('response4',function(write){
          document.getElementById('p4').innerHTML = write;
          var msg = new SpeechSynthesisUtterance(write);
        });
      })
      // permission denied:
      .catch(function(error) {
        document.body.textContent = 'Could not access the camera. Error: ' + error.name;
      });
  }
})();
