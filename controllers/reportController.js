const Report = require("./../models/reportModel.js")
const catchAsync = require("./../utils/catchAsync.js")
const ApiFeatures = require("./../utils/apiFeatures.js")

// / i can use below for a route like "/top-5-Reports" in case of like advanced funcns on like "All Reports" page
exports.aliasTopReports = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-timestamp';
    req.query.type = 'Physical, Sexual';
    next();
}

// i can use below for a route like "/top-5-Reports" in case of like advanced funcns on like "All Reports" page
exports.aliasTopReports = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-timestamp';
    req.query.type = 'Physical, Sexual';
    next();
}

// / show all reports so far
exports.getAllReports = catchAsync(async (req, res) => {
    try {
        console.log('Backend received query params:', req.query); // DEBUG LOG
        
        // First get total count BEFORE applying search/pagination
        let totalQuery = Report.find();
        
        // Apply search to total count if search exists
        if (req.query.search) {
            totalQuery = totalQuery.find({
                $or: [
                    { location: { $regex: req.query.search, $options: 'i' } },
                    { typeOfIncident: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } },
                    { landmarks: { $regex: req.query.search, $options: 'i' } },
                    { attackerGender: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }
        
        const total = await totalQuery.countDocuments();
        
        // Now apply all features to get paginated results
        const features = new ApiFeatures(Report.find(), req.query)
            .search()
            .sort()
            .paginate()
            
        const reports = await features.query
        
        console.log('Backend sending:', { // DEBUG LOG
            results: reports.length,
            total: total,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20
        });

        res.status(200).json({
            status: 'success',
            results: reports.length,
            total: total,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            data: {
                reports
            }
        });
    } catch (err) {
        console.error('Backend error:', err); // DEBUG LOG
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
});


// create new report
exports.createReport = catchAsync(async (req, res, next) => {
  console.log("incomng data: ", req.body)
    try {
      const newReport = await Report.create({
      typeOfIncident: req.body.typeOfIncident,
      
      location: req.body.location,
      description: req.body.description,
      landmarks: req.body.landmarks,
      attackerKnown: req.body.attackerKnown,
      attackerGender: req.body.attackerGender,
      timeStamp: req.body.timeStamp
      })
    //   console.log("🟢 Received POST /create with body:", req.body);
    // const newReport = await Report.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            report: newReport
        }
    })
} catch(err) {
    res.status(400).json({
        status: "fail",
        message: err.message
    })
}
})

