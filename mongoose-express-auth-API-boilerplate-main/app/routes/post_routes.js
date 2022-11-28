// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for posts
const Post = require('../models/post')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { post: { title: '', text: 'foo' } } -> { post: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /posts
router.get('/posts', (req, res, next) => {
    Post.find()
        .populate('owner')
        .then(posts => {
            return posts.map(post => post.toObject())
        })
        .then(posts => {
            res.status(200).json({ posts: posts })
        })
        .catch(next)
})

// SHOW
// GET /posts/5a7db6c74d55bc51bdf39793
router.get('/posts/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Post.findById(req.params.id)
		.populate('owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "post" JSON
		// .then((post) => res.status(200).json({ post: post.toObject() }))
		.then(post => {
            res.status(200).json({ post: post})
        })
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /posts
router.post('/posts', requireToken, (req, res, next) => {
    req.body.post.owner = req.user.id

    // on the front end, I HAVE to send a post as the top level key
    Post.create(req.body.post)
    .then(post => {
        res.status(201).json({ post: post })
    })
    .catch(next)
    
})

// UPDATE
// PATCH /posts/5a7db6c74d55bc51bdf39793
router.patch('/posts/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair

	delete req.body.post.owner

	Post.findById(req.params.id)
		.then(handle404)
		.then((post) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, post)

			// pass the result of Mongoose's `.update` to the next `.then`
			return post.updateOne(req.body.post)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
router.delete('/posts/:id', requireToken, (req, res, next) => {
	Post.findById(req.params.id)
		.then(handle404)
		.then((post) => {
			// throw an error if current user doesn't own `post`
			requireOwnership(req, post)
			// delete the post ONLY IF the above didn't throw
			post.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
