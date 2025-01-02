const dateNowElement = document.getElementById('dateNow');

const now = new Date();
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const formattedDate = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

dateNowElement.innerText = `Tanggal: ${formattedDate}`;