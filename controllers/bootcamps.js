// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: "Show all bootcamps"})
}


// @desc    Get a bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `get a bootcamp with id ${req.params.id}`})
}


// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: "create a bootcamp"})
}


// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.udpdateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Update a bootcamp with id ${req.params.id}`})
}



// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Delete a bootcamp with id ${req.params.id}`})
}