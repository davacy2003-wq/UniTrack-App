document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    async function onScanSuccess(decodedText, decodedResult) {
        html5QrcodeScanner.clear();
        try {
            const response = await fetch('http://localhost:5000/api/attendance/mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ qrCodeData: decodedText })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to mark attendance.');
            alert('Success! Attendance marked.');
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert(`Error: ${error.message}`);
            window.location.href = 'dashboard.html';
        }
    }

    function onScanFailure(error) { /* Ignore */ }

    let html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
});