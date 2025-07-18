
const userRoute = require('./userRoute');
const sellerRoute = require('./sellerRoute');
const brandRoute = require('./brandRoute');
const categoryRoute = require('./categoryRoute');
const subcategoryRoute = require('./subCategoryRoute');
const productRoute = require('./productRoute');
const reviewRoute = require('./reviewRoute');
const wishlistRoute = require('./wishlistRoute');
const eventRoute = require('./eventRoute');
const couponRoute = require('./couponRoute');
const orderRoute = require('./orderRoute');
const paymentRoute = require('./paymentRoute');
const withdrawtRoute = require('./withdrawRoute');
const conversationRoute = require('./conversationRoute');
const messagetRoute = require('./messageRoute');


const mountRoutes = (app) => {

  app.use('/api/v1/user', userRoute)
  app.use('/api/v1/shop', sellerRoute);
  app.use('/api/v1/brand', brandRoute);
  app.use('/api/v1/category', categoryRoute);
  app.use('/api/v1/subCategory', subcategoryRoute);
  app.use('/api/v1/product', productRoute);
  app.use('/api/v1/reviews', reviewRoute);
  app.use('/api/v1/wishlist', wishlistRoute);
  app.use('/api/v1/event', eventRoute);
  app.use('/api/v1/coupon', couponRoute);
  app.use('/api/v1/order', orderRoute);
  app.use('/api/v1/payment', paymentRoute);
  app.use('/api/v1/withdraw', withdrawtRoute);
  app.use('/api/v1/conversation', conversationRoute);
  app.use('/api/v1/message', messagetRoute);

};

module.exports = mountRoutes;
