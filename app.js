// Adna Cleaning - Frontend Logic using localStorage

// --- Mock Database Initialization ---
function initDatabase() {
    if (!localStorage.getItem('adna_bookings')) {
        const initialBookings = [
            { id: 1, customer: 'Ahmed Ali', phone: '+252 61 123 4567', location: 'Hodan District, Mogadishu', service: 'Deep Cleaning', staff: 'hassan', date: '2026-10-24', time: '09:00', notes: '', status: 'Pending', createdAt: new Date().toISOString() },
            { id: 2, customer: 'Fatima Osman', phone: '+252 61 234 5678', location: 'Waberi, Mogadishu', service: 'Residential Cleaning', staff: 'sarah', date: '2026-10-25', time: '14:00', notes: 'Please call before arriving.', status: 'Approved', createdAt: new Date().toISOString() },
            { id: 3, customer: 'Mohamed Salad', phone: '+252 61 345 6789', location: 'Maka Al-Mukarama', service: 'Commercial Cleaning', staff: 'david', date: '2026-10-26', time: '08:00', notes: '', status: 'In Progress', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('adna_bookings', JSON.stringify(initialBookings));
    }

    if (!localStorage.getItem('adna_staff')) {
        const initialStaff = [
            { id: 'sarah', name: 'Sarah Johnson', role: 'Residential Expert', status: 'available', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
            { id: 'david', name: 'David Miller', role: 'Commercial Specialist', status: 'busy', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100' },
            { id: 'aisha', name: 'Aisha Omar', role: 'General Cleaner', status: 'available', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100' },
            { id: 'hassan', name: 'Hassan Ali', role: 'Deep Clean Expert', status: 'inactive', img: '' }
        ];
        localStorage.setItem('adna_staff', JSON.stringify(initialStaff));
    }

    if (!localStorage.getItem('adna_courses')) {
        const initialCourses = [
            { id: 1, title: 'Customer Etiquette', desc: 'Learn proper communication and professional behavior with clients.', category: 'Etiquette', icon: 'fas fa-play-circle' },
            { id: 2, title: 'Chemical Safety', desc: 'Handling cleaning agents safely and effectively.', category: 'Safety', icon: 'fas fa-file-alt' },
            { id: 3, title: 'Advanced Cleaning', desc: 'Modern techniques for deep cleaning and sanitization.', category: 'Cleaning', icon: 'fas fa-broom' }
        ];
        localStorage.setItem('adna_courses', JSON.stringify(initialCourses));
    }

    if (!localStorage.getItem('adna_reviews')) {
        const initialReviews = [
            { id: 1, customer: 'Ali Yasin', rating: 5, comment: 'Excellent deep cleaning service! The team was very professional.', date: '2026-10-20' },
            { id: 2, customer: 'Hassan Nur', rating: 4, comment: 'Very good service, arrived on time.', date: '2026-10-22' }
        ];
        localStorage.setItem('adna_reviews', JSON.stringify(initialReviews));
    }
}

// --- Utility Functions ---
function getBookings() {
    return JSON.parse(localStorage.getItem('adna_bookings') || '[]');
}

function saveBookings(bookings) {
    localStorage.setItem('adna_bookings', JSON.stringify(bookings));
}

function getStaff() {
    return JSON.parse(localStorage.getItem('adna_staff') || '[]');
}

function saveStaff(staffList) {
    localStorage.setItem('adna_staff', JSON.stringify(staffList));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('adna_current_user'));
}

function getCourses() {
    return JSON.parse(localStorage.getItem('adna_courses') || '[]');
}

function saveCourses(courses) {
    localStorage.setItem('adna_courses', JSON.stringify(courses));
}

function getReviews() {
    return JSON.parse(localStorage.getItem('adna_reviews') || '[]');
}

function login(role, username) {
    const user = { role: role, username: username, staffId: role === 'staff' ? 'sarah' : null }; // Mocking logged in staff as Sarah
    localStorage.setItem('adna_current_user', JSON.stringify(user));
    if (role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'staff.html';
    }
}

function logout() {
    localStorage.removeItem('adna_current_user');
    window.location.href = 'login.html';
}

function getBadgeClass(status) {
    switch (status) {
        case 'Pending': return 'badge-warning';
        case 'Approved': return 'badge-success';
        case 'In Progress': return 'badge-info';
        case 'Completed': return 'badge-success';
        case 'Rejected': return 'badge-danger';
        default: return 'badge-info';
    }
}

// --- Page Specific Logic ---

// 1. Login Page Logic
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = loginForm.querySelector('input[type="text"]').value;
            // Determine role based on which tab is active
            const role = document.getElementById('tab-admin').classList.contains('active') ? 'admin' : 'staff';
            login(role, usernameInput);
        });
    }
}

