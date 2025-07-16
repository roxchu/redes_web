// script.js
// --- Control del Carrusel de Personajes ---
let slideIndexPersonajes = 0;
const slidesPersonajes = document.querySelectorAll('#carruselPersonajes .carrusel-slide');
const dotsPersonajes = document.querySelectorAll('#dotsPersonajes .dot');

function showSlidePersonajes(n) {
    // Ocultar cualquier información visible en el slide actual antes de cambiar
    slidesPersonajes.forEach(slide => {
        const infoContent = slide.querySelector('.info-content');
        if (infoContent && infoContent.classList.contains('active')) {
            infoContent.classList.remove('active');
        }
    });

    if (n >= slidesPersonajes.length) { slideIndexPersonajes = 0; }
    if (n < 0) { slideIndexPersonajes = slidesPersonajes.length - 1; }

    slidesPersonajes.forEach(slide => slide.classList.remove('active'));
    dotsPersonajes.forEach(dot => dot.classList.remove('active'));

    slidesPersonajes[slideIndexPersonajes].classList.add('active');
    dotsPersonajes[slideIndexPersonajes].classList.add('active');

    // **NUEVO: Actualiza el texto del botón "Más Info" cuando el slide cambia**
    const infoButton = document.querySelector('.info-button');
    if (infoButton) {
        // Asegúrate de que el contenido de info del nuevo slide esté oculto por defecto
        const currentInfoContent = slidesPersonajes[slideIndexPersonajes].querySelector('.info-content');
        if (currentInfoContent && currentInfoContent.classList.contains('active')) {
             infoButton.textContent = 'Menos Info';
        } else {
             infoButton.textContent = 'Más Info';
        }
    }
}

function cambiarSlidePersonajes(n) {
    showSlidePersonajes(slideIndexPersonajes += n);
}

function currentSlidePersonajes(n) {
    showSlidePersonajes(slideIndexPersonajes = n);
}

showSlidePersonajes(slideIndexPersonajes); // Inicializa el carrusel


// --- Nueva Función para alternar la visibilidad de la información (MODIFICADA) ---
// Ahora esta función NO recibe el botón como argumento, ya que es un botón global
function toggleInfoForCurrentSlide() { // Renombrada para mayor claridad
    const currentSlide = slidesPersonajes[slideIndexPersonajes];
    if (!currentSlide) return;

    const infoContent = currentSlide.querySelector('.info-content');
    const infoButton = document.querySelector('.info-button'); // Obtén el botón global

    if (infoContent && infoButton) {
        infoContent.classList.toggle('active');
        if (infoContent.classList.contains('active')) {
            infoButton.textContent = 'Menos Info';
        } else {
            infoButton.textContent = 'Más Info';
        }
    }
}

// Opcional: Auto-reproducción para el carrusel de personajes
/*
setInterval(() => { 
    cambiarSlidePersonajes(1);
}, 5000);
*/