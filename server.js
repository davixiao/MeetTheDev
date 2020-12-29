const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
// when we want to access req.body, it turns out that the body is
// in json. We cannot read it... So, we need middleware to read it for us.
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API Running');
});

// test commit

// Define routes
// in api/users, we use '/' instead of '/api/users'.
// so if user enters api/users/101, then users.js just needs /101.
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (_) => console.log(`Server Started on ${PORT}`));
