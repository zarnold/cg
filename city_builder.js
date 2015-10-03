// Heavy reused of MrDoob code for city generation
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

function gauss(esperance, stdev)
{
  // range of uniform alea  
  // be wide !
  
  var x=3*esperance*Math.random();
  console.log("x: "+x);
  var a=1/(Math.sqrt(2*Math.PI*stdev));
  console.log("a: "+a);  
  var b=esperance;
  console.log("b: "+b);  
  var c=Math.sqrt(stdev);
  console.log("c: "+c);  
  var G=a*Math.exp(-1*((x-b)*(x-b)/(2*c*c)));
  
  console.log("E: "+esperance+" S: "+stdev+" give "+G);
  return G;   
}

	function sleep(ms)
	{
		var dt = new Date();
		dt.setTime(dt.getTime() + ms);
		while (new Date().getTime() < dt.getTime());
	}
//---------------------------------------------------------------
/* This little bastards build the streets */
/* Spawn a new Worker */
function Worker(type,x,y,fatherAngle,semence,ch)
{
	//console.log('Spawn new Worker');
	this.type=type;
	this.width=1;
	this.ballSize=0;
  	this.speed=2;
	this.x = x;
  	this.y = y;

    this.angle=( Math.random() > 0.5 ? 90 : - 90 ) * Math.PI / 180;
	  this.angle = Math.pow( Math.random(), 20 ) + this.angle + fatherAngle;
    //  this.angle =  this.angle + fatherAngle;
    this.dx = Math.cos( this.angle );
    this.dy = Math.sin( this.angle );

   	this.ballSize=semence-1;
       
    if(this.type === 'street')
    {
     this.lifespan =200+50*grand();
      this.width=Math.random()+0.8;  
        	this.speed=2;   
    }

     
    if(this.type === 'highway')
    {
      this.lifespan = 1900+100*grand();   
      this.width=3;
      this.ballSize=ch.cityCharac.fertility;
      this.speed=5;
    }
    
    
    this.life=this.lifespan;
    this.dead = false;

  
}

/* Trace the street */
/* ch is th canvas handler */
Worker.prototype.build = function(ch)
{
	//console.log('I do work');
    //var width=( this.lifespan > ch.cityCharac.bvLength ? 4 : 1);
    var width=this.width;
//  Draw ----------------
	    ch.ctx.strokeStyle = '#FF7800';
      ch.ctx.lineWidth=width;
	    ch.ctx.beginPath();
	    ch.ctx.moveTo( this.x, this.y );
	    this.x += this.dx * this.speed;
	    this.y += this.dy * this.speed;
	    ch.ctx.lineTo( this.x, this.y );
	    ch.ctx.stroke();
//  End Of drawing -------

//-- Add a small curvature      
 	  var doCurv=(Math.random() > (1-ch.cityCharac.curveProbability )? 1 : 0);
      if( (doCurv == 1) && (this.type != 'street') )
      {
        
	      this.angle += ( Math.random() > 0.05 ? 1 : - 1 )*((ch.cityCharac.curviness)*Math.PI/180);
        this.dx = Math.cos( this.angle );
        this.dy = Math.sin( this.angle );
      }
//-- End curviness
    
	    this.life -= 2;
      //var p=  0.995*Math.exp(-0.25*((this.lifespan-400)/200));
      
      //var p=0.05*(Math.pow(2,this.ballSize)-1);
      if(this.ballSize>10) this.ballSize=10;
      
      var p=(this.ballSize*grand() / 10 );
      

    	if ( !this.dead  && Math.random() < p && ch.workers.length < ch.cityCharac.maxBastards ) 	    
    		this.spawn(ch);
    	
	    if((this.life<10) && (!this.dead))
	    {
	    	this.die(ch);
		  } 
                                                                   
	    var index = ( Math.floor( this.x ) + ch.width * Math.floor( this.y ) ) * 4;
	    if ( ch.data[ index + 0 ] > 200 ) this.die(ch);
	    		
	    if ( this.x < 0 || this.x > ch.width ) this.die(ch);						
	    if ( this.y < 0 || this.y > ch.height ) this.die(ch);
				    	  
    
}

/* Learn its behavior: data loading and interval */
Worker.prototype.educate = function(ch)
{
	//console.log('Educate the new worker');
	var instance = this;			
	this.engine=setInterval(function() { instance.build(ch); }, 20);	
}

