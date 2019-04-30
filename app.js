var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

var campgrounds = [
  {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"},
  {name: "Granite Hill", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg "},
  {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
  {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"},
  {name: "Granite Hill", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg "},
  {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
  {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"},
  {name: "Granite Hill", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg "},
  {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
  {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"},
  {name: "Granite Hill", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg "},
  {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
]

app.get('/', function  (req, res) {
  res.render('landing')
})

app.get('/campgrounds', function (req, res) {
  res.render('campgrounds', {campgrounds: campgrounds})
})

app.post('/campgrounds', function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name
  var image = req.body.image
  var newCampground = {name: name, image: image}
  campgrounds.push(newCampground)

  // redirect back to campgrounds page
  res.redirect('/campgrounds')  // default is to redirect to the .get route
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