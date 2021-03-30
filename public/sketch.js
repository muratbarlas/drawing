//client code - front end

var socket;

var beamSelected = true;
var starSelected = false;

var beamButton, starButton;
function setup() {
  createCanvas(1300, 800);
  background(0);
  slider = createSlider(1, 20, 10, 1);
  slider.position(180, 3);



  //socket = io.connect('http://localhost:3000');
  socket = io.connect('https://drawing-machine.herokuapp.com/');
  
  //handle broadcast calls
  socket.on('laserBeams', newDrawing);
  socket.on('stars', newStar);

  beamButton = select('#beams');
  starButton = select("#stars");

  beamButton.mousePressed(makeBeams);
  starButton.mousePressed(makeStars)
}

function makeBeams(){
  beamSelected = true;
  starSelected=false;
}

function makeStars(){
  beamSelected = false;
  starSelected= true;
}


function newDrawing(data){
  makeLaserBeam(data.x, data.y, data.red,data.green,data.blue, data.val_, data.val2_, data.reverse, data.size_)
 
}

function newStar(starData){
  star(starData.x, starData.y, starData.rad1, starData.rad2, starData.corners, starData.red, starData.green, starData.blue);
}



function mouseDragged(){
  var xM = mouseX;
  var yM= mouseY;
  var r = xM/width * 255;
	var g = yM/height * 255;
  var b = random(200);
  var size = slider.value();
  if (beamSelected == true){
    

    
  
    var val = random(100);
    var val2 = random(100)
    var reverseVal = floor(random(4));
    makeLaserBeam(xM, yM, r, g, b, val, val2, reverseVal, size)
  

    var data ={
      x: xM,
      y: yM,
      reverse: reverseVal,
      red:r,
      green:g,
      blue:b,
      val_:val,
      val2_:val2,
      size_: size

    }
  
    socket.emit('laserBeams', data) ;
  }

  else if(starSelected == true){
    star(xM, yM, 7.5, 22.5, 5, r, g, b);
    var data = {
      x: xM,
      y: yM,
      rad1: 7.5,
      rad2: 22.5,
      corners: 5,
      red: r,
      green: g,
      blue: b
    }
    socket.emit('stars', data) ;
  }
}


function makeLaserBeam(x, y, r,g,b, val, val2, reverseVal, size){
  strokeWeight(size);
	stroke(r, g, b);

	
	if (reverseVal ==0){
		line(x, y, x+val, y+val2);
		
	}
	else if (reverseVal == 1){
		line(x, y, x-val, y-val2);
		
	}
	else if (reverseVal ==2){
		line(x, y, x+val, y-val2);
		
	}
	else if (reverseVal == 3){
		line(x, y, x-val, y+val2);
		
  }
  
  
}


function star(x, y, radius1, radius2, npoints, r, g, b) { //source: https://p5js.org/examples/form-star.html
  fill(r, g, b);
  stroke("white");
  strokeWeight(1);
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}




