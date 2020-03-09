


//**************************************al cargar la pagina se ejecuta*************************************************************//



//sugerencias predictivas
var cajaSugerencias = document.getElementById('segbus');

var inputBusqueda = document.getElementById("input");

var btnX = document.getElementById("btn-x");
var divSug = document.getElementById("segbus-esc");

//esta funcion se ejecuta cuando crga la pagina

window.onload = function() {
    //cargar las primeras 4 sugerencias
    for (let index = 0; index < limitesugerencias; index++) {
        getSugerencias(sugerenciasArry);
    }
    getTendencias();

    inputBusqueda.value = '';
};
//**************************************events listener*************************************************************//

//para cambiar de pagina (misGuifos)
var misGuifos = document.getElementById("misGif");
misGuifos.addEventListener("click", () => {
    location.assign("../mis-gif/mis-gif.html");
});
//para cambiar de pagina (upload)
var upload = document.getElementById("upload");
upload.addEventListener("click", () => {
    location.assign("../upload/upload.html");
});


var btnBuscar = document.getElementById('btn-buscar');
btnBuscar.addEventListener('click', () => {
    //llamo a la funcion buscar
    buscar(inputBusqueda.value, mostrarResultados);
});

//monitorea el estado del imput en la barra de busqueda
inputBusqueda.addEventListener('input', event => {
    let valor = inputBusqueda.value.trim();

    if (valor) {
        document.getElementById("btn-buscar").disabled = false;
        //muestro el boton eliminar
        mostEsconComponet(btnX, mostrar);
        obtenerSugerencias(valor);
    } else {

        document.getElementById("btn-buscar").disabled = true;
        //escondo el boton eliminar
        mostEsconComponet(btnX, esconder);
        mostEsconComponet(divSug, esconder);
    }

});
//este evento es para detectar el enter
inputBusqueda.addEventListener('keyup', event => {
    if (event.keyCode == 13) {
        buscar(inputBusqueda.value.trim());
        return;
    }
});


//**************************************sugerencias de la busqueda****************************************************************************//

function obtenerSugerencias(palabra, callback) {
    console.log("haciendo la consulta");
    //creo la URL para la consulta
    let url = segBusqUrl + '&q=' + palabra;
    //llamo la funcion que me actualiza el scrip
    actulizarScrip(url, callback);
}


function actulizarScrip(url, callback) {
    console.log("insertando el scrip");
    //creo el nuevo scrip
    let nuevoScrip = document.createElement("script");

    // le asigno la url y un id
    nuevoScrip.setAttribute("src", url);
    nuevoScrip.setAttribute("id", "jsonp");
    //busco si ya existe
    let viejoScrip = document.getElementById("jsonp");

    // seciono el body
    let body = document.getElementsByTagName("body")[0];

    if (viejoScrip == null) {
        //si no hay ningulo le pego el nuevo
        body.appendChild(nuevoScrip);
    } else {
        // si ya existe lo remplazo
        body.replaceChild(nuevoScrip, viejoScrip);
    }

}

function mostrarJsonp(obj) {
    console.log("muestro el obj");
    arraySugBus = obj[1];
    colocarSugBus(arraySugBus);

}

function colocarSugBus(sugArr) {

    //borro todas las anteriores
    while (cajaSugerencias.firstChild) {
        cajaSugerencias.removeChild(cajaSugerencias.firstChild);
    }

    //si no hay resultados no lo muestro
    if (sugArr.length == 0) {

        mostEsconComponet(divSug, esconder);

    } else {
        // si hay lo muestro
        mostEsconComponet(divSug, mostrar);

        if (sugArr.length >= maxsug) {
            for (let index = 0; index < maxsug; index++) {
                insertarBtnSug(sugArr[index]);
            }

        } else {
            for (let index = 0; index < sugArr.length; index++) {
                insertarBtnSug(sugArr[index]);
            }
        }

    }


    // botonesSugeridos(sugArr);
}

function insertarBtnSug(texto) {
    let boton = document.createElement('button');
    boton.setAttribute('class', 'btn-bus-pre');
    boton.setAttribute('onclick', 'buscar("' + texto + '")');
    boton.textContent = texto;
    cajaSugerencias.appendChild(boton);
}


//**************************************hace la busqueda y optiene los datos*************************************************************//


function buscar(palabra) {
    //gusrdo el texto buscado
    document.getElementById("tex-buscado").innerText = palabra + ' (resultados)';

    inputBusqueda.value = palabra;

    //obtengo nuevas sugerencias con la palabra buscada
    obtenerSugerencias(palabra);


    mostEsconComponet(btnX, mostrar);

    const found = fetch(searchEndPoint + 'q=' + palabra + '&api_key=' + apiKey + "&limit=" + limitebusqueda)
        .then(response => {
            return response.json();
        })
        .then(resdata => {
            var datos = resdata.data;

            mostrarResultados(datos);
            return datos;
        })
        .catch(error => {
            console.log(error);
            return error;
        });
    return found;
}

