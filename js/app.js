
/* =========================
   1. SAMPLE DATA
========================= */

const users = {
    patient: {
        name: "Nguyễn Văn A",
        role: "Bệnh nhân",
        avatar: "NA"
    },
    doctor: {
        name: "Trần Minh B",
        role: "Bác sĩ",
        avatar: "TB"
    },
    admin: {
        name: "Admin",
        role: "Quản trị viên",
        avatar: "AD"
    }
};

// DỮ LIỆU PHẢN HỒI CỦA BỆNH NHÂN
let feedbackData = [];



let selectedFeedbackRating = 0;

let currentRole = "patient";
let currentDoctorAppointmentFilter = "all";
// Danh sách đề xuất tái khám
let reExamRecommendations = [];


// Dữ liệu hồ sơ bệnh nhân mẫu
// Sau này sẽ thay bằng dữ liệu lấy từ USERS và PATIENTS

let patientProfile = {
    username: "patient01",
    email: "patient@gmail.com",
    phone: "0901234567",
    fullName: "Nguyễn Văn A",
    dateOfBirth: "2004-07-30",
    gender: "Nam",
    address: "Quận 7, TP. Hồ Chí Minh"
};


/* =========================
   2. MENU CONFIGURATION
========================= */

const menus = {
    patient: [
    { title: "Trang chủ", icon: "fa-house", page: "dashboard" },
    { title: "Hồ sơ cá nhân", icon: "fa-user", page: "profile" },
    { title: "Danh sách bác sĩ", icon: "fa-user-doctor", page: "doctors" },
    { title: "Đặt lịch khám", icon: "fa-calendar-plus", page: "booking" },
    { title: "Lịch hẹn của tôi", icon: "fa-calendar-check", page: "appointments" },
    { title: "Phản hồi", icon: "fa-comment-dots", page: "feedback" },
    { title: "Thông báo", icon: "fa-bell", page: "notifications" }
    ],

    doctor: [
        { title: "Trang chủ", icon: "fa-house", page: "dashboard" },
        { title: "Lịch khám của tôi", icon: "fa-calendar-check", page: "appointments" },
        { title: "Hồ sơ bệnh nhân", icon: "fa-users", page: "patients" }
    ],

    admin: [
        { title: "Trang chủ", icon: "fa-house", page: "dashboard" },
        { title: "Quản lý tài khoản", icon: "fa-users", page: "users" },
        { title: "Quản lý bác sĩ", icon: "fa-user-doctor", page: "doctors" },
        { title: "Quản lý lịch khám", icon: "fa-calendar-check", page: "appointments" },
        { title: "Quản lý phản hồi", icon: "fa-comments", page: "feedback" },
        { title: "Báo cáo thống kê", icon: "fa-chart-column", page: "reports" }
    ]
};

/* =========================
   3. PAGE TITLES
========================= */

const pageTitles = {
    dashboard: "Tổng quan",
    profile: "Hồ sơ cá nhân",
    doctors: "Danh sách bác sĩ",
    booking: "Đặt lịch khám",
    appointments: "Lịch khám",
    feedback: "Quản lý phản hồi",
    notifications: "Thông báo",
    patients: "Hồ sơ bệnh nhân",
    users: "Quản lý tài khoản",
    reports: "Báo cáo thống kê"
};

/* =========================
   4. AUTHENTICATION DEMO
========================= */

function showLogin() {
    document.getElementById("login-page").classList.remove("hidden");
    document.getElementById("register-page").classList.add("hidden");
    document.getElementById("dashboard-page").classList.add("hidden");
}

function showRegister() {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("register-page").classList.remove("hidden");
    document.getElementById("dashboard-page").classList.add("hidden");
}

function showDashboard() {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("register-page").classList.add("hidden");
    document.getElementById("dashboard-page").classList.remove("hidden");
}

/* =========================
   5. LOGIN FORM
========================= */

document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = this.querySelector('input[type="email"]').value.toLowerCase();

    // Tài khoản demo để kiểm tra 3 vai trò
    if (email.includes("doctor")) {
        currentRole = "doctor";
    } else if (email.includes("admin")) {
        currentRole = "admin";
    } else {
        currentRole = "patient";
    }

    loadDashboard();
});

/* =========================
   6. REGISTER FORM
========================= */

document.getElementById("register-form").addEventListener("submit", function(e) {
    e.preventDefault();

    showToast("Đăng ký thành công!");

    setTimeout(() => {
        showLogin();
    }, 1200);
});

/* =========================
   7. LOGOUT
========================= */

function logout() {
    showLogin();
}

/* =========================
   8. LOAD DASHBOARD
========================= */

function loadDashboard() {

    const user = users[currentRole];

    document.getElementById("sidebar-name").textContent = user.name;
    document.getElementById("sidebar-role").textContent = user.role;
    document.getElementById("sidebar-avatar").textContent = user.avatar;

    document.getElementById("topbar-name").textContent = user.name;
    document.getElementById("topbar-avatar").textContent = user.avatar;

    showDashboard();

    renderMenu();
    navigateTo("dashboard");
}

/* =========================
   9. RENDER SIDEBAR
========================= */

function renderMenu() {

    const menuContainer = document.getElementById("sidebar-menu");

    menuContainer.innerHTML = menus[currentRole].map(item => `
        <div class="menu-item"
             data-page="${item.page}"
             onclick="navigateTo('${item.page}')">

            <i class="fa-solid ${item.icon}"></i>
            <span>${item.title}</span>

        </div>
    `).join("");
}

/* =========================
   10. NAVIGATION
========================= */


function navigateTo(page) {

    // 1. Cập nhật menu đang được chọn
    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.page === page
        );
    });

    // 2. Cập nhật tiêu đề
    const currentTitle = page === "dashboard"
    ? (currentRole === "patient" ? "Trang chủ" : "Tổng quan")
    : (page === "doctors" && currentRole === "admin")
        ? "Quản lý bác sĩ"
        : (pageTitles[page] || "Patient CRM");

    document.getElementById("page-title").textContent = currentTitle;

    // 3. Hiển thị nội dung trang tương ứng
    renderPage(page);
}


/* =========================
   11. PAGE RENDERER
========================= */

function renderPage(page) {

    const content = document.getElementById("content-area");

    if (page === "dashboard") {
        content.innerHTML = getDashboardHTML();
        return;
    }

    if (page === "appointments" && currentRole === "doctor") {
    content.innerHTML = getDoctorAppointmentsHTML();
    renderDoctorAppointments();
    return;
    }

    // Hồ sơ bệnh nhân dành cho Doctor
    if (page === "patients" && currentRole === "doctor") {
        content.innerHTML = getDoctorPatientsHTML();
        renderDoctorPatients();
        return;
    }

    if (page === "appointments" && currentRole === "patient") {
    content.innerHTML = getMyAppointmentsHTML();
    renderMyAppointments();
    return;
    }

    // Quản lý lịch khám dành cho Admin
    if (page === "appointments" && currentRole === "admin") {
        content.innerHTML = getAdminAppointmentsHTML();
        renderAdminAppointments();
        return;
    }

    // Báo cáo thống kê dành cho Admin
    if (page === "reports" && currentRole === "admin") {
        content.innerHTML = getAdminReportsHTML();
        renderAdminReports();
        return;
    }

    if (page === "feedback" && currentRole === "patient") {
    content.innerHTML = getPatientFeedbackHTML();
    renderPatientFeedback();
    return;
    }
    // Quản lý phản hồi dành cho Admin
    if (page === "feedback" && currentRole === "admin") {
        content.innerHTML = getAdminFeedbackHTML();
        renderAdminFeedback();
        return;
    }

    if (page === "notifications" && currentRole === "patient") {
    content.innerHTML = getPatientNotificationsHTML();
    renderPatientNotifications();
    return;
    }
    
    // Hiển thị hồ sơ cá nhân của bệnh nhân
    if (page === "profile" && currentRole === "patient") {
        content.innerHTML = getPatientProfileHTML();
        return;
    }
    
    
    if (page === "doctors" && currentRole === "patient") {
        content.innerHTML = getDoctorsHTML();
        return;
    }

    // Quản lý bác sĩ dành cho Admin
    if (page === "doctors" && currentRole === "admin") {
        content.innerHTML = getAdminDoctorsHTML();
        renderAdminDoctors();
        return;
    }

    if (page === "booking" && currentRole === "patient") {
    content.innerHTML = getBookingHTML();
    initializeBookingPage();
    return;
    }

    // Quản lý tài khoản dành cho Admin
    if (page === "users" && currentRole === "admin") {
        content.innerHTML = getAdminUsersHTML();
        renderAdminUsers();
        return;
    }

    content.innerHTML = `
        <div class="page-heading">
            <h1>${pageTitles[page] || page}</h1>
            <p>Quản lý thông tin trong hệ thống Patient CRM/PRM.</p>
        </div>

        <div class="panel">
            <h3>${pageTitles[page] || page}</h3>
            <p style="margin-top:12px;color:#64748B">
                Khu vực này sẽ được triển khai ở bước tiếp theo.
            </p>
        </div>
    `;
}

/* =========================
   12. DASHBOARD HTML
========================= */

function getDashboardHTML() {

    if (currentRole === "patient") {    
    return `
        <div class="patient-welcome">
            <div>
                <h1>Xin chào, Nguyễn Văn A!</h1>
                <p>Chúc bạn một ngày tốt lành. Hãy theo dõi lịch khám của mình nhé.</p>
            </div>

            <button class="btn-booking"
                onclick="navigateTo('booking')">
                <i class="fa-solid fa-calendar-plus"></i>
                Đặt lịch khám
            </button>

        </div>

        <!-- THỐNG KÊ -->
        <div class="stats-grid">

            <div class="stat-card">
                <div class="stat-top">
                    <p>Tổng lịch khám</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-calendar"></i>
                    </div>
                </div>
                <h2>12</h2>
                <p>Tổng lịch khám đã đặt</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Đã hoàn thành</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                </div>
                <h2>08</h2>
                <p>Lịch khám đã hoàn tất</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Sắp tới</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                </div>
                <h2>04</h2>
                <p>Lịch khám đang chờ</p>
            </div>

        </div>

        <!-- LỊCH KHÁM SẮP TỚI -->
        <div class="panel">

            <div class="panel-header">
                <h3>Lịch khám sắp tới</h3>

                <a href="#"
                    onclick="navigateTo('appointments'); return false;">
                    Xem tất cả
                </a>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Mã lịch</th>
                            <th>Bác sĩ</th>
                            <th>Chuyên khoa</th>
                            <th>Ngày khám</th>
                            <th>Giờ khám</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>AP001</td>
                            <td>BS. Trần Minh B</td>
                            <td>Nội tổng quát</td>
                            <td>05/11/2026</td>
                            <td>09:30</td>
                            <td>
                                <span class="status status-success">
                                    Đã xác nhận
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>AP002</td>
                            <td>BS. Nguyễn Minh C</td>
                            <td>Tim mạch</td>
                            <td>12/11/2026</td>
                            <td>14:00</td>
                            <td>
                                <span class="status status-warning">
                                    Chờ xác nhận
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <!-- LỊCH SỬ VÀ THÔNG BÁO -->
        <div class="patient-bottom-grid">

            <div class="panel">
                <div class="panel-header">
                    <h3>Lịch sử khám gần đây</h3>

                    <a href="#"
                        onclick="navigateTo('appointments'); return false;">
                        Xem tất cả
                    </a>
                </div>

                <div class="recent-visit">
                    <div class="visit-icon">
                        <i class="fa-solid fa-stethoscope"></i>
                    </div>

                    <div class="visit-info">
                        <h4>Khám tổng quát</h4>
                        <p>BS. Trần Minh B</p>
                        <span>28/10/2026</span>
                    </div>

                    <span class="status status-success">
                        Đã khám
                    </span>
                </div>

                <div class="recent-visit">
                    <div class="visit-icon">
                        <i class="fa-solid fa-heart-pulse"></i>
                    </div>

                    <div class="visit-info">
                        <h4>Khám tim mạch</h4>
                        <p>BS. Nguyễn Minh C</p>
                        <span>20/10/2026</span>
                    </div>

                    <span class="status status-success">
                        Đã khám
                    </span>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <h3>Thông báo mới</h3>

                    <a href="#"
                        onclick="navigateTo('notifications'); return false;">
                        Xem tất cả
                    </a>
                </div>

                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>

                    <div>
                        <h4>Lịch khám đã được xác nhận</h4>
                        <p>Lịch khám ngày 05/11/2026 đã được xác nhận.</p>
                        <span>01/11/2026</span>
                    </div>
                </div>

                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fa-solid fa-bell"></i>
                    </div>

                    <div>
                        <h4>Nhắc lịch khám</h4>
                        <p>Bạn có lịch khám sắp tới vào ngày 05/11/2026.</p>
                        <span>02/11/2026</span>
                    </div>
                </div>
            </div>

        </div>
    `;
    }

    if (currentRole === "doctor") {
        return `
            <div class="page-heading">
                <h1>Xin chào, BS. Trần Minh B!</h1>
                <p>Tổng quan lịch khám được phân công của bạn.</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fa-solid fa-calendar-day"></i>
                    </div>
                    <h2>08</h2>
                    <p>Lịch khám hôm nay</p>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fa-solid fa-check-circle"></i>
                    </div>
                    <h2>05</h2>
                    <p>Đã hoàn thành</p>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fa-solid fa-hourglass-half"></i>
                    </div>
                    <h2>03</h2>
                    <p>Chờ khám</p>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <h3>Lịch khám hôm nay</h3>
                    <a href="#" onclick="navigateTo('appointments');return false;">
                        Xem tất cả
                    </a>
                </div>

                <p>Nguyễn Văn A – 09:30 – Khám tổng quát</p>
                <br>
                <span class="status status-warning">Chờ khám</span>
            </div>
        `;
    }

    return `
        <div class="page-heading">
            <h1>Tổng quan</h1>
            <p>Tổng quan hoạt động của hệ thống Patient CRM/PRM.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fa-solid fa-users"></i>
                </div>
                <h2>1,250</h2>
                <p>Tổng bệnh nhân</p>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>
                <h2>45</h2>
                <p>Tổng bác sĩ</p>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fa-solid fa-calendar-check"></i>
                </div>
                <h2>320</h2>
                <p>Tổng lịch khám</p>
            </div>
        </div>

        <div class="panel">
            <h3>Hoạt động hệ thống</h3>
            <br>
            <p>Hệ thống đang hoạt động bình thường.</p>
        </div>
    `;
}


/* =========================
   PATIENT PROFILE
========================= */

function getPatientProfileHTML() {
    return `
        <div class="page-heading">
            <h1>Hồ sơ cá nhân</h1>
            <p>Quản lý và cập nhật thông tin tài khoản, thông tin cá nhân của bạn.</p>
        </div>

        <!-- PROFILE HEADER -->
        <div class="profile-header panel">
            <div class="profile-avatar">
                <i class="fa-solid fa-user"></i>
            </div>

            <div class="profile-header-info">
                <h2>${patientProfile.fullName}</h2>
                <p><i class="fa-solid fa-envelope"></i> ${patientProfile.email}</p>
                <span class="profile-role">Bệnh nhân</span>
            </div>

            <div class="profile-header-action">
                <button type="button"
                    class="action-btn"
                    id="edit-profile-btn"
                    onclick="setProfileEditMode(true)">
                    <i class="fa-solid fa-pen"></i>
                    Chỉnh sửa
                </button>
            </div>
        </div>

        <form id="patient-profile-form"
            onsubmit="savePatientProfile(event)">

            <!-- ACCOUNT INFORMATION -->
            <div class="panel profile-panel">
                <div class="profile-section-title">
                    <div class="profile-section-icon">
                        <i class="fa-solid fa-lock"></i>
                    </div>
                    <div>
                        <h3>Thông tin tài khoản</h3>
                        <p>Thông tin dùng để đăng nhập và liên hệ.</p>
                    </div>
                </div>

                <div class="profile-form-grid">

                    <div class="form-group">
                        <label>Tên đăng nhập</label>
                        <input type="text"
                            value="${patientProfile.username}"
                            readonly>
                        <small class="field-note">
                            Tên đăng nhập không thể chỉnh sửa.
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Email <span class="required">*</span></label>
                        <input type="email"
                            id="profile-email"
                            value="${patientProfile.email}"
                            data-editable
                            readonly
                            required>
                    </div>

                    <div class="form-group">
                        <label>Số điện thoại <span class="required">*</span></label>
                        <input type="tel"
                            id="profile-phone"
                            value="${patientProfile.phone}"
                            data-editable
                            readonly
                            required
                            pattern="[0-9]{10,11}"
                            title="Số điện thoại gồm 10 đến 11 chữ số">
                    </div>

                </div>
            </div>

            <!-- PERSONAL INFORMATION -->
            <div class="panel profile-panel">
                <div class="profile-section-title">
                    <div class="profile-section-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div>
                        <h3>Thông tin cá nhân</h3>
                        <p>Thông tin cơ bản trong hồ sơ bệnh nhân.</p>
                    </div>
                </div>

                <div class="profile-form-grid">

                    <div class="form-group">
                        <label>Họ và tên <span class="required">*</span></label>
                        <input type="text"
                            id="profile-fullname"
                            value="${patientProfile.fullName}"
                            data-editable
                            readonly
                            required>
                    </div>

                    <div class="form-group">
                        <label>Ngày sinh</label>
                        <input type="date"
                            id="profile-dob"
                            value="${patientProfile.dateOfBirth}"
                            data-editable
                            readonly>
                    </div>

                    <div class="form-group">
                        <label>Giới tính</label>
                        <select id="profile-gender"
                            data-editable
                            disabled>
                            <option value="Nam" ${patientProfile.gender === "Nam" ? "selected" : ""}>Nam</option>
                            <option value="Nữ" ${patientProfile.gender === "Nữ" ? "selected" : ""}>Nữ</option>
                            <option value="Khác" ${patientProfile.gender === "Khác" ? "selected" : ""}>Khác</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <input type="text"
                            id="profile-address"
                            value="${patientProfile.address}"
                            data-editable
                            readonly>
                    </div>

                </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="profile-actions hidden" id="profile-actions">

                <button type="button"
                    class="btn btn-outline"
                    onclick="cancelProfileEdit()">
                    Hủy
                </button>

                <button type="submit" class="action-btn">
                    <i class="fa-solid fa-floppy-disk"></i>
                    Lưu thay đổi
                </button>

            </div>

        </form>
    `;
}


