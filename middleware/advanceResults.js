const advanceResult = (model, populate) => async (req, res, next) => {
    let query;
    
      //Copy req.query
      const reqQuery = { ...req.query };
    
      //Fields to exclude
      const removeFields = ['select', 'sort', 'page', 'limit'];
      
      // Loop over removefields and delete them from reqQuery
      removeFields.forEach(params => delete reqQuery[params]);
    
      // Create query string
      let queryStr = JSON.stringify(req.query);
    
      // Create operators ($gt, $gte, etc)
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
      // Finding resources
      query = model.find(JSON.parse(queryStr));
    
      // SELECT FIELDS
      if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
      }
    
      // Sort
    
      if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      }else {
        query = query.sort('-createdAt')
      }
    
      //Paginaton
      const page = parseInt(req.query.page, 2) || 1;
      const limit = parseInt(req.query.limit, 2) || 100;
      const startIndex = (page-1)*limit;
      const endIndex = page * limit
      const total = await model.countDocuments();
    
      query = query.skip(startIndex).limit(limit);

      if(populate) {
        query = query.populate(populate);
      }
    
      // Executing query
      const results = await query;
    
      // Paginaton result
      const pagination = {};
      if(endIndex < total){
        pagination.next = {
          page: page + 1,
          limit
        }
      }
    
      if(startIndex > 0) {
        pagination.pre ={
          page: page - 1,
          limit
        }
      }
    
      res.advanceResult = {
        success: true,
        count: results.length,
        pagination,
        data: results
      }

      next();
    
}

module.exports = advanceResult;