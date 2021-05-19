//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _=require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//     Aici ne conectam la baza de date folosing mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
//     Aici construim schema
const itemsSchema = {
  name:String
};
//    Aici construim modelul,colectia
const Item = mongoose.model("Item",itemsSchema);

//aici am construit prime 3 iteme default folosing schema
const item1 = new Item({
  name:"Welcome to your todolist"
});

const item2 = new Item({
  name:"Hit the + button to add a new item"
});
const item3 = new Item({
  name:"<-- Hit this to delete an item"
});
//am pus iteme intr un array
const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items:[itemsSchema]
}

const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {

// aici ne cauta toate itemele din colectia respectiva
Item.find({},function(err,foundItems){
// aici verificam daca avem primele 3 iteme salvate in baza de date si se afiseaza
// pe site-ul nostru iar daca nu se afiseaza le fom afisa noi
  if(foundItems.length ===0){
    Item.insertMany(defaultItem, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Success");
      }
    })
    res.redirect("/");//asa ne intoarcem la home root si afisam obiectele pe care le introducem
  }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
})



});
//    Aceasta functie ne ajuta sa cream noi directoare pentru site-ul nostru
app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
      if (!err){
        if(!foundList){
          const list = new List({
            name: customListName,
            items: defaultItem
          });


          list.save();
          res.redirect("/" + customListName)
        }else{
          res.render("list", {listTitle:foundList.name, newListItems:foundList.items});
        }
      }
    });



});


app.post("/", function(req, res){

  const itemName = req.body.newItem;//aceasta functie cere de la user noul item introdus in lista
  const listName = req.body.list;

  const item = new Item({   //folosindu-ne de model si de itemSchema introducem in baza de date noul obiect
    name : itemName
  });

  if(listName === "Today"){
    item.save();//salveaza noul item
    res.redirect("/");//item-ul salvat il redirectioneaza catre home route pentru a fii postat si pe website
  }else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


});


app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;// req.body.checkbox ne inregistreaza din list.ejs itemele care sunt apasate de catre utilizator
  const listName = req.body.listName;

  if(listName === "Today"){
    //functia de mai jos ne cauta itemul cu id ul respectiv si il sterge
  Item.findByIdAndRemove(checkedItemId,function(err){
    if (!err){
      console.log("Succesfully deleted checked item.");
      res.redirect("/")
    }
  })
}else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
    if(!err){
      res.redirect("/" + listName);
    }
  })
}
});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
