<?php
// Set headers FIRST - this is critical
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Disable HTML errors completely and log to file
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/php_errors.log');
error_reporting(E_ALL);

// Create directories if they don't exist
$uploadDir = __DIR__.'/uploads/';
$resultsDir = __DIR__.'/results/';
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
if (!file_exists($resultsDir)) mkdir($resultsDir, 0777, true);

function jsonResponse($success, $data = [], $error = '', $code = 200) {
    http_response_code($code);
    $response = [
        'success' => $success,
        'data' => $data,
        'error' => $error
    ];
    echo json_encode($response);
    exit;
}

try {
    // Verify files were uploaded
    if (empty($_FILES['resumes']['tmp_name'][0])) {
        jsonResponse(false, [], 'No files uploaded', 400);
    }

    $maxFiles = 100; // Allow up to 100 resumes
    if (count($_FILES['resumes']['tmp_name']) > $maxFiles) {
        jsonResponse(false, [], "Too many files uploaded. Maximum allowed: $maxFiles", 400);
    }

    $rankedResumes = [];
    $allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    $maxFileSize = 50 * 1024 * 1024; // 50MB

    foreach ($_FILES['resumes']['tmp_name'] as $index => $tmpName) {
        if (!is_uploaded_file($tmpName)) continue;

        $fileSize = $_FILES['resumes']['size'][$index];
        $fileType = $_FILES['resumes']['type'][$index];
        $originalName = $_FILES['resumes']['name'][$index];

        if ($fileSize > $maxFileSize) {
            jsonResponse(false, [], "File too large: $originalName", 400);
        }

        if (!in_array($fileType, $allowedTypes)) {
            jsonResponse(false, [], "Invalid file type: $originalName", 400);
        }

        $safeName = preg_replace('/[^a-zA-Z0-9\.\-]/', '_', $originalName);
        $filename = time().'_'.$safeName;
        $targetPath = $uploadDir.$filename;

        if (!move_uploaded_file($tmpName, $targetPath)) {
            jsonResponse(false, [], "Failed to save file: $originalName", 500);
        }

        // Your actual ranking logic here
        $score = rand(70, 100);
        $skills = ['Testing', 'JIRA', 'Bug Reporting'];

        $rankedResumes[] = [
            'originalName' => $originalName,
            'score' => $score,
            'skills' => $skills,
            'experience' => rand(1, 10).' years'
        ];
    }

    jsonResponse(true, [
        'totalProcessed' => count($rankedResumes),
        'topCandidates' => $rankedResumes
    ]);

} catch (Exception $e) {
    jsonResponse(false, [], 'Server error: '.$e->getMessage(), 500);
}
