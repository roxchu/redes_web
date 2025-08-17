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

// foro.js - JavaScript para el sistema de comentarios
// Agrega esto a tu script.js existente

document.addEventListener('DOMContentLoaded', function() {
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
        
        // Mostrar estado de carga
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

    // Función para mostrar mensajes de estado
    function mostrarMensaje(mensaje, tipo) {
        mensajeEstado.textContent = mensaje;
        mensajeEstado.className = `mensaje-estado ${tipo}`;
        mensajeEstado.style.display = 'block';

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            mensajeEstado.style.display = 'none';
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

    // Función para validar longitud de texto en tiempo real
    const nombreInput = document.getElementById('nombreUsuario');
    const comentarioTextarea = document.getElementById('comentarioTexto');

    if (nombreInput) {
        nombreInput.addEventListener('input', function() {
            if (this.value.length > 100) {
                this.value = this.value.substring(0, 100);
                mostrarMensaje('El nombre no puede exceder 100 caracteres', 'info');
            }
        });
    }

    if (comentarioTextarea) {
        comentarioTextarea.addEventListener('input', function() {
            if (this.value.length > 1000) {
                this.value = this.value.substring(0, 1000);
                mostrarMensaje('El comentario no puede exceder 1000 caracteres', 'info');
            }
            
            // Mostrar contador de caracteres
            const contador = this.value.length;
            const max = 1000;
            
            // Crear o actualizar contador visual
            let contadorDiv = document.querySelector('.contador-caracteres');
            if (!contadorDiv) {
                contadorDiv = document.createElement('div');
                contadorDiv.className = 'contador-caracteres';
                contadorDiv.style.cssText = 'color: #888; font-size: 12px; text-align: right; margin-top: 5px;';
                this.parentNode.appendChild(contadorDiv);
            }
            contadorDiv.textContent = `${contador}/${max} caracteres`;
            
            // Cambiar color si está cerca del límite
            if (contador > max * 0.9) {
                contadorDiv.style.color = '#f44336';
            } else if (contador > max * 0.8) {
                contadorDiv.style.color = '#ff9800';
            } else {
                contadorDiv.style.color = '#888';
            }
        });
    }
});