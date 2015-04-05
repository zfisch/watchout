/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

//general settings of game
var settings = {
  w: window.innerWidth,
  h: window.innerHeight,
  r: 15,
  n: 30,
  duration: 1500
};

//defaults
var score = 0;
var highScore = 0;
var collisionCount = 0;
var hero = { x: settings.w/2, y: settings.h/2 };

//helper functions
var pixelize = function(num){ return num + 'px'; };

var randomNumber = function(n){ return Math.floor( Math.random() * n ) ; };
var randomX = function(){ return pixelize( randomNumber(settings.w - settings.r*2) ) ; };
var randomY = function(){ return pixelize( randomNumber(settings.h - settings.r*2) ) ; };

var updateScore = function(){
  d3.select(".high span").text(highScore);
  d3.select(".current span").text(score);
  d3.select(".collisions span").text(collisionCount);
};

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

//Game Board settings
var gameBoard = d3.select('.gameBoard').style({
  height: pixelize(settings.h),
  width: pixelize(settings.w)
});


//hero settings
d3.select('.hero').style({
  top: pixelize(hero.x),
  left: pixelize(hero.y),
  width: pixelize(settings.r),
  height: pixelize(settings.r),
  'border-radius': pixelize(settings.r)
});

//mouse controls
gameBoard.on('mousemove', function(){
  var loc = d3.mouse(this);
  hero = { x: loc[0], y: loc[1] };
  d3.select('.hero').style({
    top: pixelize(hero.y - settings.r/2),
    left: pixelize(hero.x - settings.r/2)
  });
});

//enemy placement and settings
var enemies = d3.selectAll('.enemies')
  .data(d3.range(settings.n))
  .enter().append('div')
  .attr('class', 'enemy')
  .style({
    top: randomY,
    left: randomX,
    width: (pixelize(settings.r*2)),
    height: (pixelize(settings.r*2))
  });

// enemy positioning
var updatePosition = function(obj){
  obj.transition().duration(settings.duration).style({
    top: randomY,
    left: randomX
  }).each('end', function(){
    updatePosition( d3.select(this) );
  });
}

updatePosition(enemies);


//score counter
var scoreTicker = function(){
  score++;
  highScore = Math.max(score, highScore);
  updateScore();
}

setInterval(scoreTicker, 100);

//collision handling
var prevCollision = false;

var detectCollisions = function(){

  var collision = false;

  enemies.each(function(){
    var cx = this.offsetLeft + settings.r;
    var cy = this.offsetTop  + settings.r;
    // the magic of collision detection
    var x = cx - hero.x;
    var y = cy - hero.y;
    if( Math.sqrt(x*x + y*y) < settings.r*2 ){
      collision = true;
    }
  });

  if(collision) {
    score = 0;
    if( prevCollision != collision){
      collisionCount = collisionCount + 1;
    }
  }
  prevCollision = collision;
};

d3.timer(detectCollisions);