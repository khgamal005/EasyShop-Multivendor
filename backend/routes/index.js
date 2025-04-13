
const userRoute = require('./userRoute');
const sellerRoute = require('./sellerRoute');


const mountRoutes = (app) => {

  app.use('/api/v1/user', userRoute)
  app.use('/api/v1/shop', sellerRoute);

};

module.exports = mountRoutes;
