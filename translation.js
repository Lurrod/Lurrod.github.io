// Dictionnaire de traductions
const translations = {
    fr: {
        title: "Titouan Borde Portfolio",
        accueil_heading: "Titouan Borde",
        accueil_subheading: "Développeur Web",
        projets_heading: "Projets",
        projets_description: "Découvrez mes projets récents, qu'ils soient personnels ou à des fins d'apprentissage.",
        projet1_title: "Projet 1",
        projet1_description: "Ce projet est un des 5 nécessaires pour valider ma certification FreeCodeCamp d'intégrateur web. C'est un site qui propose des ventes de 3 types d'appartements, il possède une page d'accueil un menu de navigation et une page de contact (toutes infos présentent sur ce site sont factices et inventer dans le cadre de l'exercice tout comme le formulaire de contact qui n'est pas fonctionnel)",
        projet2_title: "Projet 2",
        projet2_description: "Ce projet est un des 5 nécessaires pour valider ma certification FreeCodeCamp d'intégrateur web. C'est un site de documentation, il n'a pas de fonction particulière, mais dispose d'une barre de navigation sur la gauche qui permet de naviguer entre les grandes parties du site.",
        projet3_title: "Projet 3",
        projet3_description: "Description",
        competences_heading: "Compétences",
        html_skill: "HTML 5",
        html_description: "à compléter",
        css_skill: "CSS",
        css_description: "à compléter",
        js_skill: "Javascript",
        js_description: "à compléter",
        contact_heading: "Contact",
        contact_description: "N'hésitez pas à me contacter pour discuter de nouvelles opportunités ou collaborations.",
        label_nom: "Nom",
        label_email: "Email",
        label_message: "Message",
        submit_button: "Envoyer",
        footer_text: "Tous droits réservés."
    },
    en: {
        title: "Titouan Borde Portfolio",
        accueil_heading: "Titouan Borde",
        accueil_subheading: "Web Developer",
        projets_heading: "Projects",
        projets_description: "Discover my recent projects, whether personal or for learning purposes.",
        projet1_title: "Project 1",
        projet1_description: "This project is one of the five required for my FreeCodeCamp web integrator certification. It’s a site offering sales of three types of apartments",
        projet2_title: "Project 2",
        projet2_description: "This project is one of the five required for my FreeCodeCamp web integrator certification. It's a documentation site",
        projet3_title: "Project 3",
        projet3_description: "Description",
        competences_heading: "Skills",
        html_skill: "HTML 5",
        html_description: "to be completed",
        css_skill: "CSS",
        css_description: "to be completed",
        js_skill: "Javascript",
        js_description: "to be completed",
        contact_heading: "Contact",
        contact_description: "Feel free to reach out to discuss new opportunities or collaborations.",
        label_nom: "Name",
        label_email: "Email",
        label_message: "Message",
        submit_button: "Send",
        footer_text: "All rights reserved."
    }
};


let currentLanguage = 'fr';

function applyTranslations() {
    const elements = document.querySelectorAll("[id]");

    elements.forEach((element) => {
        const translationKey = element.id;
        if (translations[currentLanguage][translationKey]) {
            element.innerText = translations[currentLanguage][translationKey];
        }
    });
}


document.getElementById("toggleLanguage").addEventListener("click", () => {
    currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
    applyTranslations();
});


applyTranslations();