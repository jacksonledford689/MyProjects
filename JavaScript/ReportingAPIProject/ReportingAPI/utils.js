// get the earliest start date
module.exports.getStartDate = (data) => {
    let min = new Date(data[0].date);
    data.forEach(obj => {
        const date = new Date(obj.date);
        if (date.getTime() < min.getTime()) {
            min = date;
        }
    });

    return min.toISOString().split('T')[0];
}

// get the latest end date
module.exports.getEndDate = (data) => {
    let max = new Date(data[0].date);
    data.forEach(obj => {
        const date = new Date(obj.date);
        if (date.getTime() > max.getTime()) {
            max = date;
        }
    });

    return max.toISOString().split('T')[0];
}


const getCartValueTotal = (data) => {
    let cartValueTotal = 0;
    data.forEach(cart => {
        cart.cartItems.forEach(cartItem => {
            cartValueTotal += cartItem.price;
        });
    });
    return parseFloat(cartValueTotal.toFixed(2));
}

const getRestLeastAbandCarts = (data) => {
    const restMap = {};

    data.forEach(cart => {
        const id = cart.restaurantid;
        restMap[id] ? restMap[id]++ : restMap[id] = 1;
    });

    const restId = Object.keys(restMap).reduce( (a, b) => {
        return restMap[a] < restMap[b] ? a : b;
    });

    return parseInt(restId);
}

const getRestMostAbandCarts = (data) => {
    const restMap = {};

    data.forEach(cart => {
        const id = cart.restaurantid;
        restMap[id] ? restMap[id]++ : restMap[id] = 1;
    });

    const restId =  Object.keys(restMap).reduce( (a, b) => {
        return restMap[a] > restMap[b] ? a : b;
    });

    return parseInt(restId);
}

const getCommonAbandonedItems = (data) => {
    let map = {};

    data.forEach( cart => {
        cart.cartItems.forEach( item => {
            const id = item.itemid;
            map[id] ? map[id]++ : map[id] = 1;
        });
    });

    return Object.keys(map).sort( (a, b) => map[b] - map[a]).splice(0, 5).map(e => parseInt(e));
}

const getPendingAmount = (data) => {
  let pendingAmount = 0;
  data.forEach(transactions =>{
    transactions.transactionItems.forEach(transactionItem =>{
      if(transactionItem.status == "pending"){pendingAmount += transactionItem.totalPrice}
    });
  });
  return parseFloat(pendingAmount.toFixed(2));
}

const getDeclinedAmount = (data) => {
  let declinedAmount = 0;
  data.forEach(transactions =>{
    transactions.transactionItems.forEach(transactionItem =>{
      if(transactionItem.status == "declined"){declinedAmount += transactionItem.totalPrice}
    });
  });
  return parseFloat(declinedAmount.toFixed(2));
}

const getPostedAmount = (data) => {
  let postedAmount = 0;
  data.forEach(transactions =>{
    transactions.transactionItems.forEach(transactionItem =>{
      if(transactionItem.status == "accepted"){postedAmount += transactionItem.totalPrice}
    });
  });
  return parseFloat(postedAmount.toFixed(2));
}

const getPendingCount = (data) => {
  let pendingCount = 0;
  data.forEach(transactions =>{
    transactions.transactionItems.forEach(transactionItem =>{
      if(transactionItem.status == "pending"){pendingCount++}
    });
  });
  return parseInt(pendingCount);
}

const getPostedCount = (data) => {
  let postedCount = 0;
  data.forEach(transactions =>{
    transactions.transactionItems.forEach(transactionItem =>{
      if(transactionItem.status == "accepted"){postedCount++}
    });
  });
  return parseInt(postedCount);
}

const getResolvedTickets = (data) => {
    let resolvedTickets = 0;
    data.forEach( date => {
        date.ticketItems.forEach( ticket => {
            if (ticket.status === 'resolved' || ticket.status === 'closed') {
                resolvedTickets++;
            }
        });
    });
    return resolvedTickets;
}

const getUnresolvedTickets = (data) => {
    let unresolvedTickets = 0;
    data.forEach(date => {
        date.ticketItems.forEach(ticket => {
            if (ticket.status === 'pending' || ticket.status === 'open') {
                unresolvedTickets++;
            }
        })
    });
    return unresolvedTickets;
}

const getMostTicketRestaurants = (data) => {
    let map = {};

    data.forEach( date => {
        date.ticketItems.forEach( ticket => {
            const id = ticket.restaurantid;
            map[id] ? map[id]++ : map[id] = 1;
        });
    });

    return Object.keys(map).sort( (a, b) => map[b] - map[a]).splice(0, 5).map(e => parseInt(e));
}

