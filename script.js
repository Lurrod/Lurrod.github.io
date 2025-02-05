document.addEventListener('DOMContentLoaded', () => {
    const accueilHeading = document.querySelector('.accueil-heading');
    const subHeading = document.querySelector('.header-h3');
    const isEnglishVersion = window.location.pathname.includes('/en/');
    
    accueilHeading.textContent = '';
    
    function typewriterEffect(element, text, delay = 100) {
        let i = 0;
        element.textContent = '';
        function type() {
            if (i < text.length) {
                element.textContent = text.slice(0, i + 1);
                i++;
                setTimeout(type, delay);
            }
        }
        type();
    }
    
    typewriterEffect(accueilHeading, "Titouan Borde", 100);
    
    setTimeout(() => {
        if (subHeading) {
            subHeading.style.color = 'var(--text-color)';
            const text = isEnglishVersion ? 'Web Developer' : 'Développeur Web';
            createGlitchEffect(text, subHeading);
        }
    },);
});

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
            const cursor = document.createElement('span');
            cursor.innerHTML = '|';
            cursor.style.opacity = '1';
            cursor.style.marginLeft = '5px';
            cursor.style.animation = 'blink 1s infinite';
            element.appendChild(cursor);
        }
    }, 50);
}

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
        themeButton.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeButton.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

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

    function expandProject(card) {
        if (currentExpandedProject) return;

        const expandedProject = document.createElement('div');
        expandedProject.className = 'project-expanded';
        expandedProject.innerHTML = projectTemplate.innerHTML;

        expandedProject.querySelector('.project-title h3').textContent = card.dataset.title;
        expandedProject.querySelector('.project-description p').textContent = card.dataset.description;
        expandedProject.querySelector('.project-iframe').src = card.dataset.preview;
        expandedProject.querySelector('.github-link').href = card.dataset.github;
        expandedProject.querySelector('.preview-link').href = card.dataset.preview;
        const skills = card.dataset.skills.split(', ');
        const skillsList = expandedProject.querySelector('.project-skills');
        skillsList.innerHTML = ''; // Vide la liste avant d'ajouter de nouveaux éléments
        skills.forEach(skill => {
            const skillItem = document.createElement('li');
            skillItem.textContent = skill;
            skillsList.appendChild(skillItem);
        });

        document.body.appendChild(expandedProject);
        overlay.style.display = 'block';
        requestAnimationFrame(() => {
            expandedProject.style.display = 'block';
            overlay.style.opacity = '1';
        });

        document.body.style.overflow = 'hidden';

        currentExpandedProject = expandedProject;

        expandedProject.querySelector('.close-button').addEventListener('click', closeExpandedProject);
    }

    function closeExpandedProject() {
        if (!currentExpandedProject) return;

        currentExpandedProject.style.display = 'none';
        overlay.style.opacity = '0';
        setTimeout(() => {
            currentExpandedProject.remove();
            overlay.style.display = 'none';
            currentExpandedProject = null;
        }, 300);

        document.body.style.overflow = '';
    }

    projectCards.forEach((card) => {
        card.addEventListener('click', () => expandProject(card));
    });

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

        document.addEventListener("click", (e) => {
            if (!certificationMenu.contains(e.target) && !certificationButton.contains(e.target)) {
                certificationMenu.classList.add("hidden");
                certificationButton.classList.remove("active");
            }
        });
    }
});

document.getElementById('file').addEventListener('change', function (e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : 'Aucun fichier sélectionné';
    document.getElementById('file-name').textContent = fileName;
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
