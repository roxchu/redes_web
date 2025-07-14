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
}

function cambiarSlidePersonajes(n) {
    showSlidePersonajes(slideIndexPersonajes += n);
}

function currentSlidePersonajes(n) {
    showSlidePersonajes(slideIndexPersonajes = n);
}

showSlidePersonajes(slideIndexPersonajes); // Inicializa el carrusel


// --- Nueva Función para alternar la visibilidad de la información ---
function toggleInfo(buttonElement) {
    const parentSlide = buttonElement.closest('.carrusel-slide');
    if (!parentSlide) return;

    const infoContent = parentSlide.querySelector('.info-content');
    if (infoContent) {
        infoContent.classList.toggle('active');
        if (infoContent.classList.contains('active')) {
            buttonElement.textContent = 'Menos Info';
        } else {
            buttonElement.textContent = 'Más Info';
        }
    }
}

// Opcional: Auto-reproducción para el carrusel de personajes
/*
setInterval(() => {
    cambiarSlidePersonajes(1);
}, 5000);
*/ 