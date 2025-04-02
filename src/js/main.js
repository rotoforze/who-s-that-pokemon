const imagenPokemon = document.querySelector(".imagen-pokemon");
const btnAdivinar = document.querySelector(".adivinar");
const campoAdivinar = document.querySelector(".nombre");
const elementosPuntos = document.querySelector(".puntos");


import { api } from "./api.js";

let nombrePokemon = "";
let gris = 1;
let brillo = 0;
let blur = 0;

let contador = 0;
let letras = -1;

let puntuacion;

let haGanado = false;

if (localStorage.getItem("puntos")) {
    puntuacion = localStorage.getItem("puntos");
}else {
    puntuacion = 0;
    localStorage.setItem("puntos", 0);
}
elementosPuntos.innerHTML = puntuacion;

console.log(localStorage.getItem("puntos"));
async function establecerPokemon() {
    // saca un pokemon del 1 al 1025 (3 de momento)
    const datos = await api(Math.floor(Math.random()*1025)+1);

    document.querySelector(".intenta").setAttribute("style", "display: none;");
    document.querySelector(".ganador").setAttribute("style", "display: none;");
    document.querySelector(".primero").setAttribute("style", "display: flex;");

    gris = 1;
    brillo = 0;
    blur = 0;
    contador = 0;
    letras = -1;
    haGanado = false;

    campoAdivinar.value = "";
    document.querySelector(".nombre-pista").innerHTML = "";

    nombrePokemon = datos.name;
    console.log(nombrePokemon);
    imagenPokemon.setAttribute("src", datos["sprites"]["front_default"]);
    imagenPokemon.setAttribute("style", "filter: grayscale("+gris+") brightness("+brillo+") blur("+blur+"px);");
}

establecerPokemon();

function ganar() {
    imagenPokemon.setAttribute("style", "");
    document.querySelector(".intenta").setAttribute("style", "display: none;");
    document.querySelector(".primero").setAttribute("style", "display: none;");
    document.querySelector(".ganador").setAttribute("style", "display: flex;");

    localStorage.removeItem("puntos");
    localStorage.setItem("puntos", ++puntuacion);
    elementosPuntos.innerHTML = puntuacion;
    haGanado = true;
}



function seguir() {
    document.querySelector(".ganador").setAttribute("style", "display: none;");
    document.querySelector(".primero").setAttribute("style", "display: none;");
    document.querySelector(".intenta").setAttribute("style", "display: flex;");

    console.log(contador);
    if (contador == 3) {
        brillo = 1;
        blur = 5;
    }
    if (contador > 3 & contador < 9) {
        blur--;
    }
    if (contador == 10) {
        gris = 0;
    }

    if (contador > 10) {
        letras++;
    }

    if (letras > -1 & letras < nombrePokemon.length) {
        document.querySelector(".nombre-pista").innerHTML += nombrePokemon.charAt(letras);
    }
    imagenPokemon.setAttribute("style", "filter: grayscale("+gris+") brightness("+brillo+") blur("+blur+"px);");
}

function adivinar() {
    if (campoAdivinar.value) {
        if (haGanado) {
            establecerPokemon();
        }else {
            contador++;
            if (campoAdivinar.value.toLowerCase() == nombrePokemon) {
                ganar();
            }else {
                seguir();
            }
        }
    }
}

btnAdivinar.addEventListener("click", adivinar, true);


function comprobarTeclado(event) {
    switch (event.key) {
        case 'Enter':
            adivinar();
            break;
        default:
            break;
    }
    
}
campoAdivinar.addEventListener("keydown", () => {comprobarTeclado(event);});

document.querySelector(".volverAJugar").addEventListener("click", establecerPokemon, true);
document.querySelector(".retry").addEventListener("click", establecerPokemon, true);
