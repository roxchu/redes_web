// script.js - Arcane Website Enhanced
// Inicialización y efectos visuales
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeScrollEffects();
    cargarBookart();
    initializeForum();
    initializeCarousel(); // Función para inicializar el carrusel
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
    
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
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

    // Efectos de parallax suave en scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const particles = document.getElementById('particles');
        if (particles) {
            particles.style.transform = `translateY(${rate}px)`;
        }
    });
}

// --- CONTROL DEL CARRUSEL DE PERSONAJES (FUNCIONALIDAD CORREGIDA) ---
let slideIndexPersonajes = 0;
let slidesPersonajes;
let dotsPersonajes;
let infoButton;

function initializeCarousel() {
    slidesPersonajes = document.querySelectorAll('#carruselPersonajes .carrusel-slide');
    dotsPersonajes = document.querySelectorAll('#dotsPersonajes .dot');
    infoButton = document.querySelector('#carruselPersonajes .info-button'); // Apuntamos al botón dentro del carrusel

    if (slidesPersonajes.length > 0) {
        showSlidePersonajes(slideIndexPersonajes);
        
        // Conexión de los botones del carrusel
        document.querySelector('.prev').addEventListener('click', () => cambiarSlidePersonajes(-1));
        document.querySelector('.next').addEventListener('click', () => cambiarSlidePersonajes(1));
        
        dotsPersonajes.forEach((dot, index) => {
            dot.addEventListener('click', () => currentSlidePersonajes(index));
        });
        
        // Ahora el botón de info sí tiene una función asociada
        infoButton.addEventListener('click', toggleInfoForCurrentSlide);
    }
}

function showSlidePersonajes(n) {
    if (n >= slidesPersonajes.length) { slideIndexPersonajes = 0; }
    if (n < 0) { slideIndexPersonajes = slidesPersonajes.length - 1; }

    // Ocultar todos los slides y sus puntos
    slidesPersonajes.forEach(slide => {
        slide.classList.remove('active');
        const infoContent = slide.querySelector('.info-content');
        if (infoContent) {
            infoContent.classList.remove('active');
        }
    });
    
    dotsPersonajes.forEach(dot => dot.classList.remove('active'));

    // Mostrar el slide y el punto actual
    if (slidesPersonajes[slideIndexPersonajes]) {
        slidesPersonajes[slideIndexPersonajes].classList.add('active');
    }
    if (dotsPersonajes[slideIndexPersonajes]) {
        dotsPersonajes[slideIndexPersonajes].classList.add('active');
    }

    // Asegurar que el botón muestre "Más Info"
    if (infoButton) {
        infoButton.textContent = 'Más Info';
    }
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

// --- SISTEMA DE BOOKART (FUNCIONALIDAD ORIGINAL MANTENIDA) ---
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

// --- SISTEMA DE COMENTARIOS DEL FORO (FUNCIONALIDAD ORIGINAL MANTENIDA) ---
function initializeForum() {
    const comentarioForm = document.getElementById('comentarioForm');
    const verComentariosBtn = document.getElementById('verComentariosBtn');
    const ocultarComentariosBtn = document.getElementById('ocultarComentariosBtn');
    const comentariosSection = document.getElementById('comentariosSection');
    const comentariosList = document.getElementById('comentariosList');
    const mensajeEstado = document.getElementById('mensajeEstado');

    // Event listeners
    if (comentarioForm) {
        comentarioForm.addEventListener('submit', enviarComentario);
    }
    
    if (verComentariosBtn) {
        verComentariosBtn.addEventListener('click', mostrarComentarios);
    }
    
    if (ocultarComentariosBtn) {
        ocultarComentariosBtn.addEventListener('click', ocultarComentarios);
    }

    // Función para enviar comentario
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
        
        // Mostrar estado de carga con animación mejorada
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
                
                // Si los comentarios están visibles, recargarlos
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
            // Restaurar botón
            enviarBtn.textContent = textoOriginal;
            enviarBtn.disabled = false;
        }
    }

    // Función para mostrar comentarios
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

    // Función para cargar comentarios desde el servidor
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

    // Función para mostrar la lista de comentarios
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

    // Función para ocultar comentarios
    function ocultarComentarios() {
        comentariosSection.style.display = 'none';
    }

    // Función para mostrar mensajes de estado con animación
    function mostrarMensaje(mensaje, tipo) {
        mensajeEstado.textContent = mensaje;
        mensajeEstado.className = `mensaje-estado ${tipo}`;
        mensajeEstado.style.display = 'block';
        
        // Animación de entrada
        mensajeEstado.style.opacity = '0';
        mensajeEstado.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            mensajeEstado.style.transition = 'all 0.3s ease';
            mensajeEstado.style.opacity = '1';
            mensajeEstado.style.transform = 'translateY(0)';
        }, 10);

        // Ocultar mensaje después de 5 segundos con animación
        setTimeout(() => {
            mensajeEstado.style.opacity = '0';
            mensajeEstado.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                mensajeEstado.style.display = 'none';
            }, 300);
        }, 5000);
    }

    // Función para escapar HTML y prevenir XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Función para formatear fecha
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

// --- NUEVA FUNCIONALIDAD PARA LA SECCIÓN CIUDADES ---
document.addEventListener('DOMContentLoaded', function() {
    // Asegurarse de que esta función se ejecute después de que el DOM esté completamente cargado
    setupCiudadesInfo();
});

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

// --- NUEVA FUNCIONALIDAD PARA LA SECCIÓN CIUDADES ---
document.addEventListener('DOMContentLoaded', function() {
    setupCiudadesInfo();
});

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