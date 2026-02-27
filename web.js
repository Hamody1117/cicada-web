// web.js - النسخة الكاملة مع جميع الوظائف والربط

// ============================================
// ===== تهيئة الصفحة والتحقق من تسجيل الدخول =====
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ web.js loaded successfully');
    
    // التحقق من الصفحة الحالية
    if (document.getElementById('loginForm')) {
        console.log('📝 Login page detected');
        setupLoginPage();
    } else {
        console.log('📊 Dashboard page detected');
        checkLoginAndSetup();
    }
});

// ============================================
// ===== 1. وظائف صفحة تسجيل الدخول =====
// ============================================
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (username && email && password) {
            loginBtn.classList.add('loading');
            loginBtn.textContent = 'Loading...';
            
            setTimeout(function() {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', username);
                localStorage.setItem('userEmail', email);
                
                const profileData = {
                    fullName: username,
                    jobTitle: 'Product Owner',
                    email: email
                };
                localStorage.setItem('profileData', JSON.stringify(profileData));
                
                window.location.href = 'web.html';
            }, 1500);
        } else {
            alert('❌ Please enter all fields');
        }
    });
}

// ============================================
// ===== 2. التحقق من تسجيل الدخول وإعداد dashboard =====
// ============================================
function checkLoginAndSetup() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        window.location.href = 'front.html';
        return;
    }
    
    // تهيئة المهام
    initializeTasks();
    
    // تحديث واجهة المستخدم
    updateUserInterface();
    
    // تحديث جرس الإشعارات
    updateNotificationBadge();
    
    // إعداد جميع الوظائف
    setupTabs();
    setupViewAllButton(); // ربط View All
    setupSidebarToggle();
    setupThemeToggle();
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
    
    // تحديث كل العروض
    updateAllCounts();
    renderTasksList();
    renderBoard();
    renderBacklog();
    updateSprints();
    updateReports();
    
    // تحميل الإعدادات المحفوظة
    loadSavedSettings();
}

// ============================================
// ===== 3. تحديث واجهة المستخدم =====
// ============================================
function updateUserInterface() {
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    
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
            img.src = `https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=fff&size=128`;
        }
    });
}

// ============================================
// ===== 4. تهيئة المهام =====
// ============================================
function initializeTasks() {
    if (!localStorage.getItem('tasks')) {
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
        localStorage.setItem('tasks', JSON.stringify(defaultTasks));
    }
}

function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

// ============================================
// ===== 5. تحديث جرس الإشعارات =====
// ============================================
function updateNotificationBadge() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const overdueTasks = tasks.filter(task => {
        if (task.status === 'done') return false;
        return task.dueDate && task.dueDate < today;
    });
    
    badge.textContent = overdueTasks.length;
    badge.style.backgroundColor = overdueTasks.length > 0 ? '#ef4444' : '#64748b';
    
    localStorage.setItem('notificationData', JSON.stringify({
        overdue: overdueTasks.length
    }));
}

// ============================================
// ===== 6. نظام التبويبات =====
// ============================================
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
                
                // تحديث البيانات حسب القسم
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
    
    // تفعيل التبويب الافتراضي
    setTimeout(() => {
        const defaultTab = document.querySelector('.nav-item[data-section="dashboard"]');
        if (defaultTab) defaultTab.click();
    }, 100);
}

// ============================================
// ===== 7. ربط زر View All =====
// ============================================
function setupViewAllButton() {
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // تفعيل تبويب Tasks
            const tasksTab = document.querySelector('[data-section="tasks"]');
            if (tasksTab) {
                tasksTab.click();
            }
        });
    }
}

// ============================================
// ===== 8. طي القائمة الجانبية =====
// ============================================
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
            localStorage.setItem('sidebarCollapsed', 'true');
            if (sidebarSetting) sidebarSetting.value = 'collapsed';
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
            localStorage.setItem('sidebarCollapsed', 'false');
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
                localStorage.setItem('sidebarCollapsed', 'true');
            } else {
                sidebar.classList.remove('collapsed');
                const icon = toggle.querySelector('i');
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-left');
                localStorage.setItem('sidebarCollapsed', 'false');
            }
        });
    }
}

