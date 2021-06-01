'use strict';
const express = require('express');

const session = require('express-session')
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')

var cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser());
const port = 6790;

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
const fs = require("fs");


app.use(session({ secret: 'secret', saveUninitialized: true, resave: true }))

app.get('/autentificare', (req, res) => res.render('autentificare.ejs',{utilizator: req.session.utilizator}));
app.get('/logout',(req,res)=>{
	res.redirect('/autentificare');
});
app.get('/', (req, res) => res.render('home.ejs',{utilizator: req.session.utilizator}));
app.get('/home', (req, res) => res.render('home.ejs'));
app.get('/index', (req, res) => res.render('index.ejs',{utilizator: req.session.utilizator}));
app.get('/lotto', (req, res) => res.render('lotto.ejs',{utilizator: req.session.utilizator}));
app.get('/casino', (req, res) => res.render('casino.ejs',{utilizator: req.session.utilizator}));
app.get('/casinoR', (req, res) => res.render('casinoR.ejs',{utilizator: req.session.utilizator}));
app.get('/inregistrare', (req, res) => res.render('inregistrare.ejs'));
app.get('/despre', (req, res) => res.render('despre.ejs'));


var flagAutentificare=false;
var flagAdmin=0;

var sess;
var con;
var listaProduse;

fs.readFile('utilizatori.json', (err, data) => {

	if (err) throw err;
	let listaUtilizatori = JSON.parse(data);

	app.post('/verifica-autentificare', (req, res) => {
		var utilizatori = listaUtilizatori;
		var raspunsuri_autentificare = JSON.stringify(req.body);
		console.log(raspunsuri_autentificare)
		raspunsuri_autentificare = JSON.parse(raspunsuri_autentificare);
		console.log(raspunsuri_autentificare)
		var utilizatorCorect = false;
		var flag = false;
		var iterator;
		res.cookie('errorMessage', 'false');
		for (var i = 0; i < utilizatori.length; i++) {
			if (utilizatori[i].utilizator == raspunsuri_autentificare['utilizator'] && utilizatori[i].parola == raspunsuri_autentificare['parola']) {
				flag = true;
				utilizatorCorect = true;
				iterator = i;
				flagAdmin=utilizatori[i].admin;
			}
		}

		if (flag == true) {
			console.log('true flag');
		}
		else {
			console.log('false flag');
		}

		if (utilizatorCorect == true) {
			sess = req.session;
			sess.utilizator = utilizatori[iterator].nume + " " + utilizatori[iterator].prenume ;
			console.log('true utilizator');
			console.log(req.cookies.errorMessage);
			flagAutentificare=true;
			res.redirect('/index');
		}
		else {

			res.write('<h1 style="color: red;">Eroare Autentificare!</h1>');
			res.write('<h2 style="color: red;">Numele de utilizator sau parola introduse gresit</h2>');
			console.log('false utilizator');
			//res.cookie('errorMessage', 'true');
			//res.redirect('/autentificare');
		}
	});
});


fs.readFile('intrebariF.json', (err, data) => {
	if (err) throw err;
	let listaIntrebari = JSON.parse(data);

	app.get('/fotbal', (req, res) => {
		res.render('fotbal', { intrebari: listaIntrebari });
	});

	app.post('/fotbal2', (req, res) => {
		res.render('fotbal2', { intrebari: listaIntrebari, raspunsuri: JSON.stringify(req.body) })
	});
});

fs.readFile('intrebariT.json', (err, data) => {
	if (err) throw err;
	let listaIntrebari = JSON.parse(data);

	app.get('/tenis', (req, res) => {
		res.render('tenis', { intrebari: listaIntrebari });
	});

	app.post('/tenis2', (req, res) => {
		res.render('tenis2', { intrebari: listaIntrebari, raspunsuri: JSON.stringify(req.body) })
	});
});



// app.post('/back',(req,res)=>{
// 	res.render('index.ejs');
// });


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));