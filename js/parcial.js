window.addEventListener("load", cargar);

function cargar() {
    btnAgregar = document.getElementById("btnAgregar");
    btnGuardar = document.getElementById("btnGuardar");
    btnCancelar = document.getElementById("btnCancelar");
    btnAgregar.addEventListener("click", agregar);
    btnGuardar.addEventListener("click", validar);
    btnCancelar.addEventListener("click", cancelar);
    cargarTabla();
    cargarSelect();
}

function cargarSelect() {
    for (var i = 2000; i <= 2020; i++) {
        var select = document.getElementById("slcAño");
        var option = document.createElement("OPTION");
        select.options.add(option);
        option.text = i;
        option.value = i;
    }
}

function cargarTabla() {
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
            document.getElementById("spinner").hidden = true;
            var listaAutos = JSON.parse(peticionHttp.responseText);
            for (var i = 0; i < listaAutos.length; i++) {
                entablar(listaAutos[i].id, listaAutos[i].make, listaAutos[i].model,
                    listaAutos[i].year);
            }
        }
    }
    peticionHttp.open("GET", "http://localhost:3000/autos", true);
    peticionHttp.send();
    document.getElementById("spinner").hidden = false;
}

function entablar(id, marca, modelo, año) {
    var cuerpo = document.getElementById("tblCuerpo");
    /* Creo el <tr> */
    var row = document.createElement("tr");
    cuerpo.appendChild(row);
    /* Creo el <td> y se lo adjunto al <tr>, luego le adjunto el nombre al <td> */

    var tdMarca = document.createElement("td");
    row.appendChild(tdMarca);
    var textoMarca = document.createTextNode(marca);
    tdMarca.appendChild(textoMarca);

    var tdModelo = document.createElement("td");
    row.appendChild(tdModelo);
    var textoModelo = document.createTextNode(modelo);
    tdModelo.appendChild(textoModelo);

    var tdAño = document.createElement("select");
    row.appendChild(tdAño);
    for (var i = 2000; i <= 2020; i++) {
        var tdValue = document.createElement("option");
        tdAño.appendChild(tdValue);
        tdValue.text = i;
        tdValue.value = i;
    }
    var tdValue = document.createElement("option");
    tdValue.value = año;
    tdValue.selected = año;
    tdValue.hidden = true;
    tdAño.appendChild(tdValue);
    var textoAño = document.createTextNode(año);
    tdValue.appendChild(textoAño);

    console.log(tdAño.value);

    row.setAttribute("id", id);
    tdAño.addEventListener("change", editarAño);
}

function editarAño(event) {
    var añoElegido = event.currentTarget.value;
    var idRow = event.currentTarget.parentNode.getAttribute("id")
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
            //LOADER
            document.getElementById("spinner").hidden = true;
        }
    }
    peticionHttp.open("POST", "http://localhost:3000/editarYear", true);
    peticionHttp.setRequestHeader("Content-type", "application/json");
    var nuevoAño = { id: idRow, year: añoElegido};
    var stringAño = JSON.stringify(nuevoAño);
    peticionHttp.send(stringAño);
    document.getElementById("spinner").hidden = false;
}

function agregar() {
    document.getElementById("divAgregar").hidden = false;
}

function validar(event) {
    var esCorrecto = true;

    var marca = document.getElementById("txtMarca").value;
    var modelo = document.getElementById("txtModelo").value;
    var año = document.getElementById("slcAño").value;

    //Validar
    if (marca.length <= 3) {
        esCorrecto = false;
        document.getElementById("txtMarca").className = "conError";
    }
    else {
        document.getElementById("txtMarca").className = "sinError";
    }

    if (modelo.length <= 3) {
        esCorrecto = false;
        document.getElementById("txtModelo").className = "conError";
    }
    else {
        document.getElementById("txtModelo").className = "sinError";
    }

    if (esCorrecto) {

        guardar(marca, modelo, año);
    }
    else {
        return;
    }
}

function guardar(marcaP, modeloP, añoP) {
    var peticionHttp = new XMLHttpRequest();
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState == 4 && peticionHttp.status == 200) {
            //CAMBIOS
            entablar(generarNuevoId(), marcaP, modeloP, añoP);
            //BOTONES DISABLED, LOADER Y DIV DE MODIFICACION
            document.getElementById("spinner").hidden = true;
            document.getElementById("divAgregar").hidden = true;
            document.getElementById("btnGuardar").disabled = false;
            document.getElementById("btnCancelar").disabled = false;

        }
    }
    peticionHttp.open("POST", "http://localhost:3000/nuevoAuto", true);
    peticionHttp.setRequestHeader("Content-type", "application/json");
    var nuevoAuto = { make: marcaP, model: modeloP, year: añoP };
    var stringAuto = JSON.stringify(nuevoAuto);
    peticionHttp.send(stringAuto);
    document.getElementById("spinner").hidden = false;
    document.getElementById("btnCancelar").disabled = true;
    document.getElementById("btnGuardar").disabled = true;
}

function generarNuevoId() {
    var cuerpo = document.getElementById("tblCuerpo");
    var ultimoAuto = cuerpo.children[cuerpo.children.length - 1];
    return parseInt(ultimoAuto.getAttribute("id")) + 1;
}

function cancelar() {
    document.getElementById("txtMarca").value = "";
    document.getElementById("txtModelo").value = "";
    document.getElementById("slcAño").value = "2000";
    document.getElementById("txtModelo").className = "sinError";
    document.getElementById("txtMarca").className = "sinError";
    document.getElementById("divAgregar").hidden = true;
}