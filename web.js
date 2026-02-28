// web.js - Complete version with all dashboard and authentication functionality
// FIXED: Using sessionStorage + delay for file:// protocol

// ============================================
// ===== Page Initialization and Login Check =====
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔵🔵🔵 WEB.JS STARTED 🔵🔵🔵');
    console.log('📌 Time:', new Date().toLocaleTimeString());
    console.log('📌 Page:', window.location.pathname);
    console.log('📌 Full URL:', window.location.href);
    console.log('📌 sessionStorage.isLoggedIn:', sessionStorage.getItem('isLoggedIn'));
    
    // Check which page we're on
    if (document.getElementById('loginForm')) {
        console.log('📝 Login page detected - setting up login page');
        setupLoginPage();
    } else {
        console.log('📊 Dashboard page detected - calling checkLoginAndSetup()');
        checkLoginAndSetup();
    }
    
    // Add global ESC key handler to close modals
    setupGlobalKeyHandlers();
});

// ============================================
// ===== 0. Global Handlers =====
// ============================================
function setupGlobalKeyHandlers() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close all active modals
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            const overlay = document.getElementById('overlay');
            if (overlay) overlay.classList.remove('active');
        }
    });
}

// ============================================
// ===== 1. Login Page Functions =====
// ============================================
function setupLoginPage() {
    console.log('🔵 setupLoginPage() started');
    
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerLink = document.getElementById('showRegisterModal');
    const registerModal = document.getElementById('registerModal');
    const overlay = document.getElementById('overlay');
    const closeRegisterBtn = document.getElementById('closeRegisterModal');
    const forgotLink = document.getElementById('forgotPassword');
    const forgotModal = document.getElementById('forgotModal');
    const closeForgotBtn = document.getElementById('closeForgotModal');
    const switchToLogin = document.getElementById('switchToLogin');
    const themeToggle = document.getElementById('themeToggle');
    
    // ===== Theme Toggle =====
    if (themeToggle) {
        // Load saved theme
        const savedTheme = sessionStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            updateThemeToggle(themeToggle, 'dark');
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            sessionStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeToggle(this, isDark ? 'dark' : 'light');
        });
    }
    
    // ===== Password Toggle for Login =====
    setupPasswordToggle('togglePassword', 'password');
    
    // ===== Login Form Submission (USING SESSION STORAGE) =====
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('🔵 LOGIN: Form submitted');
            
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const remember = document.getElementById('remember')?.checked || false;
            
            let isValid = true;
            
            // Reset errors
            emailError.textContent = '';
            passwordError.textContent = '';
            email.classList.remove('error');
            password.classList.remove('error');
            
            // Validate email
            if (!email.value.trim()) {
                emailError.textContent = 'Email is required';
                email.classList.add('error');
                isValid = false;
            } else if (!validateEmail(email.value)) {
                emailError.textContent = 'Please enter a valid email';
                email.classList.add('error');
                isValid = false;
            }
            
            // Validate password
            if (!password.value) {
                passwordError.textContent = 'Password is required';
                password.classList.add('error');
                isValid = false;
            } else if (password.value.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                password.classList.add('error');
                isValid = false;
            }
            
            if (isValid) {
                console.log('🔵 LOGIN: Validation passed');
                
                // Show loading
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
                
                // Save to sessionStorage IMMEDIATELY
                console.log('🔵 LOGIN: Saving to sessionStorage NOW');
                
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userName', email.value.split('@')[0]);
                sessionStorage.setItem('userEmail', email.value);
                
                console.log('🔵 LOGIN: sessionStorage.isLoggedIn =', sessionStorage.getItem('isLoggedIn'));
                
                if (remember) {
                    sessionStorage.setItem('rememberMe', 'true');
                }
                
                const profileData = {
                    fullName: email.value.split('@')[0],
                    jobTitle: 'Product Owner',
                    email: email.value
                };
                sessionStorage.setItem('profileData', JSON.stringify(profileData));
                
                // Add activity
                addActivity(`User logged in: ${email.value}`);
                
                // Verify sessionStorage was saved
                const savedValue = sessionStorage.getItem('isLoggedIn');
                console.log('🔵 LOGIN: Verification - isLoggedIn =', savedValue);
                
                if (savedValue === 'true') {
                    // Longer delay for file:// protocol (1000ms)
                    setTimeout(function() {
                        console.log('🔵 LOGIN: Redirecting to web.html');
                        console.log('🔵 LOGIN: Final sessionStorage check:', sessionStorage.getItem('isLoggedIn'));
                        
                        // Use replace to prevent back button issues
                        window.location.replace('web.html');
                    }, 1000);
                } else {
                    console.error('❌ LOGIN: sessionStorage save failed!');
                    showNotification('Login failed - please try again', 'error');
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;
                }
            } else {
                console.log('🔵 LOGIN: Validation failed');
            }
        });
    }
    
    // ===== Open Registration Modal =====
    if (registerLink && registerModal && overlay) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(registerModal, overlay);
        });
    }
    
    // ===== Close Registration Modal =====
    if (closeRegisterBtn && registerModal && overlay) {
        closeRegisterBtn.addEventListener('click', function() {
            closeModal(registerModal, overlay);
            document.getElementById('registerForm')?.reset();
        });
    }
    
    // ===== Switch to Login from Register Modal =====
    if (switchToLogin && registerModal && overlay) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(registerModal, overlay);
            document.getElementById('email')?.focus();
        });
    }
    
    // ===== Open Forgot Password Modal =====
    if (forgotLink && forgotModal && overlay) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(forgotModal, overlay);
        });
    }
    
    // ===== Close Forgot Password Modal =====
    if (closeForgotBtn && forgotModal && overlay) {
        closeForgotBtn.addEventListener('click', function() {
            closeModal(forgotModal, overlay);
            document.getElementById('forgotForm')?.reset();
        });
    }
    
    // ===== Registration Form Setup =====
    setupRegistrationForm();
    
    // ===== Forgot Password Form Setup =====
    setupForgotPasswordForm();
    
    // ===== Success Modal Setup =====
    setupSuccessModal();
}

