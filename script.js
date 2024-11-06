const canvas = document.getElementById('animatedBackground');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

const colors = [
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-1-dark').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-2-dark').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-3-dark').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-4-dark').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-5-dark').trim(),
];

const colorsLight = [
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-1-light').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-2-light').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-3-light').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-4-light').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--particle-color-5-light').trim(),
];

class Particle {
    constructor(x, y, size, velocityX, velocityY) {
        if (document.body.classList.contains('light-theme')) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.originalSize = size;
            this.color = colorsLight[Math.floor(Math.random() * colorsLight.length)];
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.alpha = 0.6;
        } else {
            this.x = x;
            this.y = y;
            this.size = size;
            this.originalSize = size;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.alpha = 0.6;
        }
    }

    update(mouse) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = 150;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 10;
            const directionY = forceDirectionY * force * 10;

            this.x += directionX;
            this.y += directionY;
            this.size = this.originalSize * 1.5;
        } else {
            this.size = this.originalSize;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < 0 || this.x > canvas.width) {
            this.velocityX = -this.velocityX;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.velocityY = -this.velocityY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
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

document.getElementById('toggleTheme').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('toggleTheme');
    if (document.body.classList.contains('light-theme')) {
        themeButton.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeButton.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

document.addEventListener("keydown", function(event) {
    const sections = document.querySelectorAll(".section");
    let currentSectionIndex = Array.from(sections).findIndex(section =>
        section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top < window.innerHeight
    );

    if (event.key === "ArrowDown") {
        event.preventDefault(); // Empêche le comportement par défaut de défilement
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

document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    emailjs.sendForm('service_4a3pj9b', 'template_j71c1xs', this)
        .then(() => {
            alert('Message envoyé avec succès !');
        }, (error) => {
            alert('Échec de l\'envoi du message...', error);
        });
});
