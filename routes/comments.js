var express = require('express')
var router = express.Router({mergeParams: true})  // get :id param from app.js
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require('../middleware')   // automatically requires index.js

// Comments New
router.get('/new', middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
       res.render('comments/new', {campground: campground})
    }
  })
})

// Comments  create
router.post('/', middleware.isLoggedIn, function (req, res) {
  // lookup campground using n ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err)  {
      console.log(err)
      res.redirect('/campgrounds') 
    } else {
      // create new comment
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err)
        } else {
          // add username and id to comment
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          // save comment
          comment.save()
          console.log(comment)
          // connect new comment to camground
          campground.comments.push(comment)
          campground.save()
          // redirect to compaground show page
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  })
})

// comments edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function  (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect('back')
    } else {
      console.log(foundComment)
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
    }
  })
})

// comments update
router.put('/:comment_id', middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, foundComment) {
    if (err) {
      res.redirect('back')
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

// delete route
router.delete('/:comment_id/', middleware.checkCommentOwnership, function (req, res) {

  Comment.findByIdAndRemove (req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back")
    } else {
      console.log('comment deleted=================')
      res.redirect('/campgrounds/' + req.params.id )
    }
  }) 
})



module.exports = router