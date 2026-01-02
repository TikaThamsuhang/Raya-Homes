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

    // --- Gallery Data & Logic ---
    const galleryImages = [
        "imgs/Single/img-1.png",
        "imgs/Single/img-bed-1.png",
        "imgs/Single/img-wash-1.png",
        "imgs/Single/img-kitchen-1.png",
        "imgs/Single/img-1.png", // Added for demo length
        "imgs/Single/img-bed-1.png",
        "imgs/Single/img-wash-1.png",
        "imgs/Single/img-kitchen-1.png",
        "imgs/Single/img-1.png",
        "imgs/Single/img-bed-1.png",
        "imgs/Single/img-wash-1.png", 
        "imgs/Single/img-kitchen-1.png"
    ];

    let currentGalleryIndex = 0;
    const galleryOverlay = document.getElementById('gallery-overlay');
    const galleryMainImage = document.getElementById('galleryMainImage');
    const galleryCounterIndex = document.getElementById('currentImageIndex');
    const galleryCounterTotal = document.getElementById('totalImages');
    const thumbnailStrip = document.getElementById('thumbnailStrip');

    // Initialize Total
    if(galleryCounterTotal) galleryCounterTotal.textContent = galleryImages.length;

    // Open Gallery Function
    window.openGallery = (index = 0) => {
        currentGalleryIndex = index;
        updateGalleryUI();
        if(galleryOverlay) {
            galleryOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
        }
    };

    // Close Gallery Function
    const closeGallery = () => {
        if(galleryOverlay) {
            galleryOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        }
    };

    // Update UI (Image, Counter, Thumbnails)
    const updateGalleryUI = () => {
        if(galleryMainImage) {
            // Add fade effect
            galleryMainImage.style.opacity = '0.5';
            setTimeout(() => {
                galleryMainImage.src = galleryImages[currentGalleryIndex];
                galleryMainImage.style.opacity = '1';
            }, 100);
        }
        
        if(galleryCounterIndex) galleryCounterIndex.textContent = currentGalleryIndex + 1;
        
        // Update Thumbnails
        renderThumbnails();
        scrollThumbnailIntoView();
    };

    // Render Thumbnails
    const renderThumbnails = () => {
        if(!thumbnailStrip) return;
        thumbnailStrip.innerHTML = galleryImages.map((img, idx) => `
            <div class="thumb ${idx === currentGalleryIndex ? 'active' : ''}" 
                 onclick="openGallery(${idx})">
                <img src="${img}" loading="lazy">
            </div>
        `).join('');
    };

    // Scroll active thumbnail into view
    const scrollThumbnailIntoView = () => {
        if(!thumbnailStrip) return;
        const activeThumb = thumbnailStrip.children[currentGalleryIndex];
        if(activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    // Navigation Controls
    const showNextImage = () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateGalleryUI();
    };

    const showPrevImage = () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        updateGalleryUI();
    };

    // Event Listeners
    document.getElementById('galleryNextBtn')?.addEventListener('click', showNextImage);
    document.getElementById('galleryPrevBtn')?.addEventListener('click', showPrevImage);
    document.getElementById('closeGalleryBtn')?.addEventListener('click', closeGallery);
    document.querySelector('.gallery-backdrop')?.addEventListener('click', closeGallery);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryOverlay?.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // Wire up "See all photos" button
    document.querySelector('.btn-see-all')?.addEventListener('click', () => openGallery(0));

    // Wire up Main Grid Images
    document.querySelectorAll('.gallery-main img, .thumb-item img').forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            // Map grid images to gallery index (simplified logic for demo)
            // Main image is index 0, thumbnails follow
            let targetIndex = 0;
            if (img.closest('.gallery-thumbnails')) {
                // Find index based on parent structure or just use simple math
                // For this demo, we'll just check the standard order
                const thumbs = Array.from(document.querySelectorAll('.thumb-item img'));
                targetIndex = thumbs.indexOf(img) + 1; // +1 because main image is 0
            }
            openGallery(targetIndex);
        });
    });

    // --- Map Toggle Logic ---
    const photoView = document.getElementById('photoView');
    const mapView = document.getElementById('mapView');
    const galleryFooter = document.querySelector('.gallery-footer'); // Get footer
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Tab UI
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle View
            const tabName = btn.getAttribute('data-tab');
            if (tabName === 'map') {
                photoView.classList.add('hidden');
                mapView.classList.remove('hidden');
                if(galleryFooter) galleryFooter.style.display = 'none'; // Hide footer
            } else {
                mapView.classList.add('hidden');
                photoView.classList.remove('hidden');
                if(galleryFooter) galleryFooter.style.display = 'flex'; // Show footer
            }
        });
    });

    // --- Hero Carousel Logic ---
    // Make the hero image interactive (sync with same gallery images)
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    const heroCounterIndex = document.getElementById('heroCurrentIndex');
    const heroCounterTotal = document.getElementById('heroTotalCount');
    const heroImage = document.querySelector('.gallery-main img');

    if(heroCounterTotal) heroCounterTotal.textContent = galleryImages.length;

    const updateHeroUI = () => {
        if(heroImage) {
            heroImage.style.opacity = '0.8';
            setTimeout(() => {
                heroImage.src = galleryImages[currentGalleryIndex];
                heroImage.style.opacity = '1';
            }, 100);
        }
        if(heroCounterIndex) heroCounterIndex.textContent = currentGalleryIndex + 1;
    };

    if(heroPrevBtn) {
        heroPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger openGallery
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
            updateHeroUI();
        });
    }

    if(heroNextBtn) {
        heroNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
            updateHeroUI();
        });
    }

    // Connect Hero Image Click to Open Gallery (Updated to sync index)
    if(heroImage) {
        // Remove old listener if any (cleaner way is to assume fresh load)
        // Since we replaced the listener above, we just ensure openGallery uses current index
        heroImage.addEventListener('click', () => {
            openGallery(currentGalleryIndex);
        });
    }

    // --- End Gallery Logic ---
});