/* =========================
   PROFILE EDIT MODE
========================= */

function setProfileEditMode(enabled) {
    document.querySelectorAll("#patient-profile-form [data-editable]")
        .forEach(field => {
            if (field.tagName === "SELECT") {
                field.disabled = !enabled;
            } else {
                field.readOnly = !enabled;
            }
        });

    document.getElementById("edit-profile-btn").classList.toggle(
        "hidden", enabled
    );

    document.getElementById("profile-actions").classList.toggle(
        "hidden", !enabled
    );
}


/* =========================
   SAVE PATIENT PROFILE
========================= */

function savePatientProfile(event) {
    event.preventDefault();

    patientProfile.email =
        document.getElementById("profile-email").value.trim();

    patientProfile.phone =
        document.getElementById("profile-phone").value.trim();

    patientProfile.fullName =
        document.getElementById("profile-fullname").value.trim();

    patientProfile.dateOfBirth =
        document.getElementById("profile-dob").value;

    patientProfile.gender =
        document.getElementById("profile-gender").value;

    patientProfile.address =
        document.getElementById("profile-address").value.trim();

    // Cập nhật tên hiển thị trên Sidebar và Topbar
    users.patient.name = patientProfile.fullName;

    const nameParts = patientProfile.fullName.trim().split(/\s+/);
    users.patient.avatar = nameParts.length > 1
        ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
        : patientProfile.fullName.substring(0, 2);

    document.getElementById("sidebar-name").textContent =
        users.patient.name;

    document.getElementById("topbar-name").textContent =
        users.patient.name;

    document.getElementById("sidebar-avatar").textContent =
        users.patient.avatar;

    document.getElementById("topbar-avatar").textContent =
        users.patient.avatar;

    // Hiển thị lại giao diện ở chế độ chỉ xem
    renderPage("profile");

    showToast("Cập nhật thông tin cá nhân thành công!");
}


/* =========================
   SAMPLE DOCTORS
========================= */

const doctorsData = [
    {
        doctor_id: 1,
        full_name: "Trần Minh B",
        specialty: "Nội tổng quát",
        qualification: "Bác sĩ chuyên khoa I",
        experience_years: 10,
        description: "Khám và tư vấn các bệnh lý nội khoa tổng quát.",
        doctor_status: "Đang hoạt động"
    },
    {
        doctor_id: 2,
        full_name: "Nguyễn Minh C",
        specialty: "Tim mạch",
        qualification: "Thạc sĩ Y khoa",
        experience_years: 8,
        description: "Tư vấn và theo dõi các bệnh lý về tim mạch.",
        doctor_status: "Đang hoạt động"
    },
    {
        doctor_id: 3,
        full_name: "Lê Hoàng D",
        specialty: "Nhi khoa",
        qualification: "Bác sĩ chuyên khoa I",
        experience_years: 6,
        description: "Khám và chăm sóc sức khỏe trẻ em.",
        doctor_status: "Đang hoạt động"
    },
    {
        doctor_id: 4,
        full_name: "Phạm Thu E",
        specialty: "Da liễu",
        qualification: "Bác sĩ chuyên khoa II",
        experience_years: 12,
        description: "Tư vấn và điều trị các vấn đề về da.",
        doctor_status: "Đang hoạt động"
    },
    {
        doctor_id: 5,
        full_name: "Võ Quốc F",
        specialty: "Tai mũi họng",
        qualification: "Bác sĩ chuyên khoa I",
        experience_years: 7,
        description: "Khám và điều trị bệnh lý tai, mũi, họng.",
        doctor_status: "Ngừng hoạt động"
    }
];

// =====================================
// DỮ LIỆU QUẢN LÝ TÀI KHOẢN ADMIN
// =====================================

let adminAccounts = [
    {
        account_id: 1,
        full_name: "Nguyễn Văn A",
        email: "patient@gmail.com",
        phone: "0901234567",
        role: "Bệnh nhân",
        status: "Đang hoạt động"
    },

    ...doctorsData.map(doctor => ({
        account_id: doctor.doctor_id + 1,
        full_name: doctor.full_name,
        email: `doctor${doctor.doctor_id}@gmail.com`,
        phone: "Chưa cập nhật",
        role: "Bác sĩ",
        status: doctor.doctor_status
    }))
];


// =====================================
// DỮ LIỆU LỊCH LÀM VIỆC CỦA BÁC SĨ
// =====================================

// day_of_week: 1 = Thứ 2, ..., 7 = Chủ nhật

const doctorSchedules = [
    {
        doctor_id: 1,
        day_of_week: 1,
        start_time: "08:00",
        end_time: "11:30"
    },
    {
        doctor_id: 1,
        day_of_week: 4,
        start_time: "08:00",
        end_time: "11:30"
    },
    {
        doctor_id: 1,
        day_of_week: 5,
        start_time: "13:30",
        end_time: "17:00"
    },

    {
        doctor_id: 2,
        day_of_week: 2,
        start_time: "08:00",
        end_time: "11:30"
    },
    {
        doctor_id: 2,
        day_of_week: 4,
        start_time: "13:30",
        end_time: "17:00"
    },

    {
        doctor_id: 3,
        day_of_week: 3,
        start_time: "08:00",
        end_time: "11:30"
    },
    {
        doctor_id: 3,
        day_of_week: 6,
        start_time: "08:00",
        end_time: "11:30"
    },

    {
        doctor_id: 4,
        day_of_week: 1,
        start_time: "13:30",
        end_time: "17:00"
    },
    {
        doctor_id: 4,
        day_of_week: 3,
        start_time: "13:30",
        end_time: "17:00"
    }
];

// =====================================
// DỮ LIỆU NGÀY NGHỈ CỦA BÁC SĨ
// =====================================

const doctorTimeOffs = [
    {
        doctor_id: 2,
        date: "2026-11-05",
        reason: "Nghỉ công tác"
    }
];

// =====================================
// DỮ LIỆU LỊCH KHÁM ĐÃ ĐƯỢC ĐẶT
// =====================================

let appointmentsData = [
    {
        appointment_id: 1,
        patient_id: 1,
        doctor_id: 1,
        date: "2026-11-05",
        start_time: "08:30",
        end_time: "09:00",
        reason: "Khám tổng quát",
        status: "Đã xác nhận"
    },
    {
        appointment_id: 2,
        patient_id: 1,
        doctor_id: 3,
        date: "2026-11-07",
        start_time: "09:00",
        end_time: "09:30",
        reason: "Khám sức khỏe",
        status: "Đã xác nhận"
    },

    {
        appointment_id: 4,
        patient_id: 1,
        doctor_id: 1,
        date: "2026-10-28",
        start_time: "09:00",
        end_time: "09:30",
        reason: "Khám sức khỏe tổng quát",
        status: "Đã hoàn thành"
    }
];

// =====================================
// DỮ LIỆU THÔNG BÁO
// =====================================

let notificationsData = [];



/* =========================
   CANCEL PROFILE EDIT
========================= */

function cancelProfileEdit() {
    renderPage("profile");
}


/* =========================
   DOCTOR LIST - PATIENT
========================= */

function getDoctorsHTML() {
    return `
        <div class="page-heading">
            <h1>Danh sách bác sĩ</h1>
            <p>Tìm kiếm và lựa chọn bác sĩ phù hợp với nhu cầu khám của bạn.</p>
        </div>

        <!-- SEARCH AND FILTER -->
        <div class="panel doctor-toolbar">
            <div class="doctor-search">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    id="doctor-search"
                    placeholder="Tìm theo tên bác sĩ..."
                    oninput="filterDoctors()"
                >
            </div>

            <select id="specialty-filter"
                class="filter-select"
                onchange="filterDoctors()">
                <option value="">Tất cả chuyên khoa</option>
                <option value="Nội tổng quát">Nội tổng quát</option>
                <option value="Tim mạch">Tim mạch</option>
                <option value="Nhi khoa">Nhi khoa</option>
                <option value="Da liễu">Da liễu</option>
                <option value="Tai mũi họng">Tai mũi họng</option>
            </select>
        </div>

        <!-- DOCTOR COUNT -->
        <div class="doctor-result-heading">
            <h3>Đội ngũ bác sĩ</h3>
           <span id="doctor-count">${doctorsData.length} bác sĩ</span>
        </div>

        <!-- DOCTOR CARDS -->
        <div class="doctor-grid" id="doctor-grid">
            ${getDoctorCards(doctorsData)}
        </div>
    `;
}



function getBookingHTML() {
    const activeDoctors = doctorsData.filter(
        doctor => doctor.doctor_status === "Đang hoạt động"
    );

    const selectedDoctor = activeDoctors.find(
        doctor => doctor.doctor_id === window.selectedDoctorId
    );

    const doctorOptions = activeDoctors.map(doctor => `
        <option
            value="${doctor.doctor_id}"
            ${selectedDoctor?.doctor_id === doctor.doctor_id ? "selected" : ""}
        >
            ${doctor.full_name} - ${doctor.specialty}
        </option>
    `).join("");

    return `
        <div class="booking-page">

            <div class="booking-header">
                <h2>Đặt lịch khám</h2>
                <p>Vui lòng chọn bác sĩ, ngày và giờ khám phù hợp.</p>
            </div>

            <div class="booking-layout">

                <div class="booking-form-panel">

                    <h3>Thông tin đặt lịch</h3>

                    <div class="booking-form-group">
                        <label for="booking-doctor">Chọn bác sĩ</label>
                        <select id="booking-doctor">
                            <option value="">-- Chọn bác sĩ --</option>
                            ${doctorOptions}
                        </select>
                    </div>

                    <div class="booking-form-group">
                        <label>Lịch làm việc trong 7 ngày tiếp theo</label>

                        <div id="doctor-week-schedule">
                            <p class="booking-hint">
                                Vui lòng chọn bác sĩ để xem lịch làm việc.
                            </p>
                        </div>
                    </div>

                    <input type="hidden" id="booking-date">

                    <div class="booking-form-group">
                        <label>Khung giờ khám còn trống</label>

                        <div id="available-slots">
                            <p class="booking-hint">
                                Vui lòng chọn bác sĩ và ngày khám.
                            </p>
                        </div>
                    </div>

                    <div class="booking-form-group">
                        <label for="booking-reason">Lý do khám</label>

                        <textarea
                            id="booking-reason"
                            rows="4"
                            placeholder="Nhập triệu chứng hoặc lý do bạn muốn khám..."
                        ></textarea>
                    </div>

                    <button
                        class="btn-booking"
                        onclick="confirmBooking()"
                    >
                        Xác nhận đặt lịch
                    </button>

                </div>

                <div class="booking-summary">
                    <h3>Thông tin lịch khám</h3>

                    <div id="booking-summary-content">
                        <p class="booking-hint">
                            Thông tin lịch khám sẽ hiển thị tại đây.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    `;
}


let selectedBookingTime = null;
let bookingAlreadyConfirmed = false;

// Chuyển ngày trong tuần: Thứ 2 = 1, Chủ nhật = 7
function getBookingDayOfWeek(dateString) {
    const date = new Date(dateString + "T00:00:00");
    return date.getDay() === 0 ? 7 : date.getDay();
}

// Chuyển giờ thành số phút để so sánh
function bookingTimeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

// Định dạng ngày hiển thị
function formatBookingDate(dateString) {
    if (!dateString) return "Chưa chọn";

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

// Khởi tạo trang đặt lịch

function initializeBookingPage() {
    const doctorSelect = document.getElementById("booking-doctor");
    const reasonInput = document.getElementById("booking-reason");

    if (!doctorSelect || !reasonInput) return;

    selectedBookingTime = null;

    bookingAlreadyConfirmed = false;

    const reExamBooking = window.pendingReExamBooking;

    if (reExamBooking) {
        doctorSelect.value = String(reExamBooking.doctorId);
        reasonInput.value = reExamBooking.reason;
    } else if (window.selectedDoctorId) {
        doctorSelect.value = String(window.selectedDoctorId);
    }

    doctorSelect.addEventListener("change", function () {
        selectedBookingTime = null;

        // Xóa ngày đã chọn khi đổi bác sĩ
        document.getElementById("booking-date").value = "";

        renderDoctorWeekSchedule();
        updateAvailableSlots();
        updateBookingSummary();
    });

    reasonInput.addEventListener("input", updateBookingSummary);

    // Tự động hiển thị lịch nếu đã có bác sĩ được chọn
    // Hiển thị lịch làm việc của bác sĩ
    if (doctorSelect.value) {
        renderDoctorWeekSchedule();
    }

    // Nếu đi từ đề xuất tái khám, điền ngày đề xuất
    if (reExamBooking) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const recommendedDate = new Date(
            reExamBooking.date + "T00:00:00"
        );

        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 6);

        if (
            recommendedDate >= today &&
            recommendedDate <= maxDate
        ) {
            selectBookingDate(reExamBooking.date);
        } else {
            showToast(
                "Ngày đề xuất nằm ngoài lịch hiển thị 7 ngày. Vui lòng chọn ngày khác."
            );
        }
    }

    updateAvailableSlots();
    updateBookingSummary();
}


function renderDoctorWeekSchedule() {
    const doctorId = Number(
        document.getElementById("booking-doctor").value
    );

    const container = document.getElementById(
        "doctor-week-schedule"
    );

    const dateInput = document.getElementById("booking-date");

    if (!container || !dateInput) return;

    if (!doctorId) {
        container.innerHTML = `
            <p class="booking-hint">
                Vui lòng chọn bác sĩ để xem lịch làm việc.
            </p>
        `;
        return;
    }

    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor || doctor.doctor_status !== "Đang hoạt động") {
        container.innerHTML = `
            <p class="booking-error">
                Bác sĩ hiện không hoạt động.
            </p>
        `;
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = `<div class="doctor-week-grid">`;

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const dateString = `${year}-${month}-${day}`;
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

        const schedules = doctorSchedules.filter(
            item =>
                item.doctor_id === doctorId &&
                item.day_of_week === dayOfWeek
        );

        const isDayOff = doctorTimeOffs.some(
            item =>
                item.doctor_id === doctorId &&
                item.date === dateString
        );

        const isWorking = schedules.length > 0 && !isDayOff;

        const isSelected = dateInput.value === dateString;

        const dayNames = [
            "CN", "T2", "T3", "T4", "T5", "T6", "T7"
        ];

        let timeLabel = "Nghỉ";

        if (isDayOff) {
            timeLabel = "Nghỉ đột xuất";
        } else if (isWorking) {
            timeLabel = schedules.map(schedule =>
                `${schedule.start_time} - ${schedule.end_time}`
            ).join("<br>");
        }

        html += `
            <button
                type="button"
                class="doctor-day-card
                    ${isWorking ? "working-day" : "off-day"}
                    ${isSelected ? "selected-day" : ""}"
                ${isWorking ? `onclick="selectBookingDate('${dateString}')"` : "disabled"}
            >
                <span class="doctor-day-name">
                    ${dayNames[date.getDay()]}
                </span>

                <strong class="doctor-day-number">
                    ${day}
                </strong>

                <span class="doctor-day-month">
                    Tháng ${month}
                </span>

                <span class="doctor-day-status">
                    ${timeLabel}
                </span>
            </button>
        `;
    }

    html += `</div>`;

    container.innerHTML = html;
}

// Chọn ngày khám từ lịch hiển thị
function selectBookingDate(dateString) {
    const dateInput = document.getElementById("booking-date");

    if (!dateInput) return;

    dateInput.value = dateString;

    selectedBookingTime = null;

    renderDoctorWeekSchedule();
    updateAvailableSlots();
    updateBookingSummary();
}


