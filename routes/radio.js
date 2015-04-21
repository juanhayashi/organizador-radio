var Radio, Resena;
exports.setModel = function(modelo){
	Radio = modelo.radio;
	Resena = modelo.resena;
};
exports.index = function(req, res){
	Radio.find({}, function(error, radio){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			Resena.find({}, function(error, resena){
				if(error){
					res.send('Error.');		
				}else{
					res.render('radio/index', {
						resena: resena,
						radio: radio
					});
				}
				
			})
		}
	})
};

exports.index2 = function(req, res){
	Radio.find({}, function(error, radio){
		if(error){
			res.send('Ha surgido un error.');
		}else{
			Resena.find({}, function(error, resena){
				if(error){
					res.send('Error.');		
				}else{
					res.render('radio/index2', {
						resena: resena,
						radio: radio
					});
				}
				
			})
		}
	})
};

exports.create = function(req, res){
	res.render('radio/save', {
		put: false,
		action: '/radio/',
		radio: new Radio({
			nombreRadio: '',
			ip: ''
			//biografia: ''
		})
	});
};
exports.store = function(req, res){
	var radio = new Radio({
		nombreRadio: req.body.nombreRadio,
		ip: req.body.ip
		//biografia: req.body.biografia
	});
	radio.save(function(error, documento){
		if(error){
			res.send('Error al intentar guardar la radio.');
		}else{	
			res.redirect('/radio');
		}
	});
};
exports.show = function(req, res){
	Radio.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el radio.');
		}else{
						Resena.find({'nombreRadio': documento.nombreRadio}, function(error, resena){
				if(error){
					res.send('Error.');		
				}else{
					console.log(resena);
					res.render('radio/show', {
						resena: resena,
						radio: documento
					});
				}
				
			})
		}
	});
};
exports.edit = function(req, res){
	Radio.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar ver el radio.');
		}else{
			res.render('radio/save', {
				put: true,
				action: '/radio/' + req.params.id,
				radio: documento
			});
		}
	});
};
exports.update = function(req, res){
	Radio.findById(req.params.id, function(error, documento){
		if(error){
			res.send('Error al intentar modificar el radio.');
		}else{
			var radio = documento;
			radio.nombreRadio = req.body.nombreRadio;
			radio.ip = req.body.ip;
			//radio.biografia = req.body.biografia;
			radio.save(function(error, documento){
				if(error){
					res.send('Error al intentar guardar el radio.');
				}else{	
					res.redirect('/radio');
				}
			});
		}
	});
};
exports.destroy = function(req, res){
	Radio.remove({_id: req.params.id}, function(error){
		if(error){
			res.send('Error al intentar eliminar el radio.');
		}else{	
			res.redirect('/radio');
		}
	});
};
