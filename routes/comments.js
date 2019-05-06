var express = require('express')
var router = express.Router({mergeParams: true})  // get :id param from app.js
var Campground = require("../models/campground")
var Comment = require("../models/comment")

// Comments New
router.get('/new', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
       res.render('comments/new', {campground: campground})
    }
  })
})

// Comments  create
router.post('/', isLoggedIn, function (req, res) {
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

// Middleware
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

module.exports = router