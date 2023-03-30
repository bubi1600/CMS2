const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cron = require('node-cron');
const removeExpiredProducts = require('./routes/removeExpiredProducts');

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
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const productQuantitiesRoutes = require('./routes/productQuantities');

const api = process.env.API_URL;
const PORT = process.env.PORT || 3000

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/productQuantities`, productQuantitiesRoutes);

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

// Set up the cron job to delete expired products every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const expiredProducts = await Product.find({ expiryDate: { $lt: new Date() } });
        for (const product of expiredProducts) {
            // Delete the product from the database
            await product.remove();
            // Update the ProductQuantity records of all users who have this product
            await ProductQuantity.updateMany({ product: product._id }, { quantity: 0 });
        }
    } catch (err) {
        console.error(err);
    }
});

//Server
app.listen(PORT, () => {

    console.log('server is running at: ', PORT);
})