// 2. Booking Page Logic
function setupBookingPage() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect data
            const newBooking = {
                id: Date.now(),
                customer: document.getElementById('b_name').value,
                phone: document.getElementById('b_phone').value,
                location: document.getElementById('b_location').value,
                service: document.getElementById('b_service').value,
                staff: document.getElementById('b_staff').value,
                date: document.getElementById('b_date').value,
                time: document.getElementById('b_time').value,
                notes: document.getElementById('b_notes').value,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };

            const bookings = getBookings();
            bookings.push(newBooking);
            saveBookings(bookings);

            alert('Your booking request has been submitted successfully! We will contact you soon.');
            bookingForm.reset();
        });
    }
}

// 3. Admin Dashboard Logic
function setupAdminDashboard() {
    if (!document.getElementById('adminBookingsTable')) return;

    let user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        // Auto-login for demo purposes to prevent annoying redirects during testing
        user = { role: 'admin', username: 'Demo Admin', staffId: null };
        localStorage.setItem('adna_current_user', JSON.stringify(user));
    }

    renderAdminMetrics();
    renderAdminBookings();
    renderAdminStaff();
}

function renderAdminMetrics() {
    const bookings = getBookings();
    const staff = getStaff();
    
    document.getElementById('metric_staff').innerText = staff.length;
    document.getElementById('metric_bookings').innerText = bookings.length;
    document.getElementById('metric_requests').innerText = bookings.filter(b => b.status === 'Pending').length;
    // Mock revenue
    document.getElementById('metric_revenue').innerText = '$' + (bookings.length * 85).toLocaleString();
}

function renderAdminBookings() {
    const bookings = getBookings().sort((a, b) => b.id - a.id); // Newest first
    const tbody = document.getElementById('adminBookingsTable');
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const initials = booking.customer.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        let actionButtons = '';
        if (booking.status === 'Pending') {
            actionButtons = `
                <button title="Approve" style="color: var(--success);" onclick="updateBookingStatus(${booking.id}, 'Approved')"><i class="fas fa-check-circle"></i></button>
                <button title="Reject" style="color: var(--danger);" onclick="updateBookingStatus(${booking.id}, 'Rejected')"><i class="fas fa-times-circle"></i></button>
            `;
        } else {
            actionButtons = `<button title="View Details"><i class="fas fa-eye"></i></button>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="td-user">
                    <div style="width: 36px; height: 36px; border-radius: 8px; background: var(--bg-main); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary);">${initials}</div>
                    <span>${booking.customer}</span>
                </div>
            </td>
            <td>${booking.service.replace('-', ' ')}</td>
            <td>${booking.date}</td>
            <td><span class="badge ${getBadgeClass(booking.status)}">${booking.status}</span></td>
            <td class="actions">${actionButtons}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateBookingStatus(id, newStatus) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = newStatus;
        saveBookings(bookings);
        renderAdminBookings();
        renderAdminMetrics();
    }
}

function renderAdminStaff() {
    const staffList = getStaff();
    const container = document.getElementById('adminStaffList');
    container.innerHTML = '';

    staffList.forEach(staff => {
        let statusBadge = '';
        if (staff.status === 'available') statusBadge = '<span class="badge badge-success">Available</span>';
        else if (staff.status === 'busy') statusBadge = '<span class="badge badge-warning">Busy</span>';
        else statusBadge = '<span class="badge" style="background: var(--border); color: var(--text-muted);">Inactive</span>';

        let imgHtml = staff.img 
            ? `<img src="${staff.img}" alt="${staff.name}">`
            : `<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg-main); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--text-muted);"><i class="fas fa-user"></i></div>`;

        const div = document.createElement('div');
        div.style = "display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;";
        div.innerHTML = `
            <div class="td-user">
                ${imgHtml}
                <div>
                    <span>${staff.name}</span>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${staff.role}</p>
                </div>
            </div>
            ${statusBadge}
        `;
        container.appendChild(div);
    });
}


