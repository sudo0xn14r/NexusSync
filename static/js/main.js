document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    feather.replace();
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Handle loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Show loading screen when navigating to new page
    document.addEventListener('click', function(e) {
        // Check if the click is on a link that navigates within our site
        const target = e.target.closest('a');
        if (target && 
            target.href && 
            target.href.indexOf(window.location.origin) === 0 && 
            !target.getAttribute('data-bs-toggle') && // Exclude dropdown toggles
            !target.getAttribute('data-noloading') && // Allow exclusions
            !e.ctrlKey && !e.metaKey) { // Don't trigger on new tab/window opens
            
            // Show loading screen
            if (loadingScreen) {
                loadingScreen.classList.add('active');
            }
        }
    });
    
    // Hide loading screen when page is fully loaded
    window.addEventListener('load', function() {
        if (loadingScreen) {
            // Add a small delay to ensure smooth transition
            setTimeout(function() {
                loadingScreen.classList.remove('active');
            }, 300);
        }
    });
    
    // Only run authenticated page functionality if the elements exist
    // This prevents errors on the login/register pages
    const isAuthenticatedPage = document.body.classList.contains('authenticated-page');
    
    if (isAuthenticatedPage) {
        initializeAuthenticatedPageFeatures();
    }
    
    // Handle common functionality for all pages
    
    // Handle click-to-copy elements
    document.querySelectorAll('.click-to-copy').forEach(element => {
        element.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i data-feather="check" class="feather-sm"></i> Copied!';
                feather.replace();
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                    feather.replace();
                }, 2000);
            });
        });
    });
    
    // Add confirmation for dangerous actions
    document.querySelectorAll('[data-confirm]').forEach(element => {
        element.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm') || 'Are you sure you want to proceed?';
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
    
    // Handle auto-dismissing alerts
    document.querySelectorAll('.alert-auto-dismiss').forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000); // Dismiss after 5 seconds
    });
    
    // Add date-time formatting to elements with data-datetime attribute
    document.querySelectorAll('[data-datetime]').forEach(element => {
        const datetime = element.getAttribute('data-datetime');
        const date = new Date(datetime);
        element.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    });
    
    // Handle form validation styling and loading screen on form submission
    const forms = document.querySelectorAll('form');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            // Validate if it's a form that needs validation
            if (form.classList.contains('needs-validation')) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }
            
            // Only show loading if form is valid and doesn't have the no-loading attribute
            if (form.checkValidity() && !form.getAttribute('data-noloading')) {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('active');
                }
            }
        }, false);
    });
});

// Function to initialize features only for authenticated pages
function initializeAuthenticatedPageFeatures() {
    // Sidebar functionality
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    
    if (sidebar && content) {
        // Collapse sidebar on small screens by default
        function checkWidth() {
            if (window.innerWidth < 768) {
                sidebar.classList.add('collapsed');
                content.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                content.classList.remove('expanded');
            }
        }
        
        // Initial check
        checkWidth();
        
        // Check on resize
        window.addEventListener('resize', checkWidth);
        
        // Toggle sidebar functionality
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                content.classList.toggle('expanded');
            });
        }
        
        if (sidebarCollapseBtn) {
            sidebarCollapseBtn.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                content.classList.toggle('expanded');
            });
        }
        
        // Auto-expand active dropdown menus
        const activeLinks = document.querySelectorAll('.sidebar-dropdown-link.active');
        activeLinks.forEach(function(link) {
            const parentCollapse = link.closest('.collapse');
            if (parentCollapse) {
                new bootstrap.Collapse(parentCollapse).show();
            }
        });
    }
}
