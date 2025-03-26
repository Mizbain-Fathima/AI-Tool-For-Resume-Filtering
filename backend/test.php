<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

echo json_encode([
    'success' => true,
    'message' => 'Backend is working',
    'received_files' => $_FILES['resumes']['name'] ?? [],
    'job_description' => $_POST['jobDescription'] ?? ''
]);