const getLeastTicketRestaurants = (data) => {
    let map = {};

    data.forEach( date => {
        date.ticketItems.forEach( ticket => {
            const id = ticket.restaurantid;
            map[id] ? map[id]++ : map[id] = 1;
        });
    });

    return Object.keys(map).sort( (a, b) => map[a] - map[b]).splice(0, 5).map(e => parseInt(e));

}

const getDriverMostTickets = (data) => {
    let map = {};

    data.forEach( date => {
        date.ticketItems.forEach( ticket => {
            const id = ticket.driverid;
            map[id] ? map[id]++ : map[id] = 1;
        });
    });

    return Object.keys(map).sort( (a, b) => map[b] - map[a]).splice(0, 5).map(e => parseInt(e));
}

const getDriverLeastTickets = (data) => {
    let map = {};

    data.forEach( date => {
        date.ticketItems.forEach( ticket => {
            const id = ticket.driverid;
            map[id] ? map[id]++ : map[id] = 1;
        });
    });

    return Object.keys(map).sort( (a, b) => map[a] - map[b]).splice(0, 5).map(e => parseInt(e));
}


const getRewardPoints = (data, userid = null) => {
    let points = 0;
    data.forEach( date => {
        date.rewardList.forEach( rewards => {
            if (parseInt(rewards.userid) === parseInt(userid)) {
                points += rewards.rewardPoints;
            }
        });
    });
    return points;
}

getCountDeliveriesComplete = data => {
    let count = 0; 
    data.forEach( e => {
        e.deliveries.forEach( delivery => {
            if (delivery.isCompleted == 1) {
                count++;
            }
        })
    })
    return parseInt(count);
}


getCountDeliveriesCancelled = data => {
    let count = 0;
    data.forEach( e => {
        e.deliveries.forEach( delivery => {
            if (delivery.isCompleted == 0) {
                count++;
            }
        })
    })
    return parseInt(count);
}

getTipTotal = data => {
    let amount = 0;
    data.forEach( e => {
        e.deliveries.forEach( delivery => {
            amount += delivery.tipAmount;
        })
    })
    return parseFloat(amount.toFixed(2));
}

getAverageDeliveryRating = data => {
    let totalRating = 0;
    let totalDelivery = 0;
    
    data.forEach( e => {
        e.deliveries.forEach( delivery => {
            totalRating += delivery.rating;
            totalDelivery++;
        })
    })

    const average = totalRating / totalDelivery;
    return parseFloat(average.toFixed(2));
}

getAverageDeliveryTime = data => {
    let totalTime = 0;
    let totalDelivery = 0;

    data.forEach( e => {
        e.deliveries.forEach( delivery => {
            totalTime += delivery.deliveryTime;
            totalDelivery++;
        })
    })

    const average = totalTime / totalDelivery;
    return parseFloat(average.toFixed(2));
}

module.exports.filterByDateRange = (startDate, endDate, data) => {
    return data.filter (e => {
        const date = new Date(e.date).getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return date >= start && date <= end;
    })
}


Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

Date.prototype.subtractDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
};

//startDate + timeframe number of days
module.exports.getTimeframeEndDate = (startDate, timeframe) => {

    let toAdd = 0;
    if (timeframe === 'day') toAdd = 1 - 1;
    if (timeframe === 'week') toAdd = 7 - 1;
    if (timeframe === 'month') toAdd = 28 - 1;
    if (timeframe === 'year') toAdd = 365 - 1;

    const date = new Date(startDate);
    return date.addDays(toAdd).toISOString().split('T')[0];
}

//endDate - timeframe number of days
module.exports.getTimeframeStartDate = (endDate, timeframe) => {

    let toSubtract  = 0;
    if (timeframe === 'day') toSubtract = 1 - 1;
    if (timeframe === 'week') toSubtract  = 7 - 1;
    if (timeframe === 'month') toSubtract  = 28 - 1;
    if (timeframe === 'year') toSubtract  = 365 - 1;

    const date = new Date(endDate);
    return date.subtractDays(toSubtract ).toISOString().split('T')[0];
}


module.exports.isValidUserId = id => {
    return id >= 1 && id <= 1000;
}

module.exports.isValidRestaurantId = id => {
    return id >= 1 && id <= 200;
}

module.exports.isValidItemId = id => {
    return id >= 1 && id <= 1000;
}

module.exports.isValidDriverId = id => {
    return id >= 1 && id <= 200;
}

module.exports.isValidRewardPoints = id => {
    return id >= 0;
}

//rewards report object
module.exports.rewardsReport = (data, userid = null) => {
    const rewardPoints = getRewardPoints(data, userid);
    return {
        userid,
        rewardPoints
    }
}