// ============================================
// ===== 2. Modal Helper Functions =====
// ============================================
function openModal(modal, overlay) {
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Focus first input in modal
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function closeModal(modal, overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// ============================================
// ===== 3. Registration Form Setup =====
// ============================================
function setupRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const overlay = document.getElementById('overlay');
    const registerModal = document.getElementById('registerModal');
    const successModal = document.getElementById('successModal');
    
    if (!registerForm) return;
    
    // Setup password toggles for registration
    setupPasswordToggle('toggleRegPassword', 'regPassword');
    setupPasswordToggle('toggleRegConfirmPassword', 'regConfirmPassword');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('regFullName');
        const email = document.getElementById('regEmail');
        const password = document.getElementById('regPassword');
        const confirmPassword = document.getElementById('regConfirmPassword');
        const agreeTerms = document.getElementById('agreeTerms');
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-wrapper input').forEach(el => el.classList.remove('error'));
        
        let isValid = true;
        
        // Validate name
        if (!fullName.value.trim()) {
            document.getElementById('regNameError').textContent = 'Full name is required';
            fullName.classList.add('error');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            document.getElementById('regEmailError').textContent = 'Email is required';
            email.classList.add('error');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            document.getElementById('regEmailError').textContent = 'Please enter a valid email';
            email.classList.add('error');
            isValid = false;
        }
        
        // Validate password
        if (!password.value) {
            document.getElementById('regPasswordError').textContent = 'Password is required';
            password.classList.add('error');
            isValid = false;
        } else if (password.value.length < 6) {
            document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
            password.classList.add('error');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword.value) {
            document.getElementById('regConfirmError').textContent = 'Please confirm your password';
            confirmPassword.classList.add('error');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            document.getElementById('regConfirmError').textContent = 'Passwords do not match';
            confirmPassword.classList.add('error');
            isValid = false;
        }
        
        // Validate terms
        if (!agreeTerms.checked) {
            showNotification('Please agree to the Terms of Service and Privacy Policy', 'warning');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading
            registerBtn.classList.add('loading');
            registerBtn.disabled = true;
            
            // Simulate registration
            setTimeout(function() {
                registerBtn.classList.remove('loading');
                registerBtn.disabled = false;
                
                // Save user data
                sessionStorage.setItem('registeredUser', JSON.stringify({
                    name: fullName.value,
                    email: email.value
                }));
                
                // Add activity
                addActivity(`New user registered: ${email.value}`);
                
                // Close register modal
                closeModal(registerModal, overlay);
                registerForm.reset();
                
                // Show success modal
                const successMessage = document.getElementById('successMessage');
                if (successMessage) successMessage.textContent = 'Account created successfully!';
                openModal(successModal, overlay);
            }, 1500);
        }
    });
}

// ============================================
// ===== 4. Forgot Password Form Setup =====
// ============================================
function setupForgotPasswordForm() {
    const forgotForm = document.getElementById('forgotForm');
    const forgotModal = document.getElementById('forgotModal');
    const overlay = document.getElementById('overlay');
    
    if (!forgotForm) return;
    
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail');
        
        if (!email.value || !validateEmail(email.value)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        // Show loading
        const submitBtn = forgotForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate sending email
        setTimeout(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            showNotification(`Password reset link sent to ${email.value}`, 'success');
            closeModal(forgotModal, overlay);
            forgotForm.reset();
        }, 1500);
    });
}

// ============================================
// ===== 5. Success Modal Setup =====
// ============================================
function setupSuccessModal() {
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessModal');
    const gotoLoginBtn = document.getElementById('gotoLoginBtn');
    const overlay = document.getElementById('overlay');
    
    if (closeSuccessBtn && successModal && overlay) {
        closeSuccessBtn.addEventListener('click', function() {
            closeModal(successModal, overlay);
        });
    }
    
    if (gotoLoginBtn && successModal && overlay) {
        gotoLoginBtn.addEventListener('click', function() {
            closeModal(successModal, overlay);
            const emailField = document.getElementById('email');
            if (emailField) {
                emailField.focus();
                // Pre-fill email from registration
                const registeredUser = JSON.parse(sessionStorage.getItem('registeredUser') || '{}');
                if (registeredUser.email) emailField.value = registeredUser.email;
            }
        });
    }
}

