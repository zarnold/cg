function initCanvas(domElement)
{
  timedLog("Initializing main canvas");
  timedLog("Init Canvas");
  
  //THe map strucutre hold some map informations even frameRate infos
  var canvasHandler = {  
    ctx : '', 
    width : 0, 
    height:0
  }; 

  var canvas = domElement;
  canvasHandler.ctx = canvas.getContext("2d");  
  canvasHandler.width = canvas.width;
  canvasHandler.height = canvas.height;

 // canvasHandler.ctx.fillStyle="#FFF";   
// canvasHandler.ctx.fillRect(0,0,canvas.width,canvas.height);   
  return canvasHandler;    
}

function testCanvas(canvasHandler)
{
  timedLog("Test Canvas");
  canvasHandler.ctx.fillStyle="#FF7800";   
  
  for(var i=0;i<247;i++)
  {
    var randomI=2*(0.5-Math.random());
    var randomJ=2*(0.5-Math.random());    
    canvasHandler.ctx.fillRect(canvasHandler.width*(1+randomI)/2,canvasHandler.height*(1+randomJ)/2,8+4*randomI, 8+4*randomI);
  } 
}