// ============================================
// ===== 9. تبديل الثيم =====
// ============================================
function setupThemeToggle() {
    const themeSelect = document.getElementById('themeSelect');
    if (!themeSelect) return;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeSelect.value = savedTheme;
    if (savedTheme === 'dark') document.body.classList.add('dark-theme');
    
    themeSelect.addEventListener('change', function() {
        if (this.value === 'dark') {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ============================================
// ===== 10. زر العودة للأعلى =====
// ============================================
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

// ============================================
// ===== 11. تسجيل الخروج =====
// ============================================
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'front.html';
    });
}

// ============================================
// ===== 12. إنشاء وتعديل المهام =====
// ============================================
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
        modal.classList.add('active');
        overlay.classList.add('active');
    }
    
    window.openEditModal = function(id) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
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
            
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    };
    
    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        form.reset();
    }
    
    if (createBtn) createBtn.addEventListener('click', openCreateModal);
    if (tasksCreateBtn) tasksCreateBtn.addEventListener('click', openCreateModal);
    if (boardCreateBtn) boardCreateBtn.addEventListener('click', openCreateModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
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
            
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
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
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            closeModal();
            refreshAllViews();
            updateNotificationBadge();
        });
    }
}

// ============================================
// ===== 13. حذف المهمة =====
// ============================================
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
        deleteModal.classList.add('active');
        overlay.classList.add('active');
    };
    
    function closeDeleteModal() {
        deleteModal.classList.remove('active');
        overlay.classList.remove('active');
        currentDeleteId = null;
    }
    
    if (closeDelete) closeDelete.addEventListener('click', closeDeleteModal);
    if (cancelDelete) cancelDelete.addEventListener('click', closeDeleteModal);
    
    if (confirmDelete) {
        confirmDelete.addEventListener('click', function() {
            if (currentDeleteId) {
                let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                const deletedTask = tasks.find(t => t.id === currentDeleteId);
                tasks = tasks.filter(t => t.id !== currentDeleteId);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                
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

// ============================================
// ===== 14. عرض قائمة المهام =====
// ============================================
function renderTasksList() {
    const tasksList = document.getElementById('tasks-list');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    if (!tasksList) return;
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<p class="empty-message">No tasks yet. Click "New Task" to create one.</p>';
        return;
    }
    
    // فلترة المهام
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
                    <button class="action-btn delete" onclick="openDeleteModal('${task.id}', '${task.title}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    tasksList.innerHTML = html;
}

// ============================================
// ===== 15. تبديل حالة المهمة =====
// ============================================
window.toggleTaskStatus = function(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks = tasks.map(t => {
        if (t.id === taskId) {
            const newStatus = t.status === 'done' ? 'todo' : 'done';
            addActivity(`Marked "${t.title}" as ${newStatus === 'done' ? 'completed' : 'pending'}`);
            return { ...t, status: newStatus };
        }
        return t;
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshAllViews();
    updateNotificationBadge();
};

// ============================================
// ===== 16. عرض لوحة كانبان =====
// ============================================
function renderBoard() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
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

// ============================================
// ===== 17. نظام السحب والإفلات =====
// ============================================
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
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let taskTitle = '';
        
        tasks = tasks.map(t => {
            if (t.id === taskId) {
                taskTitle = t.title;
                return { ...t, status: newStatus };
            }
            return t;
        });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        if (taskTitle) {
            addActivity(`Moved "${taskTitle}" to ${formatStatus(newStatus)}`);
        }
        
        renderBoard();
        updateAllCounts();
        updateNotificationBadge();
        showNotification('Task moved', 'success');
    }
}

// ============================================
// ===== 18. تحديث الإحصائيات =====
// ============================================
function updateAllCounts() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
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
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    if (!recentList) return;
    
    if (tasks.length === 0) {
        recentList.innerHTML = '<p class="empty-message">No tasks yet. Create your first task!</p>';
        return;
    }
    
    // آخر 3 مهام
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
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    document.getElementById('profile-tasks').textContent = tasks.length;
    document.getElementById('profile-completed').textContent = tasks.filter(t => t.status === 'done').length;
}

function renderBacklog() {
    const backlogList = document.getElementById('backlog-list');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
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

function updateSprints() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('sprint-progress').textContent = `${progress}%`;
    document.getElementById('sprint-progress-bar').style.width = `${progress}%`;
    document.getElementById('sprint-completed').textContent = completed;
    document.getElementById('sprint-total').textContent = total;
}

function updateReports() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const todo = tasks.filter(t => t.status === 'todo').length;
    const progress = tasks.filter(t => t.status === 'progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const done = tasks.filter(t => t.status === 'done').length;
    
    const distChart = document.getElementById('task-distribution-chart');
    if (distChart) {
        const max = Math.max(todo, progress, review, done, 1);
        distChart.innerHTML = `
            <div style="display: flex; height: 100px; align-items: flex-end; gap: 10px; padding: 10px;">
                <div style="flex:1; background: #94a3b8; height: ${(todo/max)*100}px; text-align: center;">${todo}</div>
                <div style="flex:1; background: #2563eb; height: ${(progress/max)*100}px; text-align: center;">${progress}</div>
                <div style="flex:1; background: #f59e0b; height: ${(review/max)*100}px; text-align: center;">${review}</div>
                <div style="flex:1; background: #10b981; height: ${(done/max)*100}px; text-align: center;">${done}</div>
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

function refreshAllViews() {
    updateAllCounts();
    renderTasksList();
    renderBoard();
    renderBacklog();
    updateSprints();
    updateReports();
}

// ============================================
// ===== 19. أزرار الفلترة =====
// ============================================
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

// ============================================
// ===== 20. البحث =====
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const term = this.value.toLowerCase().trim();
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
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
                        <div class="task-item">
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

// ============================================
// ===== 21. الإشعارات =====
// ============================================
function setupNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            const notifData = JSON.parse(localStorage.getItem('notificationData')) || { overdue: 0 };
            
            if (notifData.overdue === 0) {
                showNotification('No overdue tasks!', 'info');
            } else {
                showNotification(`You have ${notifData.overdue} overdue tasks`, 'warning');
            }
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i><span>${message}</span>`;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ============================================
// ===== 22. قائمة الموبايل =====
// ============================================
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

// ============================================
// ===== 23. الإعدادات =====
// ============================================
function setupSettings() {
    const emailNotifications = document.getElementById('emailNotifications');
    const taskReminders = document.getElementById('taskReminders');
    const languageSelect = document.getElementById('languageSelect');
    
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {
        emailNotifications: true,
        taskReminders: true,
        language: 'en'
    };
    
    if (emailNotifications) emailNotifications.checked = settings.emailNotifications;
    if (taskReminders) taskReminders.checked = settings.taskReminders;
    if (languageSelect) languageSelect.value = settings.language;
    
    if (emailNotifications) {
        emailNotifications.addEventListener('change', function() {
            const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
            settings.emailNotifications = this.checked;
            localStorage.setItem('userSettings', JSON.stringify(settings));
        });
    }
    
    if (taskReminders) {
        taskReminders.addEventListener('change', function() {
            const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
            settings.taskReminders = this.checked;
            localStorage.setItem('userSettings', JSON.stringify(settings));
        });
    }
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
            settings.language = this.value;
            localStorage.setItem('userSettings', JSON.stringify(settings));
            showNotification(`Language changed to ${this.value}`, 'info');
        });
    }
}

function loadSettingsData() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {
        emailNotifications: true,
        taskReminders: true,
        language: 'en'
    };
    
    document.getElementById('emailNotifications').checked = settings.emailNotifications;
    document.getElementById('taskReminders').checked = settings.taskReminders;
    document.getElementById('languageSelect').value = settings.language;
}

