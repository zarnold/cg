// Heavy reused of MrDoob code for Cave generation
// http://jsdo.it/mrdoob/xI3u

//---------------------------------------------------------------
//  functions

function grand() {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * Math.random() - 1;
		x2 = 2 * Math.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);
	var c = Math.sqrt(-2 * Math.log(rad) / rad);
	return x1 * c;
}

function gauss(esperance, stdev) {
	// range of uniform alea
	// be wide !

	var x = 3 * esperance * Math.random();
	console.log("x: " + x);
	var a = 1 / (Math.sqrt(2 * Math.PI * stdev));
	console.log("a: " + a);
	var b = esperance;
	console.log("b: " + b);
	var c = Math.sqrt(stdev);
	console.log("c: " + c);
	var G = a * Math.exp(-1 * ((x - b) * (x - b) / (2 * c * c)));

	console.log("E: " + esperance + " S: " + stdev + " give " + G);
	return G;
}

function sleep(ms) {
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}

//---------------------------------------------------------------
/* This little bastards walk the streets */
/* Spawn a new Drunker */
function Drunker(type, x, y, ch) {
	this.type = type;
	this.width = 3*Math.random(); 
	this.speed = 2;
  this.color = Math.floor(4*Math.random());
	this.x = x;
	this.y = y;

	this.life = 1500;

	this.dead = false;
}

/* Trace the street */
/* ch is th canvas handler */
Drunker.prototype.walk = function(ch) {
	//var width=( this.lifespan > ch.CaveCharac.bvLength ? 4 : 1);
	var width = this.width;

  var randomCol=["#FF7800","#78FF00","#7800FF","#0078FF"];
	//  Draw ----------------
	ch.ctx.strokeStyle = randomCol[0];
	ch.ctx.lineWidth = width;
	ch.ctx.beginPath();
	ch.ctx.moveTo(this.x, this.y);

	var h_v = (Math.random() > 0.5 ? 0 : 1 );
	if (h_v == 0) {
		this.dx = (Math.random() > (0.5-this.dx/10) ? 1 : -1 );
		this.dy = 0;
	} else {
		this.dx = 0;
		this.dy = (Math.random() > (0.5-this.dy/10) ? 1 : -1 );
	}
	//console.log('dx: '+this.dx+' dy: '+this.dy);
	this.x += this.dx * this.speed;
	this.y += this.dy * this.speed;

	ch.ctx.lineTo(this.x, this.y);
	ch.ctx.stroke();
	//  End Of drawing -------

	this.life -= 2;
	var p = 0.04;

	if (!this.dead && Math.random() < p && ch.Drunkers.length < ch.CaveCharac.maxBastards)
		this.spawn(ch);

	if ((this.life < 10) && (!this.dead)) {
		this.die(ch);
	}

	var index = (Math.floor(this.x) + ch.width * Math.floor(this.y) ) * 4;
	//   if ( ch.data[ index + 0 ] > 200 ) this.die(ch);

	if (this.x < 0 || this.x > ch.width)
		this.die(ch);
	if (this.y < 0 || this.y > ch.height)
		this.die(ch);

}
/* Learn its behavior: data loading and interval */
Drunker.prototype.educate = function(ch) {
	var instance = this;
	this.engine = setInterval(function() {
		instance.walk(ch);
	}, 20);
}
/* Sometimes they breed */
Drunker.prototype.spawn = function(ch) {
	//what kind of child will spawn ?
	var childType = '';
	var rn = Math.random();
	childType = 'aborted';

	if (rn < ch.CaveCharac.ChildsProba[this.type]['highway'])
		childType = 'highway';
	if ((rn > ch.CaveCharac.ChildsProba[this.type]['highway']) && (rn < (ch.CaveCharac.ChildsProba[this.type]['highway'] + ch.CaveCharac.ChildsProba[this.type]['street'])))
		childType = 'street';

	if (childType === 'aborted')
		return;

	w = new Drunker(childType, this.x, this.y, ch);
	ch.Drunkers.push(w);
	w.educate(ch);

}
/* And then they die  */
Drunker.prototype.die = function(ch) {
	this.dead = true;
	clearInterval(this.engine);
	var thisIndex = ch.Drunkers.indexOf(this);

	ch.Drunkers.splice(thisIndex, 1);
}
//------------------------------------------------------------
Cave.prototype.updateData = function() {
	//console.log('Update Image Data of '+this.canvasHandler.name);
	var image = this.canvasHandler.ctx.getImageData(0, 0, this.canvasHandler.width, this.canvasHandler.height);
	var data = image.data;
	this.canvasHandler.data = data;

	//---------------
	this.canNav.clearRect(0, 0, this.canvasHandler.width, this.canvasHandler.height);
	this.canNav.drawImage(this.cnv, 0, 0);

	//-----------------
	if (this.canvasHandler.Drunkers.length == 0) {
		//clearInterval(this.architect);
		$(".terminatorButton").show();
	}
}

Cave.prototype.launch = function() {
	var CaveInstance = this;

	this.architect = setInterval(function() {
		CaveInstance.updateData();
	}, 20);

	//this.canNav.translate(0.25*this.canvasHandler.width , 0.25*this.canvasHandler.height);
	//this.canNav.rotate(Math.PI / 4);
}

