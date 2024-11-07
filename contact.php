<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = htmlspecialchars($_POST['nom']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "borde.titouan.47@gmail.com";
    $subject = "Nouveau message de contact";
    $body = "Nom: $nom\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo "Merci ! Votre message a été envoyé.";
    } else {
        echo "Erreur lors de l'envoi du message. Veuillez réessayer plus tard.";
    }
}
?>
