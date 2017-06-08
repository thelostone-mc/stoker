var socket = io.connect('http://localhost:3000');
socket.on('stocks', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
