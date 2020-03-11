//para el java scrip de la pagina mis guifos
//**************************************variables globales*************************************************************//



var gridGifSubidos = document.getElementById("gifSubidos");

//**************************************events listener*************************************************************//
//para cambiar de pagina (home)
var home = document.getElementById("logo");
home.addEventListener("click", () => {
    location.assign("../home/home.html");
    // location.assign("/pages/home/home.html"); //firebase
});


//para cambiar de pagina (upload)
var upload = document.getElementById("upload");
upload.addEventListener("click", () => {
    location.assign("../upload/upload.html");
    // location.assign("/pages/upload/upload.html"); //firebase
});


//********************************************cargar mis guifos***********************************************************/



window.onload = function() {
    //ver si existen gif guardados

    if (localStorage.getItem('GifList')) {

        cargarLocalStorageGif(gridGifSubidos);

    } else {
        //no hay gif
        console.log("no hay gif guardados en esta seseion");
    }

}