Cave.prototype.load = function(name) {
	var pathToData = "http://cepcam.org/moar/datas";
	var instance = this;

	var urlToDatas = pathToData + '/' + name + '.json';
	console.log('Loading ' + urlToDatas + ' for ' + this.canvasHandler.name);

	$.getJSON(urlToDatas, function(data) {
		console.log('Got file');
		console.log('name  Was ' + instance.canvasHandler.name);

		instance.canvasHandler.CaveCharac = data;

		//and now, display it
		var items = [];
		$.each(instance.canvasHandler.CaveCharac, function(i, item) {
			if ( typeof item === 'number')
				items.push('<dt>' + i + '</dt><dd><form> <input id="input_' + i + '" "type="text" class="input-small" placeholder="' + item + '"></form></dd>');

		});
		// close each()
		$('#Cave_characs').append(items.join(''));

	}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ', ' + error;
		console.log("Request Failed: " + err);
	});
	//Launch the Cave
	instance.launch();
}

Cave.prototype.terminate = function() {
	console.log('Terminating ' + this.canvasHandler.name);

	this.canvasHandler.ctx.clearRect(0, 0, this.canvasHandler.width, this.canvasHandler.height);
	this.canNav.clearRect(0, 0, this.canvasHandler.width, this.canvasHandler.height);

	$(".terminatorButton").hide();

	var tmpValue = $("#input_fertility").val();
	if (tmpValue)
		this.canvasHandler.CaveCharac['fertility'] = tmpValue;

	tmpValue = $("#input_curveProbability").val();
	if (tmpValue)
		this.canvasHandler.CaveCharac['curveProbability'] = tmpValue;

	tmpValue = $("#input_maxBastards").val();
	if (tmpValue)
		this.canvasHandler.CaveCharac['maxBastards'] = tmpValue;

	tmpValue = $("#input_curviness").val();
	if (tmpValue)
		this.canvasHandler.CaveCharac['curviness'] = tmpValue;

	//Update the tweet

	// Generate new markup
	$('#tweetBtn').empty();
	var tweetBtn = $('<a></a>').addClass('twitter-share-button').attr('href', 'http://twitter.com/share').attr('data-hashtags', 'CaveGenerator').attr('data-via', 'cepcam').attr('data-text', 'Mes paramètres : ' + this.canvasHandler.CaveCharac['fertility'] + ',' + this.canvasHandler.CaveCharac['maxBastards'] + ',' + this.canvasHandler.CaveCharac['curveProbability'] + ',' + this.canvasHandler.CaveCharac['curviness']);
	$('#tweetBtn').append(tweetBtn);
	twttr.widgets.load();
	//--------------
	this.canNav.scale(1, 1);
	this.launch();
	var alice = new Drunker('highway', this.canvasHandler.width / 2, this.canvasHandler.height / 2, ch);
	this.canvasHandler.Drunkers.push(alice);
	alice.educate(this.canvasHandler);
}
//---------------------------------------------------------------

/* Cities are where shit happens. */
/* Each instance help to maintain context object like canvas to paint over */
/* name : both name of the Cave and canvas Id */

function Cave(name) {
	console.log("Creating " + name);

	this.canNav = '';

	//Get and intialize canvas
	this.canvasHandler = {
		name : name,
		data : [],
		CaveCharac : {
			fertility : 8,
			maxBastards : 20,
			ChildsProba : {
				'street' : {
					'highway' : 2 / 60,
					'street' : 58 / 60
				},
				'highway' : {
					'highway' : 3 / 8,
					'street' : 5 / 8
				}
			},
			curveProbability : 0,
			bvLength : 580,
			curviness : 2
		},
		Drunkers : [],
		ctx : '',
		cnv : '',
		width : 1024,
		height : 512
	};

	var parameters = {
		width : 1024,
		height : 1024,
		roughness : 2,
		resolution : 4
	};

	//this.cnv = document.getElementById(name);
	this.cnv = document.createElement("canvas");
	this.cnv.setAttribute('width', this.canvasHandler.width);
	this.cnv.setAttribute('height', this.canvasHandler.height);

	this.canvasHandler.ctx = this.cnv.getContext("2d");
	this.canvasNav = document.getElementById("navigator");
	this.canNav = this.canvasNav.getContext("2d");

	//this.landscape=new PerlinMap(parameters);
	this.load(name);

	//-----------------
	//var id = this.canvasHandler.ctx.createImageData(640, 480);
	// only do this once per page
	//var id = this.canvasHandler.ctx.createImageData(this.landscape.width,this.landscape.height); // only do this once per page
	//var d = id.data;
	// only do this once per page
	/*
	for (var x=0;x<this.landscape.width;x++)
	for (var y=0;y<this.landscape.height;y++)
	{
	d[4*(y*this.landscape.width+x)+0]   = this.landscape.getLevel(x,y);
	d[4*(y*this.landscape.width+x)+1]   = d[4*(y*this.landscape.width+x)];
	d[4*(y*this.landscape.width+x)+2]   = d[4*(y*this.landscape.width+x)];
	d[4*(y*this.landscape.width+x)+3]   = 255;

	}
	this.canvasHandler.ctx.putImageData( id,0,0);
	*/
	//--------------------------------

	ch = this.canvasHandler;

  for(var j=0;j<5;j++)
  {
    var bob = new Drunker('street', this.canvasHandler.width / (Math.floor(2+5*Math.random())), this.canvasHandler.height / (Math.floor(2+5*Math.random())), ch);
    this.canvasHandler.Drunkers.push(bob);
    bob.educate(this.canvasHandler);
  }

}

// End of Cave constructor----------------------
