var express     = require('express')
    app         = express()
    bodyParser  = require('body-parser')
    mongoose    = require('mongoose')

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
})
var Campground = mongoose.model("Campground", campgroundSchema)

// Campground.create(
//   {
//     name: "Granite Hill", 
//     image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
//   },
//   function (err, campground) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ")
//       console.log(campground)
//     }
//   })



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
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        console.log(err)
      } else {
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