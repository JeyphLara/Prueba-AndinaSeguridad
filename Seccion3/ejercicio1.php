<?php
// API REST simple en PHP puro para devolver usuarios recientes.
header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos.
$DB_HOST = 'localhost';
$DB_NAME = 'nombre_base_datos';
$DB_USER = 'usuario';
$DB_PASS = 'contraseña';

function conectarBaseDatos($host, $dbname, $user, $pass) {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $opciones = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    return new PDO($dsn, $user, $pass, $opciones);
}

function responderJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function manejarError($mensaje, $statusCode = 500) {
    responderJSON(['error' => $mensaje], $statusCode);
}

// Validar que el método HTTP sea GET.
$metodo = $_SERVER['REQUEST_METHOD'];
$ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$ruta = rtrim($ruta, '/');

if ($metodo !== 'GET') {
    manejarError('Método HTTP no permitido. Use GET.', 405);
}

// Permitir rutas que terminen en /usuarios/recientes,
// independientemente de la carpeta base donde se sirva la aplicación.
$endpointEsperado = '/usuarios/recientes';
if (substr($ruta, -strlen($endpointEsperado)) !== $endpointEsperado) {
    manejarError('Endpoint inválido. Ruta esperada: /usuarios/recientes', 404);
}

try {
    $pdo = conectarBaseDatos($DB_HOST, $DB_NAME, $DB_USER, $DB_PASS);
} catch (PDOException $e) {
    manejarError('Error de conexión a la base de datos: ' . $e->getMessage(), 500);
}

try {
    $sql = "SELECT id, nombre, email, fecha_registro FROM usuarios WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 30 DAY) ORDER BY fecha_registro DESC";
    $stmt = $pdo->query($sql);
    $usuarios = $stmt->fetchAll();
    responderJSON(['usuarios' => $usuarios], 200);
} catch (PDOException $e) {
    manejarError('Error en la consulta de usuarios: ' . $e->getMessage(), 500);
}
