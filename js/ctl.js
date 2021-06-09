'use strict'
var db = firebase.firestore(),
	storage = firebase.storage(),
	d = new Date(),
	month = d.getMonth() + 1,
	date = d.getDate(),
	modal = document.getElementById('id01'),
	boletaC = document.getElementById('boletaC'),
	nombreC = document.getElementById('nombreC'),
	carreraC = document.getElementById('carreraC'),
	fechaC = document.getElementById('fechaC'),
	doctorC = document.getElementById('doctorC'),
	modificar = document.getElementById('modificar'),
	eliminar = document.getElementById('eliminar'),
	form = document.getElementById('form'),
	output = document.getElementById('output'),
	session = document.getElementById('session'),
	userD = document.getElementById('user');
const auth = firebase.auth(),
	  provider = new firebase.auth.GoogleAuthProvider();
form.addEventListener('submit', action, false);
form["cancelar"].addEventListener('click', limpiar, false);
session.addEventListener('click', terminarSesion, false);
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
auth.languageCode = 'it';
provider.setCustomParameters({ prompt: "select_account" });
auth.onAuthStateChanged(
	usuarioAuth => {
		if (usuarioAuth && usuarioAuth.email) {
			user.value = usuarioAuth.displayName || "";
			email.value = usuarioAuth.email || "";;
			avatar.src = usuarioAuth.photoURL || "";;
		} else {
			auth.signInWithRedirect(provider);
		}
	},
	procesaError
);

async function terminarSesion() {
	if (confirm("¿Cerrar Sesión?")) {
		try	{ await auth.signOut(); } 
		catch (e) { procesaError(e); }
	}
}

function procesaError(e) {
	console.log(e);
	alert(e.message);
}
today();
leer();

function action() {
	if (form['actua'].getAttribute("data-cita") == "") escribir();
	else actualizar();
}
function closeModal() {modal.style.display = 'none';}
function showModal(cita) {
	var id = cita.getAttribute("id"),
		boleta = cita.getAttribute("data-boleta"),
		nombre = cita.getAttribute("data-nombre"),
		carrera = cita.getAttribute("data-carrera"),
		fecha = cita.getAttribute("data-fecha"),
		doctor = cita.getAttribute("data-doctor");
	modificar.setAttribute("data-cita", id);
	eliminar.setAttribute("data-cita", id);
	boletaC.innerHTML = boleta;
	nombreC.innerHTML = nombre;
	carreraC.innerHTML = carrera;
	fechaC.innerHTML = fecha;
	doctorC.innerHTML = doctor;
	modal.style.display = "flex";
}
window.onclick = function(event) {
	if(event.target == modal)
		modal.style.display = "none";
}
function editar(cita) {
	var id = cita.getAttribute("data-cita");
	boleta: form["boleta"].value = boletaC.innerHTML.toString();
	nombre: form["nombre"].value = nombreC.innerHTML.toString();
	carrera: form["carrera"].value = carreraC.innerHTML.toString();
	fecha: form["fecha"].value = fechaC.innerHTML.toString();
	form["actua"].setAttribute("data-cita", id);
	form["guardar"].style.display = "none";
	form["actua"].style.display = "grid";
	closeModal();
}
function limpiar() {
	form.reset();
	if (form["guardar"].style.display == "none") {
		form["guardar"].style.display = "grid";
		form["actua"].style.display = "none";
		form["actua"].setAttribute("data-cita", "");
	}
}
function escribir() {
	var data = {
		boleta: form["boleta"].value,
	    nombre: form["nombre"].value,
	    carrera: form["carrera"].value,
	    fecha: form["fecha"].value,
	    doctor: userD
	};
	db.collection("citas").add(data)
	.then(() => {
		alert("¡Cita registrada!");
		limpiar();
	})
	.catch((error) => {console.error("Error al registrar: ", error);});
	subirFile(form["file"].value, form["boleta"].value)
}

function leer() {
	db.collection("citas").orderBy("fecha", "asc").onSnapshot((querySnapshot) => {
		output.innerHTML = "";
	    querySnapshot.forEach((doc) => {
			output.innerHTML += `<p id="${doc.id}"
									data-boleta="${doc.data().boleta}"
									data-nombre="${doc.data().nombre}"
									data-carrera="${doc.data().carrera}"
									data-fecha="${doc.data().fecha}"
									data-doctor="${doc.data().doctor}"
									onclick="javascript:showModal(this)">
									Boleta: ${doc.data().boleta} | 
									Fecha: ${doc.data().fecha}</p>`;
	    });
	});
}
function actualizar() {
	alert("Si en actualizar");
	var data = {
		boleta: form["boleta"].value,
	    nombre: form["nombre"].value,
	    carrera: form["carrera"].value,
	    fecha: form["fecha"].value,
	    doctor: "Bruce Wayn"
	};
	db.collection("citas").doc(form["actua"].getAttribute("data-cita")).set(data)
	.then(() => {
		alert("¡Cita registrada!");
		limpiar();
	})
	.catch((error) => {console.error("Error al registrar: ", error);});
}
function borrar(cita) {
	if(confirm("¿Quieres eliminar la cita?")) {
		db.collection("citas").doc(cita.getAttribute("data-cita")).delete()
		.then(() => {alert("¡Cita eliminada!");})
		.catch((error) => {console.error("Error al eliminar: ", error);});
		closeModal();
	}
}
function subirFile(file, id) {
	var storageRef = storage.ref(),
		fileRef = storageRef.child(file),
		fileImagesRef = storageRef.child('images/' + file),
		metadata = { idRef: id, },
		uploadTask = storageRef.child('images/mountains.jpg').put(file, metadata);


}
function today() {
	if (month <= 9) month = "0" + month.toString();
	if (date <= 9) date = "0" + date.toString();
	var dateString = d.getFullYear() + "-" + month + "-" + date;
	form["fecha"].setAttribute("min", dateString);
}