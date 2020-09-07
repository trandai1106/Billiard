// set the theme = "Obsidian" pls
var TIME_INTERVAL = 20,
	COLOR_WORD = "#dd8867",
	SIZE_WORD = "60px",
	FONT_WORD = "Comic Sans MS",
	COLOR_SHADOW = "black",
	WIDTH_CANVAS = 840, 
  HEIGHT_CANVAS = 540,
	WIDTH_NOTI = 256, 
  HEIGHT_NOTI = 32,
	COLOR_NOTI = "#dd7755",
	WIDTH_TABLE = 700, 
	HEIGHT_TABLE = 350,
  COLOR_TABLE = "#43b140",
	WIDTH_TABLE_AND_BORDER = 780,
	HEIGHT_TABLE_AND_BORDER = 430,
	COLOR_TABLE_BORDER = "#9d5524",
	WIDTH_SHADOW = 10,
	WIDTH_SHADOW_BORDER = 6,
	WIDTH_STICK = 10,
	HEIGHT_STICK = 80,
	COLOR_STICK = "#fed766",
	RADIUS_BALL = 16.5,
	RADIUS_HOLE_CORNER = 30,
	RADIUS_HOLE_MID = 24,
	COLOR_HOLE = "black",
	DISTANCE_HOLE1 = 4,
	FRICTION = 0.98,// 0.984,
	VELO_MIN = 0.04,
	VELO_MAX = 21,
	// COLOR_LINE = "#035507",
	//COLOR_LINE = "red",
	COLOR_POINT = "yellow";
	NUM_BALL = 10,
	RATE_VELO_FORCE = 5,
	RADIUS_BALL_NOTI = 11,
	SOUND1 = "sound/hit_the_ball.wav",    // hit the ball
	SOUND2 = "sound/ball_collision_ball.wav",		// ball collision ball
	SOUND3 = "sound/ball_collision_table.wav",		// ball collision table
	SOUND4 = "sound/ball_fall_into_hole.wav";		 // ball fall into hole
var key = [];
var point = [],
	line = [],
	ball = [],
	ball_noti = [],
	angle = [],
	isInsideBB = [],
	isExistBallNoti = [];
var pos_mouse1 = {x: 0, y: 0}, 
	pos_mouse2 = {x: 0, y: 0},
	pos_mouse3 = {x: 0, y: 0};
