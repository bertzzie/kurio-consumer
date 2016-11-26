const express = require('express')
const KurioConsumer = require('./kurio-consumer');

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/article', function (req, res) {
  KurioConsumer.login('', '', function (authToken) {
  	KurioConsumer.getArticle(authToken, 40, function (data) {
  		res.render('article', data)
  	});
  });
});

app.get('/', function (req, res) {
	res.sendFile('./pages/index.html', {root: __dirname});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});