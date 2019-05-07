var Campground = require('../models/campground')
var Comment = require('../models/comment')

// all the middleware goes here
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function  (req, res, next) {
  // is user logged in
  if (req.isAuthenticated()) {
    // get campground data and show form
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err || !foundCampground) {
        console.log(err)
        req.flash('error', 'Campground not found')
        res.redirect('back') 
      } else {
        //  does user own the campground
        if (foundCampground.author.id.equals(req.user._id)) {
          next()
        } else {
          req.flash('error', 'You don\'t have permission to do that')
          res.redirect('back')  
        }
      }
    })
  } else {
    req.flash('error', 'You need to be logged in to do that.')
    res.redirect('back')  // redirect back to the previous page
  }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // is user logged in
  if (req.isAuthenticated()) {
   // get campground data and show form
   Comment.findById(req.params.comment_id, function (err, foundComment) {
     if (err|| !foundComment) {
       req.flash('error', 'Comment not found')
       res.redirect('back') 
     } else {
       //  does user own the campground
       if (foundComment.author.id.equals(req.user._id)) {
         next()
       } else {
         res.flash('error', 'You don\'t have persminssion to do that')
         res.redirect('back')  
       }
     }
   })
 } else {
   req.flash('error', 'You need to be logged in to do that.')
   res.redirect('back')  
 }
}



middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('error', 'You need to be logged in todo that.')
    res.redirect('/login')
  }
}
module.exports = middlewareObj