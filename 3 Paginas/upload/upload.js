//**************************************globales********************************************************************//

//obtengo los elementos del DOM
const video = document.getElementById("video");
const videoGuardado = document.getElementById('videoGuardado');
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");

//monitoreo de eventos 
btnStart.addEventListener('click', comenzarGrabacion);
btnStop.addEventListener('click', terminarGrabacion);

//varivles de video
var blob;
var grabacion;
var miCamara;
var data;

//para el time stamp del video
var horaComienzo;

var misGif = [];

//barra de carga

const baropciones = {
    strokeWidth: 3,
    easing: 'easeInOut',
    duration: 5000,
    color: '#F7C9F3',
    trailColor: '#999999',
    trailWidth: 3,
    svgStyle: { width: '100%', height: '100%' }
}

var barra = new ProgressBar.Line(document.getElementById('conteprogresbar'), baropciones);
var barrasubir = new ProgressBar.Line(document.getElementById('conteprogresbar-subir'), baropciones);


var gridGifSubidosUpload = document.getElementById('misGif');



//**************************************events listener*************************************************************//


//para cambiar de pagina (home)
var home = document.getElementById("logo");
home.addEventListener("click", () => {
    location.assign("../home/home.html");
});
//para cambiar de pagina (home)
var flechaHome = document.getElementById("flecha");
flechaHome.addEventListener("click", () => {
    location.assign("../home/home.html");
});

//para cancelar la gravacion de los gif 
var cancelar = document.getElementById("cancelar");
cancelar.addEventListener("click", () => {
    location.reload();
});



var btnCopiEnl = document.getElementById("btn-copiEnla");



btnCopiEnl.addEventListener('click', function(event) {

    let text = btnCopiEnl.getAttribute('value');

    navigator.clipboard.writeText(text).then(function() {
        /* clipboard successfully set */
        console.log("copiado con exito");

        notificacion(3000, document.getElementById('noticover'));

    }, function() {
        /* clipboard write failed */
        console.log("copiado con exito");
    });
});


//**************************************cargo los gif guardados *************************************************************//
window.onload = function() {
    //ver si existen gif guardados

    if (localStorage.getItem('GifList')) {

        cargarLocalStorageGif(gridGifSubidosUpload);

    } else {
        //no hay gif
        console.log("no hay gif guardados en esta seseion");
    }

}




//**************************************funciones captura y muestra de video *************************************************************//



function mostrarVistaPrevia() {
    //tengo que esconder estos componentes    
    mostEsconComponet(document.getElementById("cartel"), esconder);
    mostEsconComponet(document.getElementById("barrratitulo"), esconder);
    mostEsconComponet(document.getElementById("misGif"), esconder);
    //tengo que mostrar el cartelde video   
    mostEsconComponet(document.getElementById("cartel-video"), mostrar);
    // muestro el titulo de la ventana
    mostEsconComponet(document.getElementById("titulo-1"), mostrar);

    return;
}

//esta funcion muestra el video en la pantalla
function vistaPreviaVideo() {

    //esta funcion muestra los componentes necesario
    mostrarVistaPrevia();

    //obtengo el video de la camara
    navigator.mediaDevices.getUserMedia(constrains)
        .then(stream => {

            //*seteo la fuente del video de la vista previa
            miCamara = stream;
            video.srcObject = miCamara;
        })
        .catch(console.error)
}

function comenzarGrabacion() {
    //difino donde se graba 
    grabacion = crearGrabador(miCamara);


    // muestro el titulo de la ventana
    mostEsconComponet(document.getElementById("titulo-1"), esconder);
    mostEsconComponet(document.getElementById("titulo-2"), mostrar);
    //cambiar la botonera en el foter del cartel
    mostEsconComponet(document.getElementById("foot-comenzar"), esconder);
    mostEsconComponet(document.getElementById("foot-parar"), mostrar);

    //funcion que graba
    grabacion.startRecording();
    horaComienzo = new Date().getTime();

    temporizador();
    return;
}

function terminarGrabacion() {

    //  muestro el titulo de la ventana
    mostEsconComponet(document.getElementById("titulo-2"), esconder);
    mostEsconComponet(document.getElementById("titulo-3"), mostrar);

    //cambiar los botones 
    mostEsconComponet(document.getElementById("foot-parar"), esconder);
    mostEsconComponet(document.getElementById("foot-subir"), mostrar);

    grabacion.stopRecording(() => {

        //guado la informacion grabada
        blob = grabacion.getBlob();
        //lo pongo para que se muestre
        videoGuardado.src = grabacion.toURL();
        //cambi los videos de lugar 
        mostEsconComponet(document.getElementById("videoGuardado"), mostrar);
        mostEsconComponet(document.getElementById("video"), esconder);

        //reset de grabacion      
        grabacion.destroy();
        grabacion = null;

        //parar la grabacion(deja de usar la camara)
        miCamara.getTracks().forEach(function(track) {
            track.stop();
        });
    });


    //animar la baara 
    barra.set(0.0);
    barra.animate(1.0);
}

