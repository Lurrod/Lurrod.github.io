const canvas = document.getElementById('animatedBackground');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const colors = ['#ff4655', '#ff7e75', '#ffe4e6', '#ffbaba', '#ff4d4f']; // Palette de couleurs

class Particle {
    constructor(x, y, size, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.alpha = 0.6; // Transparence de base
    }

    update(mouse) {
        // Effet de dispersion avec la souris
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) { // Distance de dispersion
            this.x += dx / 10;
            this.y += dy / 10;
        }

        // Mise à jour de la position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Réduit la taille pour simuler une disparition progressive
        if (this.size > 0.2) {
            this.size -= 0.02;
        } else {
            // Si la particule est "disparue", on la réinitialise
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2;
        this.velocityX = (Math.random() - 0.5) * 1.5;
        this.velocityY = (Math.random() - 0.5) * 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha; // Transparence
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

// Génère les particules initiales
function init() {
    for (let i = 0; i < 200; i++) {
        const size = Math.random() * 5 + 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const velocityX = (Math.random() - 0.5) * 1.5;
        const velocityY = (Math.random() - 0.5) * 1.5;
        particlesArray.push(new Particle(x, y, size, velocityX, velocityY));
    }
}

// Variables pour détecter la position de la souris
const mouse = { x: null, y: null };
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        particle.update(mouse);
        particle.draw();
    });

    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray.length = 0;
    init();
});



document.addEventListener("DOMContentLoaded", () => {
    // Fonction pour activer l'animation des barres de compétence
    function activateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(skillBar => {
            skillBar.classList.add('visible');
        });
    }
    
    // Fonction pour désactiver l'animation des barres de compétence
    function deactivateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(skillBar => {
            skillBar.classList.remove('visible');
        });
    }
    // Configuration de l'observateur pour l'animation de la section compétences
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter un délai de 0.5 second pour démarrage de l'animation
                setTimeout(() => activateSkillBars(), 500);
            }
        });
    }, { threshold: 0.5 });
    // Observer la section compétences
    const competencesSection = document.getElementById('competences');
    if (competencesSection) {
        observer.observe(competencesSection);
    }
    
    // Ajouter un écouteur d'événement au lien "Compétences"
    const competencesLink = document.querySelector('a[href="#competences"]');
    competencesLink.addEventListener('click', (event) => {
        // Retirer les classes visibles pour réinitialiser l'animation
        deactivateSkillBars();
        setTimeout(() => activateSkillBars(), 1000);
    });
});

document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('toggleTheme');
    if (document.body.classList.contains('light-theme')) {
        themeButton.innerHTML = '<i class="fas fa-sun"></i>'; // Icône pour le mode clair
    } else {
        themeButton.innerHTML = '<i class="fas fa-moon"></i>'; // Icône pour le mode sombre
    }
});

document.addEventListener("keydown", function(event) {
    const sections = document.querySelectorAll(".section"); // Récupère toutes les sections
    let currentSectionIndex = Array.from(sections).findIndex(section =>
        section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top < window.innerHeight
    );

    if (event.key === "ArrowDown") {
        event.preventDefault(); // Empêche le comportement par défaut de défilement
        // Passe à la section suivante si elle existe
        if (currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: "smooth" });
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault(); // Empêche le comportement par défaut de défilement
        // Retourne à la section précédente si elle existe
        if (currentSectionIndex > 0) {
            sections[currentSectionIndex - 1].scrollIntoView({ behavior: "smooth" });
        }
    }
});