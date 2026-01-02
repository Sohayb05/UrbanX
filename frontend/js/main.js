const form = document.getElementById('booking-form');
const historyList = document.getElementById('ride-history');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = form[0].value;
    const to = form[1].value;

    const li = document.createElement('li');
    li.textContent = `De ${from} à ${to}`;
    historyList.appendChild(li);

    form.reset();
});