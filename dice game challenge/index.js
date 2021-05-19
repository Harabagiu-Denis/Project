
var randomNumber1 =Math.floor(Math.random() *6 )+1;//am generat un numar random 1-6

var randomDiceImage = "dice" + randomNumber1 + ".png"//am selectat imaginile dice1-dice6

var randomImageSource = "images/" + randomDiceImage;//images/dice1.png- images/dice6.png

var image1 = document.querySelectorAll("img")[0];//am selectat din html primul img tag

image1.setAttribute("src",randomImageSource);//am setat ca imaginea sa se schimbe random functie de imaginile
                                            //pe care le avem in folderul images



var randomNumber2 = Math.floor(Math.random()*6)+1;

var randomImageSource2 = "images/dice"+ randomNumber2 + ".png";

document.querySelectorAll("img")[1].setAttribute("src", randomImageSource2);//am unit ce am scri mai sus in 2 randuri intr un singur rand

//folosindu-ne de if else si de innerHTML am schimbat text ul afisarii in functie de zaruri.
if(randomNumber1>randomNumber2){
  document.querySelector("h1").innerHTML = "Player 1 Wins!";
}else if(randomNumber1<randomNumber2){
  document.querySelector("h1").innerHTML = "Player 2 Wins!";
}else{
  document.querySelector("h1").innerHTML = "Draw";
}

//functie care da refresh la pagina
function refreshPage(){
    window.location.reload();
}
