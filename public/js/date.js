const dateNowElement = document.getElementById('dateNow');

const now = new Date();
const formattedDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

dateNowElement.innerText = `Tanggal: ${formattedDate}`;
