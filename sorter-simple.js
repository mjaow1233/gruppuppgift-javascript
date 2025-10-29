let people = [];

// Beräkna ålder
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Visa personer
function render(sortBy = 'firstName', sortOrder = 'asc', searchTerm = '') {
  // Filtrera personer
  let filtered = people;
  if (searchTerm) {
    filtered = people.filter(person => {
      const age = calculateAge(person.birthDate);
      const search = searchTerm.toLowerCase();

      return person.firstName.toLowerCase().includes(search) ||
        person.lastName.toLowerCase().includes(search) ||
        person.email.toLowerCase().includes(search) ||
        age.toString().includes(searchTerm);
    });
  }

  // Sortera personer
  filtered.sort((a, b) => {
    let valueA, valueB;

    if (sortBy === 'age') {
      valueA = calculateAge(a.birthDate);
      valueB = calculateAge(b.birthDate);
    } else {
      valueA = a[sortBy].toLowerCase();
      valueB = b[sortBy].toLowerCase();
    }

    if (sortOrder === 'desc') {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    } else {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    }
  });

  // Skapa HTML
  const html = filtered.map(person => `
    <section class="person">
      <p><b>Förnamn:</b> ${person.firstName}</p>
      <p><b>Efternamn:</b> ${person.lastName}</p>
      <p><b>E-post:</b> ${person.email}</p>
      <p><b>Ålder:</b> ${calculateAge(person.birthDate)} år</p>
      <p><b>Födelsedatum:</b> ${person.birthDate}</p>
    </section>
  `).join('');

  document.querySelector('.people').innerHTML = html;
}

// Ladda data och sätt upp sidan
document.addEventListener('DOMContentLoaded', async () => {
  // Ladda personer
  people = await (await fetch('people.json')).json();

  // Hämta element
  const sortSelect = document.getElementById('sortSelect');
  const orderSelect = document.getElementById('orderSelect');
  const searchField = document.getElementById('searchField');

  // Uppdatera när något ändras
  function update() {
    render(sortSelect.value, orderSelect.value, searchField.value);
  }

  sortSelect.addEventListener('change', update);
  orderSelect.addEventListener('change', update);
  searchField.addEventListener('input', update);

  render(); // Visa alla personer först
});