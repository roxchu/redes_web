// script.js - Arcane Website Enhanced
// Inicialización y efectos visuales
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeScrollEffects();
    cargarBookart();
    initializeForum();
    initializeCarousel();
});

// --- EFECTOS VISUALES MEJORADOS ---
function initializeParticles() {
    createParticles();
    setInterval(createParticles, 12000);
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Limpiar partículas anteriores
    particlesContainer.innerHTML = '';
    
    // AUMENTAR cantidad de partículas para mejor cobertura
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Distribuir partículas aleatoriamente en toda la pantalla
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + 'vh'; // AÑADIDO: posición inicial aleatoria
        
        // Animaciones variadas
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
        
        // Tamaños variados para más profundidad
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

function initializeScrollEffects() {
    // Navegación suave mejorada
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efectos de parallax suave en scroll - ELIMINADO para evitar problemas
    // Las partículas ahora son fixed y cubren toda la pantalla
}

// --- CONTROL DEL CARRUSEL DE PERSONAJES ---
let slideIndexPersonajes = 0;
let slidesPersonajes;
let dotsPersonajes;
let infoButton;
let prevBtn;
let nextBtn;

function initializeCarousel() {
    slidesPersonajes = document.querySelectorAll('#carruselPersonajes .carrusel-slide');
    dotsPersonajes = document.querySelectorAll('#dotsPersonajes .dot');
    infoButton = document.querySelector('.info-button');
    prevBtn = document.querySelector('.prev');
    nextBtn = document.querySelector('.next');

    if (slidesPersonajes.length > 0) {
        showSlidePersonajes(slideIndexPersonajes);

        if (prevBtn) prevBtn.addEventListener('click', () => cambiarSlidePersonajes(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => cambiarSlidePersonajes(1));

        dotsPersonajes.forEach((dot, index) => {
            dot.addEventListener('click', () => currentSlidePersonajes(index));
        });

        if (infoButton) {
            infoButton.addEventListener('click', toggleInfoForCurrentSlide);
        }
    }
}

function showSlidePersonajes(n) {
    if (n >= slidesPersonajes.length) { slideIndexPersonajes = 0; }
    if (n < 0) { slideIndexPersonajes = slidesPersonajes.length - 1; }

    slidesPersonajes.forEach(slide => {
        slide.classList.remove('active');
        const infoContent = slide.querySelector('.info-content');
        if (infoContent) infoContent.classList.remove('active');
    });

    dotsPersonajes.forEach(dot => dot.classList.remove('active'));

    slidesPersonajes[slideIndexPersonajes]?.classList.add('active');
    dotsPersonajes[slideIndexPersonajes]?.classList.add('active');

    if (infoButton) infoButton.textContent = 'Más Info';
}

function cambiarSlidePersonajes(n) {
    showSlidePersonajes(slideIndexPersonajes += n);
}

function currentSlidePersonajes(n) {
    showSlidePersonajes(slideIndexPersonajes = n);
}

function toggleInfoForCurrentSlide() {
    const currentSlide = slidesPersonajes[slideIndexPersonajes];
    if (!currentSlide) return;
    const infoContent = currentSlide.querySelector('.info-content');
    if (infoContent) {
        infoContent.classList.toggle('active');
        if (infoContent.classList.contains('active')) {
            infoButton.textContent = 'Menos Info';
        } else {
            infoButton.textContent = 'Más Info';
        }
    }
}

// --- SISTEMA DE BOOKART ---
async function cargarBookart() {
    const bookartGaleria = document.getElementById('bookart-galeria');
    if (!bookartGaleria) return;
    
    bookartGaleria.innerHTML = '<p class="loading-message">Cargando arte...</p>';

    try {
        const response = await fetch('obtener_bookart.php');
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la base de datos.');
        }
        const bookart_data = await response.json();

        bookartGaleria.innerHTML = '';

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
            bookartGaleria.innerHTML = '<p class="loading-message">No se encontraron archivos de bookart.</p>';
        }

    } catch (error) {
        console.error("Error al cargar el bookart: ", error);
        bookartGaleria.innerHTML = '<p class="error-message">Error al cargar el bookart. Por favor, inténtalo de nuevo más tarde.</p>';
    }
}

