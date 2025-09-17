const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzQZSZaqdmmpTYjO5lQMgDvh6eldLMjAZ4Wa-iSrPnC9VwOWnLFMgMr3tIIj8zsS5jD/exec"; // <-- GANTI INI!

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
    const filter = input.value.toLowerCase();
    const table = document.getElementById('data-table');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) { // Mulai dari 1 untuk melewati header
        const td = tr[i].getElementsByTagName('td')[0]; // Cari di kolom "Nama Barang"
        if (td) {
            const txtValue = td.textContent || td.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Panggil fungsi loadData saat halaman pertama kali dimuat
window.onload = function() {
    loadData();
};