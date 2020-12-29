const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (_) => console.log(`Server Started on ${PORT}`));
