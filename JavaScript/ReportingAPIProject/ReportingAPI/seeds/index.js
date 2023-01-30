

// JSON Generator

// abandoned-carts
// JG.repeat(1000, {
//     date: moment(JG.date(new Date(2010, 0, 1), new Date(2022, 0, 1))).format('YYYY-MM-DD'),
//     restaurantid: JG.integer(1, 200),
//     userid: JG.integer(1, 1000),
//     cartItems:
//         JG.repeat( JG.integer(1, 20), {
//             itemid: JG.integer(1, 1000),
//             price: JG.floating(0, 50, 2)
//       })  
//   });
  

//   l38pib57x6qu5hzwo9sr4w0fk7r50jv1uhmfridl

// const profit = JG.floating(0, 10000, 2);

// JG.repeat(5, { 
//     date: moment(JG.date(new Date(2010, 0, 1), new Date(2022, 0, 1))).format('YYYY-MM-DD'),
//     restaurantid: JG.integer(1, 200),
//     totalProfit: profit,
//   	totalRestaurantProfit: JG.floating(0, 10000, 2),
//     cartItems:
//         JG.repeat( JG.integer(1, 20), {
//             itemid: JG.integer(1, 1000),
//             price: JG.floating(0, 50, 2)
//       })  
//   });

// function getRandomFloat(min, max, decimals) {
//     const str = (Math.random() * (max - min) + min).toFixed(decimals);
  
//     return parseFloat(str);
// }
// const data = [
//     {
//         totalProfit: 1
//     },
//     {
//         totalProfit: 1
//     },
//     {
//         totalProfit: 1
//     },
//     {
//         totalProfit: 1
//     },
//     {
//         totalProfit: 1.4
//     }
// ]

// const hi = data.reduce( (acc, curr) => acc + curr.totalProfit, 0);
// console.log(hi);


// expected output: 10

// let sales = require('./sales.json');


// sales = JSON.parse(sales);



// for (let i = 0; i < sales.length; i++) {
//     const revenueMin = sales[i].salesCount * 5;
//     const revenueMax = sales[i].salesCount * 100;
//     const rand = getRandomFloat(revenueMin, revenueMax, 2);

//     sales[i].revenue = rand;
    
//     const totalProfit = getRandomFloat(0, rand, 2);
//     const totalRestaurantProfit = getRandomFloat(0, totalProfit, 2);
//     const totalDriverProfit = totalProfit - totalRestaurantProfit;

//     sales[i].totalProfit = totalProfit;
//     sales[i].totalRestaurantProfit = totalRestaurantProfit;
//     sales[i].totalDriverProfit = totalDriverProfit;
// }

// JG.repeat(3000, { 
//     date: moment(JG.date(new Date(2010, 0, 1), new Date(2022, 0, 1))).format('YYYY-MM-DD'),
//     restaurantid: JG.integer(1, 200),
//     totalProfit: JG.floating(8000, 15000, 2),
//   	totalRestaurantProfit: JG.floating(1000, 4000, 2),
//   	totalDriverProfit: JG.floating(1000, 4000, 2),
//   	revenue: JG.floating(20000, 100000, 2),
//   	salesCount: JG.integer(20, 1000)
//   });


// JG.repeat(470, { 
//     date: moment(JG.date(new Date(2010, 0, 1), new Date(2022, 0, 1))).format('YYYY-MM-DD'),
//   	ticketItems: 
//       JG.repeat( JG.integer(1, 25), {
//        	ticketid: JG.integer(1, 1000),
//         userid: JG.integer(1, 1000),
//         restaurantid: JG.integer(1, 200),
//         driverid: JG.integer(1, 200),
//         status: JG.random('open', 'pending', 'resolved', 					'closed')
//       })
  
//   });



// JG.repeat(430, { 
//   date: moment(JG.date(new Date(2010, 0, 1), new Date(2022, 0, 1))).format('YYYY-MM-DD'),
//   restaurantid: JG.integer(1, 200),
//   transactionItems: 
//     JG.repeat( JG.integer(1, 25), {
//        totalPrice: JG.floating(10, 500, 2),
//       status: JG.random('pending', 'declined', 						'accepted'),
//       userid: JG.integer(1, 1000),
//       paymentPlatform: JG.random('Visa', 'Discover', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay', 'Amazon Pay')
//     })
// });


// 


// JG.repeat(1000, { 
//     date: moment(JG.date(new Date(2010, 0, 1), new Date(2022, 0, 1))).format('YYYY-MM-DD'),
//        rewardList: JG.repeat(JG.integer(1, 25), 
//       {
//           userid: JG.integer(1, 1000),
//            rewardPoints: JG.integer(1, 100000)
//       }
                          
//     )                     
  
//   });


//restaurants
// JG.repeat(250, { 
//     date: moment(JG.date(new Date(2010, 0, 1), new Date(2022, 0, 1))).format('YYYY-MM-DD'),
//     restaurantList: JG.repeat(JG.integer(1, 25),
//         {
//           averagePickupTime: JG.floating(5, 60, 2),
//           numberOfOrders: JG.integer(5, 1000),
//           restaurantid: JG.integer(1, 200),
//           rating: JG.floating(0, 5, 1),
//           profit: JG.floating(0, 10000, 2),
//           highestOrderedItems: JG.repeat(5, JG.integer(1, 1000))
//         }                         
//     )                     
  
//   });