// Hiển thị các khung giờ khám còn trống
function updateAvailableSlots() {
    const doctorId = Number(
        document.getElementById("booking-doctor").value
    );

    const date = document.getElementById("booking-date").value;
    const container = document.getElementById("available-slots");

    selectedBookingTime = null;

    if (!doctorId || !date) {
        container.innerHTML = `
            <p class="booking-hint">
                Vui lòng chọn bác sĩ và ngày khám.
            </p>
        `;
        updateBookingSummary();
        return;
    }

    // Kiểm tra bác sĩ có hoạt động không
    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor || doctor.doctor_status !== "Đang hoạt động") {
        container.innerHTML = `
            <p class="booking-hint">
                Bác sĩ hiện không hoạt động.
            </p>
        `;
        updateBookingSummary();
        return;
    }

    // Kiểm tra ngày nghỉ
    const isDayOff = doctorTimeOffs.some(
        item => item.doctor_id === doctorId && item.date === date
    );

    if (isDayOff) {
        container.innerHTML = `
            <p class="booking-error">
                Bác sĩ nghỉ vào ngày này. Vui lòng chọn ngày khác.
            </p>
        `;
        updateBookingSummary();
        return;
    }

    // Tìm lịch làm việc theo thứ
    const dayOfWeek = getBookingDayOfWeek(date);

    const schedules = doctorSchedules.filter(
        item =>
            item.doctor_id === doctorId &&
            item.day_of_week === dayOfWeek
    );

    if (schedules.length === 0) {
        container.innerHTML = `
            <p class="booking-hint">
                Bác sĩ không có lịch làm việc vào ngày này.
            </p>
        `;
        updateBookingSummary();
        return;
    }

    let slots = [];

    // Tạo khung giờ 30 phút
    schedules.forEach(schedule => {
        let start = bookingTimeToMinutes(schedule.start_time);
        const end = bookingTimeToMinutes(schedule.end_time);

        while (start + 30 <= end) {
            const startTime =
                String(Math.floor(start / 60)).padStart(2, "0") +
                ":" +
                String(start % 60).padStart(2, "0");

            const endTime =
                String(Math.floor((start + 30) / 60)).padStart(2, "0") +
                ":" +
                String((start + 30) % 60).padStart(2, "0");

            slots.push({
                start_time: startTime,
                end_time: endTime
            });

            start += 30;
        }
    });

    // Kiểm tra những giờ đã được đặt
    const bookedSlots = appointmentsData.filter(
        item =>
            item.doctor_id === doctorId &&
            item.date === date &&
            item.status !== "Đã hủy"
    );

    // Chỉ giữ các khung giờ chưa bị đặt
    const availableSlots = slots.filter(slot => {
        return !bookedSlots.some(appointment => {
            const slotStart = bookingTimeToMinutes(slot.start_time);
            const slotEnd = bookingTimeToMinutes(slot.end_time);

            const appointmentStart =
                bookingTimeToMinutes(appointment.start_time);

            const appointmentEnd =
                bookingTimeToMinutes(appointment.end_time);

            return (
                slotStart < appointmentEnd &&
                slotEnd > appointmentStart
            );
        });
    });

    // Không còn giờ trống
    if (availableSlots.length === 0) {
        container.innerHTML = `
            <p class="booking-hint">
                Hiện không còn khung giờ trống trong ngày này.
            </p>
        `;
        updateBookingSummary();
        return;
    }

    // Hiển thị các nút giờ khám
    container.innerHTML = `
        <div class="booking-slots">
            ${availableSlots.map(slot => `
                <button
                    type="button"
                    class="time-slot"
                    onclick="selectBookingTime('${slot.start_time}')"
                >
                    ${slot.start_time}
                </button>
            `).join("")}
        </div>
    `;

    updateBookingSummary();
}

// Chọn khung giờ
function selectBookingTime(time) {
    selectedBookingTime = time;

    document.querySelectorAll(".time-slot").forEach(button => {
        button.classList.toggle(
            "selected",
            button.textContent.trim() === time
        );
    });

    updateBookingSummary();
}

// Cập nhật thông tin tóm tắt bên phải
function updateBookingSummary() {
    const summary = document.getElementById(
        "booking-summary-content"
    );

    if (!summary) return;

    const doctorId = Number(
        document.getElementById("booking-doctor").value
    );

    const date = document.getElementById("booking-date").value;
    const reason = document.getElementById("booking-reason").value.trim();

    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    summary.innerHTML = `
        <div class="summary-row">
            <span>Bác sĩ</span>
            <strong>${doctor ? doctor.full_name : "Chưa chọn"}</strong>
        </div>

        <div class="summary-row">
            <span>Chuyên khoa</span>
            <strong>${doctor ? doctor.specialty : "Chưa chọn"}</strong>
        </div>

        <div class="summary-row">
            <span>Ngày khám</span>
            <strong>${formatBookingDate(date)}</strong>
        </div>

        <div class="summary-row">
            <span>Giờ khám</span>
            <strong>${selectedBookingTime || "Chưa chọn"}</strong>
        </div>

        <div class="summary-row">
            <span>Lý do khám</span>
            <strong>${reason || "Chưa nhập"}</strong>
        </div>
    `;
}


function confirmBooking() {
    if (bookingAlreadyConfirmed) {
    showToast("Lịch khám này đã được xác nhận!");
    return;
    }  
    // Lấy thông tin từ form
    const doctorId = Number(
        document.getElementById("booking-doctor").value
    );

    const date = document.getElementById("booking-date").value;

    const reason = document.getElementById("booking-reason")
        .value.trim();

    // 1. Kiểm tra thông tin bắt buộc
    if (!doctorId) {
        showToast("Vui lòng chọn bác sĩ!");
        return;
    }

    if (!date) {
        showToast("Vui lòng chọn ngày khám!");
        return;
    }

    if (!selectedBookingTime) {
        showToast("Vui lòng chọn khung giờ khám!");
        return;
    }

    if (!reason) {
        showToast("Vui lòng nhập lý do khám!");
        return;
    }

    // 2. Kiểm tra bác sĩ
    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor || doctor.doctor_status !== "Đang hoạt động") {
        showToast("Bác sĩ hiện không hoạt động!");
        return;
    }

    // 3. Kiểm tra ngày không nằm trong quá khứ
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (date < localToday) {
        showToast("Không thể đặt lịch trong quá khứ!");
        return;
    }

    // 4. Kiểm tra bác sĩ có nghỉ ngày này không
    const isDayOff = doctorTimeOffs.some(
        item =>
            item.doctor_id === doctorId &&
            item.date === date
    );

    if (isDayOff) {
        showToast("Bác sĩ nghỉ vào ngày bạn chọn!");
        updateAvailableSlots();
        return;
    }

    // 5. Kiểm tra lại khung giờ đã chọn
    const dayOfWeek = getBookingDayOfWeek(date);

    const schedules = doctorSchedules.filter(
        item =>
            item.doctor_id === doctorId &&
            item.day_of_week === dayOfWeek
    );

    const selectedStart = bookingTimeToMinutes(selectedBookingTime);
    const selectedEnd = selectedStart + 30;

    const isWorkingTime = schedules.some(schedule => {
        return (
            selectedStart >= bookingTimeToMinutes(schedule.start_time) &&
            selectedEnd <= bookingTimeToMinutes(schedule.end_time)
        );
    });

    if (!isWorkingTime) {
        showToast("Khung giờ không thuộc lịch làm việc của bác sĩ!");
        updateAvailableSlots();
        return;
    }

    // 6. Kiểm tra khung giờ có bị người khác đặt chưa
    const isBooked = appointmentsData.some(appointment => {
        if (
            appointment.doctor_id !== doctorId ||
            appointment.date !== date ||
            appointment.status === "Đã hủy"
        ) {
            return false;
        }

        const appointmentStart =
            bookingTimeToMinutes(appointment.start_time);

        const appointmentEnd =
            bookingTimeToMinutes(appointment.end_time);

        return (
            selectedStart < appointmentEnd &&
            selectedEnd > appointmentStart
        );
    });

    if (isBooked) {
        showToast("Khung giờ vừa được đặt. Vui lòng chọn giờ khác!");

        selectedBookingTime = null;
        updateAvailableSlots();
        updateBookingSummary();
        return;
    }

    // 7. Tạo lịch khám mới
    const newAppointment = {
        appointment_id: appointmentsData.length > 0
            ? Math.max(...appointmentsData.map(item => item.appointment_id)) + 1
            : 1,

        patient_id: 1,
        doctor_id: doctorId,
        date: date,
        start_time: selectedBookingTime,
        end_time: bookingMinutesToTime(selectedEnd),
        reason: reason,
        status: "Đã xác nhận"
    };

    appointmentsData.push(newAppointment);

    bookingAlreadyConfirmed = true;

    // 8. Tạo thông báo
    notificationsData.push({
    notification_id: notificationsData.length > 0
        ? Math.max(...notificationsData.map(item => item.notification_id)) + 1
        : 1,
    patient_id: 1,
    title: "Đặt lịch khám thành công",
    message: `Bạn đã đặt lịch với bác sĩ ${doctor.full_name} vào ngày ${formatBookingDate(date)} lúc ${selectedBookingTime}.`,
    created_at: new Date().toISOString(),
    is_read: false
    });

    // 9. Hiển thị kết quả thành công
    const summary = document.getElementById(
        "booking-summary-content"
    );

    summary.innerHTML = `
        <div class="booking-success">
            <div class="success-icon">✓</div>

            <h3>Đặt lịch thành công!</h3>
            <p>Lịch khám của bạn đã được ghi nhận.</p>

            <div class="booking-success-actions">
                <button
                    class="btn btn-primary"
                    onclick="navigateTo('appointments')"
                >
                    Xem lịch hẹn
                </button>

                <button
                    class="btn btn-outline"
                    onclick="startNewBooking()"
                >
                    Đặt lịch khác
                </button>
            </div>

            <div class="summary-row">
                <span>Bác sĩ</span>
                <strong>${doctor.full_name}</strong>
            </div>

            <div class="summary-row">
                <span>Chuyên khoa</span>
                <strong>${doctor.specialty}</strong>
            </div>

            <div class="summary-row">
                <span>Ngày khám</span>
                <strong>${formatBookingDate(date)}</strong>
            </div>

            <div class="summary-row">
                <span>Giờ khám</span>
                <strong>${selectedBookingTime}</strong>
            </div>

            <div class="summary-row">
                <span>Trạng thái</span>
                <strong class="booking-status">
                    Đã xác nhận
                </strong>
            </div>
        </div>
    `;

    showToast("Đặt lịch khám thành công!");

    // 10. Làm mới khung giờ để giờ vừa đặt không còn xuất hiện
    selectedBookingTime = null;
    updateAvailableSlots();

    // Giữ lại thông tin kết quả thành công bên phải
    // Không chuyển trang vì trang Lịch hẹn của tôi
    // sẽ được triển khai ở phần tiếp theo.
}

// Chuyển số phút về định dạng HH:mm
function bookingMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(remainingMinutes).padStart(2, "0")
    );
}




/* =========================
   RENDER DOCTOR CARDS
========================= */

function getDoctorCards(doctors) {
    if (doctors.length === 0) {
        return `
            <div class="panel doctor-empty">
                <i class="fa-solid fa-user-doctor"></i>
                <h3>Không tìm thấy bác sĩ</h3>
                <p>Vui lòng thử tên hoặc chuyên khoa khác.</p>
            </div>
        `;
    }

    return doctors.map(doctor => `
        <div class="doctor-card">

            <div class="doctor-card-top">
                <div class="doctor-avatar">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <span class="${doctor.doctor_status === "Đang hoạt động"
                    ? "doctor-active"
                    : "doctor-inactive"}">
                    ${doctor.doctor_status}
                </span>
            </div>

            <div class="doctor-card-info">
                <h3>BS. ${doctor.full_name}</h3>

                <span class="doctor-specialty">
                    ${doctor.specialty}
                </span>

                <div class="doctor-detail">
                    <p>
                        <i class="fa-solid fa-graduation-cap"></i>
                        ${doctor.qualification}
                    </p>

                    <p>
                        <i class="fa-solid fa-briefcase"></i>
                        ${doctor.experience_years} năm kinh nghiệm
                    </p>
                </div>

                <p class="doctor-description">
                    ${doctor.description}
                </p>
            </div>

            <button
                class="doctor-book-btn"
                ${doctor.doctor_status !== "Đang hoạt động" ? "disabled" : ""}
                onclick="selectDoctor(${doctor.doctor_id})">
                <i class="fa-solid fa-calendar-plus"></i>
                Đặt lịch khám
            </button>

        </div>
    `).join("");
}


/* =========================
   SEARCH AND FILTER DOCTORS
========================= */

function filterDoctors() {
    const keyword = document
        .getElementById("doctor-search")
        .value.trim()
        .toLowerCase();

    const specialty = document
        .getElementById("specialty-filter")
        .value;

    const filteredDoctors = doctorsData.filter(doctor => {
        const matchName = doctor.full_name
            .toLowerCase()
            .includes(keyword);

        const matchSpecialty = !specialty ||
            doctor.specialty === specialty;

        return matchName && matchSpecialty;
    });

    document.getElementById("doctor-grid").innerHTML =
        getDoctorCards(filteredDoctors);

    document.getElementById("doctor-count").textContent =
        `${filteredDoctors.length} bác sĩ`;
}


/* =========================
   SELECT DOCTOR
========================= */

function selectDoctor(doctorId) {
    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor) return;

    if (doctor.doctor_status !== "Đang hoạt động") {
        showToast("Bác sĩ hiện không nhận lịch khám.");
        return;
    }

    // Lưu bác sĩ được chọn để sử dụng ở bước đặt lịch
    window.selectedDoctorId = doctor.doctor_id;

    showToast(`Bạn đã chọn BS. ${doctor.full_name}`);

    navigateTo("booking");
}


/* =========================
   13. TOAST
========================= */

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}


function getMyAppointmentsHTML() {
    return `
        <div class="my-appointments-page">

            <div class="appointments-header">
                <div>
                    <h2>Lịch hẹn của tôi</h2>
                    <p>Quản lý và theo dõi các lịch khám của bạn.</p>
                </div>

                <button
                    class="btn-booking"
                    onclick="navigateTo('booking')"
                    style="width:auto; padding: 0 20px;"
                >
                    + Đặt lịch mới
                </button>
            </div>

            <!-- Thống kê -->
            <div class="appointment-stats">

                <div class="appointment-stat-card">
                    <span>Tổng lịch hẹn</span>
                    <strong id="total-appointments">0</strong>
                </div>

                <div class="appointment-stat-card">
                    <span>Sắp tới</span>
                    <strong id="upcoming-appointments">0</strong>
                </div>

                <div class="appointment-stat-card">
                    <span>Đã hoàn thành</span>
                    <strong id="completed-appointments">0</strong>
                </div>

                <div class="appointment-stat-card">
                    <span>Đã hủy</span>
                    <strong id="cancelled-appointments">0</strong>
                </div>

            </div>

            <!-- Bộ lọc -->
            <div class="appointment-filter-panel">

                <h3>Danh sách lịch khám</h3>

                <div class="appointment-filters">
                    <button
                        class="appointment-filter active"
                        onclick="filterMyAppointments('all', this)"
                    >
                        Tất cả
                    </button>

                    <button
                        class="appointment-filter"
                        onclick="filterMyAppointments('Đã xác nhận', this)"
                    >
                        Đã xác nhận
                    </button>

                    <button
                        class="appointment-filter"
                        onclick="filterMyAppointments('Chờ xác nhận', this)"
                    >
                        Chờ xác nhận
                    </button>

                    <button
                        class="appointment-filter"
                        onclick="filterMyAppointments('Đã hoàn thành', this)"
                    >
                        Đã hoàn thành
                    </button>

                    <button
                        class="appointment-filter"
                        onclick="filterMyAppointments('Đã hủy', this)"
                    >
                        Đã hủy
                    </button>
                </div>

            </div>

            <!-- Danh sách lịch hẹn -->
            <div id="my-appointments-list"></div>

        </div>

        <!-- Khu vực hiển thị chi tiết -->
        <div id="appointment-detail-modal"></div>
    `;
}


/* =====================================
   US05 - HIỂN THỊ LỊCH HẸN CỦA BỆNH NHÂN
===================================== */

// Bộ lọc lịch hẹn hiện tại
let currentAppointmentFilter = "all";

// Lấy danh sách lịch hẹn của bệnh nhân
function getPatientAppointments() {
    return appointmentsData
        .filter(item => item.patient_id === 1)
        .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
}

// Định dạng trạng thái
function getAppointmentStatusClass(status) {
    if (status === "Đã xác nhận") return "status-success";
    if (status === "Chờ xác nhận") return "status-warning";
    if (status === "Đã hoàn thành") return "status-info";
    if (status === "Đã hủy") return "status-danger";

    return "status-info";
}

// Hiển thị danh sách lịch hẹn
function renderMyAppointments() {
    const appointments = getPatientAppointments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Thống kê
    const upcoming = appointments.filter(item =>
        new Date(item.date + "T00:00:00") >= today &&
        ["Đã xác nhận", "Chờ xác nhận"].includes(item.status)
    );

    const completed = appointments.filter(
        item => item.status === "Đã hoàn thành"
    );

    const cancelled = appointments.filter(
        item => item.status === "Đã hủy"
    );

    document.getElementById("total-appointments").textContent =
        appointments.length;

    document.getElementById("upcoming-appointments").textContent =
        upcoming.length;

    document.getElementById("completed-appointments").textContent =
        completed.length;

    document.getElementById("cancelled-appointments").textContent =
        cancelled.length;

    // Hiển thị danh sách theo bộ lọc
    filterMyAppointments(currentAppointmentFilter);
}

