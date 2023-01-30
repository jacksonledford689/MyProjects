const express = require('express');
const app = express();

app.use(express.json());

const abandonedCartsRoutes = require('./routes/abandoned-carts');
const salesRoutes = require('./routes/sales');
const transactionsRoutes = require('./routes/transactions');
const customerServiceRoutes = require('./routes/customer-service');
const rewardsRoutes = require('./routes/rewards');
const driversRoutes = require('./routes/drivers');
const restaurantsRoutes = require('./routes/restaurants');

app.use('/reports/abandoned-carts', abandonedCartsRoutes);
app.use('/reports/sales', salesRoutes);
app.use('/reports/transactions', transactionsRoutes);
app.use('/reports/customer-service', customerServiceRoutes);
app.use('/reports/rewards', rewardsRoutes);
app.use('/reports/drivers', driversRoutes);
app.use('/reports/restaurants', restaurantsRoutes);



// const data = require('./seeds/restaurants.json');

// catch 404
app.use((req, res, next) => {
    res.status(404).send({ status: 404, error: 'Not found' });
});

// catch errors
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const msg = err.error || err.message;
    res.status(status).send({ status, error: msg });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));