// ============================================
// ===== 24. وظائف البروفايل =====
// ============================================
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {
        fullName: localStorage.getItem('userName') || 'User',
        jobTitle: 'Product Owner',
        email: localStorage.getItem('userEmail') || 'user@example.com'
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
                    localStorage.setItem('profileAvatar', e.target.result);
                    showNotification('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    const savedAvatar = localStorage.getItem('profileAvatar');
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
            
            localStorage.setItem('profileData', JSON.stringify(profileData));
            localStorage.setItem('userName', profileData.fullName);
            localStorage.setItem('userEmail', profileData.email);
            
            updateUserInterface();
            showNotification('Profile updated successfully!', 'success');
        });
    }
}

function addActivity(activity) {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.unshift({ text: activity, time: new Date().toLocaleString() });
    
    if (activities.length > 10) activities.pop();
    localStorage.setItem('activities', JSON.stringify(activities));
    
    // تحديث قائمة النشاط إذا كانت مفتوحة
    loadActivity();
}

function loadActivity() {
    const activityList = document.getElementById('activityList');
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    
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

// ============================================
// ===== 25. دوال مساعدة =====
// ============================================
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
// ===== 26. تحميل الإعدادات المحفوظة =====
// ============================================
function loadSavedSettings() {
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        document.getElementById('sidebar').classList.add('collapsed');
        const icon = document.querySelector('#sidebarToggle i');
        if (icon) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
    }
    
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// ============================================
// ===== 27. إضافة الأنماط الديناميكية =====
// ============================================
(function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed; top: 20px; right: 20px; padding: 12px 20px;
            background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex; align-items: center; gap: 10px; z-index: 9999;
            border-left: 4px solid; animation: slideIn 0.3s ease;
        }
        .notification.warning { border-left-color: #f59e0b; }
        .notification.success { border-left-color: #10b981; }
        .notification.info { border-left-color: #2563eb; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .loading {
            opacity: 0.7; pointer-events: none; position: relative;
        }
        .loading::after {
            content: ''; position: absolute; width: 20px; height: 20px;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            border: 2px solid white; border-top-color: transparent;
            border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
    `;
    document.head.appendChild(style);
})();

console.log('🎉 All functions loaded successfully!');