// ============================================
// ===== 6. Helper Functions =====
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
        toggle.addEventListener('click', function() {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
}

function updateThemeToggle(toggle, theme) {
    if (!toggle) return;
    const icon = toggle.querySelector('i');
    const span = toggle.querySelector('span');
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
        span.textContent = 'Dark';
    } else {
        icon.className = 'fas fa-sun';
        span.textContent = 'Light';
    }
}

// ============================================
// ===== 7. Toast Notifications =====
// ============================================
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-circle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// ===== 8. Dashboard Functions =====
// ============================================

// ----- 8.1 Check Login and Setup Dashboard (FIXED with delay) -----
function checkLoginAndSetup() {
    console.log('🔵🔵🔵 checkLoginAndSetup() EXECUTED 🔵🔵🔵');
    console.log('📌 Checking sessionStorage.isLoggedIn =', sessionStorage.getItem('isLoggedIn'));
    
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        console.log('❌ Not logged in! Waiting 200ms and checking again...');
        
        // Wait a bit and check again (fix for file:// protocol timing)
        setTimeout(function() {
            const secondCheck = sessionStorage.getItem('isLoggedIn');
            console.log('📌 Second check - isLoggedIn =', secondCheck);
            
            if (secondCheck === 'true') {
                console.log('✅ Second check passed! Setting up dashboard...');
                setupDashboard();
            } else {
                console.log('❌ Still not logged in. Redirecting to front.html');
                window.location.href = 'front.html';
            }
        }, 200);
        
        return;
    }
    
    console.log('✅ Logged in immediately! Setting up dashboard...');
    setupDashboard();
}

// ----- 8.2 Setup Dashboard (extracted from checkLoginAndSetup) -----
function setupDashboard() {
    console.log('📌 Current URL:', window.location.href);
    console.log('📌 Setting up dashboard with isLoggedIn =', sessionStorage.getItem('isLoggedIn'));
    
    // Initialize tasks
    console.log('📌 Calling initializeTasks()');
    initializeTasks();
    
    // Update UI
    console.log('📌 Calling updateUserInterface()');
    updateUserInterface();
    
    // Update notification badge
    console.log('📌 Calling updateNotificationBadge()');
    updateNotificationBadge();
    
    // Setup all functions
    console.log('📌 Setting up all dashboard functions...');
    setupTabs();
    setupViewAllButton();
    setupSidebarToggle();
    setupDashboardThemeToggle();
    setupScrollToTop();
    setupLogout();
    setupCreateTaskModal();
    setupDeleteModal();
    setupFilterButtons();
    setupSearch();
    setupNotifications();
    setupMobileMenu();
    setupSettings();
    setupProfileTabs();
    setupProfileAvatar();
    setupProfileSave();
    
    // Update all views
    console.log('📌 Updating all views...');
    updateAllCounts();
    renderTasksList();
    renderBoard();
    setupDragAndDrop();
    renderBacklog();
    updateSprints();
    updateReports();
    
    // Load saved settings
    console.log('📌 Loading saved settings');
    loadSavedSettings();
    
    console.log('✅✅✅ Dashboard setup complete! ✅✅✅');
}

// ----- 8.3 Initialize Default Tasks -----
function initializeTasks() {
    console.log('📌 initializeTasks() called');
    
    if (!sessionStorage.getItem('tasks')) {
        console.log('📌 No tasks found, creating default tasks');
        const defaultTasks = [
            {
                id: 'task-1',
                title: 'Design system implementation',
                description: 'Create reusable components for the new design system',
                status: 'todo',
                priority: 'high',
                assignee: 'John Doe',
                dueDate: getDateString(2),
                comments: 2,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-2',
                title: 'API integration for user auth',
                description: 'Connect login system with backend endpoints',
                status: 'progress',
                priority: 'medium',
                assignee: 'Jane Smith',
                dueDate: getDateString(3),
                comments: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-3',
                title: 'Dashboard analytics charts',
                description: 'Implement real-time charts for sprint metrics',
                status: 'progress',
                priority: 'high',
                assignee: 'Mike Johnson',
                dueDate: getDateString(-1),
                comments: 3,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-4',
                title: 'Code review: Auth module',
                description: 'Review pull request #234',
                status: 'review',
                priority: 'low',
                assignee: 'Sara Ahmed',
                dueDate: getDateString(1),
                comments: 0,
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-5',
                title: 'Database schema design',
                description: 'Design initial database schema',
                status: 'done',
                priority: 'high',
                assignee: 'John Doe',
                dueDate: getDateString(-2),
                comments: 5,
                createdAt: new Date().toISOString()
            }
        ];
        sessionStorage.setItem('tasks', JSON.stringify(defaultTasks));
        console.log('📌 Default tasks created');
    } else {
        console.log('📌 Tasks already exist in sessionStorage');
    }
}

function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