// --- SISTEMA DE COMENTARIOS DEL FORO ---
function initializeForum() {
    const comentarioForm = document.getElementById('comentarioForm');
    const verComentariosBtn = document.getElementById('verComentariosBtn');
    const ocultarComentariosBtn = document.getElementById('ocultarComentariosBtn');
    const comentariosSection = document.getElementById('comentariosSection');
    const comentariosList = document.getElementById('comentariosList');
    const mensajeEstado = document.getElementById('mensajeEstado');

    if (comentarioForm) {
        comentarioForm.addEventListener('submit', enviarComentario);
    }
    
    if (verComentariosBtn) {
        verComentariosBtn.addEventListener('click', mostrarComentarios);
    }
    
    if (ocultarComentariosBtn) {
        ocultarComentariosBtn.addEventListener('click', ocultarComentarios);
    }

    async function enviarComentario(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombreUsuario').value.trim();
        const comentario = document.getElementById('comentarioTexto').value.trim();
        
        if (!nombre || !comentario) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            return;
        }

        const enviarBtn = document.getElementById('enviarBtn');
        const textoOriginal = enviarBtn.textContent;
        
        enviarBtn.innerHTML = '<span class="loading"></span> Enviando...';
        enviarBtn.disabled = true;

        try {
            const response = await fetch('comentarios.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    comentario: comentario
                })
            });

            const data = await response.json();

            if (data.success) {
                mostrarMensaje('¡Comentario enviado exitosamente!', 'exito');
                comentarioForm.reset();
                
                if (comentariosSection.style.display !== 'none') {
                    await cargarComentarios();
                }
            } else {
                mostrarMensaje(data.message || 'Error al enviar el comentario', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error de conexión. Intenta nuevamente.', 'error');
        } finally {
            enviarBtn.textContent = textoOriginal;
            enviarBtn.disabled = false;
        }
    }

    async function mostrarComentarios() {
        comentariosSection.style.display = 'block';
        verComentariosBtn.innerHTML = '<span class="loading"></span> Cargando...';
        verComentariosBtn.disabled = true;

        try {
            await cargarComentarios();
        } catch (error) {
            mostrarMensaje('Error al cargar comentarios', 'error');
        } finally {
            verComentariosBtn.textContent = 'Ver Comentarios';
            verComentariosBtn.disabled = false;
        }
    }

    async function cargarComentarios() {
        try {
            const response = await fetch('comentarios.php', {
                method: 'GET'
            });

            const data = await response.json();

            if (data.success) {
                mostrarListaComentarios(data.comentarios);
            } else {
                mostrarMensaje('Error al cargar comentarios', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error de conexión al cargar comentarios', 'error');
        }
    }

    function mostrarListaComentarios(comentarios) {
        if (comentarios.length === 0) {
            comentariosList.innerHTML = `
                <div class="comentario-item">
                    <p style="color: #888; text-align: center;">
                        No hay comentarios aún. ¡Sé el primero en comentar!
                    </p>
                </div>
            `;
            return;
        }

        comentariosList.innerHTML = comentarios.map(comentario => `
            <div class="comentario-item">
                <div class="comentario-autor">${escapeHtml(comentario.nombre)}</div>
                <div class="comentario-fecha">${formatearFecha(comentario.fecha_creacion)}</div>
                <div class="comentario-texto">${escapeHtml(comentario.comentario)}</div>
            </div>
        `).join('');
    }

    function ocultarComentarios() {
        comentariosSection.style.display = 'none';
    }

    function mostrarMensaje(mensaje, tipo) {
        mensajeEstado.textContent = mensaje;
        mensajeEstado.className = `mensaje-estado ${tipo}`;
        mensajeEstado.style.display = 'block';
        
        mensajeEstado.style.opacity = '0';
        mensajeEstado.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            mensajeEstado.style.transition = 'all 0.3s ease';
            mensajeEstado.style.opacity = '1';
            mensajeEstado.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            mensajeEstado.style.opacity = '0';
            mensajeEstado.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                mensajeEstado.style.display = 'none';
            }, 300);
        }, 5000);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatearFecha(fecha) {
        const date = new Date(fecha);
        const opciones = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-ES', opciones);
    }
}

// --- FUNCIONALIDAD PARA LA SECCIÓN CIUDADES ---
function setupCiudadesInfo() {
    const infoCiudadesBtn = document.querySelector('.info-ciudades-btn');
    const infoCiudadesContent = document.querySelector('.info-ciudades-content');

    if (infoCiudadesBtn && infoCiudadesContent) {
        infoCiudadesBtn.addEventListener('click', function() {
            if (infoCiudadesContent.style.display === 'none' || infoCiudadesContent.style.display === '') {
                infoCiudadesContent.style.display = 'block';
                infoCiudadesBtn.textContent = 'Ocultar Información de Ciudades';
            } else {
                infoCiudadesContent.style.display = 'none';
                infoCiudadesBtn.textContent = 'Ver Más Información de Ambas Ciudades';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', setupCiudadesInfo);