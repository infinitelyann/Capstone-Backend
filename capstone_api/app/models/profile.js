const mongoose = require('mongoose')


const profileSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			
		},
		img: {
			type: String,
		},
		bio: {
			type: String,
			
		}
	}
)

module.exports = mongoose.model('profile', profileSchema)
