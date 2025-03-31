document.addEventListener('DOMContentLoaded', function() {
    // toggle menu
    const menuButton = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuButton.addEventListener('click', function() {
        mobileMenu.classList.remove('hidden');
    });
    
    closeButton.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
    });

    // chiudi menu quando clic
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // smmoth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
     // Copy IBAN functionality
const copyButton = document.getElementById('copy-iban');
const ibanText = document.getElementById('iban-number');
const tooltip = document.getElementById('copy-tooltip');

if (copyButton && ibanText && tooltip) {
    copyButton.addEventListener('click', function() {
        // Create a temporary textarea element to copy the text
        const textarea = document.createElement('textarea');
        textarea.value = ibanText.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show the tooltip
        tooltip.classList.remove('hidden');
        
        // Hide the tooltip after 2 seconds
        setTimeout(function() {
            tooltip.classList.add('hidden');
        }, 2000);
    });
}
    // Sistema di traduzione
    let currentLanguage = 'bs'; // Lingua predefinita: Bosniaco
    
    // Pulsante per cambiare lingua
    const translateButton = document.getElementById('translate-button');
    translateButton.addEventListener('click', function() {
        currentLanguage = currentLanguage === 'bs' ? 'it' : 'bs';
        translatePage();
        
        // Aggiorna il testo del pulsante
        const buttonText = translateButton.querySelector('span');
        buttonText.textContent = buttonText.getAttribute(`data-${currentLanguage}`);
    });
    
    // Funzione per tradurre la pagina
    function translatePage() {
        const elementsToTranslate = document.querySelectorAll('.translate');
        
        elementsToTranslate.forEach(element => {
            const translatedText = element.getAttribute(`data-${currentLanguage}`);
            if (translatedText) {
                if (element.tagName.toLowerCase() === 'input' || 
                    element.tagName.toLowerCase() === 'textarea' || 
                    element.tagName.toLowerCase() === 'option') {
                    // Per elementi del form
                    if (element.getAttribute('placeholder')) {
                        element.setAttribute('placeholder', translatedText);
                    } else {
                        element.value = translatedText;
                    }
                } else {
                    // Per elementi di testo normali
                    element.textContent = translatedText;
                }
            }
        });
        
        // Aggiorna l'attributo lang dell'HTML
        document.documentElement.lang = currentLanguage;
    }
});
document.addEventListener('DOMContentLoaded', function() {


// Gestione del form e feedback
const form = document.getElementById('assistanceForm');
const submitButton = document.getElementById('submitButton');
const loadingButton = document.getElementById('loadingButton');
const successMessage = document.getElementById('formSuccessMessage');
const errorMessage = document.getElementById('formErrorMessage');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Nascondi il pulsante di invio e mostra il pulsante di caricamento
        submitButton.classList.add('hidden');
        loadingButton.classList.remove('hidden');
        
        // Nascondi eventuali messaggi precedenti
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Invia il form usando Fetch API
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Errore nella risposta del server');
        })
        .then(data => {
            // Mostra il messaggio di successo
            successMessage.classList.remove('hidden');
            
            // Resetta il form
            form.reset();
            
            // Scorri fino al messaggio di successo
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Nascondi il pulsante di caricamento e mostra il pulsante di invio
            loadingButton.classList.add('hidden');
            submitButton.classList.remove('hidden');
        })
        .catch(error => {
            // Mostra il messaggio di errore
            errorMessage.classList.remove('hidden');
            
            // Scorri fino al messaggio di errore
            errorMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Nascondi il pulsante di caricamento e mostra il pulsante di invio
            loadingButton.classList.add('hidden');
            submitButton.classList.remove('hidden');
            
            console.error('Errore:', error);
        });
    });
}
});
