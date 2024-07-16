<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if all required POST variables and files are set
    if (isset($_POST['album'], $_POST['songName'], $_POST['singerName'], $_FILES['mp3File'])) {
        $targetDir = "songs/" . $_POST['album'] . "/";

        echo "Target Directory: " . $targetDir . "<br>";

        // Ensure the 'songs' directory exists
        if (!is_dir($targetDir)) {
            if (!mkdir($targetDir, 0777, true)) {
                echo "<script>alert('Failed to create directories.'); window.location.href = 'upload.html';</script>";
                exit;
            } else {
                echo "Directory created successfully.<br>";
            }
        } else {
            echo "Directory already exists.<br>";
        }

        $songName = htmlspecialchars($_POST['songName']);
        $singerName = htmlspecialchars($_POST['singerName']);
        $fileName = $_FILES['mp3File']['name'];
        $fileTmpName = $_FILES['mp3File']['tmp_name'];

        echo "Uploaded File: " . $fileName . "<br>";
        echo "Temporary File: " . $fileTmpName . "<br>";

        // Validate file extension
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if ($fileExtension !== 'mp3') {
            echo "<script>alert('Invalid file type. Only MP3 files are allowed.'); window.location.href = 'upload.html';</script>";
            exit;
        }

        $newFileName = $songName . " - " . $singerName . "." . $fileExtension;
        $targetFile = $targetDir . basename($newFileName);

        echo "Target File: " . $targetFile . "<br>";

        // Move uploaded file to the target directory
        if (move_uploaded_file($fileTmpName, $targetFile)) {
            echo "<script>alert('File uploaded successfully.'); window.location.href = 'upload.html';</script>";
        } else {
            echo "<script>alert('Error uploading file.'); window.location.href = 'upload.html';</script>";
        }
    } else {
        echo "<script>alert('Missing form data.'); window.location.href = 'upload.html';</script>";
    }
} else {
    echo "<script>alert('Invalid request method.'); window.location.href = 'upload.html';</script>";
}
?>
