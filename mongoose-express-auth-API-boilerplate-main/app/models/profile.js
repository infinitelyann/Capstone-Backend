const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			
		},
		bio: {
			type: String,
			
		},
        pic:{
            type: String,
        },
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('profile', profileSchema)
