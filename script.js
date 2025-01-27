// Fonction pour créer un effet de glitch sur le texte
function createGlitchEffect(text, element) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const originalText = text;
    let iterations = 0;
    const maxIterations = 15;
    
    const interval = setInterval(() => {
        element.innerText = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        iterations += 1/3;
        
        if (iterations >= originalText.length) {
            clearInterval(interval);
            element.innerText = originalText;
            // Ajouter un curseur clignotant après le texte
            const cursor = document.createElement('span');
            cursor.innerHTML = '|';
            cursor.style.opacity = '1';
            cursor.style.marginLeft = '5px';
            cursor.style.animation = 'blink 1s infinite';
            element.appendChild(cursor);
        }
    }, 50);
}

// Attendre que le contenu soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Animation du titre principal
    const accueilHeading = document.querySelector('.accueil-heading');
    accueilHeading.textContent = '';
    
    // Correction de la fonction typewriterEffect pour éviter la duplication des lettres
    function typewriterEffect(element, text, delay = 100) {
        let i = 0;
        element.textContent = ''; // Assurez-vous que l'élément est vide
        function type() {
            if (i < text.length) {
                element.textContent = text.slice(0, i + 1); // Utilisez slice au lieu d'ajouter des caractères
                i++;
                setTimeout(type, delay);
            }
        }
        type();
    }
    
    typewriterEffect(accueilHeading, "Titouan Borde", 100);

    // Animation du sous-titre après le titre principal
    setTimeout(() => {
        const subHeading = document.querySelector('.header-h3');
        if (subHeading) {
            subHeading.style.color = 'var(--text-color)'; // Garde la couleur blanche
            const originalText = subHeading.textContent;
            subHeading.textContent = '';
            createGlitchEffect('Web Developer', subHeading);
        }
    },);
});

// Ajouter le style CSS pour le curseur clignotant
const style = document.createElement('style');
style.textContent = `
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}
.header-h3 {
    font-family: 'Courier New', monospace;
    color: var(--text-color) !important; // Force la couleur blanche
}
`;

document.head.appendChild(style);
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

document.addEventListener('DOMContentLoaded', function () {
    const projectCards = document.querySelectorAll('.project-card');
    const projectTemplate = document.getElementById('projectTemplate');
    let currentExpandedProject = null;
    let overlay = null;

    // Création de l'overlay
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', closeExpandedProject);
    }

    createOverlay();

    // Fonction pour ouvrir un projet
    function expandProject(card) {
        if (currentExpandedProject) return;

        const expandedProject = document.createElement('div');
        expandedProject.className = 'project-expanded';
        expandedProject.innerHTML = projectTemplate.innerHTML;

        // Remplir les informations du projet
        expandedProject.querySelector('.project-title h3').textContent = card.dataset.title;
        expandedProject.querySelector('.project-description p').textContent = card.dataset.description;
        expandedProject.querySelector('.project-iframe').src = card.dataset.preview;
        expandedProject.querySelector('.github-link').href = card.dataset.github;
        expandedProject.querySelector('.preview-link').href = card.dataset.preview;

        // Ajouter au DOM
        document.body.appendChild(expandedProject);
        overlay.style.display = 'block';
        requestAnimationFrame(() => {
            expandedProject.style.display = 'block';
            overlay.style.opacity = '1';
        });

        // Désactiver le défilement du body
        document.body.style.overflow = 'hidden';

        // Stocker la référence du projet développé
        currentExpandedProject = expandedProject;

        // Ajouter les gestionnaires d'événements
        expandedProject.querySelector('.close-button').addEventListener('click', closeExpandedProject);
    }

    // Fonction pour fermer un projet
    function closeExpandedProject() {
        if (!currentExpandedProject) return;

        // Masquer et supprimer le projet développé
        currentExpandedProject.style.display = 'none';
        overlay.style.opacity = '0';
        setTimeout(() => {
            currentExpandedProject.remove();
            overlay.style.display = 'none';
            currentExpandedProject = null; // Réinitialiser après suppression
        }, 300); // Délai pour les animations

        // Réactiver le défilement du body
        document.body.style.overflow = '';
    }

    // Ajouter les événements pour chaque carte
    projectCards.forEach((card) => {
        card.addEventListener('click', () => expandProject(card));
    });

    // Gestion des touches "Échap" pour fermer un projet
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && currentExpandedProject) {
            closeExpandedProject();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const certificationButton = document.getElementById("certificationButton");
    const certificationMenu = document.getElementById("certificationMenu");
  
    if (certificationButton && certificationMenu) {
        certificationButton.addEventListener("click", () => {
            certificationMenu.classList.toggle("hidden");
            certificationButton.classList.toggle("active");
        });
  
        // Ferme le menu si clic en dehors
        document.addEventListener("click", (e) => {
            if (!certificationMenu.contains(e.target) && !certificationButton.contains(e.target)) {
                certificationMenu.classList.add("hidden");
                certificationButton.classList.remove("active");
            }
        });
    }
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
