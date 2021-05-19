const express = require("express");

const bodyParser = require("body-parser");

const date= require(__dirname + "/date.js");

const app = express();

const newItems =["Buy Food","Cook Food","Eat food"];//am lasa
const workItems=[];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  const day = date.getDate();
  res.render('list',{
    listTitle : day,
    newListItems : newItems
  });

});

app.post("/",function(req,res){

  const newItem = req.body.newItem;
    if (req.body.list === "Work"){
      workItems.push(newItem);
      res.redirect("/work")

    }else{
    newItems.push(newItem);
    res.redirect("/");
  }


})

app.get("/work",function(req,res){
  res.render('list',{
    listTitle : "Work List",
    newListItems: workItems
  })
})


app.listen(3000, function() {
  console.log("Server started on port 3000")
})
















// //Metoda 1 pentru data
// var weekDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
// var day = weekDay[currentDay];

// //Metoda 2 pentru data
// var day = "";
// switch (currentDay) {
//   case 0:
//     day = "Sunday"
//     break;
//   case 1:
//     day = "Monday"
//     break;
//   case 2:
//     day = "Tuesday"
//     break;
//   case 3:
//     day = "Wednesday"
//     break;
//   case 4:
//     day = "Thursday"
//     break;
//   case 5:
//     day = "Friday"
//     break;
//   case 6:
//     day = "Saturday"
//     break;
//   default:
//   console.log("Error: current day is equal to:" + currentDay);
//
// }
