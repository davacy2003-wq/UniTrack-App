document.addEventListener('DOMContentLoaded', () => {
    // This function will run immediately to verify the user's session
    async function verifyAndLoadDashboard() {
        const token = localStorage.getItem('token');

        // 1. If no token exists, redirect to login immediately.
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        try {
            // 2. Use the token to ask the backend "Who am I?"
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                // This will happen if the token is invalid or the user was deleted.
                throw new Error('Session invalid or expired.');
            }

            // 3. If the backend confirms the user is valid, get their fresh data.
            const user = await response.json();

            // Store the fresh user data, just in case it was updated.
            localStorage.setItem('user', JSON.stringify(user));

            // 4. Now that we are verified, build the dashboard.
            initializeDashboard(user, token);

        } catch (error) {
            // If verification fails for any reason, clear the bad token and redirect to login.
            console.error(error.message);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }
    }

    // This function contains all the logic to set up the dashboard AFTER verification.
    function initializeDashboard(user, token) {
        // --- DOM REFERENCES ---
        const welcomeMessage = document.getElementById('welcome-message');
        const studentNameSpan = document.getElementById('student-name');
        const logoutBtn = document.getElementById('logout-btn');
        const scanBtn = document.getElementById('scan-qr-btn');
        const scheduleList = document.getElementById('schedule-list');

        // --- SETUP UI ---
        welcomeMessage.textContent = `Welcome, ${user.name}!`;
        studentNameSpan.textContent = user.name;
        
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });

        scanBtn.addEventListener('click', () => {
            window.location.href = 'scanner.html';
        });

        // --- FETCH ENROLLED COURSES ---
        async function fetchEnrolledCourses() {
            try {
                const response = await fetch('http://localhost:5000/api/courses/mycourses', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Could not fetch courses.');
                
                const courses = await response.json();
                scheduleList.innerHTML = '';
                if (courses.length === 0) {
                    scheduleList.innerHTML = '<li>You are not enrolled in any courses.</li>';
                } else {
                    courses.forEach(course => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${course.courseCode} - ${course.courseTitle}`;
                        scheduleList.appendChild(listItem);
                    });
                }
            } catch (error) {
                scheduleList.innerHTML = '<li>Error loading courses.</li>';
                console.error(error);
            }
        }

        fetchEnrolledCourses();
    }

    // Start the verification process when the page loads.
    verifyAndLoadDashboard();
});