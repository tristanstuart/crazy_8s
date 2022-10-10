var socket = io()
var $nameField = $('#name')
var $startForm = $('#start')
var $panel = $('#panel')
var data = {
  room: window.location.pathname.split('/')[1], // get the first path
  name: null
}

$('body').addClass('center')

var count = 0

$startForm.on('submit', function(event) {
  event.preventDefault()
  data.name = $nameField.val()
  $startForm.hide()
  $panel.show()
  $nameField.blur()
  socket.emit('join', data)
})
