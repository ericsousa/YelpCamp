
// REQUIRE LIBRARIES
var express       = require('express')
var bodyParser    = require('body-parser')
var mongoose      = require('mongoose')
var passport      = require('passport')
var localStrategy = require('passport-local')

// REQUIRE MODELS
var Campground  = require('./models/campground')
var Comment     = require('./models/comment')
var SeedDB      = require('./seeds')
var User        = require('./models/user')

// APP CONFIG
var app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

// DATABASE CONFIG 
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})
SeedDB()

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: "lk21389ajspd390dsfjn23908001ndweqko",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

  
// ROUTES

  app.get('/', function  (req, res) {
    res.render('landing')
  })

// =========================================================
// CAMPGROUNDS ROUTES
// =========================================================


// INDEX - show all campgrounds
  app.get('/campgrounds', function (req, res) {
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
  app.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new')
  })

// CREATE - add new  campground to DB
  app.post('/campgrounds', function (req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampground = {name: name, image: image, description: desc}
    
    // Create a new campground and save to database
    Campground.create(newCampground, function (err, newlyCreated) {
      if (err) {
        console.log(err)
      } else {
        // redirect back to campgrounds page
        res.redirect('/campgrounds')  // default is to redirect to the .get route
      }
    })
  })

// SHOW - shows more info about one campground
  app.get('/campgrounds/:id',  function (req, res) {
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

// =========================================================
// COMMENTS ROUTES
// =========================================================

app.get('/campgrounds/:id/comments/new', function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
       res.render('comments/new', {campground: campground})
    }
  })
})

app.post('/campgrounds/:id/comments', function (req, res) {
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

// =========================================================
// AUTH ROUTES
// =========================================================

// show register form
app.get('/register', function (req, res) {
  res.render('register')
})

// handle sign up logic
app.post('/register', function (req, res) {
  res.send('signing you up')
})

// RUN SERVER --------------------------------------
  app.listen('3000', function () {
    console.log('YelpCamp server running')
  })



/*
  NOTES 

  RESTful Routes:       
  
    (representetional state transfer)
    (a mapping between HTTP routes and CRUD)

    index     /dogs             GET      list all dogs
    new       /dogs/new         GET      show add form
    create    /dogs             POST     save new dog
    show      /dogs/:id         GET      show details
    edit      /dogs/:id/edit    GET      show edit form 
    update    /dogs/:id         PUT      update dog
    destroy   /dogs/:id         DELETE   delete dog

  -----------------------------

  db.nameOfCollection.drop()   >>    delete everything into the collection

*/