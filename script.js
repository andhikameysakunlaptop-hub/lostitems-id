const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz8tMMvQ1RuD_pwne6vNzTtfYzzJyErvc3JCaR4YDRa0DkVDvx9YmhkjJSp1s-Y0HfsOQ/exec";// Fungsi untuk mengirim data form ke Google Sheet
document.getElementById('report-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        namaBarang: document.getElementById('namaBarang').value,
        deskripsi: document.getElementById('deskripsi').value,
        lokasi: document.getElementById('lokasi').value,
        kontak: document.getElementById('kontak').value,
        status: document.getElementById('status').value
    };

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
});

// Fungsi untuk memuat data dari Google Sheet ke tabel
function loadData() {
    fetch(WEB_APP_URL)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Kosongkan tabel dulu

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

// Panggil fungsi loadData saat halaman pertama kali dimuat
window.onload = function() {
    loadData();
};
