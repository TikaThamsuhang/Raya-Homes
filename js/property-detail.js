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

    // Description "Continue Reading" Toggle
    const readMoreBtn = document.querySelector('.read-more-link');
    const descContainer = document.getElementById('descriptionContainer');
    
    if(readMoreBtn && descContainer) {
        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = descContainer.classList.toggle('expanded');
            
            if (isExpanded) {
                readMoreBtn.innerHTML = 'Show Less <i class="fa-solid fa-chevron-up"></i>';
            } else {
                readMoreBtn.innerHTML = 'Continue Reading <i class="fa-solid fa-chevron-down"></i>';
            }
        });
    }

    // Image Slider Logic (Re-implemented for detail page if needed, or kept simple)
    // Currently the detail page uses a grid, so no slider logic needed yet for the main view.

    /* --- New Listings Carousel Logic --- */
    const track = document.getElementById('newListingsTrack');
    const prevBtn = document.getElementById('nl-prev');
    const nextBtn = document.getElementById('nl-next');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        
        const updateCarousel = () => {
             // Calculate width of one card + gap
             const card = track.querySelector('.carousel-card');
             if (!card) return;
             
             // Get card width including margin/gap isn't enough because flex gap is on parent
             // Easier approach: Get card width, and compute gap from localized style or rough check
             // But simpler: Move by percentage or by calculating step
             // Best: Get offsetWidth of card + gap (1.5rem = 24px)
             const cardWidth = card.offsetWidth;
             const gap = 24; // 1.5rem
             const moveAmount = cardWidth + gap;
             
             // Calculate max index
             // Total cards
             const totalCards = track.children.length;
             // Visible cards
             const containerWidth = track.parentElement.offsetWidth;
             const visibleCards = Math.floor(containerWidth / cardWidth);
             const maxIndex = totalCards - visibleCards;

             // Clamp index
             if (currentIndex < 0) currentIndex = 0;
             if (currentIndex > maxIndex) currentIndex = maxIndex;

             // Move
             const translateX = -(currentIndex * moveAmount);
             track.style.transform = `translateX(${translateX}px)`;

             // Update buttons
             prevBtn.classList.toggle('disabled', currentIndex === 0);
             nextBtn.classList.toggle('disabled', currentIndex >= maxIndex);
        };

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
        });

        // Update on resize
        window.addEventListener('resize', () => {
            // Reset or adjust
            updateCarousel();
        });
        
        // Initial check
        // Timeout to ensure rendering
        setTimeout(updateCarousel, 100);
    }

    /* --- Internal Card Image Slider Logic (Copied from property.js) --- */
    document.querySelectorAll('.listing-card').forEach(card => {
        const images = card.querySelectorAll('.image-slider img');
        const counter = card.querySelector('.slider-counter');
        const prevBtn = card.querySelector('.slider-btn.prev');
        const nextBtn = card.querySelector('.slider-btn.next');
        
        let currentIndex = 0;
        const totalImages = images.length;

        if (totalImages > 0) {
            // Update initial counter
            if (counter) counter.textContent = `1/${totalImages}`;

            const updateSlider = () => {
                // Update images
                images.forEach((img, index) => {
                    img.classList.toggle('active', index === currentIndex);
                });
                // Update counter
                if (counter) counter.textContent = `${currentIndex + 1}/${totalImages}`;
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent link nav if card is a link
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % totalImages;
                    updateSlider();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                    updateSlider();
                });
            }
        }
    });

    // Card Click Redirect Logic
    document.querySelectorAll('.listing-card').forEach(card => {
        card.style.cursor = 'pointer'; 
        card.addEventListener('click', (e) => {
            // New Listings carousel cards only? Or all listing cards (since we reuse class)
            // Ignore clicks on buttons or links (prev/next, fav, email agent)
            if (e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            // If already on detail page, dragging/clicking might just reload or do nothing
            // But user might want to click to "go to that property".
            // For demo purposes, reload or link to same page is fine.
            window.location.href = 'property-detail.html';
        });
    });
});
