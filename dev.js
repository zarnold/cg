function addConsole()
{
  $('body').append('<div id="console" class="affix" style="width: 100%;height: 20em;border: 1px solid #333;"><h3>Console</h3></div>');
}
function deleteConsole()
{
  $('#console').remove();
}
function clearConsole()
{
  $('#console').empty();
}
function printToconsole(message)
{
$('<p style="height: 1em">'+message+'</p>').appendTo('#console');
}
function timedLog(message)
{
  //For debug only, performance killer

  var now= new Date();

   var minute = now.getMinutes();
   var second = now.getSeconds();

   if (minute < 10) { minute = "0" + minute; }
   if (second < 10) { second = "0" + second; }
   var timeString = minute + ':' +second;
    
    
   console.log('['+timeString+'] : '+message);
 
}