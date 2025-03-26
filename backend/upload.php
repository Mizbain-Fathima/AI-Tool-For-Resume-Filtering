<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$targetDir = "uploads/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

$response = [];
foreach ($_FILES['resumes']['tmp_name'] as $key => $tmpName) {
    $fileName = basename($_FILES['resumes']['name'][$key]);
    $targetFile = $targetDir . $fileName;
    if (move_uploaded_file($tmpName, $targetFile)) {
        $response[] = [
            'filename' => $fileName,
            'status' => 'success'
        ];
    } else {
        $response[] = [
            'filename' => $fileName,
            'status' => 'error'
        ];
    }
}

echo json_encode($response);
?>