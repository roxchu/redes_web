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

// Función para obtener y mostrar el bookart desde PHP
async function cargarBookart() {
    const bookartGaleria = document.getElementById('bookart-galeria');
    bookartGaleria.innerHTML = '<p class="loading-message">Cargando arte...</p>';

    try {
        const response = await fetch('obtener_bookart.php');
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos.');
        }
        const bookart_data = await response.json();

        bookartGaleria.innerHTML = ''; // Limpiar el mensaje de carga

        if (bookart_data.length > 0) {
            bookart_data.forEach(data => {
                const bookartCard = document.createElement('div');
                bookartCard.classList.add('bookart-card');
                bookartCard.innerHTML = `
                    <div class="bookart-info">
                        <h3>${data.titulo}</h3>
                        <p>${data.descripcion}</p>
                        <a href="pdfs/${data.nombre_archivo}" target="_blank" class="pdf-btn">Ver PDF</a>
                    </div>
                `;
                bookartGaleria.appendChild(bookartCard);
            });
        } else {
            bookartGaleria.innerHTML = '<p>No se encontraron archivos de bookart.</p>';
        }

    } catch (error) {
        console.error("Error al cargar el bookart: ", error);
        bookartGaleria.innerHTML = '<p class="error-message">Error al cargar el bookart. Por favor, inténtalo de nuevo más tarde.</p>';
    }
}

// Llama a la función al cargar la página para que el contenido aparezca automáticamente
document.addEventListener('DOMContentLoaded', cargarBookart);