// ----- 8.4 Update User Interface -----
function updateUserInterface() {
    const userName = sessionStorage.getItem('userName') || 'User';
    const userEmail = sessionStorage.getItem('userEmail') || 'user@example.com';
    
    document.querySelectorAll('.user-name, .user-name-display, #profile-name').forEach(el => {
        if (el) el.textContent = userName;
    });
    
    document.querySelectorAll('#profile-email, .user-email').forEach(el => {
        if (el) el.textContent = userEmail;
    });
    
    const welcomeElement = document.querySelector('.welcome-banner h2');
    if (welcomeElement) {
        welcomeElement.innerHTML = `Welcome back, <span class="user-name-display">${userName}</span>! 👋`;
    }
    
    document.querySelectorAll('.avatar img, .avatar-small img, #profile-avatar').forEach(img => {
        if (img) {
            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&size=128`;
        }
    });
}

// ----- 8.5 Update Notification Badge -----
function updateNotificationBadge() {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const overdueTasks = tasks.filter(task => {
        if (task.status === 'done') return false;
        return task.dueDate && task.dueDate < today;
    });
    
    badge.textContent = overdueTasks.length;
    badge.style.backgroundColor = overdueTasks.length > 0 ? '#ef4444' : '#64748b';
    
    sessionStorage.setItem('notificationData', JSON.stringify({
        overdue: overdueTasks.length
    }));
}

// ----- 8.6 Tabs System -----
function setupTabs() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.page-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionName = this.dataset.section;
            if (!sectionName) return;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Update data based on section
                if (sectionName === 'tasks') renderTasksList();
                if (sectionName === 'board') renderBoard();
                if (sectionName === 'backlog') renderBacklog();
                if (sectionName === 'sprints') updateSprints();
                if (sectionName === 'reports') updateReports();
                if (sectionName === 'profile') loadProfileData();
                if (sectionName === 'settings') loadSettingsData();
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Activate default tab
    setTimeout(() => {
        const defaultTab = document.querySelector('.nav-item[data-section="dashboard"]');
        if (defaultTab) defaultTab.click();
    }, 100);
}

// ----- 8.7 View All Button -----
function setupViewAllButton() {
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            const tasksTab = document.querySelector('[data-section="tasks"]');
            if (tasksTab) tasksTab.click();
        });
    }
}

// ----- 8.8 Sidebar Toggle -----
function setupSidebarToggle() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarSetting = document.getElementById('sidebarSetting');
    
    if (!toggle || !sidebar) return;
    
    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        const icon = toggle.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
            sessionStorage.setItem('sidebarCollapsed', 'true');
            if (sidebarSetting) sidebarSetting.value = 'collapsed';
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
            sessionStorage.setItem('sidebarCollapsed', 'false');
            if (sidebarSetting) sidebarSetting.value = 'expanded';
        }
    });
    
    if (sidebarSetting) {
        sidebarSetting.addEventListener('change', function() {
            if (this.value === 'collapsed') {
                sidebar.classList.add('collapsed');
                const icon = toggle.querySelector('i');
                icon.classList.remove('fa-chevron-left');
                icon.classList.add('fa-chevron-right');
                sessionStorage.setItem('sidebarCollapsed', 'true');
            } else {
                sidebar.classList.remove('collapsed');
                const icon = toggle.querySelector('i');
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-left');
                sessionStorage.setItem('sidebarCollapsed', 'false');
            }
        });
    }
}

// ----- 8.9 Dashboard Theme Toggle -----
function setupDashboardThemeToggle() {
    const themeSelect = document.getElementById('themeSelect');
    if (!themeSelect) return;
    
    const savedTheme = sessionStorage.getItem('theme') || 'light';
    themeSelect.value = savedTheme;
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
    
    themeSelect.addEventListener('change', function() {
        if (this.value === 'dark') {
            document.body.classList.add('dark-theme');
            sessionStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            sessionStorage.setItem('theme', 'light');
        }
    });
}

// ----- 8.10 Scroll to Top Button -----
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
        scrollBtn.classList.toggle('show', window.scrollY > 300);
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ----- 8.11 Logout -----
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'front.html';
    });
}

// ----- 8.12 Create/Edit Task Modal -----
function setupCreateTaskModal() {
    const createBtn = document.getElementById('createTaskBtn');
    const tasksCreateBtn = document.getElementById('tasksCreateBtn');
    const boardCreateBtn = document.getElementById('boardCreateBtn');
    const modal = document.getElementById('taskModal');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeTaskModal');
    const cancelBtn = document.getElementById('cancelModal');
    const form = document.getElementById('createTaskForm');
    const modalTitle = document.getElementById('modalTitle');
    const taskId = document.getElementById('taskId');
    
    if (!modal || !overlay) return;
    
    function openCreateModal() {
        modalTitle.textContent = 'Create New Task';
        taskId.value = '';
        form.reset();
        document.getElementById('taskDueDate').value = getDateString(3);
        openModal(modal, overlay);
    }
    
    window.openEditModal = function(id) {
        const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === id);
        
        if (task) {
            modalTitle.textContent = 'Edit Task';
            taskId.value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskAssignee').value = task.assignee || 'John Doe';
            document.getElementById('taskDueDate').value = task.dueDate || '';
            
            openModal(modal, overlay);
        }
    };
    
    function closeTaskModal() {
        closeModal(modal, overlay);
        form.reset();
    }
    
    if (createBtn) createBtn.addEventListener('click', openCreateModal);
    if (tasksCreateBtn) tasksCreateBtn.addEventListener('click', openCreateModal);
    if (boardCreateBtn) boardCreateBtn.addEventListener('click', openCreateModal);
    if (closeBtn) closeBtn.addEventListener('click', closeTaskModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeTaskModal);
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = taskId.value;
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const status = document.getElementById('taskStatus').value;
            const priority = document.getElementById('taskPriority').value;
            const assignee = document.getElementById('taskAssignee').value;
            const dueDate = document.getElementById('taskDueDate').value;
            
            let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
            
            if (id) {
                tasks = tasks.map(t => {
                    if (t.id === id) {
                        return { ...t, title, description, status, priority, assignee, dueDate };
                    }
                    return t;
                });
                addActivity(`Updated task: ${title}`);
                showNotification('Task updated successfully!', 'success');
            } else {
                const newTask = {
                    id: 'task-' + Date.now(),
                    title,
                    description,
                    status,
                    priority,
                    assignee,
                    dueDate,
                    comments: 0,
                    createdAt: new Date().toISOString()
                };
                tasks.push(newTask);
                addActivity(`Created task: ${title}`);
                showNotification('Task created successfully!', 'success');
            }
            
            sessionStorage.setItem('tasks', JSON.stringify(tasks));
            
            closeTaskModal();
            refreshAllViews();
            updateNotificationBadge();
        });
    }
}

// ----- 8.13 Delete Task Modal -----
function setupDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const overlay = document.getElementById('overlay');
    const closeDelete = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    const deleteTaskTitle = document.getElementById('deleteTaskTitle');
    
    let currentDeleteId = null;
    
    if (!deleteModal || !overlay) return;
    
    window.openDeleteModal = function(id, title) {
        currentDeleteId = id;
        if (deleteTaskTitle) deleteTaskTitle.textContent = title;
        openModal(deleteModal, overlay);
    };
    
    function closeDeleteModal() {
        closeModal(deleteModal, overlay);
        currentDeleteId = null;
    }
    
    if (closeDelete) closeDelete.addEventListener('click', closeDeleteModal);
    if (cancelDelete) cancelDelete.addEventListener('click', closeDeleteModal);
    
    if (confirmDelete) {
        confirmDelete.addEventListener('click', function() {
            if (currentDeleteId) {
                let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
                const deletedTask = tasks.find(t => t.id === currentDeleteId);
                tasks = tasks.filter(t => t.id !== currentDeleteId);
                sessionStorage.setItem('tasks', JSON.stringify(tasks));
                
                if (deletedTask) {
                    addActivity(`Deleted task: ${deletedTask.title}`);
                }
                
                closeDeleteModal();
                refreshAllViews();
                updateNotificationBadge();
                showNotification('Task deleted successfully!', 'success');
            }
        });
    }
}

// ----- 8.14 Filter Buttons -----
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTasksList();
        });
    });
}

// ----- 8.15 Search Functionality -----
function setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const term = this.value.toLowerCase().trim();
            const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
            
            const filtered = tasks.filter(t => 
                t.title.toLowerCase().includes(term) || 
                (t.description && t.description.toLowerCase().includes(term))
            );
            
            document.querySelector('[data-section="tasks"]').click();
            
            if (filtered.length === 0) {
                document.getElementById('tasks-list').innerHTML = `<p class="empty-message">No tasks found matching "${term}"</p>`;
            } else {
                let html = '';
                filtered.forEach(task => {
                    html += `
                        <div class="task-item" onclick="openEditModal('${task.id}')">
                            <div class="task-content">
                                <h4>${task.title} <span class="priority-badge ${task.priority}">${task.priority}</span></h4>
                                <p>${task.description || ''}</p>
                            </div>
                        </div>
                    `;
                });
                document.getElementById('tasks-list').innerHTML = html;
            }
            
            showNotification(`Found ${filtered.length} tasks`, 'info');
        }
    });
}

// ----- 8.16 Notifications Click -----
function setupNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            const notifData = JSON.parse(sessionStorage.getItem('notificationData')) || { overdue: 0 };
            
            if (notifData.overdue === 0) {
                showNotification('No overdue tasks!', 'info');
            } else {
                showNotification(`You have ${notifData.overdue} overdue tasks`, 'warning');
            }
        });
    }
}

// ----- 8.17 Mobile Menu -----
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });
}

// ----- 8.18 Settings -----
function setupSettings() {
    const emailNotifications = document.getElementById('emailNotifications');
    const taskReminders = document.getElementById('taskReminders');
    const languageSelect = document.getElementById('languageSelect');
    
    const settings = JSON.parse(sessionStorage.getItem('userSettings')) || {
        emailNotifications: true,
        taskReminders: true,
        language: 'en'
    };
    
    if (emailNotifications) emailNotifications.checked = settings.emailNotifications;
    if (taskReminders) taskReminders.checked = settings.taskReminders;
    if (languageSelect) languageSelect.value = settings.language;
    
    if (emailNotifications) {
        emailNotifications.addEventListener('change', function() {
            const settings = JSON.parse(sessionStorage.getItem('userSettings')) || {};
            settings.emailNotifications = this.checked;
            sessionStorage.setItem('userSettings', JSON.stringify(settings));
        });
    }
    
    if (taskReminders) {
        taskReminders.addEventListener('change', function() {
            const settings = JSON.parse(sessionStorage.getItem('userSettings')) || {};
            settings.taskReminders = this.checked;
            sessionStorage.setItem('userSettings', JSON.stringify(settings));
        });
    }
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const settings = JSON.parse(sessionStorage.getItem('userSettings')) || {};
            settings.language = this.value;
            sessionStorage.setItem('userSettings', JSON.stringify(settings));
            showNotification(`Language changed to ${this.value === 'en' ? 'English' : 'العربية'}`, 'info');
        });
    }
}

// ----- 8.19 Load Settings Data -----
function loadSettingsData() {
    const settings = JSON.parse(sessionStorage.getItem('userSettings')) || {
        emailNotifications: true,
        taskReminders: true,
        language: 'en'
    };
    
    document.getElementById('emailNotifications').checked = settings.emailNotifications;
    document.getElementById('taskReminders').checked = settings.taskReminders;
    document.getElementById('languageSelect').value = settings.language;
}

// ----- 8.20 Profile Functions -----
function loadProfileData() {
    const profileData = JSON.parse(sessionStorage.getItem('profileData')) || {
        fullName: sessionStorage.getItem('userName') || 'User',
        jobTitle: 'Product Owner',
        email: sessionStorage.getItem('userEmail') || 'user@example.com'
    };
    
    document.getElementById('profileFullName').value = profileData.fullName;
    document.getElementById('profileJobTitle').value = profileData.jobTitle;
    document.getElementById('profileEmail').value = profileData.email;
}

function setupProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    const panes = document.querySelectorAll('.profile-tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.profileTab;
            
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            this.classList.add('active');
            
            const targetPane = document.getElementById(`${tabName}-tab`);
            if (targetPane) targetPane.classList.add('active');
        });
    });
}

function setupProfileAvatar() {
    const changeBtn = document.getElementById('changeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatar = document.getElementById('profile-avatar');
    
    if (changeBtn && avatarUpload) {
        changeBtn.addEventListener('click', () => avatarUpload.click());
        
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileAvatar.src = e.target.result;
                    sessionStorage.setItem('profileAvatar', e.target.result);
                    showNotification('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    const savedAvatar = sessionStorage.getItem('profileAvatar');
    if (savedAvatar && profileAvatar) profileAvatar.src = savedAvatar;
}

function setupProfileSave() {
    const saveBtn = document.getElementById('saveProfileBtn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const profileData = {
                fullName: document.getElementById('profileFullName').value,
                jobTitle: document.getElementById('profileJobTitle').value,
                email: document.getElementById('profileEmail').value
            };
            
            sessionStorage.setItem('profileData', JSON.stringify(profileData));
            sessionStorage.setItem('userName', profileData.fullName);
            sessionStorage.setItem('userEmail', profileData.email);
            
            updateUserInterface();
            showNotification('Profile updated successfully!', 'success');
        });
    }
}

function addActivity(activity) {
    const activities = JSON.parse(sessionStorage.getItem('activities')) || [];
    activities.unshift({ text: activity, time: new Date().toLocaleString() });
    
    if (activities.length > 10) activities.pop();
    sessionStorage.setItem('activities', JSON.stringify(activities));
    
    // Update activity list if it's open
    loadActivity();
}

function loadActivity() {
    const activityList = document.getElementById('activityList');
    const activities = JSON.parse(sessionStorage.getItem('activities')) || [];
    
    if (!activityList) return;
    
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="empty-message">No recent activity</p>';
        return;
    }
    
    let html = '';
    activities.forEach(act => {
        html += `
            <div class="activity-item">
                <p>${act.text}</p>
                <small>${act.time}</small>
            </div>
        `;
    });
    
    activityList.innerHTML = html;
}

// ----- 8.21 Update All Counts -----
function updateAllCounts() {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    
    document.getElementById('dashboard-badge').textContent = tasks.length;
    document.getElementById('tasks-badge').textContent = tasks.length;
    document.getElementById('backlog-badge').textContent = tasks.filter(t => t.status === 'todo').length;
    
    document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('completed-tasks').textContent = tasks.filter(t => t.status === 'done').length;
    document.getElementById('inprogress-tasks').textContent = tasks.filter(t => t.status === 'progress').length;
    document.getElementById('pending-tasks').textContent = tasks.filter(t => ['todo', 'review'].includes(t.status)).length;
    
    updateRecentTasks();
    updateProfileStats();
}

function updateRecentTasks() {
    const recentList = document.getElementById('recent-tasks-list');
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    
    if (!recentList) return;
    
    if (tasks.length === 0) {
        recentList.innerHTML = '<p class="empty-message">No tasks yet. Create your first task!</p>';
        return;
    }
    
    // Last 3 tasks
    const recent = tasks.slice(-3).reverse();
    let html = '';
    
    recent.forEach(task => {
        html += `
            <div class="recent-task-item" onclick="openEditModal('${task.id}')">
                <span class="recent-task-title">${task.title}</span>
                <span class="priority-badge ${task.priority}">${task.priority}</span>
            </div>
        `;
    });
    
    recentList.innerHTML = html;
}

function updateProfileStats() {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    document.getElementById('profile-tasks').textContent = tasks.length;
    document.getElementById('profile-completed').textContent = tasks.filter(t => t.status === 'done').length;
}

// ----- 8.22 Render Tasks List -----
function renderTasksList() {
    const tasksList = document.getElementById('tasks-list');
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    if (!tasksList) return;
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="empty-message">No tasks yet. Click "New Task" to create one.</p>';
        return;
    }
    
    // Filter tasks
    let filteredTasks = tasks;
    if (activeFilter !== 'all') {
        filteredTasks = tasks.filter(t => t.status === activeFilter);
    }
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<p class="empty-message">No tasks match the selected filter.</p>';
        return;
    }
    
    let html = '';
    filteredTasks.forEach(task => {
        const today = new Date().toISOString().split('T')[0];
        const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'done';
        
        html += `
            <div class="task-item" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.status === 'done' ? 'checked' : ''} onchange="toggleTaskStatus('${task.id}')">
                <div class="task-content">
                    <div class="task-header">
                        <h4>${task.title}</h4>
                        <span class="priority-badge ${task.priority}">${task.priority}</span>
                        <span class="status-badge ${task.status}">${formatStatus(task.status)}</span>
                    </div>
                    <p class="task-description">${task.description || 'No description'}</p>
                    <div class="task-meta">
                        <span><i class="fas fa-user"></i> ${task.assignee || 'Unassigned'}</span>
                        <span><i class="far fa-calendar ${isOverdue ? 'overdue' : ''}"></i> ${formatDate(task.dueDate)}</span>
                        <span><i class="far fa-comment"></i> ${task.comments || 0}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn" onclick="openEditModal('${task.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="openDeleteModal('${task.id}', '${task.title.replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    tasksList.innerHTML = html;
}

// ----- 8.23 Toggle Task Status -----
window.toggleTaskStatus = function(taskId) {
    let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    
    tasks = tasks.map(t => {
        if (t.id === taskId) {
            const newStatus = t.status === 'done' ? 'todo' : 'done';
            addActivity(`Marked "${t.title}" as ${newStatus === 'done' ? 'completed' : 'pending'}`);
            return { ...t, status: newStatus };
        }
        return t;
    });
    
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
    refreshAllViews();
    updateNotificationBadge();
};

// ----- 8.24 Render Kanban Board -----
function renderBoard() {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    
    const todoCol = document.getElementById('todo-column');
    const progressCol = document.getElementById('progress-column');
    const reviewCol = document.getElementById('review-column');
    const doneCol = document.getElementById('done-column');
    
    if (todoCol) todoCol.innerHTML = '';
    if (progressCol) progressCol.innerHTML = '';
    if (reviewCol) reviewCol.innerHTML = '';
    if (doneCol) doneCol.innerHTML = '';
    
    tasks.forEach(task => {
        const taskCard = createBoardTaskCard(task);
        const columnId = `${task.status}-column`;
        const column = document.getElementById(columnId);
        if (column) column.appendChild(taskCard);
    });
    
    document.getElementById('todo-count').textContent = tasks.filter(t => t.status === 'todo').length;
    document.getElementById('progress-count').textContent = tasks.filter(t => t.status === 'progress').length;
    document.getElementById('review-count').textContent = tasks.filter(t => t.status === 'review').length;
    document.getElementById('done-count').textContent = tasks.filter(t => t.status === 'done').length;
}

function createBoardTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'board-task-card';
    card.draggable = true;
    card.dataset.taskId = task.id;
    
    card.innerHTML = `
        <div class="task-priority ${task.priority}">${task.priority}</div>
        <h5 onclick="openEditModal('${task.id}')">${task.title}</h5>
        <p>${task.description?.substring(0, 50) || ''}${task.description?.length > 50 ? '...' : ''}</p>
        <small><i class="fas fa-user"></i> ${task.assignee || 'Unassigned'}</small>
        <small><i class="far fa-calendar"></i> ${formatDate(task.dueDate)}</small>
    `;
    
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

// ----- 8.25 Drag and Drop System -----
function setupDragAndDrop() {
    const columns = document.querySelectorAll('.board-column');
    
    columns.forEach(col => {
        col.addEventListener('dragover', handleDragOver);
        col.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.closest('.board-task-card').dataset.taskId);
    e.target.closest('.board-task-card').classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.closest('.board-task-card').classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    const column = e.target.closest('.board-column');
    if (!column) return;
    
    const taskId = e.dataTransfer.getData('text/plain');
    const newStatus = column.dataset.status;
    
    if (taskId && newStatus) {
        let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
        let taskTitle = '';
        
        tasks = tasks.map(t => {
            if (t.id === taskId) {
                taskTitle = t.title;
                return { ...t, status: newStatus };
            }
            return t;
        });
        
        sessionStorage.setItem('tasks', JSON.stringify(tasks));
        
        if (taskTitle) {
            addActivity(`Moved "${taskTitle}" to ${formatStatus(newStatus)}`);
        }
        
        renderBoard();
        updateAllCounts();
        updateNotificationBadge();
        showNotification('Task moved', 'success');
    }
}

// ----- 8.26 Render Backlog -----
function renderBacklog() {
    const backlogList = document.getElementById('backlog-list');
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    const backlogTasks = tasks.filter(t => t.status === 'todo');
    
    document.getElementById('backlog-total').textContent = `${backlogTasks.length} items`;
    
    if (!backlogList) return;
    
    if (backlogTasks.length === 0) {
        backlogList.innerHTML = '<p class="empty-message">No backlog items.</p>';
        return;
    }
    
    let html = '';
    backlogTasks.forEach(task => {
        html += `
            <div class="backlog-item" onclick="openEditModal('${task.id}')">
                <span class="backlog-title">${task.title}</span>
                <span class="priority-badge ${task.priority}">${task.priority}</span>
            </div>
        `;
    });
    
    backlogList.innerHTML = html;
}

// ----- 8.27 Update Sprints -----
function updateSprints() {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('sprint-progress').textContent = `${progress}%`;
    document.getElementById('sprint-progress-bar').style.width = `${progress}%`;
    document.getElementById('sprint-completed').textContent = completed;
    document.getElementById('sprint-total').textContent = total;
}

// ----- 8.28 Update Reports -----
function updateReports() {
    const tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = tasks.filter(t => t.status === 'progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const done = tasks.filter(t => t.status === 'done').length;
    
    const distChart = document.getElementById('task-distribution-chart');
    if (distChart) {
        const max = Math.max(todo, progress, review, done, 1);
        distChart.innerHTML = `
            <div style="display: flex; height: 100px; align-items: flex-end; gap: 10px; padding: 10px;">
                <div style="flex:1; background: #94a3b8; height: ${(todo/max)*100}px; text-align: center; display: flex; align-items: flex-end; justify-content: center;">${todo}</div>
                <div style="flex:1; background: #2563eb; height: ${(progress/max)*100}px; text-align: center; display: flex; align-items: flex-end; justify-content: center;">${progress}</div>
                <div style="flex:1; background: #f59e0b; height: ${(review/max)*100}px; text-align: center; display: flex; align-items: flex-end; justify-content: center;">${review}</div>
                <div style="flex:1; background: #10b981; height: ${(done/max)*100}px; text-align: center; display: flex; align-items: flex-end; justify-content: center;">${done}</div>
            </div>
        `;
    }
    
    const rateChart = document.getElementById('completion-rate-chart');
    if (rateChart) {
        const rate = tasks.length > 0 ? (done / tasks.length) * 100 : 0;
        rateChart.innerHTML = `
            <div style="display: flex; height: 100px; align-items: center; justify-content: center;">
                <div style="width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(#10b981 0deg ${rate*3.6}deg, #e2e8f0 ${rate*3.6}deg 360deg); display: flex; align-items: center; justify-content: center;">
                    <span style="background: white; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${Math.round(rate)}%</span>
                </div>
            </div>
        `;
    }
}

// ----- 8.29 Refresh All Views -----
function refreshAllViews() {
    updateAllCounts();
    renderTasksList();
    renderBoard();
    renderBacklog();
    updateSprints();
    updateReports();
}

// ----- 8.30 Load Saved Settings -----
function loadSavedSettings() {
    if (sessionStorage.getItem('sidebarCollapsed') === 'true') {
        document.getElementById('sidebar').classList.add('collapsed');
        const icon = document.querySelector('#sidebarToggle i');
        if (icon) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
    }
    
    if (sessionStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// ----- 8.31 Helper Functions -----
function formatStatus(status) {
    const map = { 'todo': 'To Do', 'progress': 'In Progress', 'review': 'Review', 'done': 'Done' };
    return map[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// ===== 9. Dynamic Styles for Notifications =====
// ============================================
(function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .notification {
            background: white;
            color: #1e293b;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            animation: slideIn 0.3s ease;
            border-left: 4px solid;
            min-width: 300px;
        }
        
        .notification.warning {
            border-left-color: #f59e0b;
            background: #fffbeb;
        }
        
        .notification.success {
            border-left-color: #10b981;
            background: #f0fdf4;
        }
        
        .notification.info {
            border-left-color: #2563eb;
            background: #eff6ff;
        }
        
        .notification.error {
            border-left-color: #ef4444;
            background: #fef2f2;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification.warning i { color: #f59e0b; }
        .notification.success i { color: #10b981; }
        .notification.info i { color: #2563eb; }
        .notification.error i { color: #ef4444; }
        
        .notification.fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            to { opacity: 0; transform: translateX(100%); }
        }
        
        body.dark-theme .notification {
            background: #1e293b;
            color: #f1f5f9;
        }
        
        body.dark-theme .notification.warning {
            background: #422006;
        }
        
        body.dark-theme .notification.success {
            background: #064e3b;
        }
        
        body.dark-theme .notification.info {
            background: #1e3a8a;
        }
        
        body.dark-theme .notification.error {
            background: #7f1d1d;
        }
    `;
    document.head.appendChild(style);
})();

// ============================================
// ===== 10. Export functions to global scope =====
// ============================================
window.showNotification = showNotification;
window.validateEmail = validateEmail;
window.openModal = openModal;
window.closeModal = closeModal;
window.openEditModal = window.openEditModal;
window.openDeleteModal = window.openDeleteModal;
window.toggleTaskStatus = window.toggleTaskStatus;

console.log('🎉 All functions loaded successfully!');