// 4. Staff Dashboard Logic
function setupStaffDashboard() {
    if (!document.getElementById('staffBookingsTable')) return;

    let user = getCurrentUser();
    if (!user || user.role !== 'staff') {
        // Auto-login for demo purposes
        user = { role: 'staff', username: 'Demo Staff', staffId: 'sarah' };
        localStorage.setItem('adna_current_user', JSON.stringify(user));
    }

    renderStaffBookings(user.staffId);
    
    // Setup status toggle
    const statusSelect = document.getElementById('staffStatusSelect');
    if (statusSelect) {
        // Load current status
        const staffList = getStaff();
        const myStaff = staffList.find(s => s.id === user.staffId);
        if (myStaff) {
            statusSelect.value = myStaff.status === 'busy' ? 'busy' : 'available';
        }

        statusSelect.addEventListener('change', function(e) {
            const newStatus = e.target.value;
            const sList = getStaff();
            const idx = sList.findIndex(s => s.id === user.staffId);
            if (idx !== -1) {
                sList[idx].status = newStatus;
                saveStaff(sList);
            }
        });
    }
}

function renderStaffBookings(staffId) {
    const bookings = getBookings().filter(b => b.staff === staffId || b.staff === ''); // Assigned to them or unassigned
    const tbody = document.getElementById('staffBookingsTable');
    tbody.innerHTML = '';

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No upcoming jobs assigned.</td></tr>';
        return;
    }

    bookings.forEach(booking => {
        let actionBtn = '';
        if (booking.status === 'Approved') {
            actionBtn = `<button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="updateStaffBookingStatus(${booking.id}, 'In Progress')">Start Job</button>`;
        } else if (booking.status === 'In Progress') {
            actionBtn = `<button class="btn btn-primary" style="padding: 4px 12px; font-size: 0.8rem;" onclick="updateStaffBookingStatus(${booking.id}, 'Completed')">Complete</button>`;
        } else {
            actionBtn = `<button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem;">View Details</button>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div>
                    <span style="font-weight: 600;">${booking.customer}</span>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${booking.service}</p>
                </div>
            </td>
            <td>${booking.location}</td>
            <td>${booking.date}<br><span style="font-size: 0.8rem; color: var(--text-muted);">${booking.time}</span></td>
            <td><span class="badge ${getBadgeClass(booking.status)}">${booking.status}</span></td>
            <td>${actionBtn}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStaffBookingStatus(id, newStatus) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = newStatus;
        saveBookings(bookings);
        renderStaffBookings(getCurrentUser().staffId);
    }
}

// --- Global Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();

    // Check for logout buttons
    document.querySelectorAll('a[href="login.html"]').forEach(el => {
        // If it's a logout button (usually red or in sidebar)
        if (el.innerText.toLowerCase().includes('logout')) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    });

    // Run page specific setup
    setupSidebarNavigation();
    setupLoginPage();
    setupBookingPage();
    setupAdminDashboard();
    setupStaffDashboard();
    setupStaffManagement();
    setupCourseManagement();
});

// --- Sidebar Navigation & SPA Routing ---
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.innerText.toLowerCase().includes('logout')) return;
            
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                navItems.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
                
                let targetId = this.innerText.trim().toLowerCase().replace(/\s+/g, '-');
                
                // Hide all views
                document.querySelectorAll('.admin-view, .staff-view').forEach(v => {
                    v.style.display = 'none';
                });
                
                // Show target view
                const targetView = document.getElementById('view-' + targetId);
                if (targetView) {
                    targetView.style.display = 'block';
                    
                    // Specific renders
                    if (targetId === 'manage-staff') renderFullStaff();
                    if (targetId === 'bookings') renderFullBookings();
                    if (targetId === 'courses') renderFullCourses();
                    if (targetId === 'reviews') renderFullReviews();
                    if (targetId === 'earnings') renderAdminEarnings();
                    if (targetId === 'reports') renderAdminReports();
                    if (targetId === 'dashboard') {
                        renderAdminMetrics();
                        renderAdminBookings();
                        renderAdminStaff();
                    }
                } else {
                    showToast(this.innerText.trim() + ' module is coming soon!');
                }
            }
        });
    });
}

// --- Courses Management Logic ---
function renderFullCourses() {
    const courses = getCourses();
    const container = document.getElementById('coursesGrid');
    if (!container) return;
    container.innerHTML = '';
    
    if (courses.length === 0) {
        container.innerHTML = '<div style="grid-column: span 2; text-align: center; padding: 40px; background: white; border-radius: var(--radius-md); border: 1px dashed var(--border);">No courses available.</div>';
        return;
    }

    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'card';
        div.style = 'padding: 24px; position: relative;';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div style="width: 48px; height: 48px; background: var(--bg-main); color: var(--primary); display: flex; justify-content: center; align-items: center; border-radius: var(--radius-md); font-size: 1.5rem;">
                    <i class="${course.icon || 'fas fa-graduation-cap'}"></i>
                </div>
                <div class="actions">
                    <button onclick="editCourse(${course.id})" style="color: var(--primary); font-size: 0.9rem;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteCourse(${course.id})" style="color: var(--danger); font-size: 0.9rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <h3>${course.title}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px;">${course.desc}</p>
            <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                <span class="badge badge-info">${course.category}</span>
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--primary);">8 Modules</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function setupCourseManagement() {
    const addBtn = document.getElementById('addCourseBtn');
    if (addBtn) addBtn.addEventListener('click', () => openCourseModal());

    const form = document.getElementById('courseForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveCourse();
        });
    }
}

function openCourseModal(course = null) {
    const modal = document.getElementById('courseModal');
    const title = document.getElementById('courseModalTitle');
    const form = document.getElementById('courseForm');
    
    if (course) {
        title.innerText = 'Edit Course';
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDesc').value = course.desc;
        document.getElementById('courseCategory').value = course.category;
    } else {
        title.innerText = 'Add New Course';
        form.reset();
        document.getElementById('courseId').value = '';
    }
    modal.classList.add('active');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
}

function saveCourse() {
    const id = document.getElementById('courseId').value;
    const title = document.getElementById('courseTitle').value;
    const desc = document.getElementById('courseDesc').value;
    const category = document.getElementById('courseCategory').value;
    
    let courses = getCourses();
    
    if (id) {
        const idx = courses.findIndex(c => c.id == id);
        if (idx !== -1) {
            courses[idx].title = title;
            courses[idx].desc = desc;
            courses[idx].category = category;
        }
    } else {
        courses.push({
            id: Date.now(),
            title: title,
            desc: desc,
            category: category,
            icon: 'fas fa-graduation-cap'
        });
    }
    
    saveCourses(courses);
    closeCourseModal();
    renderFullCourses();
    showToast('Course saved successfully!');
}

function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        let courses = getCourses();
        courses = courses.filter(c => c.id != id);
        saveCourses(courses);
        renderFullCourses();
        showToast('Course deleted.');
    }
}

function editCourse(id) {
    const courses = getCourses();
    const course = courses.find(c => c.id == id);
    if (course) openCourseModal(course);
}

// --- Reviews Logic ---
function renderFullReviews() {
    const reviews = getReviews();
    const view = document.getElementById('view-reviews');
    if (!view) return;
    
    // Find container or replace content
    let container = view.querySelector('.reviews-container');
    if (!container) {
        const header = view.querySelector('h2');
        const p = view.querySelector('p');
        view.innerHTML = `<h2>Customer Reviews</h2><p style="color: var(--text-muted); margin-top: 8px;">Recent feedback from your clients.</p><div class="reviews-container" style="margin-top: 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;"></div>`;
        container = view.querySelector('.reviews-container');
    }
    
    container.innerHTML = '';
    reviews.forEach(review => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<i class="fas fa-star" style="color: ${i < review.rating ? 'var(--warning)' : 'var(--border)'};"></i>`;
        }
        
        const div = document.createElement('div');
        div.style = 'padding: 24px; border: 1px solid var(--border); border-radius: var(--radius-md); background: white;';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <strong>${review.customer}</strong>
                <span>${stars}</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-main);">"${review.comment}"</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 12px;">${review.date}</p>
        `;
        container.appendChild(div);
    });
}

// --- Earnings & Reports Logic ---
function renderAdminEarnings() {
    const bookings = getBookings();
    const total = bookings.reduce((sum, b) => sum + 85, 0); // Mock $85 per booking
    const pending = bookings.filter(b => b.status === 'Pending').length * 85;
    
    const view = document.getElementById('view-earnings');
    if (!view) return;
    
    view.innerHTML = `
        <h2>Financial Overview</h2>
        <div class="metrics-grid" style="margin-top: 24px;">
            <div class="metric-card">
                <div class="metric-icon green"><i class="fas fa-dollar-sign"></i></div>
                <div class="metric-info">
                    <p>Total Revenue</p>
                    <h3>$${total.toLocaleString()}</h3>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon orange"><i class="fas fa-clock"></i></div>
                <div class="metric-info">
                    <p>Pending Payments</p>
                    <h3>$${pending.toLocaleString()}</h3>
                </div>
            </div>
        </div>
        <div class="table-wrapper" style="margin-top: 24px;">
            <div class="table-header"><h3>Recent Transactions</h3></div>
            <table>
                <thead><tr><th>Customer</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                    ${bookings.slice(0, 5).map(b => `
                        <tr>
                            <td>${b.customer}</td>
                            <td>${b.service}</td>
                            <td>${b.date}</td>
                            <td>$85.00</td>
                            <td><span class="badge badge-success">Paid</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderAdminReports() {
    const view = document.getElementById('view-reports');
    if (!view) return;
    
    view.innerHTML = `
        <h2>System Reports</h2>
        <p style="color: var(--text-muted); margin-top: 8px;">Download monthly analytics and staff performance reports.</p>
        <div style="margin-top: 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
            <div class="card">
                <h3>Staff Performance</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px;">Average rating and completion rate per staff member.</p>
                <button class="btn btn-outline" style="margin-top: 16px; width: 100%;"><i class="fas fa-download"></i> Download PDF</button>
            </div>
            <div class="card">
                <h3>Revenue Analytics</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px;">Monthly growth and service distribution.</p>
                <button class="btn btn-outline" style="margin-top: 16px; width: 100%;"><i class="fas fa-download"></i> Download PDF</button>
            </div>
        </div>
    `;
}

// --- Staff Management Logic ---
function setupStaffManagement() {
    const addBtn = document.getElementById('addStaffBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => openStaffModal());
    }

    const staffForm = document.getElementById('staffForm');
    if (staffForm) {
        staffForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveStaffMember();
        });
    }
}

function openStaffModal(staff = null) {
    const modal = document.getElementById('staffModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('staffForm');
    
    if (staff) {
        title.innerText = 'Edit Staff Member';
        document.getElementById('staffId').value = staff.id;
        document.getElementById('staffName').value = staff.name;
        document.getElementById('staffRole').value = staff.role;
        document.getElementById('staffStatus').value = staff.status;
    } else {
        title.innerText = 'Add New Staff';
        form.reset();
        document.getElementById('staffId').value = '';
    }
    
    modal.classList.add('active');
}

function closeStaffModal() {
    document.getElementById('staffModal').classList.remove('active');
}

function saveStaffMember() {
    const id = document.getElementById('staffId').value;
    const name = document.getElementById('staffName').value;
    const role = document.getElementById('staffRole').value;
    const status = document.getElementById('staffStatus').value;
    
    let staffList = getStaff();
    
    if (id) {
        // Update existing
        const index = staffList.findIndex(s => s.id == id);
        if (index !== -1) {
            staffList[index].name = name;
            staffList[index].role = role;
            staffList[index].status = status;
        }
    } else {
        // Add new
        const newStaff = {
            id: 'staff_' + Date.now(),
            name: name,
            role: role,
            status: status,
            img: '' // Placeholder for now
        };
        staffList.push(newStaff);
    }
    
    saveStaff(staffList);
    closeStaffModal();
    renderFullStaff();
    renderAdminMetrics();
    renderAdminStaff();
    showToast(id ? 'Staff updated successfully!' : 'New staff added successfully!');
}

function deleteStaffMember(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        let staffList = getStaff();
        staffList = staffList.filter(s => s.id != id);
        saveStaff(staffList);
        renderFullStaff();
        renderAdminMetrics();
        renderAdminStaff();
        showToast('Staff member deleted.');
    }
}

function editStaffMember(id) {
    const staffList = getStaff();
    const staff = staffList.find(s => s.id == id);
    if (staff) {
        openStaffModal(staff);
    }
}

function renderFullStaff() {
    const staffList = getStaff();
    const tbody = document.getElementById('fullStaffTable');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    staffList.forEach(staff => {
        let statusBadge = '';
        if (staff.status === 'available') statusBadge = '<span class="badge badge-success">Available</span>';
        else if (staff.status === 'busy') statusBadge = '<span class="badge badge-warning">Busy</span>';
        else statusBadge = '<span class="badge badge-danger">Inactive</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="td-user">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--bg-main); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary);"><i class="fas fa-user"></i></div>
                    <span>${staff.name}</span>
                </div>
            </td>
            <td>${staff.role}</td>
            <td>${statusBadge}</td>
            <td class="actions">
                <button title="Edit" style="color: var(--primary);" onclick="editStaffMember('${staff.id}')"><i class="fas fa-edit"></i></button>
                <button title="Delete" style="color: var(--danger);" onclick="deleteStaffMember('${staff.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderFullBookings() {
    const bookings = getBookings().sort((a, b) => b.id - a.id);
    const tbody = document.getElementById('fullBookingsTable');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    bookings.forEach(booking => {
        const staffList = getStaff();
        const assignedStaff = staffList.find(s => s.id === booking.staff);
        const staffName = assignedStaff ? assignedStaff.name : 'Unassigned';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div>
                    <span style="font-weight: 600;">${booking.customer}</span>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${booking.phone}</p>
                </div>
            </td>
            <td>${booking.service}</td>
            <td>${booking.date} at ${booking.time}</td>
            <td>${staffName}</td>
            <td><span class="badge ${getBadgeClass(booking.status)}">${booking.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderFullAssignedWork() {
    const user = getCurrentUser();
    if (!user) return;
    
    const bookings = getBookings().filter(b => b.staff === user.staffId || b.staff === '');
    const tbody = document.getElementById('fullAssignedWorkTable');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No assigned work.</td></tr>';
        return;
    }

    bookings.forEach(booking => {
        let actionBtn = '';
        if (booking.status === 'Approved') {
            actionBtn = `<button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" onclick="updateStaffBookingStatus(${booking.id}, 'In Progress')">Start Job</button>`;
        } else if (booking.status === 'In Progress') {
            actionBtn = `<button class="btn btn-primary" style="padding: 4px 12px; font-size: 0.8rem;" onclick="updateStaffBookingStatus(${booking.id}, 'Completed')">Complete</button>`;
        } else {
            actionBtn = `<button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.8rem;" disabled>Details</button>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div>
                    <span style="font-weight: 600;">${booking.customer}</span>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${booking.service}</p>
                </div>
            </td>
            <td>${booking.location}</td>
            <td>${booking.date}<br><span style="font-size: 0.8rem; color: var(--text-muted);">${booking.time}</span></td>
            <td><span class="badge ${getBadgeClass(booking.status)}">${booking.status}</span></td>
            <td>${actionBtn}</td>
        `;
        tbody.appendChild(tr);
    });
}

function showToast(message) {
    const existing = document.getElementById('adna-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'adna-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--primary);
        color: white;
        padding: 12px 24px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        font-weight: 500;
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    toast.innerHTML = '<i class="fas fa-info-circle" style="margin-right: 8px;"></i> ' + message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
