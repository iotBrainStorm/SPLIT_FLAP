document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Sidebar Navigation Logic ---
    const navItems = document.querySelectorAll("#nav-menu li");
    const views = document.querySelectorAll(".view");
    const pageTitle = document.getElementById("page-title");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            const targetViewId = item.getAttribute("data-target");
            views.forEach(view => view.classList.remove("active"));

            const targetView = document.getElementById(targetViewId);
            if (targetView) targetView.classList.add("active");

            const titleText = item.innerText.trim();
            pageTitle.innerText = `Dashboard ${titleText}`;
        });
    });

    // --- 2. Live Preview Interaction (Drag & Add/Remove) ---
    const addModuleBtn = document.querySelector('.add-module-btn');
    const flapContainer = document.getElementById('flap-container');
    const slider = document.querySelector('.display-chassis');
    
    // Drag-to-Scroll Variables
    let isDown = false;
    let isDragging = false; 
    let startX;
    let scrollLeft;

    // Grab & Scroll Events
    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragging = false;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5; 
            
            // If moved more than 5px, consider it a drag
            if (Math.abs(walk) > 5) {
                isDragging = true;
            }
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // Add Module Event
    if(addModuleBtn && flapContainer) {
        addModuleBtn.addEventListener('click', (e) => {
            if (isDragging) return; 

            const newFlap = document.createElement('div');
            newFlap.className = 'flap';
            newFlap.innerHTML = '-<span class="remove-module-btn" title="Remove"><i class="fa-solid fa-minus"></i></span>';
            
            flapContainer.insertBefore(newFlap, addModuleBtn);
            
            // Animate popup
            newFlap.style.opacity = '0';
            newFlap.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                newFlap.style.opacity = '1';
                newFlap.style.transform = 'scale(1)';
            }, 10);
            
            // Scroll to the end so user sees the new module
            if (slider) {
                setTimeout(() => {
                    slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
                }, 50);
            }
        });
    }

    // Remove Module Event (Event Delegation)
    if (flapContainer) {
        flapContainer.addEventListener('click', (e) => {
            if (isDragging) return; 

            const removeBtn = e.target.closest('.remove-module-btn');
            
            if (removeBtn) {
                const flapToRemove = removeBtn.closest('.flap');
                if (flapToRemove) {
                    flapToRemove.style.transform = 'scale(0)';
                    flapToRemove.style.opacity = '0';
                    
                    setTimeout(() => {
                        flapToRemove.remove();
                    }, 300); 
                }
            }
        });
    }

    // --- 3. Initial Load Animation ---
    const flaps = document.querySelectorAll('.flap');
    flaps.forEach((flap, index) => {
        flap.style.opacity = '0';
        setTimeout(() => {
            flap.style.opacity = '1';
        }, 150 * index);
    });
});