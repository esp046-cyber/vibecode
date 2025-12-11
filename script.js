// Mobile App JavaScript for Gemini 3 Vibe Coding Guide

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initializeCategoryFilter();
    initializeCopyFunctionality();
    initializeScrollEffects();
    initializeTouchInteractions();
});

// Category Filter System
function initializeCategoryFilter() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const contentItems = document.querySelectorAll('[data-category]');
    const sections = document.querySelectorAll('.content-section');

    categoryPills.forEach(pill => {
        pill.addEventListener('click', function() {
            const selectedCategory = this.dataset.category;
            
            // Update active pill
            categoryPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            // Filter content
            filterContent(selectedCategory, contentItems, sections);
            
            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
}

function filterContent(selectedCategory, contentItems, sections) {
    // Show/hide content items
    contentItems.forEach(item => {
        const itemCategories = item.dataset.category.split(',');
        
        if (selectedCategory === 'all' || itemCategories.includes(selectedCategory)) {
            item.classList.remove('hidden');
            // Stagger animation for smooth appearance
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 300ms ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, Math.random() * 100);
        } else {
            item.style.transition = 'all 200ms ease-in';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.classList.add('hidden');
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            }, 200);
        }
    });

    // Show/hide entire sections
    sections.forEach(section => {
        const sectionItems = section.querySelectorAll('[data-category]');
        const visibleItems = Array.from(sectionItems).filter(item => 
            !item.classList.contains('hidden')
        );
        
        if (visibleItems.length === 0) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.classList.add('hidden');
                section.style.opacity = '';
                section.style.transform = '';
            }, 300);
        } else {
            section.classList.remove('hidden');
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 400ms ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 50);
        }
    });
}

// Copy Code Functionality
function initializeCopyFunctionality() {
    window.copyCode = function(button) {
        const codeBlock = button.closest('.code-card').querySelector('.code-block code');
        const originalText = button.innerHTML;
        
        // Get code text
        const codeText = codeBlock.textContent;
        
        // Try to copy to clipboard
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(codeText).then(() => {
                showCopySuccess(button, originalText);
            }).catch(() => {
                fallbackCopyTextToClipboard(codeText, button, originalText);
            });
        } else {
            fallbackCopyTextToClipboard(codeText, button, originalText);
        }
    };
}

function fallbackCopyTextToClipboard(text, button, originalText) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button, originalText);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showCopyError(button, originalText);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess(button, originalText) {
    const originalSVG = button.innerHTML;
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
    `;
    button.classList.add('copy-success');
    
    // Add success animation
    button.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        button.innerHTML = originalSVG;
        button.classList.remove('copy-success');
        button.style.transform = '';
    }, 2000);
    
    // Show toast notification
    showToast('Code copied to clipboard!');
}

function showCopyError(button, originalText) {
    button.style.color = 'var(--error)';
    setTimeout(() => {
        button.style.color = '';
    }, 2000);
    showToast('Failed to copy code', 'error');
}

// Toast Notification System
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Toast styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'error' ? 'var(--error)' : 'var(--success)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '1000',
        opacity: '0',
        transition: 'all 300ms ease-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        maxWidth: '90%',
        textAlign: 'center'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.tip-card, .code-card, .pattern-card, .practice-item, .content-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 600ms ease-out';
        observer.observe(el);
    });
}

// Touch Interactions
function initializeTouchInteractions() {
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.tip-card, .category-pill, .code-card, .pattern-card, .practice-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Handle pull-to-refresh (optional)
    let startY = 0;
    let pullDistance = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (window.scrollY === 0) {
            pullDistance = e.touches[0].clientY - startY;
            
            if (pullDistance > 0 && pullDistance < 100) {
                document.body.style.transform = `translateY(${pullDistance * 0.5}px)`;
                document.body.style.transition = 'transform 0.1s ease-out';
            }
        }
    });
    
    document.addEventListener('touchend', function() {
        if (pullDistance > 50) {
            // Refresh functionality could go here
            showToast('Pull to refresh feature ready!', 'success');
        }
        
        document.body.style.transform = '';
        document.body.style.transition = 'transform 0.3s ease-out';
        pullDistance = 0;
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations or lazy loading here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Handle arrow key navigation for category pills
    if (e.target.classList.contains('category-pill')) {
        const pills = Array.from(document.querySelectorAll('.category-pill'));
        const currentIndex = pills.indexOf(e.target);
        
        let nextIndex;
        if (e.key === 'ArrowLeft') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : pills.length - 1;
        } else if (e.key === 'ArrowRight') {
            nextIndex = currentIndex < pills.length - 1 ? currentIndex + 1 : 0;
        } else {
            return;
        }
        
        e.preventDefault();
        pills[nextIndex].focus();
        pills[nextIndex].click();
    }
    
    // Handle Enter/Space for cards
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('tip-card')) {
        e.preventDefault();
        // Could trigger modal or expand functionality here
        showToast('Card interaction ready!', 'success');
    }
});

// Analytics and Performance Tracking (Optional)
function trackInteraction(action, element) {
    // Placeholder for analytics tracking
    console.log(`Interaction: ${action} on ${element}`);
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterContent,
        copyCode,
        showToast
    };
}