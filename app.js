/**
 * Module dependencies.
 */
var express = require('express');
var app = express();
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var radio = require('./routes/radio');
var resena = require('./routes/resena');
var chat = require('./routes/chat');

//Conectar a MongoDB
mongoose.connect('mongodb://localhost/db_node', function(error){
	if(error){
		throw error;		
	}else{
		console.log('Conectado a MongoDB');
	}
});

//Modelos!
var RadioSchema = mongoose.Schema({
	nombreRadio: {type: String, required: true},
	ip: {type: String, required: true},
	//biografia: {type: String, required: true}
});
var RadioModel = mongoose.model('Radio', RadioSchema);


var ResenaSchema = mongoose.Schema({
	nombreRadio: {type: String, required: true},
	comentario: {type: String, required: true},
	puntaje: {type: Number, required: true}
});
var ResenaModel = mongoose.model('Resena', ResenaSchema);
//pruebaaaa
var Modelos = {
    radio: RadioModel,
    resena: ResenaModel
};
//finprueba
resena.setModel(ResenaModel);
radio.setModel(Modelos);


// all environments
app.set('views', path.join(__dirname, 'views'));
app.use("/function", express.static(__dirname + '/function'));
app.use("/js", express.static(__dirname + '/js'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', radio.index2);
app.get('/users', user.list);

//RADIO
app.get('/radio', radio.index);
app.get('/radio/create', radio.create);
app.post('/radio', radio.store);
app.get('/radio/:id', radio.show);
app.get('/radio/:id/edit', radio.edit);
app.put('/radio/:id', radio.update);
app.delete('/radio/:id', radio.destroy);

//Reseñas
app.get('/resena', resena.index);
app.get('/resena/create/:nombreRadio', resena.create);
app.post('/resena', resena.store);
app.get('/resena/:id', resena.show);
app.get('/resena/:id/edit', resena.edit);
app.put('/resena/:id', resena.update);
app.delete('/resena/:id', resena.destroy);

//
app.get('/chat', chat.index);

//Server
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = '8080';
server.listen(port);
console.log('Start Web Services NodeJS in Port ' + port);

//Socket
io.sockets.on('connection', function (socket) {
	
	socket.on('initRoom', function (data) {
		console.log("Un usuario entró al chat de la sala " + data.room);
		socket.join(data.room);
	});

	socket.on('exitRoom', function (data) {
		console.log("Un usuario se salió del chat de la sala " + data.room);
		socket.leave(data.room);
	});

	socket.on('disconnect', function () {
		console.log("Usuario desconectado");
	});
	
	socket.on('broadcast', function (data) {
		console.log("Un usuario envió el mensaje: " + data.text);
		socket.broadcast.emit('broadcastCallback', { text:data.text});
	});

	socket.on('multicast', function (data) {
		console.log("Se envió el mensaje " + data.text + " a la sala " + data.room);
		io.sockets.in(data.room).emit('multicastCallback', {text:data.text});
	});
});