// Lọc lịch hẹn theo trạng thái
function filterMyAppointments(status, button = null) {
    currentAppointmentFilter = status;

    document.querySelectorAll(".appointment-filter").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        document.querySelectorAll(".appointment-filter").forEach(item => {
            const text = item.textContent.trim();

            if (
                (status === "all" && text === "Tất cả") ||
                text === status
            ) {
                item.classList.add("active");
            }
        });
    }

    const appointments = getPatientAppointments();

    const filteredAppointments = status === "all"
        ? appointments
        : appointments.filter(item => item.status === status);

    const container = document.getElementById("my-appointments-list");

    if (!container) return;

    if (filteredAppointments.length === 0) {
        container.innerHTML = `
            <div class="panel" style="text-align:center; padding:40px;">
                <i class="fa-solid fa-calendar-xmark"
                   style="font-size:35px;color:#94A3B8;margin-bottom:15px;">
                </i>
                <h3>Không có lịch khám</h3>
                <p style="color:#64748B;margin-top:8px;">
                    Hiện chưa có lịch khám thuộc trạng thái này.
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="panel">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Mã lịch</th>
                            <th>Bác sĩ</th>
                            <th>Chuyên khoa</th>
                            <th>Ngày khám</th>
                            <th>Giờ khám</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filteredAppointments.map(item => {
                            const doctor = doctorsData.find(
                                doctor => doctor.doctor_id === item.doctor_id
                            );

                            return `
                                <tr>
                                    <td>AP${String(item.appointment_id).padStart(3, "0")}</td>

                                    <td>
                                        BS. ${doctor ? doctor.full_name : "Chưa cập nhật"}
                                    </td>

                                    <td>
                                        ${doctor ? doctor.specialty : "Chưa cập nhật"}
                                    </td>

                                    <td>${formatBookingDate(item.date)}</td>

                                    <td>${item.start_time}</td>

                                    <td>
                                        <span class="status ${getAppointmentStatusClass(item.status)}">
                                            ${item.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button class="btn btn-primary"
                                            onclick="viewAppointmentDetail(${item.appointment_id})">
                                            Chi tiết
                                        </button>

                                        ${
                                            ["Đã xác nhận", "Chờ xác nhận"].includes(item.status)
                                            ? `
                                                <button class="btn btn-outline"
                                                    onclick="cancelMyAppointment(${item.appointment_id})">
                                                    Hủy lịch
                                                </button>
                                            `
                                            : ""
                                        }
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Xem chi tiết lịch khám
function viewAppointmentDetail(appointmentId) {
    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment) return;

    const doctor = doctorsData.find(
        item => item.doctor_id === appointment.doctor_id
    );

    const modal = document.getElementById("appointment-detail-modal");

    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAppointmentDetail(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <h3>Chi tiết lịch khám</h3>

                <p><strong>Mã lịch:</strong> AP${String(appointment.appointment_id).padStart(3, "0")}</p>
                <p><strong>Bác sĩ:</strong> ${doctor ? doctor.full_name : "Chưa cập nhật"}</p>
                <p><strong>Chuyên khoa:</strong> ${doctor ? doctor.specialty : "Chưa cập nhật"}</p>
                <p><strong>Ngày khám:</strong> ${formatBookingDate(appointment.date)}</p>
                <p><strong>Giờ khám:</strong> ${appointment.start_time} - ${appointment.end_time}</p>
                <p><strong>Lý do khám:</strong> ${appointment.reason}</p>
                <p><strong>Trạng thái:</strong> ${appointment.status}</p>

                <div class="modal-actions">
                    <button class="btn btn-primary"
                        onclick="closeAppointmentDetail()">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Đóng chi tiết
function closeAppointmentDetail(event) {
    if (event && event.target !== event.currentTarget) return;

    document.getElementById("appointment-detail-modal").innerHTML = "";
}

// Hủy lịch khám
function cancelMyAppointment(appointmentId) {
    const confirmed = confirm("Bạn có chắc chắn muốn hủy lịch khám này không?");

    if (!confirmed) return;

    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment) return;

    appointment.status = "Đã hủy";

    showToast("Hủy lịch khám thành công!");

    renderMyAppointments();
}


function getPatientFeedbackHTML() {
    return `
        <div class="feedback-page">

            <div class="feedback-header">
                <div>
                    <h2>Phản hồi của tôi</h2>
                    <p>
                        Chia sẻ trải nghiệm khám bệnh để chúng tôi
                        cải thiện chất lượng dịch vụ.
                    </p>
                </div>
            </div>

            <div class="feedback-layout">

                <div class="feedback-form-panel">

                    <h3>Gửi phản hồi</h3>

                    <div class="feedback-form-group">
                        <label for="feedback-appointment">
                            Chọn lịch khám đã hoàn thành
                        </label>

                        <select id="feedback-appointment">
                            <option value="">
                                -- Chọn lịch khám --
                            </option>
                        </select>
                    </div>

                    <div class="feedback-form-group">
                        <label>Mức độ hài lòng</label>

                        <div class="feedback-rating" id="feedback-rating">
                            ${[1, 2, 3, 4, 5].map(number => `
                                <button
                                    type="button"
                                    class="rating-star"
                                    onclick="selectFeedbackRating(${number})"
                                >
                                    ★
                                </button>
                            `).join("")}
                        </div>

                        <p id="rating-description">
                            Vui lòng chọn số sao đánh giá.
                        </p>
                    </div>

                    <div class="feedback-form-group">
                        <label for="feedback-content">
                            Nội dung phản hồi
                        </label>

                        <textarea
                            id="feedback-content"
                            rows="5"
                            placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                        ></textarea>
                    </div>

                    <button
                        class="btn-feedback"
                        onclick="submitPatientFeedback()"
                    >
                        Gửi phản hồi
                    </button>

                </div>

                <div class="feedback-history-panel">
                    <h3>Lịch sử phản hồi</h3>

                    <div id="patient-feedback-list"></div>
                </div>

            </div>
        </div>
    `;
}


/* =====================================
   US06 - XỬ LÝ PHẢN HỒI BỆNH NHÂN
===================================== */

// Khởi tạo dữ liệu cho trang phản hồi
function renderPatientFeedback() {
    selectedFeedbackRating = 0;

    const appointmentSelect = document.getElementById(
        "feedback-appointment"
    );

    const historyContainer = document.getElementById(
        "patient-feedback-list"
    );

    if (!appointmentSelect || !historyContainer) return;

    // Chỉ lấy lịch đã hoàn thành của bệnh nhân hiện tại
    const completedAppointments = appointmentsData.filter(
        appointment =>
            appointment.patient_id === 1 &&
            appointment.status === "Đã hoàn thành"
    );

    // Loại bỏ những lịch đã được gửi phản hồi
    const availableAppointments = completedAppointments.filter(
        appointment =>
            !feedbackData.some(
                feedback =>
                    feedback.appointment_id === appointment.appointment_id
            )
    );

    appointmentSelect.innerHTML = `
        <option value="">-- Chọn lịch khám --</option>

        ${availableAppointments.map(appointment => {
            const doctor = doctorsData.find(
                item => item.doctor_id === appointment.doctor_id
            );

            return `
                <option value="${appointment.appointment_id}">
                    AP${String(appointment.appointment_id).padStart(3, "0")}
                    - ${doctor ? doctor.full_name : "Bác sĩ"}
                    - ${formatBookingDate(appointment.date)}
                </option>
            `;
        }).join("")}
    `;

    // Hiển thị lịch sử phản hồi
    renderFeedbackHistory();

    // Đặt lại đánh giá sao
    updateFeedbackRating();
}

// Chọn số sao đánh giá
function selectFeedbackRating(rating) {
    selectedFeedbackRating = rating;
    updateFeedbackRating();
}

// Cập nhật giao diện đánh giá sao
function updateFeedbackRating() {
    const stars = document.querySelectorAll(".rating-star");

    const descriptions = [
        "",
        "Rất không hài lòng",
        "Không hài lòng",
        "Bình thường",
        "Hài lòng",
        "Rất hài lòng"
    ];

    stars.forEach((star, index) => {
        star.classList.toggle(
            "active",
            index < selectedFeedbackRating
        );
    });

    const description = document.getElementById(
        "rating-description"
    );

    if (description) {
        description.textContent = selectedFeedbackRating
            ? descriptions[selectedFeedbackRating]
            : "Vui lòng chọn số sao đánh giá.";
    }
}

// Gửi phản hồi
function submitPatientFeedback() {
    const appointmentId = Number(
        document.getElementById("feedback-appointment").value
    );

    const content = document.getElementById(
        "feedback-content"
    ).value.trim();

    // Kiểm tra lịch khám
    if (!appointmentId) {
        showToast("Vui lòng chọn lịch khám!");
        return;
    }

    // Kiểm tra số sao
    if (selectedFeedbackRating === 0) {
        showToast("Vui lòng đánh giá mức độ hài lòng!");
        return;
    }

    // Kiểm tra nội dung
    if (!content) {
        showToast("Vui lòng nhập nội dung phản hồi!");
        return;
    }

    // Kiểm tra lịch có thực sự hoàn thành không
    const appointment = appointmentsData.find(
        item =>
            item.appointment_id === appointmentId &&
            item.patient_id === 1 &&
            item.status === "Đã hoàn thành"
    );

    if (!appointment) {
        showToast("Lịch khám không hợp lệ!");
        return;
    }

    // Không cho gửi phản hồi trùng
    const alreadyFeedback = feedbackData.some(
        item => item.appointment_id === appointmentId
    );

    if (alreadyFeedback) {
        showToast("Bạn đã gửi phản hồi cho lịch khám này!");
        return;
    }

    // Tạo phản hồi mới
    const newFeedback = {
        feedback_id: feedbackData.length > 0
            ? Math.max(...feedbackData.map(item => item.feedback_id)) + 1
            : 1,

        appointment_id: appointmentId,
        patient_id: 1,
        rating: selectedFeedbackRating,
        content: content,
        created_at: new Date().toISOString(),
        status: "Chờ xử lý"
    };

    feedbackData.push(newFeedback);

    // Xóa nội dung form
    document.getElementById("feedback-content").value = "";

    selectedFeedbackRating = 0;

    // Cập nhật giao diện
    renderPatientFeedback();

    showToast("Gửi phản hồi thành công!");
}

// Hiển thị lịch sử phản hồi
function renderFeedbackHistory() {
    const container = document.getElementById(
        "patient-feedback-list"
    );

    if (!container) return;

    const patientFeedbacks = feedbackData
        .filter(item => item.patient_id === 1)
        .sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

    if (patientFeedbacks.length === 0) {
        container.innerHTML = `
            <div class="feedback-empty">
                <i class="fa-regular fa-comment-dots"></i>
                <p>Bạn chưa có phản hồi nào.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = patientFeedbacks.map(feedback => {
        const appointment = appointmentsData.find(
            item => item.appointment_id === feedback.appointment_id
        );

        const doctor = appointment
            ? doctorsData.find(
                item => item.doctor_id === appointment.doctor_id
            )
            : null;

        const dateText = new Date(
            feedback.created_at
        ).toLocaleDateString("vi-VN");

        return `
            <div class="feedback-history-item">

                <div class="feedback-history-top">
                    <strong>
                        ${doctor ? doctor.full_name : "Bác sĩ"}
                    </strong>

                    <span class="feedback-history-status">
                        ${feedback.status}
                    </span>
                </div>

                <div class="feedback-history-stars">
                    ${"★".repeat(feedback.rating)}${"☆".repeat(5 - feedback.rating)}
                </div>

                <p>${feedback.content}</p>

                <div class="feedback-history-date">
                    Lịch AP${String(feedback.appointment_id).padStart(3, "0")}
                    · ${dateText}
                </div>

            </div>
        `;
    }).join("");
}


function getPatientNotificationsHTML() {
    return `
        <div class="notifications-page">

            <div class="notifications-header">
                <div>
                    <h2>Thông báo</h2>
                    <p>Theo dõi các cập nhật về lịch khám và phản hồi của bạn.</p>
                </div>

                <button
                    class="btn-mark-all"
                    onclick="markAllNotificationsRead()"
                >
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            <!-- Thống kê thông báo -->
            <div class="notification-stats">

                <div class="notification-stat-card">
                    <span>Tổng thông báo</span>
                    <strong id="notification-total">0</strong>
                </div>

                <div class="notification-stat-card">
                    <span>Chưa đọc</span>
                    <strong id="notification-unread">0</strong>
                </div>

                <div class="notification-stat-card">
                    <span>Đã đọc</span>
                    <strong id="notification-read">0</strong>
                </div>

            </div>

            <!-- Bộ lọc -->
            <div class="notification-filter-panel">
                <h3>Danh sách thông báo</h3>

                <div class="notification-filters">
                    <button
                        class="notification-filter active"
                        onclick="filterPatientNotifications('all', this)"
                    >
                        Tất cả
                    </button>

                    <button
                        class="notification-filter"
                        onclick="filterPatientNotifications('unread', this)"
                    >
                        Chưa đọc
                    </button>

                    <button
                        class="notification-filter"
                        onclick="filterPatientNotifications('read', this)"
                    >
                        Đã đọc
                    </button>
                </div>
            </div>

            <!-- Danh sách -->
            <div
                id="patient-notification-list"
                class="patient-notification-list"
            ></div>

        </div>
    `;
}


/* =====================================
   US07 - XỬ LÝ THÔNG BÁO
===================================== */

let currentNotificationFilter = "all";

// Hiển thị danh sách thông báo
function renderPatientNotifications() {
    const notifications = notificationsData.filter(
        item => item.patient_id === 1
    );

    const total = notifications.length;
    const unread = notifications.filter(item => !item.is_read).length;
    const read = notifications.filter(item => item.is_read).length;

    document.getElementById("notification-total").textContent = total;
    document.getElementById("notification-unread").textContent = unread;
    document.getElementById("notification-read").textContent = read;

    filterPatientNotifications(currentNotificationFilter);
}

// Lọc thông báo
function filterPatientNotifications(status, button = null) {
    currentNotificationFilter = status;

    document.querySelectorAll(".notification-filter").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        document.querySelectorAll(".notification-filter").forEach(item => {
            const text = item.textContent.trim();

            if (
                (status === "all" && text === "Tất cả") ||
                (status === "unread" && text === "Chưa đọc") ||
                (status === "read" && text === "Đã đọc")
            ) {
                item.classList.add("active");
            }
        });
    }

    const container = document.getElementById(
        "patient-notification-list"
    );

    if (!container) return;

    let notifications = notificationsData.filter(
        item => item.patient_id === 1
    );

    if (status === "unread") {
        notifications = notifications.filter(item => !item.is_read);
    } else if (status === "read") {
        notifications = notifications.filter(item => item.is_read);
    }

    notifications.sort((a, b) => {
        return new Date(b.created_at || 0) -
               new Date(a.created_at || 0);
    });

    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="notification-empty">
                <i class="fa-regular fa-bell-slash"></i>
                <p>Không có thông báo nào.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notifications.map(item => `
        <div class="notification-item ${item.is_read ? "" : "unread"}">

            <div class="notification-icon">
                <i class="fa-solid fa-bell"></i>
            </div>

            <div class="notification-content">
                <h4>${item.title}</h4>
                <p>${item.message}</p>

                <span class="notification-date">
                    ${item.created_at
                        ? new Date(item.created_at).toLocaleString("vi-VN")
                        : "Thông báo từ hệ thống"}
                </span>
            </div>

            <div class="notification-actions">
                ${
                    item.type === "re_exam"
                    ? `
                        <button
                            class="btn btn-primary"
                            onclick="startReExamBooking(${item.appointment_id})"
                        >
                            Đặt lịch tái khám
                        </button>
                    `
                    : ""
                }

                ${
                    !item.is_read
                    ? `
                        <button
                            class="notification-action-btn"
                            onclick="markNotificationRead(${item.notification_id})"
                        >
                            Đánh dấu đã đọc
                        </button>
                    `
                    : `
                        <span class="notification-date">Đã đọc</span>
                    `
                }
            </div>

        </div>
    `).join("");
}

// Đánh dấu một thông báo đã đọc
function markNotificationRead(notificationId) {
    const notification = notificationsData.find(
        item =>
            item.notification_id === notificationId &&
            item.patient_id === 1
    );

    if (!notification) return;

    notification.is_read = true;

    renderPatientNotifications();
    showToast("Đã đánh dấu thông báo đã đọc!");
}

// Đánh dấu tất cả thông báo đã đọc
function markAllNotificationsRead() {
    notificationsData.forEach(item => {
        if (item.patient_id === 1) {
            item.is_read = true;
        }
    });

    renderPatientNotifications();
    showToast("Đã đánh dấu tất cả thông báo đã đọc!");
}


function getDoctorAppointmentsHTML() {
    return `
        <div class="doctor-appointments-page">

            <div class="doctor-appointments-header">
                <div>
                    <h2>Lịch khám của tôi</h2>
                    <p>Quản lý và theo dõi các lịch khám được phân công.</p>
                </div>
            </div>

            <!-- Thống kê -->
            <div class="doctor-appointment-stats">

                <div class="doctor-stat-card">
                    <span>Tổng lịch khám</span>
                    <strong id="doctor-total-appointments">0</strong>
                </div>

                <div class="doctor-stat-card">
                    <span>Chờ xác nhận</span>
                    <strong id="doctor-pending-appointments">0</strong>
                </div>

                <div class="doctor-stat-card">
                    <span>Đang khám</span>
                    <strong id="doctor-inprogress-appointments">0</strong>
                </div>

                <div class="doctor-stat-card">
                    <span>Đã hoàn thành</span>
                    <strong id="doctor-completed-appointments">0</strong>
                </div>

            </div>

            <!-- Bộ lọc -->
            <div class="doctor-appointment-filter-panel">

                <h3>Danh sách lịch khám</h3>

                <div class="doctor-appointment-filters">

                    <button
                        class="doctor-appointment-filter active"
                        onclick="filterDoctorAppointments('all', this)"
                    >
                        Tất cả
                    </button>

                    <button
                        class="doctor-appointment-filter"
                        onclick="filterDoctorAppointments('Chờ xác nhận', this)"
                    >
                        Chờ xác nhận
                    </button>

                    <button
                        class="doctor-appointment-filter"
                        onclick="filterDoctorAppointments('Đã xác nhận', this)"
                    >
                        Đã xác nhận
                    </button>

                    <button
                        class="doctor-appointment-filter"
                        onclick="filterDoctorAppointments('Đang khám', this)"
                    >
                        Đang khám
                    </button>

                    <button
                        class="doctor-appointment-filter"
                        onclick="filterDoctorAppointments('Đã hoàn thành', this)"
                    >
                        Đã hoàn thành
                    </button>

                    <button
                        class="doctor-appointment-filter"
                        onclick="filterDoctorAppointments('Đã hủy', this)"
                    >
                        Đã hủy
                    </button>

                </div>

                <div class="doctor-appointment-date-filter">
                    <label for="doctor-appointment-date">
                        Lọc theo ngày khám
                    </label>

                    <input
                        type="date"
                        id="doctor-appointment-date"
                        onchange="filterDoctorAppointments(currentDoctorAppointmentFilter)"
                    >

                    <button
                        class="btn-clear-date"
                        onclick="clearDoctorAppointmentDate()"
                    >
                        Xóa bộ lọc ngày
                    </button>
                </div>

            </div>

            <!-- Danh sách -->
            <div id="doctor-appointments-list"></div>

        </div>

        <!-- Modal chi tiết lịch khám -->
        <div id="doctor-appointment-detail-modal"></div>
    `;
}

// =====================================
// DOCTOR - HIỂN THỊ LỊCH KHÁM
// =====================================

// Lấy lịch khám được phân công cho bác sĩ hiện tại
function getDoctorAppointments() {
    // Tài khoản bác sĩ demo hiện tại là bác sĩ có doctor_id = 1
    return appointmentsData
        .filter(item => item.doctor_id === 1)
        .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
}


// Hiển thị lịch khám và thống kê
function renderDoctorAppointments() {
    const appointments = getDoctorAppointments();

    const pending = appointments.filter(
        item => item.status === "Chờ xác nhận"
    );

    const inProgress = appointments.filter(
        item => item.status === "Đang khám"
    );

    const completed = appointments.filter(
        item => item.status === "Đã hoàn thành"
    );

    document.getElementById("doctor-total-appointments").textContent =
        appointments.length;

    document.getElementById("doctor-pending-appointments").textContent =
        pending.length;

    document.getElementById("doctor-inprogress-appointments").textContent =
        inProgress.length;

    document.getElementById("doctor-completed-appointments").textContent =
        completed.length;

    filterDoctorAppointments(currentDoctorAppointmentFilter);
}


// Lọc lịch khám theo trạng thái và ngày
function filterDoctorAppointments(status, button = null) {
    currentDoctorAppointmentFilter = status;

    document.querySelectorAll(".doctor-appointment-filter").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        document.querySelectorAll(".doctor-appointment-filter").forEach(item => {
            if (
                item.getAttribute("onclick")?.includes(`'${status}'`)
            ) {
                item.classList.add("active");
            }
        });
    }

    const dateInput = document.getElementById("doctor-appointment-date");
    const selectedDate = dateInput ? dateInput.value : "";

    let filteredAppointments = getDoctorAppointments();

    if (status !== "all") {
        filteredAppointments = filteredAppointments.filter(
            item => item.status === status
        );
    }

    if (selectedDate) {
        filteredAppointments = filteredAppointments.filter(
            item => item.date === selectedDate
        );
    }

    const container = document.getElementById("doctor-appointments-list");

    if (filteredAppointments.length === 0) {
        container.innerHTML = `
            <div class="panel">
                <p>Không có lịch khám phù hợp.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="panel">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Mã lịch</th>
                        <th>Bệnh nhân</th>
                        <th>Ngày khám</th>
                        <th>Giờ khám</th>
                        <th>Lý do khám</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    ${filteredAppointments.map(item => `
                        <tr>
                            <td>AP${String(item.appointment_id).padStart(3, "0")}</td>
                            <td>Nguyễn Văn A</td>
                            <td>${formatBookingDate(item.date)}</td>
                            <td>${item.start_time} - ${item.end_time}</td>
                            <td>${item.reason}</td>
                            <td>${item.status}</td>
                            <td>
                                ${
                                    item.status === "Đã hoàn thành"
                                    ? `
                                        ${
                                            reExamRecommendations.some(
                                                r => r.appointment_id === item.appointment_id
                                            )
                                            ? `
                                                <div class="reexam-status">
                                                    <span>✓ Đã đề xuất tái khám</span>
                                                </div>

                                                <button
                                                    class="btn btn-primary"
                                                    onclick="openReExamForm(${item.appointment_id})"
                                                >
                                                    Cập nhật đề xuất
                                                </button>
                                            `
                                            : `
                                                <button
                                                    class="btn btn-primary"
                                                    onclick="openReExamForm(${item.appointment_id})"
                                                >
                                                    Đề xuất tái khám
                                                </button>
                                            `
                                        }
                                    `
                                    : `
                                        <button
                                            class="btn btn-primary"
                                            onclick="updateDoctorAppointmentStatus(${item.appointment_id})"
                                        >
                                            ${
                                                item.status === "Chờ xác nhận"
                                                    ? "Xác nhận"
                                                    : item.status === "Đã xác nhận"
                                                    ? "Bắt đầu khám"
                                                    : item.status === "Đang khám"
                                                    ? "Hoàn thành"
                                                    : "Xem"
                                            }
                                        </button>
                                    `
                                }
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}


// Cập nhật trạng thái lịch khám
function updateDoctorAppointmentStatus(appointmentId) {
    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment) return;

    if (appointment.status === "Chờ xác nhận") {
        appointment.status = "Đã xác nhận";
        showToast("Đã xác nhận lịch khám!");

    } else if (appointment.status === "Đã xác nhận") {
        appointment.status = "Đang khám";
        showToast("Đã bắt đầu khám!");

    } else if (appointment.status === "Đang khám") {
        appointment.status = "Đã hoàn thành";
        showToast("Đã hoàn thành lịch khám!");

    } else {
        showToast("Lịch khám này đã kết thúc hoặc không thể cập nhật.");
        return;
    }

    renderDoctorAppointments();
}


// Xóa bộ lọc ngày
function clearDoctorAppointmentDate() {
    document.getElementById("doctor-appointment-date").value = "";
    filterDoctorAppointments(currentDoctorAppointmentFilter);
}

// =====================================
// DOCTOR - HỒ SƠ BỆNH NHÂN
// =====================================

// Giao diện hồ sơ bệnh nhân
function getDoctorPatientsHTML() {
    return `
        <div class="page-heading">
            <h2>Hồ sơ bệnh nhân</h2>
            <p>Tra cứu thông tin và theo dõi lịch sử khám của bệnh nhân.</p>
        </div>

        <div class="panel">
            <div class="doctor-search">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    id="doctor-patient-search"
                    placeholder="Tìm kiếm bệnh nhân..."
                    oninput="renderDoctorPatients()"
                >
            </div>
        </div>

        <div class="doctor-result-heading">
            <h3>Danh sách bệnh nhân</h3>
            <span id="doctor-patient-count">0 bệnh nhân</span>
        </div>

        <div id="doctor-patients-list"></div>

        <div id="doctor-patient-detail-modal"></div>
    `;
}


// Hiển thị danh sách bệnh nhân
function renderDoctorPatients() {
    const container = document.getElementById("doctor-patients-list");
    const searchInput = document.getElementById("doctor-patient-search");

    if (!container || !searchInput) return;

    const keyword = searchInput.value.trim().toLowerCase();

    // Chỉ lấy bệnh nhân có lịch khám với bác sĩ hiện tại
    const patientIds = [
        ...new Set(
            getDoctorAppointments().map(item => item.patient_id)
        )
    ];

    // Dữ liệu hồ sơ bệnh nhân mẫu hiện có
    const patients = patientIds
        .filter(id => id === 1)
        .map(id => ({
            patient_id: id,
            fullName: patientProfile.fullName,
            phone: patientProfile.phone,
            email: patientProfile.email,
            dateOfBirth: patientProfile.dateOfBirth,
            gender: patientProfile.gender,
            address: patientProfile.address
        }))
        .filter(patient =>
            patient.fullName.toLowerCase().includes(keyword) ||
            patient.phone.includes(keyword)
        );

    document.getElementById("doctor-patient-count").textContent =
        `${patients.length} bệnh nhân`;

    if (patients.length === 0) {
        container.innerHTML = `
            <div class="panel">
                <p>Không tìm thấy bệnh nhân phù hợp.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="panel">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Mã bệnh nhân</th>
                        <th>Họ và tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    ${patients.map(patient => `
                        <tr>
                            <td>BN${String(patient.patient_id).padStart(3, "0")}</td>
                            <td>${patient.fullName}</td>
                            <td>${patient.phone}</td>
                            <td>${patient.email}</td>
                            <td>
                                <button
                                    class="btn btn-primary"
                                    onclick="viewDoctorPatientDetail(${patient.patient_id})"
                                >
                                    Xem hồ sơ
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}


// Xem chi tiết hồ sơ bệnh nhân
function viewDoctorPatientDetail(patientId) {
    if (patientId !== 1) return;

    const patientAppointments = getDoctorAppointments()
        .filter(item => item.patient_id === patientId);

    const modal = document.getElementById(
        "doctor-patient-detail-modal"
    );

    modal.innerHTML = `
        <div class="modal-overlay"
             onclick="closeDoctorPatientDetail(event)">

            <div class="modal"
                 onclick="event.stopPropagation()">

                <h3>Thông tin bệnh nhân</h3>

                <p><strong>Mã bệnh nhân:</strong> BN001</p>
                <p><strong>Họ và tên:</strong> ${patientProfile.fullName}</p>
                <p><strong>Ngày sinh:</strong> ${formatBookingDate(patientProfile.dateOfBirth)}</p>
                <p><strong>Giới tính:</strong> ${patientProfile.gender}</p>
                <p><strong>Số điện thoại:</strong> ${patientProfile.phone}</p>
                <p><strong>Email:</strong> ${patientProfile.email}</p>
                <p><strong>Địa chỉ:</strong> ${patientProfile.address}</p>

                <hr>

                <h4>Lịch sử khám với bác sĩ</h4>

                ${
                    patientAppointments.length === 0
                    ? `<p>Chưa có lịch sử khám.</p>`
                    : `
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Ngày khám</th>
                                    <th>Lý do khám</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${patientAppointments.map(item => `
                                    <tr>
                                        <td>${formatBookingDate(item.date)}</td>
                                        <td>${item.reason}</td>
                                        <td>${item.status}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    `
                }

                <div class="modal-actions">
                    <button
                        class="btn btn-primary"
                        onclick="closeDoctorPatientDetail()"
                    >
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    `;
}

// Đóng chi tiết hồ sơ
// Đóng modal hồ sơ bệnh nhân và đề xuất tái khám
function closeDoctorPatientDetail(event) {
    if (event && event.target !== event.currentTarget) return;

    const patientModal = document.getElementById(
        "doctor-patient-detail-modal"
    );

    const appointmentModal = document.getElementById(
        "doctor-appointment-detail-modal"
    );

    if (patientModal) {
        patientModal.innerHTML = "";
    }

    if (appointmentModal) {
        appointmentModal.innerHTML = "";
    }
}

// Mở biểu mẫu đề xuất tái khám
function openReExamForm(appointmentId) {
    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment || appointment.status !== "Đã hoàn thành") {
        showToast("Chỉ có thể đề xuất tái khám cho lịch đã hoàn thành.");
        return;
    }

    const existingRecommendation = reExamRecommendations.find(
        item => item.appointment_id === appointmentId
    );

    const modal = document.getElementById(
        "doctor-appointment-detail-modal"
    );

    modal.innerHTML = `
        <div class="modal-overlay"
             onclick="closeDoctorPatientDetail(event)">

            <div class="modal"
                 onclick="event.stopPropagation()">

                <h3>Đề xuất tái khám</h3>

                <p>
                    <strong>Mã lịch khám:</strong>
                    AP${String(appointmentId).padStart(3, "0")}
                </p>

                <p>
                    <strong>Bệnh nhân:</strong>
                    Nguyễn Văn A
                </p>

                <form onsubmit="saveReExamRecommendation(event, ${appointmentId})">

                    <div class="form-group">
                        <label>Ngày tái khám đề xuất</label>

                        <p class="booking-hint">
                            Chọn ngày bác sĩ có lịch làm việc.
                        </p>

                        <div id="reexam-date-options"></div>

                        <input
                            type="date"
                            id="reexam-date"
                            min="${new Date().toLocaleDateString("en-CA")}"
                            value="${existingRecommendation?.date || ""}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Lời dặn của bác sĩ</label>
                        <textarea
                            id="reexam-note"
                            rows="4"
                            placeholder="Nhập lời dặn và hướng dẫn tái khám..."
                            required
                        >${existingRecommendation?.note || ""}</textarea>
                    </div>

                    <div class="modal-actions">
                        <button
                            type="button"
                            class="btn btn-outline"
                            onclick="closeDoctorPatientDetail()"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Lưu đề xuất
                        </button>
                    </div>

                </form>
            </div>
        </div>
    `;
        renderReExamDateOptions(
        appointment.doctor_id,
        existingRecommendation?.date || ""
        );
}


// Lưu đề xuất tái khám
function saveReExamRecommendation(event, appointmentId) {
    event.preventDefault();

    const date = document.getElementById("reexam-date").value;
    const note = document.getElementById("reexam-note").value.trim();

    if (!date || !note) {
        showToast("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // Không cho đề xuất ngày trong quá khứ
    const selectedDate = new Date(date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showToast("Không thể đề xuất ngày trong quá khứ.");
        return;
    }

    // Kiểm tra ngày có thuộc lịch làm việc của bác sĩ
    const appointmentForSchedule = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    const selectedDayOfWeek = getBookingDayOfWeek(date);

    const hasWorkingSchedule = doctorSchedules.some(
        item =>
            item.doctor_id === appointmentForSchedule.doctor_id &&
            item.day_of_week === selectedDayOfWeek
    );

    const isDoctorDayOff = doctorTimeOffs.some(
        item =>
            item.doctor_id === appointmentForSchedule.doctor_id &&
            item.date === date
    );

    if (!hasWorkingSchedule || isDoctorDayOff) {
        showToast("Ngày này bác sĩ không có lịch làm việc. Vui lòng chọn ngày khác.");
        return;
    }

    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment || appointment.status !== "Đã hoàn thành") {
        showToast("Không tìm thấy lịch khám phù hợp.");
        return;
    }

    const existingIndex = reExamRecommendations.findIndex(
        item => item.appointment_id === appointmentId
    );

    const recommendation = {
        appointment_id: appointmentId,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        date: date,
        note: note
    };

    if (existingIndex >= 0) {
        reExamRecommendations[existingIndex] = recommendation;
    } else {
        reExamRecommendations.push(recommendation);
    }

    // Tạo hoặc cập nhật thông báo tái khám cho bệnh nhân
const existingNotification = notificationsData.find(
    item =>
        item.patient_id === appointment.patient_id &&
        item.type === "re_exam" &&
        item.appointment_id === appointmentId
);

const notificationMessage =
    `Bác sĩ đề xuất bạn tái khám vào ngày ${formatBookingDate(date)}. ` +
    `Lời dặn: ${note}`;

if (existingNotification) {
    existingNotification.title = "Bác sĩ đề xuất tái khám";
    existingNotification.message = notificationMessage;
    existingNotification.created_at = new Date().toISOString();
    existingNotification.is_read = false;
} else {
    notificationsData.push({
        notification_id: notificationsData.length > 0
            ? Math.max(...notificationsData.map(item => item.notification_id)) + 1
            : 1,
        patient_id: appointment.patient_id,
        title: "Bác sĩ đề xuất tái khám",
        message: notificationMessage,
        type: "re_exam",
        appointment_id: appointmentId,
        created_at: new Date().toISOString(),
        is_read: false
    });
}

    closeDoctorPatientDetail();

    // Cập nhật lại danh sách lịch khám
    filterDoctorAppointments(currentDoctorAppointmentFilter);

    showToast("Đã lưu đề xuất tái khám thành công!");
}

// Bắt đầu đặt lịch từ đề xuất tái khám
function startReExamBooking(appointmentId) {
    const recommendation = reExamRecommendations.find(
        item => item.appointment_id === appointmentId
    );

    if (!recommendation) {
        showToast("Không tìm thấy đề xuất tái khám.");
        return;
    }

    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment) {
        showToast("Không tìm thấy lịch khám ban đầu.");
        return;
    }

    // Lưu thông tin để điền sẵn vào trang đặt lịch
    window.pendingReExamBooking = {
        doctorId: recommendation.doctor_id,
        date: recommendation.date,
        reason: `Tái khám theo đề xuất của bác sĩ. ${recommendation.note}`,
        appointmentId: appointmentId
    };

    // Chuyển đến trang đặt lịch
    navigateTo("booking");
}

// Hiển thị lịch làm việc khi bác sĩ đề xuất tái khám
function renderReExamDateOptions(doctorId, selectedDate = "") {
    const container = document.getElementById("reexam-date-options");

    if (!container) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayNames = [
        "CN", "T2", "T3", "T4", "T5", "T6", "T7"
    ];

    let html = `<div class="doctor-week-grid">`;

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const dateString = `${year}-${month}-${day}`;
        const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

        const schedules = doctorSchedules.filter(
            item =>
                item.doctor_id === doctorId &&
                item.day_of_week === dayOfWeek
        );

        const isDayOff = doctorTimeOffs.some(
            item =>
                item.doctor_id === doctorId &&
                item.date === dateString
        );

        const isWorking = schedules.length > 0 && !isDayOff;

        const timeLabel = isDayOff
            ? "Nghỉ đột xuất"
            : isWorking
                ? schedules.map(item =>
                    `${item.start_time} - ${item.end_time}`
                ).join("<br>")
                : "Nghỉ";

        html += `
            <button
                type="button"
                class="doctor-day-card
                    ${isWorking ? "working-day" : "off-day"}
                    ${selectedDate === dateString ? "selected-day" : ""}"
                ${isWorking
                    ? `onclick="selectReExamDate('${dateString}', ${doctorId})"`
                    : "disabled"}
            >
                <span class="doctor-day-name">
                    ${dayNames[date.getDay()]}
                </span>

                <strong class="doctor-day-number">${day}</strong>

                <span class="doctor-day-month">
                    Tháng ${month}
                </span>

                <span class="doctor-day-status">
                    ${timeLabel}
                </span>
            </button>
        `;
    }

    html += `</div>`;

    container.innerHTML = html;
}


// Chọn ngày tái khám từ lịch làm việc
function selectReExamDate(dateString, doctorId) {
    const dateInput = document.getElementById("reexam-date");

    if (!dateInput) return;

    dateInput.value = dateString;

    renderReExamDateOptions(doctorId, dateString);
}

// Bắt đầu đặt một lịch khám mới
function startNewBooking() {
    bookingAlreadyConfirmed = false;
    selectedBookingTime = null;

    // Xóa thông tin đề xuất tái khám trước đó
    window.pendingReExamBooking = null;

    // Xóa bác sĩ được chọn từ lần đặt lịch trước
    window.selectedDoctorId = null;

    navigateTo("booking");
}

// =====================================
// ADMIN - QUẢN LÝ TÀI KHOẢN
// =====================================

function getAdminUsersHTML() {
    return `
        <div class="page-heading">
            <h2>Quản lý tài khoản</h2>
            <p>Quản lý thông tin và trạng thái tài khoản người dùng trong hệ thống.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <p>Tổng tài khoản</p>
                <h2 id="admin-total-users">0</h2>
            </div>

            <div class="stat-card">
                <p>Bệnh nhân</p>
                <h2 id="admin-patient-users">0</h2>
            </div>

            <div class="stat-card">
                <p>Bác sĩ</p>
                <h2 id="admin-doctor-users">0</h2>
            </div>

            <div class="stat-card">
                <p>Tài khoản bị khóa</p>
                <h2 id="admin-locked-users">0</h2>
            </div>
        </div>

        <div class="panel">
            <h3>Danh sách tài khoản</h3>

            <div class="admin-user-toolbar">
                <input
                    type="text"
                    id="admin-user-search"
                    placeholder="Tìm theo tên hoặc email..."
                    oninput="renderAdminUsers()"
                >

                <select
                    id="admin-user-role"
                    onchange="renderAdminUsers()"
                >
                    <option value="all">Tất cả vai trò</option>
                    <option value="Bệnh nhân">Bệnh nhân</option>
                    <option value="Bác sĩ">Bác sĩ</option>
                </select>

                <select
                    id="admin-user-status"
                    onchange="renderAdminUsers()"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
            </div>
        </div>

        <div id="admin-users-list"></div>
    `;
}


// Hiển thị danh sách tài khoản
function renderAdminUsers() {
    const container = document.getElementById("admin-users-list");

    if (!container) return;

    const keyword = document
        .getElementById("admin-user-search").value
        .trim()
        .toLowerCase();

    const role = document.getElementById("admin-user-role").value;
    const status = document.getElementById("admin-user-status").value;

    const patients = adminAccounts.filter(
        item => item.role === "Bệnh nhân"
    );

    const doctors = adminAccounts.filter(
        item => item.role === "Bác sĩ"
    );

    const locked = adminAccounts.filter(
        item => item.status === "Ngừng hoạt động"
    );

    document.getElementById("admin-total-users").textContent =
        adminAccounts.length;

    document.getElementById("admin-patient-users").textContent =
        patients.length;

    document.getElementById("admin-doctor-users").textContent =
        doctors.length;

    document.getElementById("admin-locked-users").textContent =
        locked.length;

    const filteredUsers = adminAccounts.filter(item => {
        const matchesKeyword =
            item.full_name.toLowerCase().includes(keyword) ||
            item.email.toLowerCase().includes(keyword);

        const matchesRole =
            role === "all" || item.role === role;

        const matchesStatus =
            status === "all" || item.status === status;

        return matchesKeyword && matchesRole && matchesStatus;
    });

    if (filteredUsers.length === 0) {
        container.innerHTML = `
            <div class="panel">
                <p>Không tìm thấy tài khoản phù hợp.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="panel">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Mã tài khoản</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filteredUsers.map(item => `
                            <tr>
                                <td>TK${String(item.account_id).padStart(3, "0")}</td>
                                <td>${item.full_name}</td>
                                <td>${item.email}</td>
                                <td>${item.phone}</td>
                                <td>${item.role}</td>
                                <td>
                                    <span class="${
                                        item.status === "Đang hoạt động"
                                            ? "status-active"
                                            : "status-inactive"
                                    }">
                                        ${item.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        class="btn ${
                                            item.status === "Đang hoạt động"
                                                ? "btn-danger"
                                                : "btn-primary"
                                        }"
                                        onclick="toggleAdminAccount(${item.account_id})"
                                    >
                                        ${
                                            item.status === "Đang hoạt động"
                                                ? "Khóa"
                                                : "Mở khóa"
                                        }
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}


// Khóa hoặc mở khóa tài khoản
function toggleAdminAccount(accountId) {
    const account = adminAccounts.find(
        item => item.account_id === accountId
    );

    if (!account) return;

    account.status =
        account.status === "Đang hoạt động"
            ? "Ngừng hoạt động"
            : "Đang hoạt động";

    // Đồng bộ trạng thái bác sĩ
    if (account.role === "Bác sĩ") {
        const doctor = doctorsData.find(
            item => item.doctor_id === account.account_id - 1
        );

        if (doctor) {
            doctor.doctor_status = account.status;
        }
    }

    renderAdminUsers();

    showToast(
        account.status === "Đang hoạt động"
            ? "Đã mở khóa tài khoản!"
            : "Đã khóa tài khoản!"
    );
}

// ==========================================
// ADMIN - QUẢN LÝ BÁC SĨ
// ==========================================

// Giao diện trang quản lý bác sĩ
function getAdminDoctorsHTML() {
    return `
        <div class="page-header">
            <h2>Quản lý bác sĩ</h2>
            <p>Danh sách và thông tin các bác sĩ trong hệ thống.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Tổng số bác sĩ</h3>
                <p id="admin-doctor-total">0</p>
            </div>

            <div class="stat-card">
                <h3>Đang hoạt động</h3>
                <p id="admin-doctor-active">0</p>
            </div>

            <div class="stat-card">
                <h3>Ngừng hoạt động</h3>
                <p id="admin-doctor-inactive">0</p>
            </div>
        </div>

        <div class="panel">
            <div class="admin-doctor-header">
                <h3>Danh sách bác sĩ</h3>

                <button
                    class="btn btn-primary"
                    onclick="openAdminDoctorAddForm()"
                >
                    <i class="fa-solid fa-plus"></i>
                    Thêm bác sĩ
                </button>
            </div>

            <div class="admin-user-toolbar">
                <input
                    type="text"
                    id="admin-doctor-search"
                    placeholder="Tìm theo tên bác sĩ..."
                    oninput="renderAdminDoctors()"
                >

                <select
                    id="admin-doctor-specialty"
                    onchange="renderAdminDoctors()"
                >
                    <option value="all">Tất cả chuyên khoa</option>
                    ${[...new Set(doctorsData.map(doctor => doctor.specialty))]
                        .map(specialty => `
                            <option value="${specialty}">${specialty}</option>
                        `).join("")}
                </select>

                <select
                    id="admin-doctor-status"
                    onchange="renderAdminDoctors()"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>

                <button class="btn" onclick="resetAdminDoctorFilters()">
                    Đặt lại
                </button>
            </div>

            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Mã bác sĩ</th>
                            <th>Họ và tên</th>
                            <th>Chuyên khoa</th>
                            <th>Trình độ</th>
                            <th>Kinh nghiệm</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                            <th>Quản lý trạng thái</th>
                        </tr>
                    </thead>

                    <tbody id="admin-doctors-table"></tbody>
                </table>
            </div>
        </div>
    `;
}


// Hiển thị danh sách bác sĩ
function renderAdminDoctors() {
    const container = document.getElementById("admin-doctors-table");

    if (!container) return;

    // Lấy dữ liệu tìm kiếm và bộ lọc
    const keyword = document
        .getElementById("admin-doctor-search")
        .value.trim().toLowerCase();

    const specialty = document.getElementById(
        "admin-doctor-specialty"
    ).value;

    const status = document.getElementById(
        "admin-doctor-status"
    ).value;

    // Thống kê tổng số bác sĩ
    const activeDoctors = doctorsData.filter(
        doctor => doctor.doctor_status === "Đang hoạt động"
    );

    const inactiveDoctors = doctorsData.filter(
        doctor => doctor.doctor_status === "Ngừng hoạt động"
    );

    document.getElementById("admin-doctor-total").textContent =
        doctorsData.length;

    document.getElementById("admin-doctor-active").textContent =
        activeDoctors.length;

    document.getElementById("admin-doctor-inactive").textContent =
        inactiveDoctors.length;

    // Lọc danh sách bác sĩ
    const filteredDoctors = doctorsData.filter(doctor => {
        const matchesKeyword = doctor.full_name
            .toLowerCase()
            .includes(keyword);

        const matchesSpecialty =
            specialty === "all" || doctor.specialty === specialty;

        const matchesStatus =
            status === "all" || doctor.doctor_status === status;

        return matchesKeyword && matchesSpecialty && matchesStatus;
    });

    // Không tìm thấy kết quả
    if (filteredDoctors.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 25px;">
                    Không tìm thấy bác sĩ phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    // Hiển thị danh sách sau khi lọc
    container.innerHTML = filteredDoctors.map(doctor => `
        <tr>
            <td>BS${String(doctor.doctor_id).padStart(3, "0")}</td>
            <td>${doctor.full_name}</td>
            <td>${doctor.specialty}</td>
            <td>${doctor.qualification}</td>
            <td>${doctor.experience_years} năm</td>
            <td>
                <span class="${
                    doctor.doctor_status === "Đang hoạt động"
                        ? "status-active"
                        : "status-inactive"
                }">
                    ${doctor.doctor_status}
                </span>
            </td>
            <td>
                <button
                    class="btn btn-primary"
                    onclick="viewAdminDoctorDetail(${doctor.doctor_id})"
                >
                    Xem chi tiết
                </button>
            </td>
            <td>
                <button
                    class="btn ${
                        doctor.doctor_status === "Đang hoạt động"
                            ? "btn-danger"
                            : "btn-primary"
                    }"
                    onclick="toggleAdminDoctorStatus(${doctor.doctor_id})"
                >
                    ${
                        doctor.doctor_status === "Đang hoạt động"
                            ? "Khóa"
                            : "Mở khóa"
                    }
                </button>
            </td>
        </tr>
    `).join("");
}


// Đặt lại bộ lọc bác sĩ
function resetAdminDoctorFilters() {
    document.getElementById("admin-doctor-search").value = "";
    document.getElementById("admin-doctor-specialty").value = "all";
    document.getElementById("admin-doctor-status").value = "all";

    renderAdminDoctors();
}

// ==========================================
// ADMIN - XEM CHI TIẾT BÁC SĨ
// ==========================================

function viewAdminDoctorDetail(doctorId) {
    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor) return;

    // Tạo modal nếu chưa tồn tại
    let modal = document.getElementById("admin-doctor-detail-modal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "admin-doctor-detail-modal";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-overlay"
             onclick="closeAdminDoctorDetail(event)">

            <div class="modal"
                 onclick="event.stopPropagation()">

                <h3>Thông tin chi tiết bác sĩ</h3>

                <hr>

                <p>
                    <strong>Mã bác sĩ:</strong>
                    BS${String(doctor.doctor_id).padStart(3, "0")}
                </p>

                <p>
                    <strong>Họ và tên:</strong>
                    ${doctor.full_name}
                </p>

                <p>
                    <strong>Chuyên khoa:</strong>
                    ${doctor.specialty}
                </p>

                <p>
                    <strong>Trình độ:</strong>
                    ${doctor.qualification}
                </p>

                <p>
                    <strong>Kinh nghiệm:</strong>
                    ${doctor.experience_years} năm
                </p>

                <p>
                    <strong>Mô tả:</strong>
                    ${doctor.description}
                </p>

                <p>
                    <strong>Trạng thái:</strong>
                    ${doctor.doctor_status}
                </p>

                <div class="modal-actions">
                    <button
                        class="btn btn-primary"
                        onclick="openAdminDoctorEditForm(${doctor.doctor_id})"
                    >
                        Chỉnh sửa
                    </button>

                    <button
                        class="btn"
                        onclick="closeAdminDoctorDetail()"
                    >
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    `;
}


// Đóng cửa sổ chi tiết bác sĩ
function closeAdminDoctorDetail(event) {
    if (event && event.target !== event.currentTarget) return;

    const modal = document.getElementById(
        "admin-doctor-detail-modal"
    );

    if (modal) {
        modal.innerHTML = "";
    }
}

// Mở biểu mẫu chỉnh sửa bác sĩ
function openAdminDoctorEditForm(doctorId) {
    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor) return;

    const modal = document.getElementById(
        "admin-doctor-detail-modal"
    );

    modal.innerHTML = `
        <div class="modal-overlay"
             onclick="closeAdminDoctorDetail(event)">

            <div class="modal"
                 onclick="event.stopPropagation()">

                <h3>Chỉnh sửa thông tin bác sĩ</h3>

                <form onsubmit="saveAdminDoctor(event, ${doctor.doctor_id})">

                    <div class="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            id="edit-doctor-name"
                            value="${doctor.full_name}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Chuyên khoa</label>
                        <input
                            type="text"
                            id="edit-doctor-specialty"
                            value="${doctor.specialty}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Trình độ chuyên môn</label>
                        <input
                            type="text"
                            id="edit-doctor-qualification"
                            value="${doctor.qualification}"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Số năm kinh nghiệm</label>
                        <input
                            type="number"
                            id="edit-doctor-experience"
                            value="${doctor.experience_years}"
                            min="0"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea
                            id="edit-doctor-description"
                            rows="3"
                            required
                        >${doctor.description}</textarea>
                    </div>

                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">
                            Lưu thay đổi
                        </button>

                        <button
                            type="button"
                            class="btn"
                            onclick="viewAdminDoctorDetail(${doctor.doctor_id})"
                        >
                            Hủy
                        </button>
                    </div>

                </form>
            </div>
        </div>
    `;
}

// Lưu thông tin bác sĩ
function saveAdminDoctor(event, doctorId) {
    event.preventDefault();

    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor) return;

    const fullName = document
        .getElementById("edit-doctor-name")
        .value.trim();

    const specialty = document
        .getElementById("edit-doctor-specialty")
        .value.trim();

    const qualification = document
        .getElementById("edit-doctor-qualification")
        .value.trim();

    const experience = Number(
        document.getElementById("edit-doctor-experience").value
    );

    const description = document
        .getElementById("edit-doctor-description")
        .value.trim();

    if (
        !fullName ||
        !specialty ||
        !qualification ||
        !description ||
        !Number.isInteger(experience) ||
        experience < 0
    ) {
        showToast("Vui lòng kiểm tra lại thông tin!");
        return;
    }

    // Cập nhật dữ liệu bác sĩ
    doctor.full_name = fullName;
    doctor.specialty = specialty;
    doctor.qualification = qualification;
    doctor.experience_years = experience;
    doctor.description = description;

    // Đồng bộ tên bác sĩ sang tài khoản tương ứng
    const account = adminAccounts.find(
        item => item.account_id === doctorId + 1
    );

    if (account) {
        account.full_name = fullName;
    }

    // Cập nhật lại giao diện
    closeAdminDoctorDetail();
    renderAdminDoctors();

    showToast("Cập nhật thông tin bác sĩ thành công!");
}

// ==========================================
// ADMIN - THÊM BÁC SĨ
// ==========================================

function openAdminDoctorAddForm() {
    let modal = document.getElementById(
        "admin-doctor-detail-modal"
    );

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "admin-doctor-detail-modal";
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-overlay"
             onclick="closeAdminDoctorDetail(event)">

            <div class="modal"
                 onclick="event.stopPropagation()">

                <h3>Thêm bác sĩ mới</h3>

                <form onsubmit="saveNewAdminDoctor(event)">

                    <div class="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            id="new-doctor-name"
                            placeholder="Nhập họ và tên bác sĩ"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Chuyên khoa</label>
                        <input
                            type="text"
                            id="new-doctor-specialty"
                            placeholder="Ví dụ: Nội tổng quát"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Trình độ chuyên môn</label>
                        <input
                            type="text"
                            id="new-doctor-qualification"
                            placeholder="Ví dụ: Thạc sĩ Y khoa"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Số năm kinh nghiệm</label>
                        <input
                            type="number"
                            id="new-doctor-experience"
                            min="0"
                            value="0"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea
                            id="new-doctor-description"
                            rows="3"
                            placeholder="Nhập mô tả về bác sĩ"
                            required
                        ></textarea>
                    </div>

                    <div class="modal-actions">
                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Thêm bác sĩ
                        </button>

                        <button
                            type="button"
                            class="btn"
                            onclick="closeAdminDoctorDetail()"
                        >
                            Hủy
                        </button>
                    </div>

                </form>
            </div>
        </div>
    `;
}

function saveNewAdminDoctor(event) {
    event.preventDefault();

    const fullName = document
        .getElementById("new-doctor-name")
        .value.trim();

    const specialty = document
        .getElementById("new-doctor-specialty")
        .value.trim();

    const qualification = document
        .getElementById("new-doctor-qualification")
        .value.trim();

    const experience = Number(
        document.getElementById("new-doctor-experience").value
    );

    const description = document
        .getElementById("new-doctor-description")
        .value.trim();

    if (
        !fullName ||
        !specialty ||
        !qualification ||
        !description ||
        !Number.isInteger(experience) ||
        experience < 0
    ) {
        showToast("Vui lòng kiểm tra lại thông tin!");
        return;
    }

    // Tạo mã bác sĩ mới
    const newDoctorId = Math.max(
        0,
        ...doctorsData.map(doctor => doctor.doctor_id)
    ) + 1;

    // Tạo dữ liệu bác sĩ
    const newDoctor = {
        doctor_id: newDoctorId,
        full_name: fullName,
        specialty: specialty,
        qualification: qualification,
        experience_years: experience,
        description: description,
        doctor_status: "Đang hoạt động"
    };

    doctorsData.push(newDoctor);

    // Tạo tài khoản bác sĩ tương ứng
    adminAccounts.push({
        account_id: newDoctorId + 1,
        full_name: fullName,
        email: `doctor${newDoctorId}@gmail.com`,
        phone: "Chưa cập nhật",
        role: "Bác sĩ",
        status: "Đang hoạt động"
    });

    closeAdminDoctorDetail();

    renderAdminDoctors();

    showToast("Thêm bác sĩ mới thành công!");
}

// ==========================================
// ADMIN - KHÓA / MỞ KHÓA BÁC SĨ
// ==========================================

function toggleAdminDoctorStatus(doctorId) {
    const doctor = doctorsData.find(
        item => item.doctor_id === doctorId
    );

    if (!doctor) return;

    // Đổi trạng thái bác sĩ
    doctor.doctor_status =
        doctor.doctor_status === "Đang hoạt động"
            ? "Ngừng hoạt động"
            : "Đang hoạt động";

    // Đồng bộ trạng thái với tài khoản bác sĩ
    const account = adminAccounts.find(
        item => item.account_id === doctorId + 1
    );

    if (account) {
        account.status = doctor.doctor_status;
    }

    // Cập nhật lại danh sách và thống kê
    renderAdminDoctors();

    showToast(
        doctor.doctor_status === "Đang hoạt động"
            ? "Đã mở khóa bác sĩ thành công!"
            : "Đã khóa bác sĩ thành công!"
    );
}

// ==========================================
// ADMIN - QUẢN LÝ LỊCH KHÁM
// ==========================================

function getAdminAppointmentsHTML() {
    return `
        <div class="page-header">
            <h2>Quản lý lịch khám</h2>
            <p>Theo dõi và quản lý toàn bộ lịch khám trong hệ thống.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Tổng lịch khám</h3>
                <p id="admin-appointment-total">0</p>
            </div>

            <div class="stat-card">
                <h3>Đã xác nhận</h3>
                <p id="admin-appointment-confirmed">0</p>
            </div>

            <div class="stat-card">
                <h3>Chờ xác nhận</h3>
                <p id="admin-appointment-pending">0</p>
            </div>

            <div class="stat-card">
                <h3>Đã hoàn thành</h3>
                <p id="admin-appointment-completed">0</p>
            </div>
        </div>

        <div class="panel">
            <h3>Danh sách lịch khám</h3>

            <div class="admin-user-toolbar">
                <input
                    type="text"
                    id="admin-appointment-search"
                    placeholder="Tìm mã lịch, tên bệnh nhân hoặc bác sĩ..."
                    oninput="renderAdminAppointments()"
                >

                <select
                    id="admin-appointment-status"
                    onchange="renderAdminAppointments()"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang khám">Đang khám</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>

                <input
                    type="date"
                    id="admin-appointment-date"
                    onchange="renderAdminAppointments()"
                >

                <button
                    class="btn"
                    onclick="resetAdminAppointmentFilters()"
                >
                    Đặt lại
                </button>
            </div>

            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Mã lịch</th>
                            <th>Bệnh nhân</th>
                            <th>Bác sĩ</th>
                            <th>Ngày khám</th>
                            <th>Giờ khám</th>
                            <th>Lý do khám</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                            <th>Cập nhật trạng thái</th>
                        </tr>
                    </thead>

                    <tbody id="admin-appointments-table"></tbody>
                </table>
            </div>
        </div>
        <div id="admin-appointment-detail-modal"></div>
    `;
}

function renderAdminAppointments() {
    const container = document.getElementById(
        "admin-appointments-table"
    );

    if (!container) return;

    // Thống kê toàn bộ lịch khám
    const total = appointmentsData.length;

    const confirmed = appointmentsData.filter(
        item => item.status === "Đã xác nhận"
    ).length;

    const pending = appointmentsData.filter(
        item => item.status === "Chờ xác nhận"
    ).length;

    const completed = appointmentsData.filter(
        item => item.status === "Đã hoàn thành"
    ).length;

    document.getElementById("admin-appointment-total").textContent =
        total;

    document.getElementById("admin-appointment-confirmed").textContent =
        confirmed;

    document.getElementById("admin-appointment-pending").textContent =
        pending;

    document.getElementById("admin-appointment-completed").textContent =
        completed;

    // Lấy điều kiện tìm kiếm và lọc
    const keyword = document
        .getElementById("admin-appointment-search")
        .value.trim().toLowerCase();

    const status = document.getElementById(
        "admin-appointment-status"
    ).value;

    const selectedDate = document.getElementById(
        "admin-appointment-date"
    ).value;

    // Lọc lịch khám
    const filteredAppointments = [...appointmentsData]
        .filter(item => {
            const doctor = doctorsData.find(
                doctor => doctor.doctor_id === item.doctor_id
            );

            const patientName = "Nguyễn Văn A";

            const doctorName = doctor
                ? doctor.full_name
                : "Chưa cập nhật";

            const appointmentCode =
                `AP${String(item.appointment_id).padStart(3, "0")}`;

            const matchesKeyword =
                appointmentCode.toLowerCase().includes(keyword) ||
                patientName.toLowerCase().includes(keyword) ||
                doctorName.toLowerCase().includes(keyword);

            const matchesStatus =
                status === "all" || item.status === status;

            const matchesDate =
                !selectedDate || item.date === selectedDate;

            return matchesKeyword && matchesStatus && matchesDate;
        })
        .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

    // Không có kết quả
    if (filteredAppointments.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center; padding:25px;">
                    Không tìm thấy lịch khám phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    // Hiển thị kết quả
    container.innerHTML = filteredAppointments.map(item => {
        const doctor = doctorsData.find(
            doctor => doctor.doctor_id === item.doctor_id
        );

        return `
            <tr>
                <td>
                    AP${String(item.appointment_id).padStart(3, "0")}
                </td>

                <td>Nguyễn Văn A</td>

                <td>
                    ${doctor ? doctor.full_name : "Chưa cập nhật"}
                </td>

                <td>${formatBookingDate(item.date)}</td>

                <td>${item.start_time} - ${item.end_time}</td>

                <td>${item.reason}</td>

                <td>
                    <span class="status ${getAppointmentStatusClass(item.status)}">
                        ${item.status}
                    </span>
                </td>
                <td>
                    <button
                        class="btn btn-primary"
                        onclick="viewAdminAppointmentDetail(${item.appointment_id})"
                    >
                        Xem chi tiết
                    </button>
                </td>
                <td>
                    <select
                        class="filter-select"
                        onchange="updateAdminAppointmentStatus(
                            ${item.appointment_id},
                            this.value
                        )"
                        ${item.status === "Đã hủy" ? "disabled" : ""}
                    >
                        <option value="Chờ xác nhận"
                            ${item.status === "Chờ xác nhận" ? "selected" : ""}>
                            Chờ xác nhận
                        </option>

                        <option value="Đã xác nhận"
                            ${item.status === "Đã xác nhận" ? "selected" : ""}>
                            Đã xác nhận
                        </option>

                        <option value="Đang khám"
                            ${item.status === "Đang khám" ? "selected" : ""}>
                            Đang khám
                        </option>

                        <option value="Đã hoàn thành"
                            ${item.status === "Đã hoàn thành" ? "selected" : ""}>
                            Đã hoàn thành
                        </option>

                        <option value="Đã hủy"
                            ${item.status === "Đã hủy" ? "selected" : ""}>
                            Đã hủy
                        </option>
                    </select>
                </td>
            </tr>
        `;
    }).join("");
}


// Đặt lại bộ lọc lịch khám
function resetAdminAppointmentFilters() {
    document.getElementById("admin-appointment-search").value = "";
    document.getElementById("admin-appointment-status").value = "all";
    document.getElementById("admin-appointment-date").value = "";

    renderAdminAppointments();
}

// ==========================================
// ADMIN - XEM CHI TIẾT LỊCH KHÁM
// ==========================================

function viewAdminAppointmentDetail(appointmentId) {
    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment) return;

    const doctor = doctorsData.find(
        item => item.doctor_id === appointment.doctor_id
    );

    const patientName = appointment.patient_id === 1
        ? patientProfile.fullName
        : "Chưa cập nhật";

    const modal = document.getElementById(
        "admin-appointment-detail-modal"
    );

    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-overlay"
             onclick="closeAdminAppointmentDetail(event)">

            <div class="modal"
                 onclick="event.stopPropagation()">

                <h3>Chi tiết lịch khám</h3>

                <hr>

                <h4>Thông tin lịch khám</h4>

                <p>
                    <strong>Mã lịch:</strong>
                    AP${String(appointment.appointment_id).padStart(3, "0")}
                </p>

                <p>
                    <strong>Ngày khám:</strong>
                    ${formatBookingDate(appointment.date)}
                </p>

                <p>
                    <strong>Giờ khám:</strong>
                    ${appointment.start_time} - ${appointment.end_time}
                </p>

                <p>
                    <strong>Lý do khám:</strong>
                    ${appointment.reason}
                </p>

                <p>
                    <strong>Trạng thái:</strong>
                    ${appointment.status}
                </p>

                <hr>

                <h4>Thông tin bệnh nhân</h4>

                <p>
                    <strong>Mã bệnh nhân:</strong>
                    BN${String(appointment.patient_id).padStart(3, "0")}
                </p>

                <p>
                    <strong>Họ và tên:</strong>
                    ${patientName}
                </p>

                <p>
                    <strong>Số điện thoại:</strong>
                    ${appointment.patient_id === 1
                        ? patientProfile.phone
                        : "Chưa cập nhật"}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${appointment.patient_id === 1
                        ? patientProfile.email
                        : "Chưa cập nhật"}
                </p>

                <hr>

                <h4>Thông tin bác sĩ</h4>

                <p>
                    <strong>Họ và tên:</strong>
                    ${doctor ? doctor.full_name : "Chưa cập nhật"}
                </p>

                <p>
                    <strong>Chuyên khoa:</strong>
                    ${doctor ? doctor.specialty : "Chưa cập nhật"}
                </p>

                <div class="modal-actions">
                    <button
                        class="btn btn-primary"
                        onclick="closeAdminAppointmentDetail()"
                    >
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    `;
}

// Đóng cửa sổ chi tiết lịch khám
function closeAdminAppointmentDetail(event) {
    if (event && event.target !== event.currentTarget) return;

    const modal = document.getElementById(
        "admin-appointment-detail-modal"
    );

    if (modal) {
        modal.innerHTML = "";
    }
}
// ==========================================
// ADMIN - CẬP NHẬT TRẠNG THÁI LỊCH KHÁM
// ==========================================

function updateAdminAppointmentStatus(appointmentId, newStatus) {
    const appointment = appointmentsData.find(
        item => item.appointment_id === appointmentId
    );

    if (!appointment) return;

    const validStatuses = [
        "Chờ xác nhận",
        "Đã xác nhận",
        "Đang khám",
        "Đã hoàn thành",
        "Đã hủy"
    ];

    if (!validStatuses.includes(newStatus)) {
        showToast("Trạng thái không hợp lệ!");
        return;
    }

    if (appointment.status === "Đã hủy") {
        showToast("Lịch khám đã hủy không thể cập nhật!");
        renderAdminAppointments();
        return;
    }

    appointment.status = newStatus;

    renderAdminAppointments();

    showToast("Cập nhật trạng thái lịch khám thành công!");
}

/* =====================================
   ADMIN - QUẢN LÝ PHẢN HỒI
===================================== */

// Giao diện quản lý phản hồi
function getAdminFeedbackHTML() {
    return `
        <div class="page-heading">
            <h1>Quản lý phản hồi</h1>
            <p>Theo dõi và quản lý đánh giá từ bệnh nhân.</p>
        </div>

        <!-- THỐNG KÊ PHẢN HỒI -->
        <div class="stats-grid">

            <div class="stat-card">
                <div class="stat-top">
                    <p>Tổng phản hồi</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-comments"></i>
                    </div>
                </div>
                <h2 id="feedback-total">0</h2>
                <p>Tổng số phản hồi nhận được</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Chờ xử lý</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                </div>
                <h2 id="feedback-pending">0</h2>
                <p>Phản hồi chưa được xử lý</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Đã xử lý</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                </div>
                <h2 id="feedback-resolved">0</h2>
                <p>Phản hồi đã được xử lý</p>
            </div>

            <div class="stat-card">
                <div class="stat-top">
                    <p>Đánh giá trung bình</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>
                <h2 id="feedback-average">0.0</h2>
                <p>Trên thang điểm 5 sao</p>
            </div>

        </div>

        <!-- DANH SÁCH PHẢN HỒI -->
        <div class="panel">

            <div class="panel-header">
                <div>
                    <h3>Danh sách phản hồi</h3>
                    <p>Theo dõi đánh giá và ý kiến của bệnh nhân.</p>
                </div>
            </div>

            <div class="feedback-toolbar"
                style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin:16px 0;">

                <div class="doctor-search"
                    style="width:420px; max-width:100%;">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        id="admin-feedback-search"
                        placeholder="Tìm mã phản hồi, tên bệnh nhân..."
                        oninput="renderAdminFeedback()"
                    >
                </div>

                <select
                    id="admin-feedback-status"
                    class="filter-select"
                    style="min-width:180px;"
                    onchange="renderAdminFeedback()">

                    <option value="">Tất cả trạng thái</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đã xử lý">Đã xử lý</option>

                </select>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Mã phản hồi</th>
                            <th>Bệnh nhân</th>
                            <th>Mã lịch khám</th>
                            <th>Đánh giá</th>
                            <th>Nội dung</th>
                            <th>Ngày gửi</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody id="admin-feedback-table">
                    </tbody>
                </table>
            </div>
            <div id="admin-feedback-detail-modal"></div>

        </div>
    `;
}


// Hiển thị dữ liệu và thống kê phản hồi
function renderAdminFeedback() {

    const total = feedbackData.length;

    const pending = feedbackData.filter(
        item => item.status === "Chờ xử lý"
    ).length;

    const resolved = feedbackData.filter(
        item => item.status === "Đã xử lý"
    ).length;

    const average = total > 0
        ? (
            feedbackData.reduce(
                (sum, item) => sum + item.rating, 0
            ) / total
        ).toFixed(1)
        : "0.0";

    // Cập nhật thống kê
    document.getElementById("feedback-total").textContent = total;
    document.getElementById("feedback-pending").textContent = pending;
    document.getElementById("feedback-resolved").textContent = resolved;
    document.getElementById("feedback-average").textContent = average;

    const table = document.getElementById("admin-feedback-table");

    if (!table) return;

    // Sắp xếp phản hồi mới nhất lên đầu
    // Lấy từ khóa tìm kiếm
    const searchInput = document.getElementById(
        "admin-feedback-search"
    );

    const keyword = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

        // Lấy trạng thái được chọn
    const statusFilter = document.getElementById(
        "admin-feedback-status"
    );

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "";

// Tìm kiếm phản hồi
    const filteredFeedbacks = feedbackData.filter(feedback => {

        const appointment = appointmentsData.find(
            item => item.appointment_id === feedback.appointment_id
        );

        const patientName = feedback.patient_id === 1
            ? patientProfile.fullName
            : "Chưa cập nhật";

        const feedbackCode =
            `FB${String(feedback.feedback_id).padStart(3, "0")}`;

        const appointmentCode = appointment
            ? `AP${String(appointment.appointment_id).padStart(3, "0")}`
            : "";

        const matchesKeyword =
            feedbackCode.toLowerCase().includes(keyword) ||
            patientName.toLowerCase().includes(keyword) ||
            appointmentCode.toLowerCase().includes(keyword);

        const matchesStatus =
            selectedStatus === "" ||
            feedback.status === selectedStatus;

        return matchesKeyword && matchesStatus;
    });

// Sắp xếp phản hồi mới nhất lên đầu
    const sortedFeedbacks = filteredFeedbacks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    if (sortedFeedbacks.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:30px;">
                    Chưa có phản hồi nào từ bệnh nhân.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = sortedFeedbacks.map(feedback => {

        const appointment = appointmentsData.find(
            item => item.appointment_id === feedback.appointment_id
        );

        const patientName = feedback.patient_id === 1
            ? patientProfile.fullName
            : "Chưa cập nhật";

        const feedbackDate = new Date(
            feedback.created_at
        ).toLocaleDateString("vi-VN");

        const appointmentCode = appointment
            ? `AP${String(appointment.appointment_id).padStart(3, "0")}`
            : "Không xác định";

        return `
            <tr>
                <td>
                    FB${String(feedback.feedback_id).padStart(3, "0")}
                </td>

                <td>${patientName}</td>

                <td>${appointmentCode}</td>

                <td>
                    <span style="color:#F59E0B;">
                        ${"★".repeat(feedback.rating)}
                        ${"☆".repeat(5 - feedback.rating)}
                    </span>
                    (${feedback.rating}/5)
                </td>

                <td>${feedback.content}</td>

                <td>${feedbackDate}</td>

                <td>
                    <span class="status ${
                        feedback.status === "Đã xử lý"
                            ? "status-success"
                            : "status-warning"
                    }">
                        ${feedback.status}
                    </span>
                </td>
                <td>
                    <button
                        class="action-btn"
                        onclick="viewAdminFeedbackDetail(${feedback.feedback_id})">
                        <i class="fa-solid fa-eye"></i>
                        Xem chi tiết
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}
// ==========================================
// ADMIN - XEM CHI TIẾT PHẢN HỒI
// ==========================================

function viewAdminFeedbackDetail(feedbackId) {

    const feedback = feedbackData.find(
        item => item.feedback_id === feedbackId
    );

    if (!feedback) return;

    const appointment = appointmentsData.find(
        item => item.appointment_id === feedback.appointment_id
    );

    const doctor = appointment
        ? doctorsData.find(
            item => item.doctor_id === appointment.doctor_id
        )
        : null;

    const patientName = feedback.patient_id === 1
        ? patientProfile.fullName
        : "Chưa cập nhật";

    const modal = document.getElementById(
        "admin-feedback-detail-modal"
    );

    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-overlay"
             onclick="closeAdminFeedbackDetail(event)">

            <div class="modal"
                 onclick="event.stopPropagation()">

                <h3>Chi tiết phản hồi</h3>

                <hr>

                <h4>Thông tin phản hồi</h4>

                <p>
                    <strong>Mã phản hồi:</strong>
                    FB${String(feedback.feedback_id).padStart(3, "0")}
                </p>

                <p>
                    <strong>Đánh giá:</strong>
                    <span style="color:#F59E0B;">
                        ${"★".repeat(feedback.rating)}
                        ${"☆".repeat(5 - feedback.rating)}
                    </span>
                    (${feedback.rating}/5)
                </p>

                <p>
                    <strong>Nội dung:</strong>
                    ${feedback.content}
                </p>

                <p>
                    <strong>Ngày gửi:</strong>
                    ${new Date(feedback.created_at).toLocaleString("vi-VN")}
                </p>

                <p>
                    <strong>Trạng thái:</strong>
                    ${feedback.status}
                </p>

                <hr>

                <h4>Thông tin bệnh nhân</h4>

                <p>
                    <strong>Mã bệnh nhân:</strong>
                    BN${String(feedback.patient_id).padStart(3, "0")}
                </p>

                <p>
                    <strong>Họ và tên:</strong>
                    ${patientName}
                </p>

                <p>
                    <strong>Số điện thoại:</strong>
                    ${feedback.patient_id === 1
                        ? patientProfile.phone
                        : "Chưa cập nhật"}
                </p>

                <hr>

                <h4>Thông tin lịch khám</h4>

                <p>
                    <strong>Mã lịch:</strong>
                    ${appointment
                        ? `AP${String(appointment.appointment_id).padStart(3, "0")}`
                        : "Không xác định"}
                </p>

                <p>
                    <strong>Bác sĩ:</strong>
                    ${doctor ? doctor.full_name : "Chưa cập nhật"}
                </p>

                <p>
                    <strong>Chuyên khoa:</strong>
                    ${doctor ? doctor.specialty : "Chưa cập nhật"}
                </p>

                <p>
                    <strong>Ngày khám:</strong>
                    ${appointment
                        ? formatBookingDate(appointment.date)
                        : "Chưa cập nhật"}
                </p>

                <div class="modal-actions">

                    ${feedback.status === "Chờ xử lý" ? `
                        <button
                            class="btn btn-primary"
                            onclick="resolveAdminFeedback(${feedback.feedback_id})">
                            <i class="fa-solid fa-check"></i>
                            Đánh dấu đã xử lý
                        </button>
                    ` : `
                        <span style="color:#16A34A; font-weight:600;">
                            <i class="fa-solid fa-circle-check"></i>
                            Phản hồi đã được xử lý
                        </span>
                    `}

                    <button
                        class="btn"
                        onclick="closeAdminFeedbackDetail()">
                        Đóng
                    </button>

                </div>

            </div>
        </div>
    `;
}


// Đóng cửa sổ chi tiết phản hồi
function closeAdminFeedbackDetail(event) {

    if (event && event.target !== event.currentTarget) return;

    const modal = document.getElementById(
        "admin-feedback-detail-modal"
    );

    if (modal) {
        modal.innerHTML = "";
    }
}

// ==========================================
// ADMIN - XỬ LÝ PHẢN HỒI
// ==========================================

function resolveAdminFeedback(feedbackId) {

    const feedback = feedbackData.find(
        item => item.feedback_id === feedbackId
    );

    if (!feedback) {
        showToast("Không tìm thấy phản hồi!");
        return;
    }

    // Không xử lý trùng
    if (feedback.status === "Đã xử lý") {
        showToast("Phản hồi này đã được xử lý!");
        return;
    }

    // Cập nhật dữ liệu
    feedback.status = "Đã xử lý";

    // Đóng cửa sổ chi tiết
    closeAdminFeedbackDetail();

    // Cập nhật bảng và thống kê
    renderAdminFeedback();

    // Thông báo thành công
    showToast("Đã xử lý phản hồi thành công!");
}

// ==========================================
// ADMIN - BÁO CÁO THỐNG KÊ
// ==========================================
let adminAppointmentChart = null;
let adminRatingChart = null;
let adminAppointmentTrendChart = null;
let adminDoctorChart = null;
function getAdminReportsHTML() {
    return `
        <div class="page-heading">
            <h1>Báo cáo thống kê</h1>
            <p>Tổng hợp tình hình hoạt động của hệ thống Patient CRM/PRM.</p>
        </div>

        <div class="stats-grid">

            <!-- Tổng tài khoản -->
            <div class="stat-card">
                <div class="stat-top">
                    <p>Tổng tài khoản</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-users"></i>
                    </div>
                </div>
                <h2 id="report-total-accounts">0</h2>
                <p>Tổng tài khoản trong hệ thống</p>
            </div>

            <!-- Bệnh nhân -->
            <div class="stat-card">
                <div class="stat-top">
                    <p>Bệnh nhân</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>
                </div>
                <h2 id="report-total-patients">0</h2>
                <p>Tổng số bệnh nhân</p>
            </div>

            <!-- Bác sĩ -->
            <div class="stat-card">
                <div class="stat-top">
                    <p>Bác sĩ</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-user-doctor"></i>
                    </div>
                </div>
                <h2 id="report-total-doctors">0</h2>
                <p>Tổng số bác sĩ</p>
            </div>

            <!-- Lịch khám -->
            <div class="stat-card">
                <div class="stat-top">
                    <p>Lịch khám</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>
                </div>
                <h2 id="report-total-appointments">0</h2>
                <p>Tổng số lịch khám</p>
            </div>

            <!-- Phản hồi -->
            <div class="stat-card">
                <div class="stat-top">
                    <p>Phản hồi</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-comments"></i>
                    </div>
                </div>
                <h2 id="report-total-feedback">0</h2>
                <p>Tổng số phản hồi nhận được</p>
            </div>

            <!-- Đánh giá trung bình -->
            <div class="stat-card">
                <div class="stat-top">
                    <p>Đánh giá trung bình</p>
                    <div class="stat-icon">
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>
                <h2 id="report-average-rating">0.0</h2>
                <p>Trên thang điểm 5 sao</p>
            </div>

        </div>
        <!-- BIỂU ĐỒ BÁO CÁO -->
        <div style="
            display:grid;
            grid-template-columns:repeat(2, minmax(0, 1fr));
            gap:20px;
            margin-top:24px;
        ">

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h3>Trạng thái lịch khám</h3>
                        <p>Tỷ lệ lịch khám theo trạng thái.</p>
                    </div>
                </div>

                <div style="height:300px; padding:15px;">
                    <canvas id="report-appointment-chart"></canvas>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h3>Mức độ hài lòng</h3>
                        <p>Phân bố đánh giá của bệnh nhân.</p>
                    </div>
                </div>

                <div style="height:300px; padding:15px;">
                    <canvas id="report-rating-chart"></canvas>
                </div>
            </div>

        </div>
        <!-- BIỂU ĐỒ PHÂN TÍCH CHI TIẾT -->
        <div style="
            display:grid;
            grid-template-columns:repeat(2, minmax(0, 1fr));
            gap:20px;
            margin-top:20px;
        ">

            <!-- Lịch khám theo thời gian -->
            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h3>Xu hướng lịch khám</h3>
                        <p>Số lượng lịch khám theo ngày.</p>
                    </div>
                </div>

                <div style="height:300px; padding:15px;">
                    <canvas id="report-appointment-trend-chart"></canvas>
                </div>
            </div>

            <!-- Lịch khám theo bác sĩ -->
            <div class="panel">
                <div class="panel-header">
                    <div>
                        <h3>Lịch khám theo bác sĩ</h3>
                        <p>So sánh số lượng lịch khám của từng bác sĩ.</p>
                    </div>
                </div>

                <div style="height:300px; padding:15px;">
                    <canvas id="report-doctor-chart"></canvas>
                </div>
            </div>

        </div>
    `;
}


// Hiển thị số liệu thống kê
function renderAdminReports() {

    // Tổng số tài khoản
    const totalAccounts = adminAccounts.length;

    // Tổng số bệnh nhân
    const totalPatients = adminAccounts.filter(
        account => account.role === "Bệnh nhân"
    ).length;

    // Tổng số bác sĩ
    const totalDoctors = doctorsData.length;

    // Tổng số lịch khám
    const totalAppointments = appointmentsData.length;

    // Tổng số phản hồi
    const totalFeedback = feedbackData.length;

    // Điểm đánh giá trung bình
    const averageRating = totalFeedback > 0
        ? (
            feedbackData.reduce(
                (sum, item) => sum + item.rating, 0
            ) / totalFeedback
        ).toFixed(1)
        : "0.0";

    // Cập nhật giao diện
    document.getElementById("report-total-accounts").textContent =
        totalAccounts;

    document.getElementById("report-total-patients").textContent =
        totalPatients;

    document.getElementById("report-total-doctors").textContent =
        totalDoctors;

    document.getElementById("report-total-appointments").textContent =
        totalAppointments;

    document.getElementById("report-total-feedback").textContent =
        totalFeedback;

    document.getElementById("report-average-rating").textContent =
        averageRating;

        // =====================================
    // BIỂU ĐỒ TRẠNG THÁI LỊCH KHÁM
    // =====================================

    const appointmentCanvas = document.getElementById(
        "report-appointment-chart"
    );

    if (appointmentCanvas) {

        if (adminAppointmentChart) {
            adminAppointmentChart.destroy();
        }

        const statuses = [
            "Chờ xác nhận",
            "Đã xác nhận",
            "Đang khám",
            "Đã hoàn thành",
            "Đã hủy"
        ];

        const statusCounts = statuses.map(status =>
            appointmentsData.filter(
                item => item.status === status
            ).length
        );

        adminAppointmentChart = new Chart(appointmentCanvas, {
            type: "doughnut",

            data: {
                labels: statuses,

                datasets: [{
                    data: statusCounts,
                    backgroundColor: [
                        "#F59E0B",
                        "#2563EB",
                        "#8B5CF6",
                        "#16A34A",
                        "#EF4444"
                    ],
                    borderWidth: 2,
                    borderColor: "#FFFFFF"
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    },

                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw} lịch`;
                            }
                        }
                    }
                }
            }
        });
    }
        // =====================================
    // BIỂU ĐỒ MỨC ĐỘ HÀI LÒNG
    // =====================================

    const ratingCanvas = document.getElementById(
        "report-rating-chart"
    );

    if (ratingCanvas) {

        if (adminRatingChart) {
            adminRatingChart.destroy();
        }

        const ratings = [1, 2, 3, 4, 5];

        const ratingCounts = ratings.map(rating =>
            feedbackData.filter(
                item => Number(item.rating) === rating
            ).length
        );

        adminRatingChart = new Chart(ratingCanvas, {
            type: "bar",

            data: {
                labels: [
                    "1 sao",
                    "2 sao",
                    "3 sao",
                    "4 sao",
                    "5 sao"
                ],

                datasets: [{
                    label: "Số lượt đánh giá",
                    data: ratingCounts,
                    backgroundColor: [
                        "#EF4444",
                        "#F97316",
                        "#F59E0B",
                        "#3B82F6",
                        "#16A34A"
                    ],
                    borderRadius: 7,
                    maxBarThickness: 45
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
        // =====================================
    // BIỂU ĐỒ XU HƯỚNG LỊCH KHÁM
    // =====================================

    const trendCanvas = document.getElementById(
        "report-appointment-trend-chart"
    );

    if (trendCanvas) {

        if (adminAppointmentTrendChart) {
            adminAppointmentTrendChart.destroy();
        }

        // Gom nhóm lịch khám theo ngày
        const appointmentsByDate = {};

        appointmentsData.forEach(item => {
            appointmentsByDate[item.date] =
                (appointmentsByDate[item.date] || 0) + 1;
        });

        // Sắp xếp ngày tăng dần
        const sortedDates = Object.keys(appointmentsByDate).sort();

        const dateLabels = sortedDates.map(date => {
            const [year, month, day] = date.split("-");
            return `${day}/${month}/${year}`;
        });

        const dateCounts = sortedDates.map(
            date => appointmentsByDate[date]
        );

        adminAppointmentTrendChart = new Chart(trendCanvas, {
            type: "line",

            data: {
                labels: dateLabels,

                datasets: [{
                    label: "Số lịch khám",
                    data: dateCounts,
                    borderColor: "#2563EB",
                    backgroundColor: "rgba(37, 99, 235, 0.15)",
                    fill: true,
                    tension: 0.35,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }
        // =====================================
    // BIỂU ĐỒ LỊCH KHÁM THEO BÁC SĨ
    // =====================================

    const doctorCanvas = document.getElementById(
        "report-doctor-chart"
    );

    if (doctorCanvas) {

        if (adminDoctorChart) {
            adminDoctorChart.destroy();
        }

        // Đếm số lịch khám của từng bác sĩ
        const doctorLabels = doctorsData.map(
            doctor => doctor.full_name
        );

        const doctorCounts = doctorsData.map(doctor =>
            appointmentsData.filter(
                appointment =>
                    appointment.doctor_id === doctor.doctor_id
            ).length
        );

        adminDoctorChart = new Chart(doctorCanvas, {
            type: "bar",

            data: {
                labels: doctorLabels,

                datasets: [{
                    label: "Số lịch khám",
                    data: doctorCounts,
                    backgroundColor: "#3B82F6",
                    borderRadius: 6,
                    maxBarThickness: 35
                }]
            },

            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}