
// Hämta personer från JSON-fil
const peopleRaw = await fetch('people.json');
const people = await peopleRaw.json();

// Beräkna ålder från födelsedatum
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

// Hämta värde för sortering
function getSortValue(person, sortBy) {
  switch (sortBy) {
    case 'firstName': return person.firstName.toLowerCase();
    case 'lastName': return person.lastName.toLowerCase();
    case 'email': return person.email.toLowerCase();
    case 'age': return calculateAge(person.birthDate);
    default: return person.firstName.toLowerCase();
  }
}

// Visa personer
function render(sortBy = 'firstName', sortOrder = 'asc') {
  const sortedPeople = people.toSorted((a, b) => {
    const valueA = getSortValue(a, sortBy);
    const valueB = getSortValue(b, sortBy);

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const html = sortedPeople.map(person => `
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

// Event-lyssnare
document.addEventListener('DOMContentLoaded', () => {
  const sortSelect = document.getElementById('sortSelect');
  const orderSelect = document.getElementById('orderSelect');

  function updateDisplay() {
    render(sortSelect.value, orderSelect.value);
  }

  sortSelect.addEventListener('change', updateDisplay);
  orderSelect.addEventListener('change', updateDisplay);

  render();
});