//**********************************************************//
// This lib offer texture Object
//Like Perlin for example
//***********************************************************//

//Will use an PerlinMap object, that will enable to get a grey level from coordinates
function PerlinMap(parameters)
{
		var square = {
			origin: {x:0,y:0},
			distance:256
		};
		
	this.width=parameters.width;
	this.height=parameters.height;
	this.roughness=parameters.roughness;
	this.resolution=parameters.resolution;
	
	this.seed=1;
			
	this.pixel=[];
	
	//Fill it with grey. That a mockup for testing interfaces
	for(var i=0; i<this.width*this.height; i++)
		this.pixel.push(0);
		
	this.diamondSquare(square);

}	


//An helper for greying a pixel
PerlinMap.prototype.greyize = function(x,y,greyLevel)
{
	x=Math.floor(x);
	y=Math.floor(y);
	greyLevel=Math.floor(greyLevel);
	if(x<0) x=0;
	if(y<0) y=0;				
	if(x>this.width) x=this.width;		
	if(y>this.height) y=this.height;		
	if(greyLevel>255) greyLevel=255;
	
	//console.log('Will Colors ('+x+','+y+') in '+greyLevel);
	this.pixel[x+y*this.width]=greyLevel;
	
}

//An helper for getting color of a pixel
PerlinMap.prototype.getColor = function(x,y)
{
	var greyLevel;
	x=Math.floor(x);
	y=Math.floor(y);
	greyLevel=Math.floor(greyLevel);	
	if(x<0) x=0;
	if(y<0) y=0;		
	if(x>this.width) x=this.width;		
	if(y>this.height) y=this.height;		

	
	greyLevel=this.pixel[x+y*this.width];
	
	return greyLevel;
	
}
//*This one recompute an existing Perlin Map
PerlinMap.prototype.recompute = function(parameters)
{
	//Fill it with another grey.
	for(var i=0; i<this.width*this.height; i++)
		this.pixel.push(200);	
}


//this function implement the Diamond square algorithm
//It takes a square, color some points and level down
//A square is {origin: {x,y},distance}
PerlinMap.prototype.diamondSquare = function(square)
{
		//console.log("------------------now squaring with "+square.origin.x+","+square.origin.y);
		
		var smallerSquare = {
			origin: {x:0,y:0},
			distance:0
		};
		
		if(square.origin.x<0 || square.origin.x>this.width) return;
		if(square.origin.y<0 || square.origin.y>this.height) return;	
		
		//Recursion. Wat r u doin ? stahp	
		if(Math.floor(square.distance)<=this.resolution) return;

//Now compute levels


//The square step
		var pixX=0;
		var pixY=0;
		var pixC=0;
		//grey levels of croners. For code readibility only
		var g1,g2,g3,g4;
		//console.log("A: "+pixC+" this width "+this.width+" this pixel "+ this.pixel[12]);		
		//Central pixel coordinate
		pixX = square.origin.x+square.distance/2;
		pixY = square.origin.y+square.distance/2;
		
		//each current square corners color
		//console.log('g1 coor '+ square.origin.x + this.width*square.origin.y);
		g1 = this.getColor(square.origin.x,square.origin.y);
		g2 = this.getColor(square.origin.x+square.distance,square.origin.y);
		g3 = this.getColor(square.origin.x,square.origin.y+square.distance);
		g4 = this.getColor(square.origin.x+square.distance,square.origin.y+square.distance);
		
	
		pixC = (g1+g2+g3+g4) / 4;
		console.log("Before: "+pixC);			
		pixC = Math.floor(pixC+square.distance*Math.random());
		console.log("After: "+pixC);
		//cap it please. It's grey level
		if(pixC > 255) pixC=255;
		//console.log("after: "+pixC);						
		
		//put it
		this.greyize(pixX,pixY,pixC);
//---------------- End of square Step 

//Now Diamond step
//one
		g1=this.getColor(square.origin.x,square.origin.y);
		g2=this.getColor(square.origin.x+square.distance/2,square.origin.y+square.distance/2);		
		g3=this.getColor(square.origin.x,square.origin.y+square.distance);		
		g4=this.getColor(square.origin.x-square.distance/2,square.origin.y+square.distance/2);		
		pixC = (g1+g2+g3+g4) / 4;		
		pixC = Math.floor(pixC+square.distance*Math.random());
		//cap it please. It's grey level
		if(pixC > 255) pixC=255;
		pixX=square.origin.x;
		pixY=square.origin.y+Math.floor(square.distance/2);
		//put it
		this.greyize(pixX,pixY,pixC);		

//two

		g1=this.getColor(square.origin.x,square.origin.y);
		g2=this.getColor(square.origin.x+square.distance/2,square.origin.y+square.distance/2);		
		g3=this.getColor(square.origin.x+square.distance,square.origin.y);		
		g4=this.getColor(square.origin.x,square.origin.y-square.distance/2);		
		pixC = (g1+g2+g3+g4) / 4;		
		pixC = Math.floor(pixC+square.distance*Math.random());
		//cap it please. It's grey level
		if(pixC > 255) pixC=255;

		pixX=square.origin.x+Math.floor(square.distance/2);
		pixY=square.origin.y;
		//put it
		this.greyize(pixX,pixY,pixC);	


//three

		g1=this.getColor(square.origin.x,square.origin.y+square.distance/2);
		g2=this.getColor(square.origin.x+square.distance/2,square.origin.y+square.distance/2);		
		g3=this.getColor(square.origin.x+square.distance,square.origin.y+square.distance);		
		g4=this.getColor(square.origin.x+square.distance+square.distance/2,square.origin.y+square.distance/2);		
		pixC = (g1+g2+g3+g4) / 4;		
		pixC = Math.floor(pixC+square.distance*Math.random());
		//cap it please. It's grey level
		if(pixC > 255) pixC=255;

		pixX=square.origin.x+Math.floor(square.distance);
		pixY=square.origin.y+Math.floor(square.distance/2);
		//put it
		this.greyize(pixX,pixY,pixC);	

		
//end of diamond step		
			
		smallerSquare.distance = Math.floor(square.distance/2);
		//console.log("Will square with "+ smallerSquare.distance);

//4 smaller square		
		smallerSquare.origin.x=square.origin.x+0;
		smallerSquare.origin.y=square.origin.y+0;			
		this.diamondSquare(smallerSquare);		
		
		smallerSquare.origin.x=square.origin.x+smallerSquare.distance;
		smallerSquare.origin.y=square.origin.y+0;		
		this.diamondSquare(smallerSquare);	
		
		smallerSquare.origin.x=square.origin.x+0;
		smallerSquare.origin.y=square.origin.y+smallerSquare.distance;		
		this.diamondSquare(smallerSquare);	
		
		smallerSquare.origin.x=square.origin.x+smallerSquare.distance;
		smallerSquare.origin.y=square.origin.y+smallerSquare.distance;		
		this.diamondSquare(smallerSquare);							
}

//The core one: return a grey level given a 2D coordinate
PerlinMap.prototype.getLevel = function(x,y)
{
	//Cap it
	if(x>this.width) x=this.width;
	if(y>this.height) y=this.height;

	return this.pixel[y*this.width+x];
}

//For the random generator. change seed
PerlinMap.prototype.setSeed = function(seedValue)
{
	this.seed=seedValue;	
}