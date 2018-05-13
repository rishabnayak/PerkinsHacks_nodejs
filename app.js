const express = require('express');
const app = express();
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
  res.render('homepage.html');
});

const server = app.listen(8000, () => {
  console.log("View at localhost:8000");
});