/* Sometimes they breed */
Worker.prototype.spawn = function(ch)
{
      //what kind of child will spawn ?  
      var childType='';
      var rn= Math.random();
        childType='aborted';
   
   	  
      if(rn<ch.cityCharac.ChildsProba[this.type]['highway'] )
        childType='highway';
      if( (rn>ch.cityCharac.ChildsProba[this.type]['highway']) &&(rn< (ch.cityCharac.ChildsProba[this.type]['highway']+ch.cityCharac.ChildsProba[this.type]['street'])) )
        childType='street';        
        
      if(childType === 'aborted')  return;
      
	  w=new Worker(childType,this.x,this.y,this.angle,this.ballSize,ch);
      ch.workers.push(w);
	  w.educate(ch);
	  
    this.ballSize--;
}

/* And then they die  */
Worker.prototype.die = function(ch)
{
		  this.dead=true;
		  clearInterval(this.engine);
		  var thisIndex=ch.workers.indexOf(this);
		  
		  ch.workers.splice(thisIndex, 1 );
}


//------------------------------------------------------------
City.prototype.updateData = function()
{
		//console.log('Update Image Data of '+this.canvasHandler.name);
    	var image = this.canvasHandler.ctx.getImageData( 0, 0, this.canvasHandler.width, this.canvasHandler.height );
    	var data = image.data;
    	this.canvasHandler.data=data;

	
//---------------
	this.canNav.clearRect ( 0 , 0 , this.canvasHandler.width, this.canvasHandler.height );   
	this.canNav.drawImage(this.cnv,0,0);

//-----------------      	
    	if(this.canvasHandler.workers.length==0)
    	{
    		//clearInterval(this.architect);
    		$(".terminatorButton").show();
    	}
}

City.prototype.launch = function()
{
  var cityInstance = this;		

  	this.architect=setInterval(function() { cityInstance.updateData(); }, 40);	  

	//this.canNav.translate(0.25*this.canvasHandler.width , 0.25*this.canvasHandler.height);
	//this.zoom*=1.002;   
	//this.canNav.rotate(Math.PI / 4);  	
}

City.prototype.load = function(name)
{
  var pathToData="http://cepcam.org/moar/datas";
  var instance=this;
  
   var urlToDatas=pathToData+'/'+this.canvasHandler.name+'.json';
   console.log('Loading '+urlToDatas+' for '+this.canvasHandler.name);
/*
$.getJSON(urlToDatas, function(data) {
    console.log('Got file');
    console.log('name  Was '+instance.canvasHandler.name) ;
    
    instance.canvasHandler.cityCharac=data;

    //and now, display it
    var items = [];
    $.each(instance.canvasHandler.cityCharac, function(i, item) {
    if(typeof item === 'number')
      items.push('<dt>'+i+'</dt><dd><form> <input id="input_'+i+'" "type="text" class="input-small" placeholder="'+item+'"></form></dd>');

    });  // close each()
    $('#city_characs').append( items.join('') );
    
 
})
.fail(function( jqxhr, textStatus, error ) {
  var err = textStatus + ', ' + error;
  console.log( "Request Failed: " + err);
}); */  

    var items = [];
    $.each(instance.canvasHandler.cityCharac, function(i, item) {
    if(typeof item === 'number')
      items.push('<dt>'+i+'</dt><dd><form> <input id="input_'+i+'" "type="text" class="input-small" placeholder="'+item+'"></form></dd>');

    });  // close each()
    $('#city_characs').append( items.join('') );
    
   //Launch the city
    instance.launch();
    this.canNav.scale(this.canvasHandler.cityCharac.zoom,this.canvasHandler.cityCharac.zoom);	 
}

