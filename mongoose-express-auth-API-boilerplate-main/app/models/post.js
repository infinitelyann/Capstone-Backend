const mongoose = require('mongoose')
const commentSchema = require('./comment')

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
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
		comments: [commentSchema],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('post', postSchema)
