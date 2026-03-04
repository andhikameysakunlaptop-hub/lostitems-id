// ===============================
// KONFIGURASI
// ===============================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzg-6xTc7_nbQ5fX5vby0rj44DA2LIGgONGHUsO8B802t0VYv4Pk0Kd5KuuWQQYGX8niw/exec";


// ===============================
// FUNGSI START SCREEN
// ===============================
function showMainContent() {
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');

    startScreen.style.animation = 'fadeOut 0.5s forwards';

    setTimeout(() => {
        startScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
    }, 500);
}


// ===============================
// FUNGSI KIRIM FORM (DENGAN ANTI-DOUBLE CLICK)
// ===============================
document.getElementById('report-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const pesanSukses = document.getElementById('pesan-sukses');
    const submitBtn = e.target.querySelector('button[type="submit"]'); // Mengambil tombol submit

    const formData = {
        namaBarang: document.getElementById('namaBarang').value,
        deskripsi: document.getElementById('deskripsi').value,
        lokasi: document.getElementById('lokasi').value,
        kontak: document.getElementById('kontak').value,
        status: document.getElementById('status').value
    };

    // Menonaktifkan tombol agar tidak bisa diklik dua kali
    submitBtn.disabled = true;
    submitBtn.innerText = "Mengirim...";
    submitBtn.style.opacity = "0.7";
    pesanSukses.style.display = 'none';

    fetch(WEB_APP_URL, {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    .then(response => response.text())
    .then(() => {
        pesanSukses.style.display = 'block';
        document.getElementById('report-form').reset();

        // Reload data setelah 1 detik agar tabel terupdate
        setTimeout(() => {
            loadData();
        }, 1000);
    })
    .catch(error => {
        console.error(error);
        alert("Terjadi kesalahan saat mengirim data.");
    })
    .finally(() => {
        // Mengaktifkan kembali tombol setelah proses selesai
        submitBtn.disabled = false;
        submitBtn.innerText = "Kirim Laporan";
        submitBtn.style.opacity = "1";
    });
});


// ===============================
// FUNGSI LOAD DATA
// ===============================
function loadData() {
    const tableBody = document.getElementById('table-body');

    // Memberi tanda sedang memuat di dalam tabel
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Memperbarui data...</td></tr>';

    fetch(WEB_APP_URL)
    .then(response => response.json())
    .then(data => {
        tableBody.innerHTML = '';

        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">Tidak ada data laporan.</td></tr>';
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.namaBarang}</td>
                <td>${item.deskripsi}</td>
                <td>${item.lokasi}</td>
                <td>${item.kontak}</td>
                <td>${item.status}</td>
                <td>${new Date(item.tanggal).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="6">Gagal memuat data. Silakan coba lagi.</td></tr>';
    });
}


// ===============================
// FUNGSI SEARCH
// ===============================
function filterTable() {
    const input = document.getElementById('search-box');
    const filter = input.value.toLowerCase().trim();
    const table = document.getElementById('data-table');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const tds = tr[i].getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < tds.length; j++) {
            const txtValue = tds[j].textContent || tds[j].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }

        tr[i].style.display = found ? "" : "none";
    }
}


// ===============================
// ANIMASI METEOR
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.getElementById('start-screen');
    const meteorCount = 9;

    for (let i = 0; i < meteorCount; i++) {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        startScreen.appendChild(meteor);
    }
});
