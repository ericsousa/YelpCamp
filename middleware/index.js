var Campground = require('../models/campground')
var Comment = require('../models/comment')

// all the middleware goes here
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function  (req, res, next) {
  // is user logged in
  if (req.isAuthenticated()) {
    // get campground data and show form
    Campground.findById(req.params.id, function (err, campground) {
      if (err) {
        console.log(err)
        res.redirect('back') 
      } else {
        //  does user own the campground
        if (campground.author.id.equals(req.user._id)) {
          next()
        } else {
          res.redirect('back')  
        }
      }
    })
  } else {
    res.redirect('back')  // redirect back to the previous page
  }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // is user logged in
  if (req.isAuthenticated()) {
   // get campground data and show form
   Comment.findById(req.params.comment_id, function (err, foundComment) {
     if (err) {
       console.log(err)
       res.redirect('back') 
     } else {
       //  does user own the campground
       if (foundComment.author.id.equals(req.user._id)) {
         next()
       } else {
         res.redirect('back')  
       }
     }
   })
 } else {
   res.redirect('back')  
 }
}



middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}
module.exports = middlewareObj