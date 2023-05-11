const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cron = require('node-cron');

app.use(morgan('dev'));
app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/tmp', express.static(__dirname + '/tmp'));
app.use(errorHandler);

//Routes
const removeExpiredProducts = require('./routes/removeExpiredProducts');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const productQuantitiesRoutes = require('./routes/productQuantities');
const productHistoriesRoutes = require('./routes/productHistories');
const test = require('./routes/test');
//const removeExpiredProducts = require('./routes/removeExpiredProducts');

const api = process.env.API_URL;
const PORT = process.env.PORT || 3000

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/productQuantities`, productQuantitiesRoutes);
app.use(`${api}/productHistories`, productHistoriesRoutes);
app.use(`${api}/test`, test);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
    dbName: 'test'
})
    .then(() => {
        console.log('Database Connection is ready...')
    })
    .catch((err) => {
        console.log(err);
    })
mongoose.set("useCreateIndex", true);

// Schedule the removeExpiredProducts function to run every day at midnight
setInterval(() => {
    removeExpiredProducts();
}, 24 * 60 * 60 * 1000);
// Runs at 00:00 (midnight) every day

//Server
app.listen(PORT, () => {

    console.log('server is running at: ', PORT);
})
