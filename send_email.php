<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = htmlspecialchars($_POST['nom']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "borde.titouan.47@gmail.com";
    $subject = "Nouveau message de " . $nom;
    $body = "Nom: $nom\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "Votre message a été envoyé avec succès.";
    } else {
        echo "Désolé, une erreur s'est produite. Veuillez réessayer.";
    }
} else {
    echo "Méthode de requête non autorisée.";
}
?>
