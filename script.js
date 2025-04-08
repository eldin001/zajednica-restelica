document.addEventListener('DOMContentLoaded', function() {
    
    // Create a container for floating buttons
    const floatingButtonsContainer = document.createElement('div');
    floatingButtonsContainer.className = 'floating-buttons';
    document.body.appendChild(floatingButtonsContainer);
    
    // Move the language switcher into the container
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        document.body.removeChild(languageSwitcher);
        floatingButtonsContainer.appendChild(languageSwitcher);
    }
    
    // Create the back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top-button';
    backToTopButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>';
    backToTopButton.className = 'bg-blue-600 text-white';
    floatingButtonsContainer.appendChild(backToTopButton);
    
    // Function to scroll back to top
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide the back to top button and expand language switcher based on scroll
    function toggleBackToTopButton() {
        const languageSwitcher = document.querySelector('.language-switcher');
        
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
            // Expand language switcher to show text
            if (languageSwitcher) {
                languageSwitcher.classList.add('expanded');
            }
        } else {
            backToTopButton.classList.remove('visible');
            // Collapse language switcher to show only icon
            if (languageSwitcher) {
                languageSwitcher.classList.remove('expanded');
            }
        }
    }
    
    // Add listener for scroll event
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // Initialize button state
    toggleBackToTopButton();

    // Toggle menu functionality with class-based approach for no-scroll
    const menuButton = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && closeButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('menu-open'); // Add class to body to prevent scrolling
        });
        
        closeButton.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('menu-open'); // Remove class to enable scrolling
        });

        // Close menu when link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('menu-open'); 
            });
        });
    }
    
    // Smooth scrolling for all internal links
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
            // Create a temporary textarea to hold the text
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

    // Translation functionality
    let currentLanguage = 'bs'; // Default language is Bosnian
    
    // Translation button click handler
    const translateButton = document.getElementById('translate-button');
    if (translateButton) {
        translateButton.addEventListener('click', function() {
            currentLanguage = currentLanguage === 'bs' ? 'it' : 'bs';
            translatePage();
            
            // Update button text
            const buttonText = translateButton.querySelector('span');
            if (buttonText) {
                buttonText.textContent = buttonText.getAttribute(`data-${currentLanguage}`);
            }
        });
    }
    
    // Function to translate all elements with 'translate' class
    function translatePage() {
        const elementsToTranslate = document.querySelectorAll('.translate');
        
        elementsToTranslate.forEach(element => {
            const translatedText = element.getAttribute(`data-${currentLanguage}`);
            if (translatedText) {
                if (element.tagName.toLowerCase() === 'input' || 
                    element.tagName.toLowerCase() === 'textarea' || 
                    element.tagName.toLowerCase() === 'option') {
                    // For form elements
                    if (element.getAttribute('placeholder')) {
                        element.setAttribute('placeholder', translatedText);
                    } else {
                        element.value = translatedText;
                    }
                } else {
                    // For regular elements
                    element.innerHTML = translatedText;
                }
            }
        });
        
        // Update page language attribute
        document.documentElement.lang = currentLanguage;
    }

    // CAPTCHA and form handling - FIXED VERSION
    const form = document.getElementById('assistanceForm');
    const submitButton = document.getElementById('submitButton');
    const loadingButton = document.getElementById('loadingButton');
    const successMessage = document.getElementById('formSuccessMessage');
    const errorMessage = document.getElementById('formErrorMessage');
    const captchaChallenge = document.getElementById('captcha-challenge');
    const captchaAnswer = document.getElementById('captcha-answer');
    const refreshCaptchaButton = document.getElementById('refresh-captcha');
    const captchaError = document.getElementById('captcha-error');

    let currentCaptchaResult = 0;

    // Function to generate a new CAPTCHA
    function generateCaptcha() {
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * 2)]; 
        let num1, num2;
        
        if (operation === '+') {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            currentCaptchaResult = num1 + num2;
        } else if (operation === '-') {
            num1 = Math.floor(Math.random() * 10) + 11; 
            num2 = Math.floor(Math.random() * 10) + 1;
            currentCaptchaResult = num1 - num2;
        } else { // '×'
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
            currentCaptchaResult = num1 * num2;
        }
        
        captchaChallenge.textContent = `${num1} ${operation} ${num2}`;
        captchaAnswer.value = '';
        hideCaptchaError();
    }

    // Function to show CAPTCHA error
    function showCaptchaError() {
        captchaError.classList.remove('hidden');
    }

    // Function to hide CAPTCHA error
    function hideCaptchaError() {
        captchaError.classList.add('hidden');
    }

    // Function to check if CAPTCHA is correct
    function isCaptchaCorrect() {
        return parseInt(captchaAnswer.value, 10) === currentCaptchaResult;
    }

    // Initialize CAPTCHA if elements exist
    if (captchaChallenge && captchaAnswer && refreshCaptchaButton) {
        generateCaptcha();
        
        refreshCaptchaButton.addEventListener('click', generateCaptcha);
    }

    // Form submission handling - UNIFIED VERSION
    if (form && submitButton && loadingButton && successMessage && errorMessage) {
        // Remove any existing event listeners 
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Use the new form reference
        const form = document.getElementById('assistanceForm');
        
        // Add event listener with CAPTCHA validation
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check CAPTCHA first
            if (!isCaptchaCorrect()) {
                showCaptchaError();
                captchaAnswer.focus();
                return false;
            }
            
            // CAPTCHA is correct - hide error message
            hideCaptchaError();
            
            // Show loading state
            submitButton.classList.add('hidden');
            loadingButton.classList.remove('hidden');
            
            // Hide any existing messages
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
            
            // Submit the form
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
                throw new Error('Error in server response');
            })
            .then(data => {
                // Show success message
                successMessage.classList.remove('hidden');
                
                // Reset form
                form.reset();
                
                // Generate new CAPTCHA
                generateCaptcha();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Restore submit button
                loadingButton.classList.add('hidden');
                submitButton.classList.remove('hidden');
            })
            .catch(error => {
                // Show error message
                errorMessage.classList.remove('hidden');
                
                // Scroll to error message
                errorMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Restore submit button
                loadingButton.classList.add('hidden');
                submitButton.classList.remove('hidden');
                
                console.error('Error:', error);
            });
            
            return false;
        });
    }
});