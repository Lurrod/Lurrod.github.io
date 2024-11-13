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
        footer_text: "\u00A9 2024 Titouan Borde.Tous droits réservés."
    },
    en: {
        title: "Titouan Borde Portfolio",
        accueil_heading: "Titouan Borde",
        accueil_subheading: "Web Developer",
        projets_heading: "Projects",
        projets_description: "Discover my recent projects, whether personal or for learning purposes.",
        projet1_title: "Project 1",
        projet1_description: "This project is one of the five required for my FreeCodeCamp web integrator certification. It’s a site offering sales of three types of apartments, it has a home page, a navigation menu and a contact page (all information presented on this site is artificial and invented as part of the exercise just like the contact form which is not functional)",
        projet2_title: "Project 2",
        projet2_description: "This project is one of the five required for my FreeCodeCamp web integrator certification. It's a documentation site, it has no particular function, but has a navigation bar on the left which allows you to navigate between the main parts of the site",
        projet3_title: "Project 3",
        projet3_description: "Description",
        competences_heading: "Skills",
        html_skill: "HTML 5",
        html_description: "",
        css_skill: "CSS",
        css_description: "",
        js_skill: "Javascript",
        js_description: "",
        contact_heading: "Contact",
        contact_description: "Feel free to reach out to discuss new opportunities or collaborations.",
        label_nom: "Name",
        label_email: "Email",
        label_message: "Message",
        submit_button: "Send",
        footer_text: "\u00A9 2024 Titouan Borde. All rights reserved."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const initialLanguage = document.documentElement.lang || 'fr';
    translatePage(initialLanguage);
});

function translatePage(language) {
    if (!translations[language]) {
        console.error(`No translations available for language: ${language}`);
        return;
    }

    Object.keys(translations[language]).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = translations[language][id];
        } else {
            console.warn(`No element found with id: ${id}`);
        }
    });
}
