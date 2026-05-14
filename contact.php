<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Database credentials
$host = "localhost";
$db_name = "peka_db";
$username = "peka_user";
$password = "PasswordPeka123!"; // Ganti dengan password yang Anda buat di database

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    if(!empty($data->name) && !empty($data->email) && !empty($data->message)){
        
        $query = "INSERT INTO inquiries (name, email, message) VALUES (:name, :email, :message)";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":message", $data->message);

        if($stmt->execute()){
            http_response_code(201);
            echo json_encode(array("message" => "Pesan berhasil terkirim."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Gagal mengirim pesan."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Data tidak lengkap."));
    }
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array("message" => "Database error: " . $exception->getMessage()));
}
?>
