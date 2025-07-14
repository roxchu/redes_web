let slideIndex = 0; // Índice de la imagen actual
const slides = document.querySelectorAll('.carrusel-slide'); // Todas las imágenes
const dots = document.querySelectorAll('.dot'); // Todos los indicadores

// Función para mostrar un slide específico
function showSlide(n) {
    // Si llegamos al final, volvemos al principio
    if (n >= slides.length) {
        slideIndex = 0;
    }
    // Si retrocedemos desde el principio, vamos al final
    if (n < 0) {
        slideIndex = slides.length - 1;
    }

    // Ocultar todos los slides y desactivar todos los puntos
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Mostrar el slide actual y activar su punto correspondiente
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

// Función para avanzar o retroceder el slide
function cambiarSlide(n) {
    showSlide(slideIndex += n);
}

// Función para ir directamente a un slide mediante los puntos
function currentSlide(n) {
    showSlide(slideIndex = n - 1); // Restamos 1 porque los arrays son base 0
}

// Inicializar el carrusel mostrando la primera imagen
showSlide(slideIndex);

// Opcional: Auto-reproducción
// setInterval(() => {
//     cambiarSlide(1);
// }, 3000); // Cambia cada 3 segundos