document.addEventListener('DOMContentLoaded', function() {
    // ===== Existing Functionality =====
    // Update copyright year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // ===== New Dark Mode Functionality =====
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize dark mode
    function initDarkMode() {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true' || (savedMode === null && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
            updateToggleIcon(true);
        }
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
        updateToggleIcon(isDark);
    });

    // Update toggle icon
    function updateToggleIcon(isDark) {
        const moonIcon = darkModeToggle.querySelector('.fa-moon');
        const sunIcon = darkModeToggle.querySelector('.fa-sun');
        
        moonIcon.style.display = isDark ? 'none' : 'block';
        sunIcon.style.display = isDark ? 'block' : 'none';
        
        darkModeToggle.setAttribute('aria-label', 
            isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // System preference listener
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('darkMode')) {
            const isDark = e.matches;
            document.body.classList.toggle('dark-mode', isDark);
            updateToggleIcon(isDark);
        }
    });

    // ===== Color Palette Functionality =====
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            
            // Update CSS variables
            document.documentElement.style.setProperty('--highlight-color', color);
            
            // Calculate and set darker hover color
            const hoverColor = shadeColor(color, -20);
            document.documentElement.style.setProperty('--btn-hover', hoverColor);
            
            // Save to localStorage
            localStorage.setItem('customColor', color);
            localStorage.setItem('customHoverColor', hoverColor);
        });
    });

    // Apply saved color if exists
    const savedColor = localStorage.getItem('customColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--highlight-color', savedColor);
        document.documentElement.style.setProperty(
            '--btn-hover', 
            localStorage.getItem('customHoverColor') || shadeColor(savedColor, -20)
        );
    }

    // Helper function to darken/lighten colors
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1,3), 16);
        let G = parseInt(color.substring(3,5), 16);
        let B = parseInt(color.substring(5,7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = Math.min(255, Math.max(0, R));
        G = Math.min(255, Math.max(0, G));
        B = Math.min(255, Math.max(0, B));

        const RR = R.toString(16).padStart(2, '0');
        const GG = G.toString(16).padStart(2, '0');
        const BB = B.toString(16).padStart(2, '0');

        return `#${RR}${GG}${BB}`;
    }

    // Initialize everything
    initDarkMode();
});