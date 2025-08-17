<?php
header('Content-Type: application/json');

// 1. Configuración de la base de datos
$servername = "localhost";
$username = "root"; // Usuario por defecto de XAMPP
$password = "";     // Contraseña por defecto de XAMPP
$dbname = "arcane_bd"; // Nombre de tu base de datos

// 2. Conectar a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 3. Consulta SQL para obtener los datos
$sql = "SELECT titulo, descripcion, nombre_archivo FROM bookart_pdfs";
$result = $conn->query($sql);

$bookart_data = array();

// 4. Recorrer los resultados y guardarlos en un array
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $bookart_data[] = $row;
    }
}

// 5. Devolver los datos como JSON
echo json_encode($bookart_data);

// Cerrar la conexión
$conn->close();
?>