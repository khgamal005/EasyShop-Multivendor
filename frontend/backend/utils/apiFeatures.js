class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // filter() {
    
  //   const queryStringObj = { ...this.queryString };
  // const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword']; 
  //   excludesFields.forEach((field) => delete queryStringObj[field]);

  //     if (queryStringObj.subcategory) {
  //   queryStringObj.subcategories = { $in: [queryStringObj.subcategory] };
  //   delete queryStringObj.subcategory; // remove the original field
  // }
  //   // Apply filtration using [gte, gt, lte, lt]
  //   let queryStr = JSON.stringify(queryStringObj);
  //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //   // this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
  //     this.mongooseQuery = this.mongooseQuery.find(filters);


  //   return this;
  // }
filter() {
  const queryStringObj = { ...this.queryString };
  const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword']; // Add keyword here
  excludesFields.forEach((field) => delete queryStringObj[field]);

  // Subcategory filtering
  if (queryStringObj.subcategory) {
    queryStringObj.subcategories = { $in: [queryStringObj.subcategory] };
    delete queryStringObj.subcategory;
  }
  
  if (queryStringObj.color) {
  const colorArray = Array.isArray(queryStringObj.color)
    ? queryStringObj.color
    : [queryStringObj.color];

  queryStringObj.color = { $in: colorArray };
}

  // Handle comparison operators
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filters = JSON.parse(queryStr);

  // Get existing query conditions
  const existingConditions = this.mongooseQuery.getQuery();
  
  // Merge new filters with existing conditions
  const mergedConditions = { ...existingConditions, ...filters };
  
  this.mongooseQuery = this.mongooseQuery.find(mergedConditions);

  return this;
}

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }


search() {
  if (this.queryString.keyword) {
    const keyword = this.queryString.keyword;
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    };
    this.mongooseQuery = this.mongooseQuery.find(query);
  }
  return this;
}



  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    
    this.paginationResult = pagination;
    // console.log(this.paginationResult,skip)
    return this;
  }
}

module.exports = ApiFeatures;
