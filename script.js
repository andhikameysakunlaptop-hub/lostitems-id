// GANTI DENGAN URL WEB APP YANG BARU (TANPA SPASI!)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzg-6xTc7_nbQ5fX5vby0rj44DA2LIGgONGHUsO8B802t0VYv4Pk0Kd5KuuWQQYGX8niw/exec";

// Fungsi untuk menampilkan konten utama setelah tombol Start diklik
function showMainContent() {
    const startScreen = document.getElementById('start-screen');
    const mainContent = document.getElementById('main-content');
    // const loadingStart = document.getElementById('loading-start'); // Tidak digunakan lagi
    // const startBtn = document.getElementById('start-btn'); // Tidak digunakan lagi

    // Animasi menghilang layar start
    startScreen.style.animation = 'fadeOut 0.5s forwards';

    // Tunggu animasi selesai, lalu tampilkan konten utama
    setTimeout(() => {
        startScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        // loadData(); // Jangan muat data otomatis saat klik "Mulai"
    }, 500); // 500ms = durasi animasi
}

// Fungsi untuk mengirim data form ke Google Sheet
document.getElementById('report-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        namaBarang: document.getElementById('namaBarang').value,
        deskripsi: document.getElementById('deskripsi').value,
        lokasi: document.getElementById('lokasi').value,
        kontak: document.getElementById('kontak').value,
        status: document.getElementById('status').value
    };

    // Tidak ada loading saat kirim
    document.getElementById('pesan-sukses').style.display = 'none';

    fetch(WEB_APP_URL, {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Tampilkan pesan sukses
        document.getElementById('pesan-sukses').style.display = 'block';
        // Reset form
        document.getElementById('report-form').reset();
        // Muat ulang data tabel
        setTimeout(loadData, 2000); // Tunggu 2 detik lalu muat data
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim data.');
    });
    // .finally(() => {
    //     // Tidak ada loading untuk disembunyikan
    // });
});

// Fungsi untuk memuat data dari Google Sheet ke tabel
function loadData() {
    const loadingMain = document.getElementById('loading-main');
    const tableBody = document.getElementById('table-body');

    // Tampilkan loading saat MUAT DATA diklik
    loadingMain.classList.remove('hidden'); // Tampilkan loading
    // Kosongkan tabel dulu sementara loading
    tableBody.innerHTML = '<tr><td colspan="6">Memuat data...</td></tr>';

    fetch(WEB_APP_URL)
    .then(response => response.json())
    .then(data => {
        tableBody.innerHTML = ''; // Pastikan kosong lagi sebelum diisi

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">Tidak ada data laporan saat ini.</td></tr>';
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
        console.error('Error:', error);
        alert('Gagal memuat data.');
        tableBody.innerHTML = `<tr><td colspan="6">Gagal memuat  ${error.message}</td></tr>`;
    })
    .finally(() => {
        // Sembunyikan loading setelah selesai (baik sukses maupun gagal)
        const loadingMain = document.getElementById('loading-main');
        loadingMain.classList.add('hidden'); // Sembunyikan loading
    });
}

// Fungsi untuk mencari/filter data di tabel
function filterTable() {
    const input = document.getElementById('search-box');
    const filter = input.value.toLowerCase().trim(); // .trim() hapus spasi awal/akhir
    const table = document.getElementById('data-table');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) { // Mulai dari 1 untuk melewati header
        const tds = tr[i].getElementsByTagName('td'); // Ambil semua kolom di baris itu
        let found = false;

        // Loop melalui semua kolom (td) di baris tersebut
        for (let j = 0; j < tds.length; j++) {
            const txtValue = tds[j].textContent || tds[j].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                found = true;
                break; // Jika ketemu di salah satu kolom, langsung keluar dari loop
            }
        }

        // Jika ditemukan di salah satu kolom, tampilkan barisnya
        if (found) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

// Panggil fungsi loadData saat halaman pertama kali dimuat (ini akan dijalankan setelah tombol Start diklik)
// window.onload = function() {
//     loadData(); // Kita pindahkan ini ke fungsi showMainContent atau hapus jika tidak ingin otomatis
// };
// --- Script untuk membuat elemen animasi meteor di layar start ---
document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.getElementById('start-screen');
    const meteorCount = 9; // Jumlah meteor yang ingin ditampilkan

    for (let i = 0; i < meteorCount; i++) {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        startScreen.appendChild(meteor);
    }
});
