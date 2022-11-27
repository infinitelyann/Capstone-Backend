const express = require('express')
const passport = require('passport')

// pull in Mongoose model for posts
const Post = require('../models/post')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// POST -> anybody can give a post a comment
// POST /comments/<post_id>
router.post('/comments/:postId', removeBlanks, (req, res, next) => {
    // get the comment from req.body
    const comment = req.body.comment
    const postId = req.params.postId
    // find the post by its id
    Post.findById(postId)
        .then(handle404)
        // add the comment to the post
        .then(post => {
            // push the comment into the post's comment array and return the saved post
            post.comments.push(comment)

            return post.save()
        })
        .then(post => res.status(201).json({ post: post }))
        // pass to the next thing
        .catch(next)
})

// UPDATE a comment
// PATCH -> /comments/<post_id>/<comment_id>
router.patch('/comments/:postId/:commentId', requireToken, removeBlanks, (req, res, next) => {
    const { postId, commentId } = req.params

    // find the post
    Post.findById(postId)
        .then(handle404)
        .then(post => {
            // get the specific comment
            const theComment = post.comments.id(commentId)

            // make sure the user owns the post
            requireOwnership(req, post)

            // update that comment with the req body
            theComment.set(req.body.comment)

            return post.save()
        })
        .then(post => res.sendStatus(204))
        .catch(next)
})

// DESTROY a comment
// DELETE -> /comments/<post_id>/<comment_id>
router.delete('/comments/:postId/:commentId', requireToken, (req, res, next) => {
    const { postId, commentId } = req.params

    // find the post
    Post.findById(postId)
        .then(handle404)
        .then(post => {
            // get the specific comment
            const theComment = post.comments.id(commentId)

            // make sure the user owns the post
            requireOwnership(req, post)

            // update that comment with the req body
            theComment.remove()

            return post.save()
        })
        .then(post => res.sendStatus(204))
        .catch(next)
})

// export router
module.exports = router