const mongoose = require('mongoose');
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      minlength: [2, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },
    // A and B => shoping.com/a-and-b
    image: String,
  },
  { timestamps: true }
);


const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BACKEND_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
categorySchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
  setImageURL(doc);
});

// 2- Create model
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
