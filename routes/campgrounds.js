
var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')


// INDEX - show all campgrounds
router.get('/', function (req, res) {
    
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds})
    }
  })
})

// NEW - show form to create new campground
router.get('/new', isLoggedIn, function (req, res) {
  res.render('campgrounds/new')
})

// CREATE - add new  campground to DB
router.post('/', isLoggedIn, function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name
  var image = req.body.image
  var desc = req.body.description
  var author = { id: req.user._id, username: req.user.username }
  var newCampground = {name: name, image: image, description: desc, author: author}
  
  // Create a new campground and save to database
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      console.log(newlyCreated)
      // redirect back to campgrounds page
      res.redirect('/campgrounds')  // default is to redirect to the .get route
    }
  })
})

// SHOW - shows more info about one campground
router.get('/:id',  function (req, res) {
  // find the campground with provided id
  Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log(err)
    } else {
      // render show template with  that compground
      res.render('campgrounds/show', {campground: foundCampground})
    }
  })
})

// EDIT 
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/edit', {campground: campground})
    }
  })
})

// UPDATE 
router.put('/:id', checkCampgroundOwnership, function (req, res) {
  // find and update the crroect campground

  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      // redirect to the show page
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

// DELETE
router.delete('/:id', checkCampgroundOwnership, function (req, res){
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})

// Middlewares
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

function checkCampgroundOwnership (req, res, next) {
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

module.exports = router