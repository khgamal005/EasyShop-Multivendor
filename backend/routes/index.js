
const userRoute = require('./userRoute');


const mountRoutes = (app) => {

  app.use('/api/v1/user', userRoute);

};

module.exports = mountRoutes;