function crearGrabador(transmision) {
    return RecordRTC(transmision, {
        disableLogs: true, //tiene logs automaticos
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        timeSlice: 1000,
    });
}

//esta funcion es para recapturar el video  
function recapturar() {
    // muestro el titulo de la ventana
    mostEsconComponet(document.getElementById("titulo-3"), esconder);

    //cambiar los videos que se estan mostrando 
    mostEsconComponet(document.getElementById("video"), mostrar);
    mostEsconComponet(document.getElementById("videoGuardado"), esconder);
    //cambiar la botonera inferior 
    mostEsconComponet(document.getElementById("foot-comenzar"), mostrar);
    mostEsconComponet(document.getElementById("foot-subir"), esconder);
    //! llamar a la funcion que captura video

    vistaPreviaVideo();


}


//******************************************subrir el gif**************************************************************** */

function subirGif() {

    //hacer la animacion de la barra de carga
    barrasubir.animate(1.0);

    //mostar las pantallas correspondientes
    mostEsconComponet(document.getElementById("cartel-video"), esconder);
    mostEsconComponet(document.getElementById("cartel-subida"), mostrar);

    //configuracion de la informacion de envio
    //guardo en un formulario
    data = new FormData();
    data.append('file', blob, 'misGif.gif');
    //parametros
    var parametros = {
        method: 'POST',
        body: data,
        // mode: 'no-cors',
    };

    //creo la direccion con los parametros
    let URL = subidaEndPoint + '&api_key=' + apiKey + '&username=' + userName;

    const found = fetch(URL, parametros)
        .then(response => {
            //llamar a afuncion que muestra el gif final
            mostrarcartelDescargar();
            return response.json();
        }).then(datos => {
            guandarGifLocalStorage(datos.data.id);
        })

    .catch(error => {
        console.log(error);
        return error;
    });
    return found;
}

function cancelarSubida() {
    console.log("se cancela la subida");
    //escondo el cartel de subida  
    mostEsconComponet(document.getElementById("cartel-subida"), esconder);

    //llamo a la funcion que recaptura
    vistaPreviaVideo();
    recapturar();
}


function mostrarcartelDescargar() {

    //esconder carteles anteriores
    mostEsconComponet(document.getElementById("cartel-subida"), esconder);
    mostEsconComponet(document.getElementById("cartel-muestr-desc"), mostrar);

    //guardar el gif en local storage
    let gifURL = URL.createObjectURL(blob);

    //lo muestro en pantalla
    document.getElementById('muestra-gif').src = gifURL;



}

function guandarGifLocalStorage(id) {
    //traigo el gif conpleto con este id
    fetch(buscarProId + id + '?' + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(dataGif => {

            let url = dataGif.data.images.downsized.url
                //guardar en elnace en el boton 
            document.getElementById("btn-copiEnla").setAttribute("value", url);


            //me fijo si hay algo guardado
            if (localStorage.getItem('GifList')) {
                //me traigo lo que hay en el llocal storage
                misGif = JSON.parse(localStorage.getItem('GifList'));
                // le agrego el nuevo valor
                misGif.push(url);
                //lo guardo de nuevo
                localStorage.setItem('GifList', JSON.stringify(misGif));
            } else {
                misGif.push(url);
                localStorage.setItem('GifList', JSON.stringify(misGif));
            }
        });
}


function descargarGif() {
    invokeSaveAsDialog(blob, 'migif.gif');

}

function terminadoElGif() {

    mostEsconComponet(document.getElementById("cartel-muestr-desc"), esconder);
    window.location.replace("../mis-gif/mis-gif.html");


}

//******************************************timestamp del video**************************************************************** */

function temporizador() {

    //si no esxiste , no hago nada 
    if (!grabacion) {
        return;
    }

    document.getElementById('temporizadortag').innerText = calcularDuracion((new Date().getTime() - horaComienzo) / 1000);

    setTimeout(temporizador, 1000);

}

function calcularDuracion(segundos) {

    var hr = Math.floor(segundos / 3600);
    var min = Math.floor((segundos - (hr * 3600)) / 60);
    var seg = Math.floor(segundos - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (seg < 10) {
        seg = "0" + seg;
    }

    if (hr <= 0) {
        return min + ':' + seg;
    }

    return hr + ':' + min + ':' + seg;
}

// function btnCopiEnla(evento) {

//     console.log("evento.clipboardData")
//     console.log(evento.clipboardData)
//     evento.preventDefault();

//     if (evento.clipboardData) {
//         let text = btnCopiEnl.getAttribute('value');
//         console.log("text");
//         console.log(text);

//         evento.clipboardData.setData("text/plain", text);

//         console.log("texto copiado");
//         console.log(evento.clipboardData.getData("text"))
//     }




// }