const mongoose = require('mongoose')
const profileSchema = require('./profile')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		img: {
			type: String,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		token: String,
	},{
		profile:[profileSchema]
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
