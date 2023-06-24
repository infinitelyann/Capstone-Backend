const express = require('express')
const passport = require('passport')
const User = require('../models/user')
require("dotenv").config()
const cloudinary = require('cloudinary').v2

console.log(cloudinary.config().cloud_name)
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// ////////////////////////////
// Create
// Post an image of the user
///////////////////////////////
router.post('/image/:userId', removeBlanks, (req, res, next) => {
	try {
		const fileStr = req.body.image

		//console.log('this is the file\n', fileStr) 
		const userId = req.params.userId
		console.log('this is fileStr in imagePost', fileStr)

		// console.log('this is the uploaded info\n', uploadedResponse)
		User.findByIdAndUpdate(userId, { img: fileStr },
			function (err, doc) {
				if (err) {
					console.log(err)
				}
				else {
					console.log("Updated User : ", doc);
				}
			})
		res.json({ msg: "success" })
	} catch (error) {
		console.log(error)
		res.status(500).json({ err: error })
	}
})

/////////////////////////////////////////
// Export Router
/////////////////////////////////////////
module.exports = router