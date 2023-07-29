const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const WebSocket = require('ws'); // Import WebSocket library
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cron = require('node-cron');

app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());

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
const testsRoutes = require('./routes/testing');

const api = process.env.API_URL;
const PORT = process.env.PORT || 3000;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/productQuantities`, productQuantitiesRoutes);
app.use(`${api}/productHistories`, productHistoriesRoutes);
app.use(`${api}/testing`, testsRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
    dbName: 'test',
})
    .then(() => {
        console.log('Database Connection is ready...')
    })
    .catch((err) => {
        console.log(err);
    });
mongoose.set("useCreateIndex", true);

// Schedule the removeExpiredProducts function to run every day at midnight
setInterval(() => {
    removeExpiredProducts();
}, 24 * 60 * 60 * 1000); // Runs at 00:00 (midnight) every day

// WebSocket server
const http = require('http').createServer(app);
const wss = new WebSocket.Server({ server: http });

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');

    ws.on('message', (message) => {
        console.log('Received message from client:', message);

        // You can process the received message here and send a response if needed.
        // For example, you can use `ws.send()` to send a message back to the client.
        ws.send('Hello, client! I received your message.');
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });
});

// Start the server
http.listen(PORT, () => {
    console.log('Server is running at:', PORT);
});