City.prototype.terminate = function()
{
	console.log('Terminating '+this.canvasHandler.name);
	
	this.canvasHandler.ctx.clearRect(0,0,this.canvasHandler.width,this.canvasHandler.height);
	this.canNav.clearRect(0,0,this.canvasHandler.width,this.canvasHandler.height);

    $(".terminatorButton").hide();	
    
    var tmpValue=$("#input_fertility").val();
    if(tmpValue)  this.canvasHandler.cityCharac['fertility']=tmpValue;
    
    var tmpValue=$("#input_zoom").val();
    //if(tmpValue)  this.canvasHandler.cityCharac['zoom']=tmpValue/this.canvasHandler.cityCharac['zoom'];
        //
    tmpValue=$("#input_curveProbability").val();
    if(tmpValue) this.canvasHandler.cityCharac['curveProbability']=tmpValue;
    
     tmpValue=$("#input_maxBastards").val();
    if(tmpValue)  this.canvasHandler.cityCharac['maxBastards']=tmpValue;
    
     tmpValue=$("#input_curviness").val();
    if(tmpValue)  this.canvasHandler.cityCharac['curviness']=tmpValue;

//Update the tweet


    // Generate new markup
    $('#tweetBtn').empty();    
    var tweetBtn = $('<a></a>')
        .addClass('twitter-share-button')
        .attr('href', 'http://twitter.com/share')         
        .attr('data-hashtags', 'cityGenerator')      
        .attr('data-via', 'cepcam')
        .attr('data-text','Mes paramètres : '+this.canvasHandler.cityCharac['fertility']+','+ this.canvasHandler.cityCharac['maxBastards']+','+ this.canvasHandler.cityCharac['curveProbability']+','+this.canvasHandler.cityCharac['curviness']);
    $('#tweetBtn').append(tweetBtn);
    twttr.widgets.load();
//--------------
    this.launch();
	var alice = new Worker('highway',this.canvasHandler.width/2,this.canvasHandler.height/2,-90* Math.PI / 180,this.canvasHandler.cityCharac.fertility,ch);
  	this.canvasHandler.workers.push(alice);
  	alice.educate(this.canvasHandler);		
}

//---------------------------------------------------------------

/* Cities are where shit happens. */
/* Each instance help to maintain context object like canvas to paint over */
/* name : both name of the city and canvas Id */
 
function City(name)
{
	console.log("Creating "+name);


	this.canNav='';
	
	//Get and intialize canvas
	this.canvasHandler = {  
	name: name,
	data: [],
  cityCharac:{
  	 fertility: 30,
  	 zoom: 1/2,
	 maxBastards: 400,
   ChildsProba:{
    'street': {'highway':2/60,'street':58/60},
    'highway': {'highway':3/8,'street':5/8}
   },
   curveProbability: 0.05,
   bvLength: 200,
   curviness: 4
   },
	workers: [],
    ctx : '', 
    cnv :'',
    width : 4096, 
    height:2048
  }; 

	var parameters	= {
		width: 1024 	,
		height: 1024 ,
		roughness:2,
		resolution: 4		
	};
	

  
  //this.cnv = document.getElementById(name);
  this.cnv=document.createElement("canvas");
  this.cnv.setAttribute('width',  this.canvasHandler.width );
  this.cnv.setAttribute('height', this.canvasHandler.height);
    
  this.canvasHandler.ctx = this.cnv.getContext("2d");  
  this.canvasNav= document.getElementById("navigator");
  this.canNav=this.canvasNav.getContext("2d"); 

  
//-----------------
//var id = this.canvasHandler.ctx.createImageData(this.landscape.width,this.landscape.height); // only do this once per page
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

  ch=this.canvasHandler;
  
  var alice = new Worker('highway',this.canvasHandler.width/2,this.canvasHandler.height/2,-90* Math.PI / 180,this.canvasHandler.cityCharac.fertility,ch);
  this.canvasHandler.workers.push(alice);
  alice.educate(this.canvasHandler);


  var bob = new Worker('street',this.canvasHandler.width/4,this.canvasHandler.height/4,-90* Math.PI / 180,this.canvasHandler.cityCharac.fertility,ch);
  this.canvasHandler.workers.push(bob);
  bob.educate(this.canvasHandler);


  var charles = new Worker('street',this.canvasHandler.width/1.1,this.canvasHandler.height/1.3,-45* Math.PI / 180,this.canvasHandler.cityCharac.fertility,ch);
  this.canvasHandler.workers.push(charles);
  charles.educate(this.canvasHandler);

  var david = new Worker('street',this.canvasHandler.width/3.3,this.canvasHandler.height/4.7,-90* Math.PI / 180,this.canvasHandler.cityCharac.fertility,ch);
  this.canvasHandler.workers.push(david);
  david.educate(this.canvasHandler);
}

// End of City constructor----------------------
