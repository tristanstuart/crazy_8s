var socket = io.connect() 
var $startForm = $('#start')
var $roomField = $('#room')
var $panel = $('#panel')
var $shareLink = $('#shareLink')
var $roomCount = $('#roomCount')
var data = { room: null , name: null}



async function getData(url) {
	const response = await fetch(url)
	return response.json()
}

var count = 0
var stakes = 0

$("#create").click(function(){
  // data.name = 
  data.room = $roomField.val();
  socket.emit('create', data);
});

$roomCount.text('0 people');
$('body').addClass('body--admin');


socket.on('create', function(success) {
  if (success) {
    $("#create").hide();
    $startForm.hide()
    $panel.show()
    $shareLink.val(window.location.host+'/'+data.room)
  }
  else {
    alert('That room is taken')
  }
})

socket.on('leave', function() {
  count--
  $roomCount.text(count === 1 ? count + ' person' : count + ' people')
})

socket.on('join', function(data) {
  count++
  $roomCount.text(count === 1 ? count + ' person' : count + ' people')
})