//injecta el html con los resultados de la busqueda en la galeria
function mostrarResultados(data) {

    mostEsconComponet(divSug, esconder);
    //muestro toda la galeria de los gif
    mostEsconComponet(document.getElementById('busqueda'), mostrar);

    var gridBusqueda = document.getElementById("gridBusqueda");

    //borro los resultados anteriores
    while (gridBusqueda.firstChild) {
        gridBusqueda.removeChild(gridBusqueda.firstChild);
    }


    if (data.length == 0) {
        let tarjeta = document.createElement("div");
        tarjeta.setAttribute("class", "tarjetaGif");
        tarjeta.innerHTML +=
            '<img src = "../../assets/noresult.gif" >' +
            '<div class = "foot">' +
            '<p>No se encontraron resultados</p>' +
            '</div>';
        gridBusqueda.appendChild(tarjeta);

    } else {
        //creo los elementos html
        data.forEach(element => {
            let tarjeta = document.createElement("div");
            tarjeta.setAttribute("class", "tarjetaGif");

            tarjeta.innerHTML +=

                ' <img src =' + element.images.downsized.url + '>' +
                ' <div class = "foot">' +
                '  <p>' + element.title + '</p>' +
                ' </div>';

            gridBusqueda.appendChild(tarjeta);
        });

    }


    //guardo la info en los botones de sugerridos
    botonesSugeridos(arraySugBus);


}

function resetBusqueda() {
    //esconder la galeria
    mostEsconComponet(document.getElementById('busqueda'), esconder);
    //borrar el contenido de la busqueda
    inputBusqueda.value = "";
    //desavilito el boton porque al setear el value no se activa en evento
    document.getElementById("btn-buscar").disabled = true;
    //escondo el boton eliminar
    mostEsconComponet(btnX, esconder);
    mostEsconComponet(divSug, esconder);
}

function botonesSugeridos(arraySug) {
    //creo los botones de sugerencias

    let btnSugeBus = document.getElementById('btn-suge-cont');
    let iteracion = 0;


    while (btnSugeBus.firstChild) {
        btnSugeBus.removeChild(btnSugeBus.firstChild);
    }

    if (arraySug.length > 3) {
        iteracion = 3
    } else {
        iteracion = arraySug.length
    }

    for (let index = 0; index < iteracion; index++) {
        let boton = document.createElement('button');
        boton.setAttribute('class', 'btn');
        boton.innerText = '#' + arraySug[index];
        boton.setAttribute('onclick', 'buscar("' + arraySug[index] + '")');
        btnSugeBus.appendChild(boton);
    }


}


//**********************************************sugerencias*************************************/

function cargarSugerencia() {
    getSugerencias(sugerenciasArry);
}

function insertarSugerencia(array) {
    //obtener el elemento padre
    let sugerencias = document.getElementById("sugerencias");
    while (sugerencias.firstChild) {
        sugerencias.removeChild(sugerencias.firstChild);
    }

    //hacer con un for para cada elemento de un array
    for (let index = 0; index < array.length; index++) {
        //definir la tarjeta
        let tarjeta = document.createElement("DIV");
        tarjeta.setAttribute("class", "suge-traje");
        let title = array[index].titulo;
        tarjeta.innerHTML =

            ' <section class = "suge-header" >' +
            '<p> #' + array[index].titulo + '  </p>' +
            '<img class="eliminar-sug"  onclick="borrarSug(' + index + ')" src = "../../assets/close.svg" alt = "" > ' +
            '</section> <img class = "suge-gif" src =' + array[index].url + ' alt = "" >' +
            '<button class = "suge-btn-vmas" onclick="buscar(\'' + title + '\')"> ver mas... </button>';
        //agregarle un hijo al padre
        sugerencias.appendChild(tarjeta);
    }
}

function getSugerencias(array) {
    const found = fetch(randonEndPoint + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(resdata => {
            var datos = resdata.data;
            array.push({ url: datos.images.downsized.url, titulo: datos.title });
            insertarSugerencia(array);
            return datos;
        })
        .catch(error => {
            console.log(error);
            return error;
        });


    return found;
}

function borrarSug(index) {
    //borrar el elementop del array
    sugerenciasArry.splice(index, 1);
    //cargar un nuevo elemeto en el array
    getSugerencias(sugerenciasArry);

}

//********************************************************trending************************************************************ */
function getTendencias() {

    const found = fetch(tendenciasEndPoint + '&api_key=' + apiKey + "&limit=" + limiteTendencias)
        .then(response => {
            return response.json();
        })
        .then(resdata => {
            var datos = resdata.data;
            mostrarTendencias(datos);
            return datos;
        })
        .catch(error => {
            console.log(error);
            return error;
        });


    return found;
}

function mostrarTendencias(data) {

    var gridTendencias = document.getElementById("tendencias");
    //creo los elementos html
    data.forEach(element => {
        var tarjeta = document.createElement("div");
        tarjeta.setAttribute("class", "tarjetaGif");
        tarjeta.innerHTML +=
            '<img src =' + element.images.downsized.url + '>' +
            ' <div class = "foot">' +
            ' <p>' + element.title + '</p>' +
            '</div>'
        gridTendencias.appendChild(tarjeta);
    });
}