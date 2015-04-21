var Resena;
exports.setModel = function(modelo){
	Resena = modelo;
};
exports.index = function(req, res){
	Resena.find({}, function(error, resena){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			res.render('resena/index', {
				resena: resena
			});
		}
	})
};
exports.create = function(req, res){
	res.render('resena/save', {
		put: false,
		action: '/resena/',
		resena: new Resena({
			nombreRadio: req.params.nombreRadio,
			comentario: '',
			puntaje: ''
			//biografia: ''
		})
	});
};
exports.store = function(req, res){
	var resena = new Resena({
		nombreRadio: req.body.nombreRadio,
		comentario: req.body.comentario,
		puntaje: req.body.puntaje
		//biografia: req.body.biografia
	});
	resena.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar la resena.');
		}else{	
			res.redirect('/resena/create/'+req.body.nombreRadio);
		}
	});
};
exports.show = function(req, res){
	Resena.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el resena.');
		}else{
			res.render('resena/show', {
				resena: documento
			});
		}
	});
};
exports.edit = function(req, res){
	Resena.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el resena.');
		}else{
			res.render('resena/save', {
				put: true,
				action: '/resena/' + req.params.id,
				resena: documento
			});
		}
	});
};
exports.update = function(req, res){
	Resena.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el resena.');
		}else{
			var resena = documento;
			resena.nombreRadio = req.body.nombreRadio;
			resena.conentario = req.body.comentario;
			resena.puntaje = req.body.puntaje;
			//resena.biografia = req.body.biografia;
			resena.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar el resena.');
				}else{	
					res.redirect('/resena');
				}
			});
		}
	});
};
exports.destroy = function(req, res){
	Resena.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el resena.');
		}else{	
			res.redirect('/resena');
		}
	});
};
