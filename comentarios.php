<?php
// comentarios.php - Manejo de comentarios (con configuración incluida)

// Configuración de la base de datos
$servername = "localhost";
$username = "phpmyadmin"; // Usuario brindado por el colegio
$password = "RedesInformaticas"; // Contraseña brindada por el colegio
$dbname = "arcane_bd";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]));
}

header('Content-Type: application/json');

// Función para obtener comentarios
function obtenerComentarios($pdo) {
    $stmt = $pdo->query("SELECT * FROM comentarios ORDER BY fecha_creacion DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Función para agregar comentario
function agregarComentario($pdo, $nombre, $comentario) {
    $stmt = $pdo->prepare("INSERT INTO comentarios (nombre, comentario, fecha_creacion) VALUES (?, ?, NOW())");
    return $stmt->execute([$nombre, $comentario]);
}

// Manejar solicitudes
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Agregar comentario
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['nombre']) && isset($input['comentario'])) {
        $nombre = trim($input['nombre']);
        $comentario = trim($input['comentario']);
        
        if (empty($nombre) || empty($comentario)) {
            echo json_encode(['success' => false, 'message' => 'Nombre y comentario son requeridos']);
            exit;
        }
        
        if (agregarComentario($pdo, $nombre, $comentario)) {
            echo json_encode(['success' => true, 'message' => 'Comentario agregado exitosamente']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al agregar comentario']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    }
} elseif ($method === 'GET') {
    // Obtener comentarios
    $comentarios = obtenerComentarios($pdo);
    echo json_encode(['success' => true, 'comentarios' => $comentarios]);
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>