// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
const logger = (req, res, next) => {
    console.log(
        `${req.method}    ${req.protocol}://${req.get("host")}${req.originalUrl}`
    )
    next()
}

module.exports = logger