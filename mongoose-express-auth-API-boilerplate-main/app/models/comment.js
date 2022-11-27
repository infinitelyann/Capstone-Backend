const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		likes: {
			type: Number,
		},
		dislikes: {
			type: Number,
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

module.exports = mongoose.model('comment', commentSchema)
