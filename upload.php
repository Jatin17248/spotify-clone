<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $targetDir = "songs/";

    // Ensure the 'songs' directory exists
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $songName = $_POST['songName'];
    $singerName = $_POST['singerName'];
    $fileName = $_FILES['mp3File']['name'];
    $fileTmpName = $_FILES['mp3File']['tmp_name'];

    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $newFileName = $songName . " - " . $singerName . "." . $fileExtension;
    $targetFile = $targetDir . basename($newFileName);

    if (move_uploaded_file($fileTmpName, $targetFile)) {
        echo "<script>alert('File uploaded successfully.'); window.location.href = 'upload.html';</script>";
    } else {
        echo "<script>alert('Error uploading file.'); window.location.href = 'upload.html';</script>";
    }
} else {
    echo "<script>alert('Invalid request.'); window.location.href = 'upload.html';</script>";
}
?>
