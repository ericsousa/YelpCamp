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
  image: String
})
var Campground = mongoose.model("Campground", campgroundSchema)

// Campground.create(
//   {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
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

app.get('/campgrounds', function (req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds', {campgrounds: allCampgrounds})
    }
  })
})

app.post('/campgrounds', function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name
  var image = req.body.image
  var newCampground = {name: name, image: image}
  
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

app.get('/campgrounds/new', function (req, res) {
  res.render('new')
})

app.listen('3000', function () {
  console.log('YelpCamp server running')
})


// Notes

// RESTful route: 
//  .get('/section')
//  .post('/section')
//  .get('/section/new')  // form goes here