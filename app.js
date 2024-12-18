require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan('dev'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hai Pik');
});

const authRouter = require('./routes/auth.routes');
app.use('/api/v1/auth', authRouter);

const activityRouter = require('./routes/activity.routes');
app.use('/api/v1/activity', activityRouter);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})