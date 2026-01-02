// Récupération des éléments DOM
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const form = document.getElementById('booking-form');
const historyList = document.getElementById('ride-history');

// Gestion de la navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Retirer la classe active de tous les liens et sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Ajouter la classe active au lien cliqué
        link.classList.add('active');
        
        // Afficher la section correspondante
        const sectionId = link.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// Charger l'historique depuis le localStorage au chargement de la page
function loadHistory() {
    const rides = JSON.parse(localStorage.getItem('urbanX_rides')) || [];
    
    if (rides.length === 0) {
        historyList.innerHTML = '<li class="empty-state">Aucun trajet réservé pour le moment</li>';
        return;
    }
    
    historyList.innerHTML = '';
    rides.reverse().forEach(ride => {
        addRideToHistory(ride, false);
    });
}

// Ajouter un trajet à l'historique
function addRideToHistory(ride, saveToStorage = true) {
    // Supprimer le message "vide" s'il existe
    const emptyState = historyList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const li = document.createElement('li');
    li.className = 'ride-item';
    
    const date = new Date(ride.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    li.innerHTML = `
        <div class="ride-info">
            <div class="ride-route">🚗 ${ride.from} → ${ride.to}</div>
            <div class="ride-details">Trajet réservé avec succès</div>
        </div>
        <div class="ride-date">${formattedDate}</div>
    `;
    
    // Ajouter en premier dans la liste
    historyList.insertBefore(li, historyList.firstChild);
    
    // Sauvegarder dans localStorage
    if (saveToStorage) {
        const rides = JSON.parse(localStorage.getItem('urbanX_rides')) || [];
        rides.push(ride);
        localStorage.setItem('urbanX_rides', JSON.stringify(rides));
    }
}

// Gestion du formulaire
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const departure = document.getElementById('departure').value.trim();
    const destination = document.getElementById('destination').value.trim();
    
    if (!departure || !destination) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    // Créer l'objet trajet
    const ride = {
        from: departure,
        to: destination,
        date: new Date().toISOString()
    };
    
    // Ajouter à l'historique
    addRideToHistory(ride, true);
    
    // Réinitialiser le formulaire
    form.reset();
    
    // Afficher un message de confirmation
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '✓ Demandé !';
    btn.style.opacity = '0.8';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.opacity = '1';
    }, 2000);
    
    // Basculer vers l'onglet Historique
    const historyLink = document.querySelector('[data-section="history"]');
    if (historyLink) {
        historyLink.click();
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
});