function random(min, max) {
  return (Math.random() * (max - min)) + min;
}
function distancePP(p1, p2) {
  return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));
}
function distancePL(p, l) {
  return Math.abs((p.x - l.p1.x) * (p.y - l.p2.y) - (p.x - l.p2.x) * (p.y - l.p1.y))/distancePP(l.p1, l.p2);
}
function isInAreaOfLine(p, l, r) {
  if (distancePL(p, l) > r) return 0;
  if (((l.x1-l.x2)*(p.x-l.x2)+(l.y1-l.y2)*(p.y-l.y2))*((l.x2-l.x1)*(p.x-l.x1)+(l.y2-l.y1)*(p.y-l.y1)) < 0) return 0;
  return 1;
}
function intersectOfLines(l1, l2) {
	var p = new Point_Type();
	var x1 = l1.p1.x, y1 = l1.p1.y,
	x2 = l1.p2.x, y2 = l1.p2.y,
	x3 = l2.p1.x, y3 = l2.p1.y,
	x4 = l2.p2.x, y4 = l2.p2.y,
	a1 = l1.m0X,
	b1 = l1.m0Y,
	a2 = l2.m0X,
	b2 = l2.m0Y;
	if (a1*b2 - a2*b1 == 0) {
		console.log("error: No intersect");
		// return 0;
		return 0;
	}
	p.y = (a1*a2*(x1 - x3) + a2*b1*y1 - a1*b2*y3)/(a2*b1 - a1*b2);
	if (a1 != 0) p.x = x1 + b1*(y1-p.y)/a1;
	else p.x = x3 + b2*(y3-p.y)/a2;
	// console.log("p1: " + x1 + " " + y1);
	// console.log("p2: " + x2 + " " + y2);
	// console.log("p3: " + x3 + " " + y3);
	// console.log("p4: " + x4 + " " + y4);
	// console.log("p: " + p);
	// console.log("p vs p1, p2: " + (p.x-x1)*(p.x-x2) +" "+ (p.y-y1)*(p.y-y2));
	// console.log("p vs p3, p4: " + (p.x-x3)*(p.x-x4) +" "+ (p.y-y3)*(p.y-y4));
		return p;
}
function intersectOfSegments(l1, l2) {
	var p = new Point_Type();
	var x1 = l1.p1.x, y1 = l1.p1.y,
	x2 = l1.p2.x, y2 = l1.p2.y,
	x3 = l2.p1.x, y3 = l2.p1.y,
	x4 = l2.p2.x, y4 = l2.p2.y,
	a1 = l1.m0X,
	b1 = l1.m0Y,
	a2 = l2.m0X,
	b2 = l2.m0Y;
	if (a1*b2 - a2*b1 == 0) {
		console.log("error: No intersect");
		// return 0;
		return 0;
	}
	p.y = (a1*a2*(x1 - x3) + a2*b1*y1 - a1*b2*y3)/(a2*b1 - a1*b2);
	if (a1 != 0) p.x = x1 + b1*(y1-p.y)/a1;
	else p.x = x3 + b2*(y3-p.y)/a2;
	// console.log("p1: " + x1 + " " + y1);
	// console.log("p2: " + x2 + " " + y2);
	// console.log("p3: " + x3 + " " + y3);
	// console.log("p4: " + x4 + " " + y4);
	// console.log("p: " + p);
	// console.log("p vs p1, p2: " + (p.x-x1)*(p.x-x2) +" "+ (p.y-y1)*(p.y-y2));
	// console.log("p vs p3, p4: " + (p.x-x3)*(p.x-x4) +" "+ (p.y-y3)*(p.y-y4));
	if ((p.x-x1)*(p.x-x2) <= 0.01 && (p.y-y1)*(p.y-y2) <= 0.01)
		if ((p.x-x3)*(p.x-x4) <= 0.01 && (p.y-y3)*(p.y-y4) <= 0.01) {
			// console.log("intersect INSIDE: " + p.x +" "+ p.y);
			// return 1;
			return p;
		}
	// console.log("intersect OUTSIDE: " + p.x +" "+ p.y);
	return 0;
}
function isInAreaOfAngle(p, a, r) {
	if (isInAreaOfLine(p, a.l1, r) == 1 || isInAreaOfLine(p, a.l2, r)) return 1;
	else if (distancePP(p, a.p) < r) return 1;
	return 0;
}
function Sound_Type(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(vol){
		this.sound.volume = vol;
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}    
}
function Rectangle_Type(p, w, h, color) {
  // this.properties = 
  this.x = p.x;
  this.y = p.y;
  this.w = w;
  this.h = h;
  this.color = color;
  // draw component in the canvas
  this.draw = function () {
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
function Circle_Type(p, r, color) {
  // this.properties = 
  this.x = p.x;
  this.y = p.y;
  this.r = r;
  this.color = color;
  // draw component in the canvas
  this.draw = function () {
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}
function Ball_Type(p, r, color) {
  // this.properties = 
  this.x = p.x;
  this.y = p.y;
  this.r = r;
	this.color = color;
  this.vX = 0;
  this.vY = 0;
  this.isMoving = 0;
  this.isExist = 1;
	// console.log("hihihi");
  // draw component in the canvas
  this.draw = function () {
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}
function Point_Type(_x, _y) {
	this.x = _x;
	this.y = _y;
	this.draw = function () {
		var ctx = myGameArea.context;
		ctx.beginPath();
		ctx.fillStyle = COLOR_POINT;
    ctx.fillRect(this.x, this.y, 1, 1);
	}
}
function Line_Type(_p1, _p2) { // point1, point2
	this.p1 = _p1;
	this.p2 = _p2;
  this.x1 = _p1.x;	
  this.y1 = _p1.y;
  this.x2 = _p2.x;
  this.y2 = _p2.y;
  var mX = _p1.y - _p2.y,
		mY = _p2.x - _p1.x,
		m = Math.sqrt(mX*mX + mY*mY);
  this.m0X = mX/m;
  this.m0Y = mY/m;
	this.n0X = this.m0Y;
	this.n0Y = -this.m0X;
  this.draw = function () {
		var ctx = myGameArea.context;
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.strokeStyle = COLOR_LINE;
		ctx.stroke();
  }
}
function Angle_Type(_l1, _l2) {
	this.l1 = _l1;
	this.l2 = _l2;
	if (_l1.p1 == _l2.p1 || _l1.p1 == _l2.p2) this.p = _l1.p1;
	// else if (_l1.p2 != _l2.p1 || _l1.p2 != _l2.p2) console.log("error: two lines don't have same point");
	else this.p = _l1.p2;
	this.l1_coll = new Line_Type(new Point_Type(_l1.p1.x - _l1.m0X*RADIUS_BALL, _l1.p1.y - _l1.m0Y*RADIUS_BALL),
															 new Point_Type(_l1.p2.x - _l1.m0X*RADIUS_BALL, _l1.p2.y - _l1.m0Y*RADIUS_BALL));
	this.l2_coll = new Line_Type(new Point_Type(_l2.p1.x - _l2.m0X*RADIUS_BALL, _l2.p1.y - _l2.m0Y*RADIUS_BALL),
															 new Point_Type(_l2.p2.x - _l2.m0X*RADIUS_BALL, _l2.p2.y - _l2.m0Y*RADIUS_BALL));
	this.s1_coll = new Line_Type(new Point_Type(_l1.p2.x - _l1.m0X*RADIUS_BALL, _l1.p2.y - _l1.m0Y*RADIUS_BALL),
															 intersectOfLines(this.l1_coll, this.l2_coll));		 
	this.s2_coll = new Line_Type(new Point_Type(_l2.p1.x - _l2.m0X*RADIUS_BALL, _l2.p1.y - _l2.m0Y*RADIUS_BALL),
															 intersectOfLines(this.l1_coll, this.l2_coll));		 
	this.m0X = (this.l1.m0X + this.l2.m0X)/2;
	this.m0Y = (this.l1.m0Y + this.l2.m0Y)/2;
	this.n0X = this.m0Y;
	this.n0Y = -this.m0X;
}
function hitBall(mouseEvent) {
  var obj = document.getElementById("canvas");
  var obj_left = 0;
  var obj_top = 0;
  var pos = {x: 0, y: 0};
  while (obj.offsetParent)
  {
    obj_left += obj.offsetLeft;
    obj_top += obj.offsetTop;
    obj = obj.offsetParent;
  } 
  pos.x = mouseEvent.pageX;
  pos.y = mouseEvent.pageY;
  pos.x -= obj_left;
  pos.y -= obj_top;
  // console.log(pos);
  if (mouseEvent.type == "mousedown") { // console.log("mousedown");
		document.getElementById("canvas").removeEventListener("mousedown",hitBall);
		pos_mouse1.x = pos.x;
		pos_mouse1.y = pos.y;
		document.getElementById("canvas").addEventListener("mouseup", hitBall);
		document.getElementById("canvas").addEventListener("mousemove", hitBall);
  }
  if (mouseEvent.type == "mouseup") {	
    document.getElementById("canvas").removeEventListener("mouseup", hitBall);
		document.getElementById("canvas").removeEventListener("mousemove", hitBall);
		pos_mouse2.x = pos.x;
		pos_mouse2.y = pos.y;
		// console.log("mouseup");
		ball[0].vX = (pos_mouse1.x - pos_mouse2.x) * RATE_VELO_FORCE;
    ball[0].vY = (pos_mouse1.y - pos_mouse2.y) * RATE_VELO_FORCE;
    if (ball[0].vX != 0 || ball[0].vY != 0) {
			sound1.play(1);
			myGameArea.interval = setInterval(updateGameArea, TIME_INTERVAL);
		}
		else newTurn(); 
  }
  if (mouseEvent.type == "mousemove") {
		pos_mouse3.x = pos.x;
		pos_mouse3.y = pos.y;
		myGameArea.clear();
    drawTable();
    drawBalls();
    drawNoti();
    drawVelo();
		// for (var i = 0; i <12; ++i){angle[i].l1_coll.draw();angle[i].l2_coll.draw();}
	// console.log("mousemove");
  }
}	
function startGame() {
  myGameArea.start();
  creatBall();
  creatTable();
	createAngle();
  creatNoti();
	creatSound();
  // console.log("startGame()");
}
function creatSound() {
	sound1 = new Sound_Type(SOUND1);
	sound2 = new Sound_Type(SOUND2);
	sound3 = new Sound_Type(SOUND3);
	sound4 = new Sound_Type(SOUND4);
}
function creatBall() {
  for (var i = 0; i < NUM_BALL - 1; i++) {
		isInsideBB[i] = [];
		for (var j = i + 1; j < NUM_BALL; j++) {
			isInsideBB[i][j] = 0;
		}
  }
  ball[0] = new Ball_Type(new Point_Type(132, 370), RADIUS_BALL, "white");
	// 	console.log(ball[0]);
  ball[1] = new Ball_Type(new Point_Type(220, 360), RADIUS_BALL, "#edc951");
  ball[2] = new Ball_Type(new Point_Type(350, 400), RADIUS_BALL, "blue");
  ball[3] = new Ball_Type(new Point_Type(250, 250), RADIUS_BALL, "red");
  ball[4] = new Ball_Type(new Point_Type(300, 300), RADIUS_BALL, "purple");
  ball[5] = new Ball_Type(new Point_Type(325, 350), RADIUS_BALL, "orange");
  ball[6] = new Ball_Type(new Point_Type(425, 200), RADIUS_BALL, "green");
  ball[7] = new Ball_Type(new Point_Type(275, 200), RADIUS_BALL, "#951e3e");
  ball[8] = new Ball_Type(new Point_Type(225, 200), RADIUS_BALL, "black");
  ball[9] = new Ball_Type(new Point_Type(375, 200), RADIUS_BALL, "yellow");
  // console.log("creatBall()");
}
function creatHole() {
  hole = {};
  hole[0] = new Circle_Type(new Point_Type(table.x, table.y), RADIUS_HOLE_CORNER, COLOR_HOLE);
  hole[1] = new Circle_Type(new Point_Type(table.x + table.w/2, table.y - DISTANCE_HOLE1), RADIUS_HOLE_MID, COLOR_HOLE);
  hole[2] = new Circle_Type(new Point_Type(table.x + table.w, table.y), RADIUS_HOLE_CORNER, COLOR_HOLE);
  hole[3] = new Circle_Type(new Point_Type(table.x, table.y + table.h), RADIUS_HOLE_CORNER, COLOR_HOLE);
  hole[4] = new Circle_Type(new Point_Type(table.x + table.w/2, table.y + table.h + DISTANCE_HOLE1), RADIUS_HOLE_MID, COLOR_HOLE);
  hole[5] = new Circle_Type(new Point_Type(table.x + table.w, table.y + table.h), RADIUS_HOLE_CORNER, COLOR_HOLE);
}
function creatPoint() {
	point[0] = new Point_Type(table.x + RADIUS_HOLE_CORNER, table.y);
	point[1] = new Point_Type(table.x + RADIUS_HOLE_CORNER + WIDTH_SHADOW, table.y + WIDTH_SHADOW);
	point[2] = new Point_Type(table.x + table.w/2 - 24 - WIDTH_SHADOW/2, table.y + WIDTH_SHADOW);
	point[3] = new Point_Type(table.x + table.w/2 - 24, table.y);
	point[4] = new Point_Type(table.x + table.w - RADIUS_HOLE_CORNER, table.y);
	point[5] = new Point_Type(table.x + table.w - RADIUS_HOLE_CORNER - WIDTH_SHADOW, table.y + WIDTH_SHADOW);
	point[6] = new Point_Type(table.x + table.w/2 + 24 + WIDTH_SHADOW/2, table.y + WIDTH_SHADOW);
	point[7] = new Point_Type(table.x + table.w/2 + 24, table.y);
	point[8] = new Point_Type(table.x + RADIUS_HOLE_CORNER, table.y + table.h);
	point[9] = new Point_Type(table.x + RADIUS_HOLE_CORNER + WIDTH_SHADOW, table.y + table.h - WIDTH_SHADOW);
	point[10] = new Point_Type(table.x + table.w/2 - 24 - WIDTH_SHADOW/2, table.y + table.h - WIDTH_SHADOW);
	point[11] = new Point_Type(table.x + table.w/2 - 24, table.y + table.h);
	point[12] = new Point_Type(table.x + table.w - RADIUS_HOLE_CORNER, table.y + table.h);
	point[13] = new Point_Type(table.x + table.w - RADIUS_HOLE_CORNER - WIDTH_SHADOW, table.y + table.h - WIDTH_SHADOW);
	point[14] = new Point_Type(table.x + table.w/2 + 24 + WIDTH_SHADOW/2, table.y + table.h - WIDTH_SHADOW);
	point[15] = new Point_Type(table.x + table.w/2 + 24, table.y + table.h);
	point[16] = new Point_Type(table.x, table.y + RADIUS_HOLE_CORNER);
	point[17] = new Point_Type(table.x + WIDTH_SHADOW, table.y + RADIUS_HOLE_CORNER + WIDTH_SHADOW);
	point[18] = new Point_Type(table.x + WIDTH_SHADOW, table.y + table.h - RADIUS_HOLE_CORNER - WIDTH_SHADOW);
	point[19] = new Point_Type(table.x, table.y + table.h - RADIUS_HOLE_CORNER);
	point[20] = new Point_Type(table.x + table.w, table.y + RADIUS_HOLE_CORNER);
	point[21] = new Point_Type(table.x + table.w - WIDTH_SHADOW, table.y + RADIUS_HOLE_CORNER + WIDTH_SHADOW);
	point[22] = new Point_Type(table.x + table.w - WIDTH_SHADOW, table.y + table.h - RADIUS_HOLE_CORNER - WIDTH_SHADOW);
	point[23] = new Point_Type(table.x + table.w, table.y + table.h - RADIUS_HOLE_CORNER);
	
}
function creatLine() {
  line[0] = new Line_Type(point[0], point[1]);
  if (line[0].m0Y > 0) {
		line[0].m0X = -line[0].m0X;
		line[0].m0Y = -line[0].m0Y;
  }
  line[1] = new Line_Type(point[1], point[2]);
  if (line[1].m0Y > 0) {
		line[1].m0X = -line[1].m0X;
		line[1].m0Y = -line[1].m0Y;
  }				  
  line[2] = new Line_Type(point[2], point[3]);
  if (line[2].m0Y > 0) {
		line[2].m0X = -line[2].m0X;
		line[2].m0Y = -line[2].m0Y;
  }					  
  line[3] = new Line_Type(point[4], point[5]);
  if (line[3].m0Y > 0) {
		line[3].m0X = -line[3].m0X;
		line[3].m0Y = -line[3].m0Y;
  }					  
  line[4] = new Line_Type(point[5], point[6]);
  if (line[4].m0Y > 0) {
		line[4].m0X = -line[4].m0X;
		line[4].m0Y = -line[4].m0Y;
  }					  
  line[5] = new Line_Type(point[6], point[7]);
  if (line[5].m0Y > 0) {
		line[5].m0X = -line[5].m0X;
		line[5].m0Y = -line[5].m0Y;
  }					  
  line[6] = new Line_Type(point[8], point[9]);
  if (line[6].m0Y < 0) {
		line[6].m0X = -line[6].m0X;
		line[6].m0Y = -line[6].m0Y;
  }					  
  line[7] = new Line_Type(point[9], point[10]);
  if (line[7].m0Y < 0) {
		line[7].m0X = -line[7].m0X;
		line[7].m0Y = -line[7].m0Y;
  }					  
  line[8] = new Line_Type(point[10], point[11]);
  if (line[8].m0Y < 0) {
		line[8].m0X = -line[8].m0X;
		line[8].m0Y = -line[8].m0Y;
  }					  
  line[9] = new Line_Type(point[12], point[13]);
  if (line[9].m0Y < 0) {
		line[9].m0X = -line[9].m0X;
		line[9].m0Y = -line[9].m0Y;
  }					  
  line[10] = new Line_Type(point[13], point[14]);
  if (line[10].m0Y < 0) {
		line[10].m0X = -line[10].m0X;
		line[10].m0Y = -line[10].m0Y;
  }						   
  line[11] = new Line_Type(point[14], point[15]);
  if (line[11].m0Y < 0) {
		line[11].m0X = -line[11].m0X;
		line[11].m0Y = -line[11].m0Y;
  }						   
  line[12] = new Line_Type(point[16], point[17]);
  if (line[12].m0X > 0) {
		line[12].m0X = -line[12].m0X;
		line[12].m0Y = -line[12].m0Y;
  }						   
  line[13] = new Line_Type(point[17], point[18]);
  if (line[13].m0X > 0) {
		line[13].m0X = -line[13].m0X;
		line[13].m0Y = -line[13].m0Y;
  }						   
  line[14] = new Line_Type(point[18], point[19]);
  if (line[14].m0X > 0) {
		line[14].m0X = -line[14].m0X;
		line[14].m0Y = -line[14].m0Y;
  }						   
  line[15] = new Line_Type(point[20], point[21]);
  if (line[15].m0X < 0) {
		line[15].m0X = -line[15].m0X;
		line[15].m0Y = -line[15].m0Y;
  }	
  line[16] = new Line_Type(point[21], point[22]);
  if (line[16].m0X < 0) {
		line[16].m0X = -line[16].m0X;
		line[16].m0Y = -line[16].m0Y;
  }						   
  line[17] = new Line_Type(point[22], point[23]);	
  if (line[17].m0X < 0) {
		line[17].m0X = -line[17].m0X;
		line[17].m0Y = -line[17].m0Y;
  }						   
}
function createAngle() {
	angle[0] = new Angle_Type(line[0], line[1]);
	angle[1] = new Angle_Type(line[1], line[2]);
	angle[2] = new Angle_Type(line[3], line[4]);
	angle[3] = new Angle_Type(line[4], line[5]);
	angle[4] = new Angle_Type(line[6], line[7]);
	angle[5] = new Angle_Type(line[7], line[8]);
	angle[6] = new Angle_Type(line[9], line[10]);
	angle[7] = new Angle_Type(line[10], line[11]);
	angle[8] = new Angle_Type(line[12], line[13]);
	angle[9] = new Angle_Type(line[13], line[14]);
	angle[10] = new Angle_Type(line[15], line[16]);
	angle[11] = new Angle_Type(line[16], line[17]);
}
function creatTable(){
  table_border = new Rectangle_Type(new Point_Type((WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2,
															 (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2),
															 WIDTH_TABLE_AND_BORDER, HEIGHT_TABLE_AND_BORDER,
															 COLOR_TABLE_BORDER);
  table = new Rectangle_Type(new Point_Type((WIDTH_CANVAS - WIDTH_TABLE)/2,
												(HEIGHT_CANVAS - HEIGHT_TABLE)/2),
												WIDTH_TABLE, HEIGHT_TABLE,
												COLOR_TABLE);
	creatPoint();
  creatLine();					
  creatHole();
}
function creatNoti(){
	for (var i = 0; i < NUM_BALL; ++i) {
		isExistBallNoti[i] = 1;
	}
  noti = new Rectangle_Type(new Point_Type((WIDTH_CANVAS - WIDTH_NOTI)/2,
											 HEIGHT_CANVAS*3/4 + HEIGHT_TABLE_AND_BORDER/4 - HEIGHT_NOTI/2),
											 WIDTH_NOTI, HEIGHT_NOTI,
											 COLOR_NOTI);
  noti_left = new Circle_Type(new Point_Type(noti.x, noti.y + noti.h/2), noti.h/2, noti.color);
  noti_right = new Circle_Type(new Point_Type(noti.x + noti.w, noti.y + noti.h/2), noti.h/2, noti.color);
  ball_noti[0] = new Circle_Type(new Point_Type(0, 0), RADIUS_BALL_NOTI, "white");
  ball_noti[1] = new Circle_Type(new Point_Type(noti.x, noti.y + noti.h/2), RADIUS_BALL_NOTI, "#edc951");
  ball_noti[2] = new Circle_Type(new Point_Type(noti.x + noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "blue");
  ball_noti[3] = new Circle_Type(new Point_Type(noti.x + 2 * noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "red");
  ball_noti[4] = new Circle_Type(new Point_Type(noti.x + 3 * noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "purple");
  ball_noti[5] = new Circle_Type(new Point_Type(noti.x + 4 * noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "orange");
  ball_noti[6] = new Circle_Type(new Point_Type(noti.x + 5 * noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "green");
  ball_noti[7] = new Circle_Type(new Point_Type(noti.x + 6 * noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "#951e3e");
  ball_noti[8] = new Circle_Type(new Point_Type(noti.x + 7 * noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "black");
  ball_noti[9] = new Circle_Type(new Point_Type(noti.x + 8 * noti.h, noti.y + noti.h/2), RADIUS_BALL_NOTI, "yellow");
}
var myGameArea = {
  // create the canvas
  canvas : document.createElement("canvas"),
  
  // specify the canvas
  start : function () {
	this.canvas.id = "canvas";
    this.canvas.width = WIDTH_CANVAS;
    this.canvas.height = HEIGHT_CANVAS;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, TIME_INTERVAL);
    window.addEventListener('keydown', function (e) {
    key[e.keyCode] = true;
    })
    window.addEventListener('keyup', function (e) {
      key[e.keyCode] = false;
    })			
  },
  // clear the canvas
  clear : function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //console.log("clear()");
  } 
}
function newStatus() { 
  // ball moving
  for (var i = 0; i < NUM_BALL; i++) {
		// console.log(i);
		if (ball[i].isExist == 1) {
			if (ball[i].isMoving == 0 && (ball[i].vX != 0 || ball[i].vY != 0)) ball[i].isMoving = 1;
			if (ball[i].isMoving == 1) {
				var velo = Math.sqrt(Math.pow(ball[i].vX, 2) + Math.pow(ball[i].vY, 2));
				if (velo > VELO_MAX) {
					ball[i].vX *= VELO_MAX/velo;
					ball[i].vY *= VELO_MAX/velo;
				}
			}
			// if (i == 0) {console.log("Velo: " + ball[0].vX + ", " + ball[0].vY);}
			ball[i].x += ball[i].vX;
			ball[i].y += ball[i].vY;
			if (ball[i].vX <= VELO_MIN && ball[i].vX >= -VELO_MIN) ball[i].vX = 0;
			else ball[i].vX *= FRICTION;
			if (ball[i].vY <= VELO_MIN && ball[i].vY >= -VELO_MIN) ball[i].vY = 0;
			else ball[i].vY *= FRICTION;
			if (ball[i].vX == 0 && ball[i].vY == 0) ball[i].isMoving = 0;
			// console.log("ball[" + i + "isMoving");
		}
  }
  
  // check new turn
  var isBallsStop = 1;
  for (var i = 0; i < NUM_BALL; i++) {
		if (ball[i].isExist == 1 && ball[i].isMoving == 1) {
				isBallsStop = 0;
			break;
		}
  }
  if (isBallsStop == 1) {
		clearInterval(myGameArea.interval); // delete statement setInterval 
		setTimeout(newTurn, 1000);
  }
  
   // console.log("newStatus()");
}
function newTurn() {
  // check end game
  for (var i = 0; i < NUM_BALL; i++) {
		isExistBallNoti[i] = ball[i].isExist;
  }

  if (ball[0].isExist == 0) { 
    gameOver(0);
		return;
  } 
	var check;
	for (check = 1; check < NUM_BALL; ++check) {
		if (ball[check].isExist == 1) {
			break;
		}
  }
	if (check == NUM_BALL) {
		gameOver(1);
		return;
	}
  // console.log("newTurn()");
  var ctxEndGame = myGameArea.context;
  ctxEndGame.font = SIZE_WORD + " " + FONT_WORD;
  ctxEndGame.fillStyle = COLOR_WORD;
  ctxEndGame.fillText("New turn", 280, 55);
  // update Noti
  
  drawNoti();
  // set new velocity for ball[0]
  pos_mouse1.x = 0;
  pos_mouse2.x = 0;
  pos_mouse1.y = 0;
  pos_mouse2.y = 0;
  document.getElementById("canvas").addEventListener("mousedown",hitBall);
  // console.log(" pos1 " + pos_mouse1);
  // console.log(" pos2 " + pos_mouse2);

}
function checkCollision() {
  // console.log("checkCollision()");
  // ball - ball
  for (var i = 0; i < NUM_BALL - 1; i++) {
		if (ball[i].isExist != 1) continue;
		for (var j = i + 1; j < NUM_BALL; j++) {
			if (ball[j].isExist != 1) continue
			if (ball[i].isMoving == 1 || ball[j].isMoving == 1) {
				// console.log("hahoo");
				if (distancePP(new Point_Type(ball[i].x, ball[i].y), new Point_Type(ball[j].x, ball[j].y)) <= 2 * RADIUS_BALL && isInsideBB[i][j] == 0) {
					// console.log("distancePP <= " + i + " " + j + ": " + distancePP(new Point_Type(ball[i].x, ball[i].y), new Point_Type(ball[j].x, ball[j].y)));
					// console.log("isInsideBB <= " + i + "," + j + " : " + isInsideBB[i][j]);
					isInsideBB[i][j] = 1;
					collisionBB(i, j);
				}
				if (distancePP(new Point_Type(ball[i].x, ball[i].y), new Point_Type(ball[j].x, ball[j].y)) > 2 * RADIUS_BALL) {
					isInsideBB[i][j] = 0;
					// console.log("distancePP > " + i + " " + j + ": " + distancePP(new Point_Type(ball[i].x, ball[i].y), new Point_Type(ball[j].x, ball[j].y)));
				}
			}
		}
  }
  // ball - line
  for (var id_ball = 0; id_ball < NUM_BALL; id_ball++) { // ball
		if (ball[id_ball].isExist == 1 && ball[id_ball].isMoving == 1) {  
			for (var id_angle = 0; id_angle < 12; id_angle++) { // angle
				if (ball[id_ball].vX * angle[id_angle].m0X + ball[id_ball].vY * angle[id_angle].m0Y > 0) { // ball comes closer to angle
					if (isInAreaOfAngle(new Point_Type(ball[id_ball].x,ball[id_ball].y), angle[id_angle], RADIUS_BALL) == 1)
					{
						// console.log("check ball " + id_ball + " - angle " + id_angle);
						collisionBA(id_ball, id_angle);
					}
				}
				
			}
		}
  }
  // ball - hole
  for (var i = 0; i < NUM_BALL; i++) {
		if (ball[i].isExist == 1 && ball[i].isMoving == 1) {
			for (var j = 0; j < 6; j++) {
				if (distancePP(new Point_Type(ball[i].x, ball[i].y), new Point_Type(hole[j].x, hole[j].y)) <= hole[j].r){
				collisionBH(i, j);
				}
			}
		}
  }
}
function collisionBB(id_ball1, id_ball2) { 
	var	x1 = ball[id_ball1].x,
		y1 = ball[id_ball1].y,
		x2 = ball[id_ball2].x,
		y2 = ball[id_ball2].y,
		vX1 = ball[id_ball1].vX,
		vY1 = ball[id_ball1].vY,
		vX2 = ball[id_ball2].vX,
		vY2 = ball[id_ball2].vY;
  sound2.play(Math.sqrt(Math.pow(vX1 - vX2,2) + Math.pow(vY1 - vY2,2))/2/VELO_MAX);
  // console.log("B1: " + x1 + ", " + y1);
  // console.log("B2: " + x2 + ", " + y2);
  // console.log("v1: " + vX1 + ", " + vY1);
  // console.log("v2: " + vX2 + ", " + vY2);
	// back last position
	vX1 /= FRICTION;
	vY1 /= FRICTION;
	vX2 /= FRICTION;
	vY2 /= FRICTION;
	x1 -= vX1;
	y1 -= vY1;
	x2 -= vX2;
	y2 -= vY2;
	vX1_copy = vX1;
	vY1_copy = vY1;
	vX1 -= vX2;
	vY1 -= vY2;
	var dpp = distancePP(new Point_Type(x2, y2), new Point_Type(x1, y1)),
		dpl = distancePL(new Point_Type(x2, y2), new Line_Type(new Point_Type(x1, y1), new Point_Type(x1 + vX1, y1 + vY1)));
	var s = Math.sqrt(dpp*dpp - dpl*dpl) - Math.sqrt(4*RADIUS_BALL*RADIUS_BALL - dpl*dpl);
	var rate = s / Math.sqrt(vX1*vX1 + vY1*vY1);
	vX1 = vX1_copy;
	vY1 = vY1_copy;
	x1 += vX1 * rate;
	y1 += vY1 * rate;
	x2 += vX2 * rate;
	y2 += vY2 * rate;
  var m0X = y2 - y1,
	  m0Y = x1 - x2;
  var m = Math.sqrt(m0X*m0X + m0Y*m0Y);
		m0X /= m;
		m0Y /= m;
	var	n0X = m0Y,
		n0Y = -m0X;
	// console.log("n:" + m0X + "," + m0Y);
  // console.log("m:" + n0X + "," + n0Y);
  var k1 = vX1 * m0X + vY1 * m0Y, // k doesnt change; k with m
	  t1 = vX1 * n0X + vY1 * n0Y, // t changes; t with n
	  k2 = vX2 * m0X + vY2 * m0Y,
	  t2 = vX2 * n0X + vY2 * n0Y;
  // console.log("v1:" + vX1 + "," + vY1);
  // console.log("v2:" + vX2 + "," + vY2);
  // console.log("k1:" + k1 + ", t1:" + t1);
  // console.log("k2:" + k2 + ", t2:" + t2);
  // collison: k doesnt change; t exchanges: t1' = t2; t2' = t1
  var temp = t1;
  t1 = t2;
  t2 = temp;
	ball[id_ball1].x = x1;
	ball[id_ball1].y = y1;
	ball[id_ball2].x = x2;
	ball[id_ball2].y = y2;
  ball[id_ball1].vX = k1 * m0X + t1 * n0X;
  ball[id_ball1].vY = k1 * m0Y + t1 * n0Y;
  ball[id_ball2].vX = k2 * m0X + t2 * n0X;
  ball[id_ball2].vY = k2 * m0Y + t2 * n0Y;
  // console.log("collisionBB: " + id_ball1 + " " + id_ball2);
}
function collisionBL(id_ball, l) {
	// console.log("collisionBl");
	var	x = ball[id_ball].x,
		y = ball[id_ball].y,
		vX = ball[id_ball].vX,
		vY = ball[id_ball].vY;
	sound3.play(Math.sqrt(vX*vX + vY*vY)/VELO_MAX);
  // ball - line
	// if (id_ball == 0) {
		// console.log("collision: B" + id_ball + " - L" + l);
		// console.log("x: " + x + ", y: " + y);
		// console.log("distancePL: " + distancePL(new Point_Type(x, y), line[l]));
		// console.log("vX: " + vX + ", vY: " + vY);
		// console.log("");
	// }
	// set correct position for ball
	// 1. back to the last position of ball
	x -= vX;
	y -= vY;

	// if (id_ball == 0) {
		// console.log("back last position:");
		// console.log("x: " + x + ", y: " + y);
		// console.log("distancePL: " + distancePL(new Point_Type(x, y), line[l]));
		// console.log("vX: " + vX + ", vY: " + vY);
		// console.log("");
	// }
	// 2. Find H - projection of ball[id_ball]
	var distn = distancePL(new Point_Type(x, y), l);
	var xH = x + l.m0X * distn,
		yH = y + l.m0Y * distn;
	// 3. Set position of ball[id_ball]
	x += vX*(distn - RADIUS_BALL)/(Math.abs(l.m0X*vX + l.m0Y*vY));
	y += vY*(distn - RADIUS_BALL)/(Math.abs(l.m0X*vX + l.m0Y*vY));
	var k = vX * l.n0X + vY * l.n0Y, // k doesnt change; k with n
			t = vX * l.m0X + vY * l.m0Y; // t changes; t with m
	t = -t;
	vX = k * l.n0X + t * l.m0X;
	vY = k * l.n0Y + t * l.m0Y;
	// if (id_ball == 2) {
		// console.log("after change:");
		// console.log("x: " + x + ", y: " + y);
		// console.log("distancePL: " + distancePL(new Point_Type(x, y), line[l]));
		// console.log("vX: " + vX + ", vY: " + vY);
	// }
	ball[id_ball].x = x;
	ball[id_ball].y = y,
	ball[id_ball].vX = vX,
	ball[id_ball].vY = vY;
}
function collisionBP(id_ball, id_angle) { // ball - point of angle
		var x = ball[id_ball].x,
		y = ball[id_ball].y,
		vX = ball[id_ball].vX,
		vY = ball[id_ball].vY,
		xA = angle[id_angle].p.x,
		yA = angle[id_angle].p.y;
	sound3.play(Math.sqrt(vX*vX + vY*vY)/VELO_MAX);
	// if ()
	// ball - angle
	// if (id_ball == 0) {
		// console.log("collision: B" + id_ball + " - A" + id_angle);
		// console.log("x: " + x + ", y: " + y);
		// console.log("vX: " + vX + ", vY: " + vY);
	// }
	// set correct position for ball
	// 1. the last position of ball
	var last_pos = new Point_Type(x - vX, y - vY);
	// if (id_ball == 0) {
		// console.log("last position:");
		// console.log("x: " + last_pos.x + ", y: " + last_pos.y);
		// console.log("vX: " + vX + ", vY: " + vY);
	// }
	var new_pos;
	if (intersectOfSegments(new Line_Type(last_pos, new Point_Type(x, y)), angle[id_angle].s1_coll))
		new_pos = intersectOfSegments(new Line_Type(last_pos, new Point_Type(x, y)), angle[id_angle].s1_coll);
	else
		new_pos = intersectOfSegments(new Line_Type(last_pos, new Point_Type(x, y)), angle[id_angle].s2_coll);
	var n0X = angle[id_angle].n0X,
		n0Y = angle[id_angle].n0Y,
		m0X = angle[id_angle].m0X,
		m0Y = angle[id_angle].m0Y;
	var k = (vX * n0X + vY * n0Y), // k doesnt change; k with n
			t = (vX * m0X + vY * m0Y); // t changes; t with m
	t = -t;
	ball[id_ball].vX = k * n0X + t * m0X;
	ball[id_ball].vY = k * n0Y + t * m0Y;
	// if (id_ball == 0) {
		// console.log("after change:");
		// console.log("x: " + ball[id_ball].x + ", y: " + ball[id_ball].y);
		// console.log("vX: " + ball[id_ball].vY + ", vY: " + ball[id_ball].vY);
	// }
}
function collisionBH(id_ball, id_hole) {
	sound4.play(1);
  ball[id_ball].isExist = 0;
	ball[id_ball].isMoving = 0;
}
function collisionBA(id_ball, id_angle) { // ball - angle:{line1, point, line2}
	// console.log("collision: B" + id_ball + " - A" + id_angle);
	var last_pos = new Point_Type(ball[id_ball].x - ball[id_ball].vX, ball[id_ball].y - ball[id_ball].vY);
	var l1 = angle[id_angle].l1
	if (intersectOfSegments(new Line_Type(ball[id_ball], last_pos),angle[id_angle].l1_coll)
	    && angle[id_angle].l1.m0X * ball[id_ball].vX + angle[id_angle].l1.m0Y * ball[id_ball].vY > 0) {
		collisionBL(id_ball, angle[id_angle].l1);
	  // console.log("hi1");
	}
	else if (intersectOfSegments(new Line_Type(ball[id_ball], last_pos), angle[id_angle].l2_coll)
					 && angle[id_angle].l2.m0X * ball[id_ball].vX + angle[id_angle].l2.m0Y * ball[id_ball].vY > 0) {
		collisionBL(id_ball, angle[id_angle].l2);
		// console.log("hi2");
	}
	else {
		collisionBP(id_ball, id_angle);
		// console.log("hi3");
	}
}
function drawLinearGradient(direct,x1, y1, x2, y2, color1, color2) {
  var ctx = myGameArea.context;
  var grd;
  // draw shadow 
  if (direct == "h")
		grd = ctx.createLinearGradient(0, y1, 0, y2);
  else 
		grd = ctx.createLinearGradient(x1, 0, x2, 0);
  grd.addColorStop(0, color1);
  grd.addColorStop(1, color2);
  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
}
function drawRadialGradient(x, y, w, h, r1, r2, color1, color2) {
  var ctx = myGameArea.context;
  var grd = ctx.createRadialGradient(x + w/2, y + h/2, r1, x + w/2, y + h/2, r2);
  grd.addColorStop(0, color1);
  grd.addColorStop(1, color2);
  ctx.fillStyle = grd;
  ctx.fillRect(x, y, w, h);
}
function drawRotatedRect(x, y, w, h, degrees, color) { 
  var ctx = myGameArea.context;
  // first save the untranslated/unrotated context
  ctx.save();
  ctx.beginPath();
  // move the rotation point to the center of the rect
  ctx.translate(x, y);
  // rotate the rect
  ctx.rotate(degrees * Math.PI/180);
  // draw the rect on the transformed context
  // Note: after transforming [0,0] is visually [x,y]
  //       so the rect needs to be offset accordingly when drawn
  ctx.rect(0, -h/2, w, h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
  // restore the context to its untranslated/unrotated state
  }
function drawTable() {
  // draw table and border
  drawRadialGradient(table_border.x, table_border.y, table_border.w, table_border.h, 
										 300, 800, COLOR_TABLE_BORDER, "grey");
  table.draw();
  // draw shadow
  var ctx = myGameArea.context;
  var grd;
  // draw shadow at the top of table
  drawLinearGradient("h", (WIDTH_CANVAS - WIDTH_TABLE)/2, (HEIGHT_CANVAS - HEIGHT_TABLE)/2,
										 (WIDTH_CANVAS - WIDTH_TABLE)/2 + WIDTH_TABLE, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE)/2 + WIDTH_SHADOW,
										 COLOR_SHADOW, "#038420");
  // draw shadow at the bottom of table
  drawLinearGradient("h", (WIDTH_CANVAS - WIDTH_TABLE)/2 + WIDTH_TABLE, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE)/2 + HEIGHT_TABLE,
										 (WIDTH_CANVAS - WIDTH_TABLE)/2, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE)/2 + HEIGHT_TABLE - WIDTH_SHADOW,
										 COLOR_SHADOW, "#038420");
  // draw shadow at the left of table
  drawLinearGradient("v", (WIDTH_CANVAS - WIDTH_TABLE)/2, (HEIGHT_CANVAS - HEIGHT_TABLE)/2,
										 (WIDTH_CANVAS - WIDTH_TABLE)/2 + WIDTH_SHADOW,
										 (HEIGHT_CANVAS - HEIGHT_TABLE)/2 + HEIGHT_TABLE,
										 COLOR_SHADOW, "#038420");
  // draw shadow at the right of table
  drawLinearGradient("v", (WIDTH_CANVAS - WIDTH_TABLE)/2 + WIDTH_TABLE, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE)/2 + HEIGHT_TABLE,
										 (WIDTH_CANVAS - WIDTH_TABLE)/2 + WIDTH_TABLE - WIDTH_SHADOW,
										 (HEIGHT_CANVAS - HEIGHT_TABLE)/2,
										 COLOR_SHADOW, "#038420");
  // draw shadow at the top of border
  drawLinearGradient("h", (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2, (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2,
										 (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2 + WIDTH_TABLE_AND_BORDER, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2 + WIDTH_SHADOW_BORDER,
										 COLOR_SHADOW, COLOR_TABLE_BORDER);
  // draw shadow at the bottom of border
  drawLinearGradient("h", (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2 + WIDTH_TABLE_AND_BORDER, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2 + HEIGHT_TABLE_AND_BORDER,
										 (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2 + HEIGHT_TABLE_AND_BORDER - WIDTH_SHADOW_BORDER,
										 COLOR_SHADOW, COLOR_TABLE_BORDER);
  // draw shadow at the left of border
  drawLinearGradient("v", (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2, (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2,
										 (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2 + WIDTH_SHADOW_BORDER,
										 (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2 + HEIGHT_TABLE_AND_BORDER,
										 COLOR_SHADOW, COLOR_TABLE_BORDER);
  // draw shadow at the right of border
  drawLinearGradient("v", (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2 + WIDTH_TABLE_AND_BORDER, 
										 (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2 + HEIGHT_TABLE_AND_BORDER,
										 (WIDTH_CANVAS - WIDTH_TABLE_AND_BORDER)/2 + WIDTH_TABLE_AND_BORDER - WIDTH_SHADOW_BORDER,
										 (HEIGHT_CANVAS - HEIGHT_TABLE_AND_BORDER)/2,
										 COLOR_SHADOW, COLOR_TABLE_BORDER);
					 
  drawRotatedRect(hole[0].x, hole[0].y, 50, RADIUS_HOLE_CORNER * Math.sqrt(2), 45, COLOR_TABLE);
  drawRotatedRect(hole[2].x, hole[2].y, 50, RADIUS_HOLE_CORNER * Math.sqrt(2), 135, COLOR_TABLE);
  drawRotatedRect(hole[3].x, hole[3].y, 50, RADIUS_HOLE_CORNER * Math.sqrt(2), -45, COLOR_TABLE);
  drawRotatedRect(hole[5].x, hole[5].y, 50, RADIUS_HOLE_CORNER * Math.sqrt(2), -135, COLOR_TABLE);
  drawRotatedRect(hole[1].x, hole[1].y + DISTANCE_HOLE1, 50, 42, 120, COLOR_TABLE);
  drawRotatedRect(hole[1].x, hole[1].y + DISTANCE_HOLE1, 50, 42, 60, COLOR_TABLE);
  drawRotatedRect(hole[4].x, hole[4].y - DISTANCE_HOLE1, 50, 42, -120, COLOR_TABLE);
  drawRotatedRect(hole[4].x, hole[4].y - DISTANCE_HOLE1, 50, 42, -60, COLOR_TABLE);
  // draw holes 
  for (var i = 0; i < 6; i++) {
		hole[i].draw();
  }
  // for (var i = 0; i < 18; i++) {
		// line[i].draw();
  // }
	// for (var i = 0; i < 18; ++i) {
		// point[i].draw();
	// }
	// point[15].draw();
	// for (var i = 0; i <12; ++i){angle[i].l1_coll.draw();angle[i].l2_coll.draw();}
}
function drawBalls() {
  for (var i = 0; i < NUM_BALL; i++) { 
		if (ball[i].isExist == 1) {
			ball[i].draw();
		}
  }
   // console.log("drawBalls()");
}
function drawNoti() {
  noti.draw();
  noti_left.draw();
  noti_right.draw();
  var circle_bg;
  for (var i = 1; i< NUM_BALL; i++) {
		if (isExistBallNoti[i] == 1) {	  
			ball_noti[i].draw();
			circle_bg = new Circle_Type(new Point_Type(ball_noti[i].x, ball_noti[i].y), ball_noti[i].r/1.7, "white");
			circle_bg.draw();
			var ctx = myGameArea.context;
			ctx.font = "bold 14px Arial";
			ctx.fillStyle = "black";
			ctx.fillText(i,ball_noti[i].x - 4, ball_noti[i].y + 4);
		}
  }
}
function drawVelo() {
  var ctx = myGameArea.context;
  ctx.save();
  ctx.translate(ball[0].x, ball[0].y);
  if (pos_mouse1.y < pos_mouse3.y) {
		ctx.rotate(Math.atan(-(pos_mouse1.x - pos_mouse3.x)/(pos_mouse1.y - pos_mouse3.y)));
  }
  else if (pos_mouse1.y > pos_mouse3.y) {
		ctx.rotate(Math.atan(-(pos_mouse1.x - pos_mouse3.x)/(pos_mouse1.y - pos_mouse3.y)) - Math.PI);
  }
  else if (pos_mouse1.x > pos_mouse3.x) {
	  ctx.rotate(Math.PI/2);
	}
	else if (pos_mouse1.x < pos_mouse3.x) {
	  ctx.rotate(-Math.PI/2);
	}
  var velo = distancePP(new Point_Type(pos_mouse1.x, pos_mouse1.y), new Point_Type(pos_mouse3.x, pos_mouse3.y));
  //console.log(velo);
  if (velo > VELO_MAX) {
		pos_mouse3.x = pos_mouse1.x - (pos_mouse1.x - pos_mouse3.x)*VELO_MAX/velo;
		pos_mouse3.y = pos_mouse1.y - (pos_mouse1.y - pos_mouse3.y)*VELO_MAX/velo;
		velo = distancePP(new Point_Type(pos_mouse1.x, pos_mouse1.y), new Point_Type(pos_mouse3.x, pos_mouse3.y));
  }
  ctx.beginPath();
  ctx.globalAlpha = 0.6;
  ctx.translate(0, - RADIUS_BALL * 2);
  ctx.moveTo(-RADIUS_BALL/2, 0);
  ctx.quadraticCurveTo(0, - velo * RATE_VELO_FORCE,RADIUS_BALL/2,0);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.restore();
  // console.log("velo: " + velo);
  // console.log("drawVelo()");
}
function gameOver(num) {
  clearInterval(myGameArea.interval); // delete statement setInterval 
  myGameArea.clear();
  drawTable();
  drawBalls();
  drawNoti();
  // print on the screen the winner
  var ctxEndGame = myGameArea.context;
  ctxEndGame.font = SIZE_WORD + " " + FONT_WORD;
  ctxEndGame.fillStyle = COLOR_WORD;
  if (num == 1) {
    ctxEndGame.fillText("You win", 280, 55);
		// console.log("You win");
  }
  else if (num == 0) {
    ctxEndGame.fillText("You lose", 280, 55);
	  // console.log("You lose");
  }
  // console.log("gameOver (" + num + ")");
}
function updateGameArea() { 
  myGameArea.clear();
  newStatus();
  checkCollision();
  drawTable();
  drawBalls();
  drawNoti();
  // console.log("Velo: " + ball[0].vX + ", " + ball[0].vY);
  // console.log(ball[9]);
  // times++; // counting
  // console.log("updateGameArea() " + times); 
	// console.log("x: " + ball[7].x + ", y: " + ball[7].y);
	// console.log("vX: " + ball[7].vX + ", vY: " + ball[7].vY);
}