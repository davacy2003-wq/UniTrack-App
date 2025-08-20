document.addEventListener('DOMContentLoaded', () => {
    // --- AUTHENTICATION ---
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!token || !user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // --- STATE MANAGEMENT ---
    let allStudents = [];
    let allCourses = [];

    // --- DOM REFERENCES ---
    // Sections & Navigation
    const sections = {
        students: document.getElementById('students-section'),
        courses: document.getElementById('courses-section'),
        enrollment: document.getElementById('enrollment-section'),
        session: document.getElementById('session-section'),
        attendance: document.getElementById('attendance-section'),
    };
    const navLinks = {
        students: document.getElementById('nav-students'),
        courses: document.getElementById('nav-courses'),
        enrollment: document.getElementById('nav-enrollment'),
        session: document.getElementById('nav-session'),
        attendance: document.getElementById('nav-attendance'),
    };
    const pageTitle = document.getElementById('page-title');
    const adminName = document.getElementById('admin-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Main Content Elements
    const studentTbody = document.getElementById('student-list-tbody');
    const courseTbody = document.getElementById('course-list-tbody');
    
    // Modal & Form Elements
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modal-form');
    const closeBtn = document.querySelector('.close-btn');

    // Enrollment UI Elements
    const enrollmentCourseSelector = document.getElementById('enrollment-course-selector');
    const unenrolledList = document.getElementById('unenrolled-list');
    const enrolledList = document.getElementById('enrolled-list');
    const enrollBtn = document.getElementById('enroll-btn');
    const unenrollBtn = document.getElementById('unenroll-btn');

    // Live Session UI Elements
    const sessionCourseSelect = document.getElementById('session-course-select');
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const qrCodeContainer = document.getElementById('qr-code-container');
    const qrCodeImg = document.getElementById('qr-code-img');
    const qrTimer = document.getElementById('qr-timer');
    
    // Attendance UI Elements
    const attendanceTbody = document.getElementById('attendance-tbody');
    const attendanceCourseFilter = document.getElementById('attendance-course-filter');

    // --- NAVIGATION LOGIC ---
    function showSection(sectionName) {
        Object.values(sections).forEach(s => s.classList.add('hidden'));
        sections[sectionName].classList.remove('hidden');
        Object.values(navLinks).forEach(n => n.classList.remove('active'));
        navLinks[sectionName].classList.add('active');
        pageTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    }

    Object.keys(navLinks).forEach(key => {
        navLinks[key].addEventListener('click', (e) => {
            e.preventDefault();
            showSection(key);
            // Fetch attendance records only when the attendance tab is clicked
            if (key === 'attendance') {
                fetchAttendanceRecords();
            }
        });
    });

    // --- DATA FETCHING & RENDERING ---
    async function fetchAllData() {
        try {
            const [usersRes, coursesRes] = await Promise.all([
                fetch('https://unitrack-backend-8oyb.onrender.com/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('https://unitrack-backend-8oyb.onrender.com/api/courses', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const users = await usersRes.json();
            allCourses = await coursesRes.json();
            allStudents = users.filter(u => u.role === 'student');
            
            renderStudents();
            renderCourses();
            populateEnrollmentCourseSelector();
            populateSessionCourseSelector();
            populateAttendanceFilter();
            updateEnrollmentUI();
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        }
    }

    function renderStudents() { /* ... unchanged ... */ }
    function renderCourses() { /* ... unchanged ... */ }
    function populateEnrollmentCourseSelector() { /* ... unchanged ... */ }
    function updateEnrollmentUI() { /* ... unchanged ... */ }
    function populateSessionCourseSelector() { /* ... unchanged ... */ }

    // New function to populate the attendance filter dropdown
    function populateAttendanceFilter() {
        attendanceCourseFilter.innerHTML = '<option value="">Filter by Course...</option>';
        allCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course._id;
            option.textContent = `${course.courseCode} - ${course.courseTitle}`;
            attendanceCourseFilter.appendChild(option);
        });
    }

    // New function to fetch and display attendance records
    async function fetchAttendanceRecords() {
        let url = 'https://unitrack-backend-8oyb.onrender.com/api/attendance/records';
        const courseId = attendanceCourseFilter.value;
        if (courseId) {
            url += `?courseId=${courseId}`;
        }

        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch attendance records.');
            
            const records = await response.json();
            attendanceTbody.innerHTML = '';

            if (records.length > 0) {
                records.forEach(record => {
                    const tr = document.createElement('tr');
                    const attendanceDate = new Date(record.createdAt);
                    tr.innerHTML = `
                        <td>${record.student ? record.student.name : 'N/A'}</td>
                        <td>${record.student ? record.student.matricNumber : 'N/A'}</td>
                        <td>${record.course ? record.course.courseCode : 'N/A'}</td>
                        <td>${attendanceDate.toLocaleDateString()}</td>
                        <td>${attendanceDate.toLocaleTimeString()}</td>
                    `;
                    attendanceTbody.appendChild(tr);
                });
            } else {
                attendanceTbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No attendance records found.</td></tr>';
            }
        } catch (error) {
            attendanceTbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Error: ${error.message}</td></tr>`;
        }
    }

    // --- MODAL & FORM LOGIC ---
    function openModal(type, item = {}) { /* ... unchanged ... */ }

    // --- EVENT LISTENERS ---
    logoutBtn.addEventListener('click', () => { localStorage.clear(); window.location.href = 'index.html'; });
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target == modal) modal.style.display = 'none'; });

    document.getElementById('add-student-btn').addEventListener('click', () => openModal('addStudent'));
    document.getElementById('add-course-btn').addEventListener('click', () => openModal('addCourse'));
    
    document.querySelector('.content-body').addEventListener('click', (e) => { /* ... unchanged ... */ });
    modalForm.addEventListener('submit', (e) => { /* ... unchanged ... */ });
    enrollmentCourseSelector.addEventListener('change', updateEnrollmentUI);
    document.querySelector('.enrollment-wrapper').addEventListener('click', (e) => { /* ... unchanged ... */ });
    enrollBtn.addEventListener('click', () => handleEnrollmentAction('enroll'));
    unenrollBtn.addEventListener('click', () => handleEnrollmentAction('unenroll'));
    generateQrBtn.addEventListener('click', () => { /* ... unchanged ... */ });
    
    // New event listener for the attendance filter
    attendanceCourseFilter.addEventListener('change', fetchAttendanceRecords);

    // --- INITIALIZATION ---
    adminName.textContent = user.name;
    fetchAllData();
    
    // Re-pasting the full logic for all functions for clarity and completeness
    function renderStudents(){studentTbody.innerHTML="";allStudents.forEach(student=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${student.name}</td><td>${student.matricNumber}</td><td>${student.email}</td><td><button class="btn-warning edit-btn" data-type="student" data-item='${JSON.stringify(student)}'>Edit</button> <button class="btn-danger delete-btn" data-type="student" data-id="${student._id}">Delete</button></td>`;studentTbody.appendChild(tr)})}
    function renderCourses(){courseTbody.innerHTML="";allCourses.forEach(course=>{const tr=document.createElement("tr");tr.innerHTML=`<td>${course.courseCode}</td><td>${course.courseTitle}</td><td><button class="btn-warning edit-btn" data-type="course" data-item='${JSON.stringify(course)}'>Edit</button> <button class="btn-danger delete-btn" data-type="course" data-id="${course._id}">Delete</button></td>`;courseTbody.appendChild(tr)})}
    function populateEnrollmentCourseSelector(){enrollmentCourseSelector.innerHTML='<option value="">Select a course to manage...</option>';allCourses.forEach(course=>{const option=document.createElement("option");option.value=course._id;option.textContent=`${course.courseCode} - ${course.courseTitle}`;enrollmentCourseSelector.appendChild(option)})}
    function updateEnrollmentUI(){const selectedCourseId=enrollmentCourseSelector.value;unenrolledList.innerHTML="";enrolledList.innerHTML="";if(!selectedCourseId)return;const selectedCourse=allCourses.find(c=>c._id===selectedCourseId);const enrolledIds=new Set(selectedCourse.studentsEnrolled);const enrolledStudents=allStudents.filter(s=>enrolledIds.has(s._id));const unenrolledStudents=allStudents.filter(s=>!enrolledIds.has(s._id));enrolledStudents.forEach(student=>{const item=document.createElement("div");item.className="student-list-item";item.textContent=`${student.name} (${student.matricNumber})`;item.dataset.id=student._id;enrolledList.appendChild(item)});unenrolledStudents.forEach(student=>{const item=document.createElement("div");item.className="student-list-item";item.textContent=`${student.name} (${student.matricNumber})`;item.dataset.id=student._id;unenrolledList.appendChild(item)})}
    function openModal(type,item={}){modal.style.display="block";modalForm.dataset.type=type;modalForm.dataset.id=item._id||"";if(type==="addStudent"){modalTitle.textContent="Add New Student";modalForm.innerHTML=`<div class="form-group"><label>Full Name</label><input type="text" name="name" required></div><div class="form-group"><label>Matric No.</label><input type="text" name="matricNumber" required></div><div class="form-group"><label>Email</label><input type="email" name="email" required></div><div class="form-group"><label>Initial Password</label><input type="password" name="password" autocomplete="new-password" required></div><button type="submit" class="btn btn-primary">Add Student</button>`}else if(type==="addCourse"){modalTitle.textContent="Add New Course";modalForm.innerHTML=`<div class="form-group"><label>Course Code</label><input type="text" name="courseCode" required></div><div class="form-group"><label>Course Title</label><input type="text" name="courseTitle" required></div><button type="submit" class="btn btn-primary">Add Course</button>`}else if(type==="editStudent"){modalTitle.textContent="Edit Student";modalForm.innerHTML=`<div class="form-group"><label>Full Name</label><input name="name" value="${item.name}" required></div><div class="form-group"><label>Matric No.</label><input name="matricNumber" value="${item.matricNumber}" required></div><div class="form-group"><label>Email</label><input name="email" value="${item.email}" required></div><div class="form-group"><label>New Password</label><input name="password" placeholder="Leave blank to keep current"></div><button type="submit" class="btn btn-primary">Save Changes</button>`}else if(type==="editCourse"){modalTitle.textContent="Edit Course";modalForm.innerHTML=`<div class="form-group"><label>Course Code</label><input name="courseCode" value="${item.courseCode}" required></div><div class="form-group"><label>Course Title</label><input name="courseTitle" value="${item.courseTitle}" required></div><button type="submit" class="btn btn-primary">Save Changes</button>`}}
    document.querySelector(".content-body").addEventListener("click",e=>{const target=e.target;if(target.classList.contains("edit-btn")){openModal(target.dataset.type==="student"?"editStudent":"editCourse",JSON.parse(target.dataset.item))}if(target.classList.contains("delete-btn")){const{type,id}=target.dataset;if(confirm(`Are you sure you want to delete this ${type}?`)){const url=type==="student"?`/api/users/${id}`:`/api/courses/${id}`;fetch("http://localhost:5000"+url,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}}).then(fetchAllData)}}});
    modalForm.addEventListener("submit",async e=>{e.preventDefault();const{type,id}=e.target.dataset;const formData=new FormData(e.target);const body=Object.fromEntries(formData.entries());let url,method;if(type==="addStudent"){url="http://localhost:5000/api/users/register";method="POST"}else if(type==="addCourse"){url="http://localhost:5000/api/courses";method="POST"}else if(type==="editStudent"){url=`http://localhost:5000/api/users/${id}`;method="PUT";if(!body.password)delete body.password}else if(type==="editCourse"){url=`http://localhost:5000/api/courses/${id}`;method="PUT"}try{const response=await fetch(url,{method,headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify(body)});if(!response.ok)throw new Error("Operation failed.");modal.style.display="none";fetchAllData()}catch(error){console.error("Form submission error:",error)}});
    document.querySelector(".enrollment-wrapper").addEventListener("click",e=>{if(e.target.classList.contains("student-list-item")){e.target.classList.toggle("selected")}});
    async function handleEnrollmentAction(action){const courseId=enrollmentCourseSelector.value;if(!courseId)return alert("Please select a course first.");const sourceList=action==="enroll"?unenrolledList:enrolledList;const selectedItems=sourceList.querySelectorAll(".student-list-item.selected");if(selectedItems.length===0)return;const studentIds=Array.from(selectedItems).map(item=>item.dataset.id);const url=`http://localhost:5000/api/courses/${courseId}/${action}`;try{await Promise.all(studentIds.map(studentId=>fetch(url,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({studentId})})));await fetchAllData();enrollmentCourseSelector.value=courseId;updateEnrollmentUI()}catch(error){console.error(`Failed to ${action} students:`,error);alert(`An error occurred during ${action}.`)}}
    enrollBtn.addEventListener("click",()=>handleEnrollmentAction("enroll"));unenrollBtn.addEventListener("click",()=>handleEnrollmentAction("unenroll"));
    function populateSessionCourseSelector(){sessionCourseSelect.innerHTML='<option value="">Select a course</option>';allCourses.forEach(course=>{const option=document.createElement("option");option.value=course._id;option.textContent=`${course.courseCode} - ${course.courseTitle}`;sessionCourseSelect.appendChild(option)})}
    generateQrBtn.addEventListener("click",async()=>{const courseId=sessionCourseSelect.value;if(!courseId){return alert("Please select a course to start a session.")}try{const response=await fetch(`http://localhost:5000/api/attendance/generate/${courseId}`,{headers:{Authorization:`Bearer ${token}`}});if(!response.ok){throw new Error("Failed to generate QR code.")}const data=await response.json();qrCodeImg.src=data.qrCode;qrCodeContainer.classList.remove("hidden");let timeLeft=600;qrTimer.textContent="Expires in: 10:00";const timerInterval=setInterval(()=>{timeLeft--;const minutes=Math.floor(timeLeft/60);const seconds=timeLeft%60;qrTimer.textContent=`Expires in: ${minutes}:${seconds<10?"0":""}${seconds}`;if(timeLeft<=0){clearInterval(timerInterval);qrTimer.textContent="QR Code has expired.";qrCodeContainer.classList.add("hidden")}},1e3)}catch(error){alert(`Error: ${error.message}`)}});
});