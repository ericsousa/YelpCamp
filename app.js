
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

// REQUIRE ROUTES
var indexRoutes       = require('./routes/index')
var campgroundRoutes  = require('./routes/campgrounds')
var commentsRoutes     = require('./routes/comments')

// APP CONFIG
var app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

// DATABASE CONFIG 
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})

// seed the database
// SeedDB()

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

// set middleware that will run for every route
app.use(function (req, res, next) {

  // everything inside res.local
  // will be available insede the template
  // req.user is set by passport
  res.locals.currentUser = req.user
  next()
})


// LOAD ROUTES
app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments/', commentsRoutes)


// RUN SERVER --------------------------------------

app.listen('3000', function () {
  console.log('YelpCamp server running')
})
