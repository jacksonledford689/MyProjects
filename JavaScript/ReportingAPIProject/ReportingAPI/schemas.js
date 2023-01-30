const Joi = require('joi');

module.exports.AbandonedCartsSchema = Joi.array().items(
    Joi.object({
        date: Joi.string().required(),
        restaurantid: Joi.number().integer().required(),
        userid: Joi.number().integer().required(),
        cartItems: Joi.array().items(
            Joi.object({
                itemid: Joi.number().integer().required(),
                price: Joi.number().min(0).required()
            }).required()
        ).required()
    }).required()
)

module.exports.customerServiceSchema = Joi.array().items(
    Joi.object({
        date: Joi.string().required(),
        ticketItems: Joi.array().items(
            Joi.object({
                ticketid: Joi.number().integer().required(),
                userid: Joi.number().integer().required(),
                restaurantid: Joi.number().integer().required(),
                driverid: Joi.number().integer().required(),
                status: Joi.string().required()
            }).required()
        ).required()
    }).required()
)


module.exports.driversSchema = Joi.array().items(
    Joi.object({
        date: Joi.string().required(),
        driverid: Joi.number().integer(),
        deliveries: Joi.array().items(
            Joi.object({
                restaurantid: Joi.number().integer().required(),
                isCompleted: Joi.number().integer().required(),
                transactionid: Joi.number().integer().required(),
                tipAmount: Joi.number().required(),
                rating: Joi.number().required(),
                deliveryTime: Joi.number().required()
            }).required()
        ).required()
    }).required()
)

module.exports.restaurantsSchema = Joi.array().items(
    Joi.object({
        date: Joi.string().required(),
        restaurantList: Joi.array().items(
            Joi.object({
                restaurantid: Joi.number().integer().required(),
                averagePickupTime: Joi.number().required(),
                numberOfOrders: Joi.number().integer().required(),
                rating: Joi.number().required(),
                profit: Joi.number().required(),
                highestOrderedItems: Joi.array().items(
                    Joi.number().integer().required()
                ).required()
            }).required()
        ).required()
    }).required()
)

module.exports.rewardsSchema = Joi.array().items(
    Joi.object({
        date: Joi.string().required(),
        rewardList: Joi.array().items(
            Joi.object({
                userid: Joi.number().integer().required(),
                rewardPoints: Joi.number().integer().required()
            }).required()
        ).required()
    }).required()
)

module.exports.transactionsSchema = Joi.array().items(
    Joi.object({
        date: Joi.string().required(),
        restaurantid: Joi.number().integer().required(),
        transactionItems: Joi.array().items(
            Joi.object({
                totalPrice: Joi.number().required(),
                status: Joi.string().required(),
                userid: Joi.number().integer().required(),
                paymentPlatform: Joi.string().required()
            }).required()
        ).required()
    }).required()
)