//abandoned-cart report object
module.exports.abandonedCartReport = (data, userid = null, restaurantid = null) => {
    const cartCount = data.length;
    const cartValueTotal = getCartValueTotal(data);
    const restLeastAbandCarts = getRestLeastAbandCarts(data);
    const restMostAbandCarts = getRestMostAbandCarts(data);
    const commonAbandonedItems = getCommonAbandonedItems(data);

    return {
        restaurantid,
        userid,
        restLeastAbandCarts,
        restMostAbandCarts,
        cartCount,
        cartValueTotal,
        commonAbandonedItems
    }
}

/***************************************************************************** */


module.exports.salesReport = (data) => {
    const totalProfit = parseFloat(
        data.reduce( (acc, curr) => acc+ curr.totalProfit, 0)
        .toFixed(2)
    );

    const totalRestaurantProfit = parseFloat(
        data.reduce( (acc, curr) => acc + curr.totalRestaurantProfit, 0)
        .toFixed(2)
    );

    const totalDriverProfit = parseFloat(
        data.reduce( (acc, curr) => acc + curr.totalDriverProfit, 0)
        .toFixed(2)
    );

    const salesCount = parseFloat(
        data.reduce( (acc, curr) => acc + curr.salesCount, 0)
        .toFixed(2)
    );
    const newAccountCount = parseFloat(
        data.reduce( (acc, curr) => acc + curr.newAccountCount, 0)
        .toFixed(2)
    );

    return {
        totalProfit,
        totalRestaurantProfit,
        totalDriverProfit,
        salesCount,
        newAccountCount
    }
}

/***************************************************************************** */

//<<<<<<< transactions

/***************************************************************************** */
module.exports.transactionsReport = (data, userid = null, resturantid = null) => {

  const totalAmountPending = getPendingAmount(data);
  const totalAmountDeclined = getDeclinedAmount(data);
  const totalAmountPosted = getPostedAmount(data);
  const pendingPaymentCount = getPendingCount(data);
  const postedPaymentCount = getPostedCount(data);

  return {
    resturantid,
    userid,
    totalAmountPending,
    totalAmountDeclined,
    totalAmountPosted,
    pendingPaymentCount,
    postedPaymentCount
  }

}

module.exports.customerServiceReport = (data, userid = null, restaurantid = null, driverid = null) => {

    const display = userid || restaurantid || driverid ? false : true;


    const totalResolvedTickets = getResolvedTickets(data);
    const totalUnresolvedTickets = getUnresolvedTickets(data);
    const mostTicketRestaurants = display ? getMostTicketRestaurants(data) : null;
    const leastTicketRestaurants = display ? getLeastTicketRestaurants(data) : null;
    const ticketOrderRatio = (totalResolvedTickets + totalUnresolvedTickets) / 1.0;
    const driverMostTickets = display ? getDriverMostTickets(data) : null;
    const driverLeastTickets = display ? getDriverLeastTickets(data) : null;

    return {
        userid,
        restaurantid,
        driverid,
        totalResolvedTickets,
        totalUnresolvedTickets,
        mostTicketRestaurants,
        leastTicketRestaurants,
        ticketOrderRatio,
        driverMostTickets,
        driverLeastTickets
    }
}

module.exports.driversReport = (data, driverID = null) => {
    const countDeliveriesComplete = getCountDeliveriesComplete(data);
    const countDeliveriesCancelled = getCountDeliveriesCancelled(data);
    const tipTotal = getTipTotal(data);
    const averageDeliveryRating = getAverageDeliveryRating(data);
    const averageDeliveryTime = getAverageDeliveryTime(data);

    return {
        countDeliveriesComplete,
        countDeliveriesCancelled,
        tipTotal,
        driverID,
        averageDeliveryRating,
        averageDeliveryTime
    }
}

const getHighestOrderedItems = data => {
    const map = {};

    data.forEach( date => {
        date.restaurantList.forEach( rest => {
            rest.highestOrderedItems.forEach( item => {
                map[item] ? map[item]++ : map[item] = 1;
            })
        })
    })

    return Object.keys(map).sort( (a, b) => map[b] - map[a]).splice(0, 5).map(e => parseInt(e));
}

module.exports.restaurantsReport = (data, restaurantid = null) => {
    let numOrders = 0;
    let totalTime = 0;
    let totalRest = 0;
    let profits = 0;
    let totalRating = 0;

    data.forEach( date => {
        date.restaurantList.forEach( rest => {
            numOrders += rest.numberOfOrders;
            totalTime += rest.averagePickupTime;
            totalRest++;
            profits += rest.profit;
            totalRating += rest.rating;
        })
    })

    profits = parseFloat(profits.toFixed(2));
    const averageTimeToPickup = parseFloat( (totalTime / totalRest).toFixed(2));
    const averageRating = parseFloat( (totalRating / totalRest).toFixed(2));
    const totalSales = numOrders;
    const highestOrderedItems = getHighestOrderedItems(data);


    return {
        restaurantid,
        numOrders,
        averageTimeToPickup,
        profits,
        averageRating,
        totalSales,
        highestOrderedItems
    }
}
