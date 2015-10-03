function launch()
{
 
  timedLog('Launching the app.');
  timedLog('Starting to build city.');  
  
  var paris=new City('paris');
console.log('City name is:'+paris.canvasHandler.name);
	paris.load();  
  $("#terminator").hide();
  $('#terminator').bind('click', function() {
 	paris.terminate();
});
//  var barcelona=new City('barcelona');   
//  var london=new City('london');   
 
}
