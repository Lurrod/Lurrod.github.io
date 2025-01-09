document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('toggleTheme');
    if (document.body.classList.contains('light-theme')) {
        themeButton.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeButton.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleLanguageButton = document.getElementById('toggleLanguage');
    const languageFlag = document.getElementById('languageFlag');
    let isFrench = true;
    toggleLanguageButton.addEventListener('click', () => {
        if (isFrench) {
            languageFlag.src = 'images/anglais.png';
        } else {
            languageFlag.src = 'images/france.png';
        }
        isFrench = !isFrench;
    });
});

function typewriterEffect(element, text, delay = 100) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }
    type();
}

const accueilHeading = document.querySelector('.accueil-heading');
accueilHeading.textContent = '';
typewriterEffect(accueilHeading, "TITOUAN BORDE");


document.addEventListener("keydown", function(event) {
    const sections = document.querySelectorAll(".section");
    let currentSectionIndex = Array.from(sections).findIndex(section =>
        section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top < window.innerHeight
    );

    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: "smooth" });
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (currentSectionIndex > 0) {
            sections[currentSectionIndex - 1].scrollIntoView({ behavior: "smooth" });
        }
    }
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Évitez que les clics sur les icônes déclenchent l'événement sur la carte
        if (e.target.closest('.icon-container')) return;

        card.classList.toggle('minimized');
        card.classList.toggle('expanded');

        // Change l'orientation de l'icône de flèche
        const icon = card.querySelector('.expand-icon');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    });
});

document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    emailjs.sendForm('service_4a3pj9b', 'template_j71c1xs', this)
        .then(() => {
            alert('Message envoyé avec succès !');
        }, (error) => {
            alert('Échec de l\'envoi du message...', error);
        });
});
