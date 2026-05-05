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
                    if (targetId === 'assigned-work') renderFullAssignedWork();
                } else {
                    showToast(this.innerText.trim() + ' module is coming soon!');
                }
            }
        });
    });
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
                <button title="Edit" style="color: var(--primary);"><i class="fas fa-edit"></i></button>
                <button title="Delete" style="color: var(--danger);"><i class="fas fa-trash"></i></button>
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
