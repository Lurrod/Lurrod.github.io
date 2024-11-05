// Identifiant unique pour chaque carrousel
const carousels = document.querySelectorAll('.carousel');
carousels.forEach((carousel, index) => {
    let currentIndex = 0; // Index de départ pour chaque carrousel

    // Fonction pour changer d'image
    function moveCarousel(direction) {
        const images = carousel.querySelectorAll('.carousel-images img');
        images[currentIndex].classList.remove('active');
  
        currentIndex += direction;

        if (currentIndex < 0) {
            currentIndex = images.length - 1; // Aller à la dernière image
        } else if (currentIndex >= images.length) {
            currentIndex = 0; // Revenir à la première image
        }

        images[currentIndex].classList.add('active');
    }

    // Assigner les fonctions aux boutons
    carousel.querySelector('.prev').onclick = () => moveCarousel(-1);
    carousel.querySelector('.next').onclick = () => moveCarousel(1);
});
