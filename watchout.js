// start slingin' some d3 here.

//create a board

var size = 800;
var score = 0;
var highScore = 0;
var collisionCounter = 0;

var gameBoard = d3.select('body').append('svg')
  .attr('height', size + "px")
  .attr('width', size + "px");

//generate random number
var randomNumber = function(){
  return Math.floor(Math.random() * Math.floor(size * .80));
};

//define a function for creating enemies
var createEnemies = function(n){
  var x, y, enemy, arrayOfEnemies = [];

  //create enemy objects with unique names and positions
  for(var i = 0; i < n; i++){
    //define starting positions for each enemy
    x = randomNumber();
    y = randomNumber();
    //create enemy object
    enemy = {
      "name": i,
      "x": x,
      "y": y
    };

    //push enemy object to array of enemies
    arrayOfEnemies.push(enemy);
  }
  return arrayOfEnemies;
};

//create enemies
var enemies = createEnemies(10);


var placeEnemies = function(){
  d3.select("svg").selectAll("image").data(enemies)
  .enter()
  .append("svg:image")
  .attr("class", "enemy")
  .attr("xlink:href", "asteroid.png")
  .attr("height", 75)
  .attr("width", 75)
  .attr("x", function(d){return d["x"]})
  .attr("y", function(d){return d["y"]});
};
placeEnemies();

//define a function to make enemies move every second

var updatePositions = function(){
  enemies.forEach(function(enemy){
    var x = randomNumber();
    var y = randomNumber();
    enemy['x'] = x;
    enemy['y'] = y;
  });

   d3.select("svg").selectAll("image").data(enemies)
  .transition()
  .duration(750)
  .attr("x", function(d){return d["x"]})
  .attr("y", function(d){return d["y"]});
};


setInterval(updatePositions, 1000);


//create a movable player
var createHero = function(){
  var hero = [{
    "name": "hero",
    "x": 400,
    "y": 400
  }];
  return hero;
};

var hero = createHero();

//add a hero to the board
var placeHero = function(){
  d3.select("svg").append('image').data(hero)
  .attr("class", "hero")
  .attr("xlink:href", "hero.gif")
  .attr("height", 75)
  .attr("width", 75)
  .attr("x", function(d){return d["x"]})
  .attr("y", function(d){return d["y"]});
};

placeHero();


//move player with mouseover
d3.select("svg").on("mousemove", function() {
  var position = d3.mouse(this);
  var px = position[0]
  var py = position[1]

  hero["x"] = px;
  hero["y"] = py;

   d3.select(".hero").data(hero)
  .attr("x", px)
  .attr("y", py);
});

//implement collision detection
var detectCollision = function(){
 enemies.forEach(function(enemy){
  var diffx = Math.abs(hero["x"] - enemy["x"]);
  var diffy = Math.abs(hero["y"] - enemy["y"]);


  if(diffx < 7 || diffy < 7 ){
  //increment collision counter
    collisionCounter++;
  //reset score
    resetScore();
    console.log(collisionCounter);
  }
 })
};

//increment score
setInterval(function(score){
  detectCollision();
  score++
}, 100);

var resetScore = function(){
  if(score > highScore){
    highScore = score;
  }
  score = 0;
};

//high score






