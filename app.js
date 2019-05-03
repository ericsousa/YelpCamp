var express     = require('express')
    app         = express()
    bodyParser  = require('body-parser')
    mongoose    = require('mongoose')

var Campground  = require('./models/campground')
    Comment     = require('./models/comment')
    SeedDB      = require('./seeds')

SeedDB()

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

  app.get('/', function  (req, res) {
    res.render('landing')
  })

// INDEX - show all campgrounds
  app.get('/campgrounds', function (req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
      if (err) {
        console.log(err)
      } else {
        res.render('index', {campgrounds: allCampgrounds})
      }
    })
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

// NEW - show form to create new campground
  app.get('/campgrounds/new', function (req, res) {
    res.render('new')
  })

// SHOW - shows more info about one campground
  app.get('/campgrounds/:id',  function (req, res) {
    // find the campground with provided id
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
      if (err) {
        console.log(err)
      } else {
        console.log(foundCampground)
        // render show template with  that compground
        res.render('show', {campground: foundCampground})
      }
    })
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