// Property Detail Page Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // Header Scroll Effect
    const header = document.querySelector('.detail-header');
    
    if (header) {
        const handleScroll = () => {
             if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Check immediately on load in case page is already scrolled
        handleScroll();
    }

    // Image Slider Logic (Re-implemented for detail page if needed, or kept simple)
    // Currently the detail page uses a grid, so no slider logic needed yet for the main view.
});
