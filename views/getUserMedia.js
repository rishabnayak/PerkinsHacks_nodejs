(function() {
  'use strict';
  var video = document.querySelector('video'), canvas;
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');
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
    navigator.mediaDevices.getUserMedia({video: true})
    // permission granted:
      .then(function(stream) {
        video.srcObject = stream;
        var rafId;
        var CANVAS_WIDTH = canvas.width;
        var CANVAS_HEIGHT = canvas.height;
        var context;
        context = canvas.getContext('2d');
        function drawVideoFrame(time) {
          rafId = requestAnimationFrame(drawVideoFrame);
          context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          var data = canvas.toDataURL('image/jpeg');
          photo.setAttribute('src',data);
          var blob = dataURLtoBlob(data);
        };
        rafId = requestAnimationFrame(drawVideoFrame);
      })
      // permission denied:
      .catch(function(error) {
        document.body.textContent = 'Could not access the camera. Error: ' + error.name;
      });
  }
})();
