<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Database credentials
$host = "localhost";
$db_name = "pekadb";
$username = "pekauser";
$password = "X3GoIcVQ24Y9I5g7kxjR";

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
            // KIRIM EMAIL NOTIFIKASI
            $to = "official@pekamerawatnegeri.com";
            $subject = "Pesan Baru dari Website: " . $data->name;
            $email_content = "Nama: " . $data->name . "\n";
            $email_content .= "Email: " . $data->email . "\n\n";
            $email_content .= "Pesan:\n" . $data->message;
            $headers = "From: webmaster@pekamerawatnegeri.com";

            mail($to, $subject, $email_content, $headers);

            http_response_code(201);
            echo json_encode(array("message" => "Pesan berhasil terkirim."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Gagal mengirim pesan ke database."));
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
