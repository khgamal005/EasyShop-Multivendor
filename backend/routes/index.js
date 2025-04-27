
const userRoute = require('./userRoute');
const sellerRoute = require('./sellerRoute');
const brandRoute = require('./brandRoute');
const categoryRoute = require('./categoryRoute');
const subcategoryRoute = require('./subCategoryRoute');
const productRoute = require('./productRoute');
const reviewRoute = require('./reviewRoute');
const wishlistRoute = require('./wishlistRoute');


const mountRoutes = (app) => {

  app.use('/api/v1/user', userRoute)
  app.use('/api/v1/shop', sellerRoute);
  app.use('/api/v1/brand', brandRoute);
  app.use('/api/v1/category', categoryRoute);
  app.use('/api/v1/subCategory', subcategoryRoute);
  app.use('/api/v1/product', productRoute);
  app.use('/api/v1/reviews', reviewRoute);
  app.use('/api/v1/wishlist', wishlistRoute);

};

module.exports = mountRoutes;
