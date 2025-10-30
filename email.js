let people = [];
// Visa och filtrera personer
function render(search = '') {

  let filteredAndSortedPeople = people
    // 1. Filtrera efter E-postadress
    .filter(({ email }) => search === ''
      || email.toLowerCase().includes(search.toLowerCase()))
    // 2. Sortera efter E-postadress (Stigande)
    .toSorted((a, b) => a.email > b.email ? 1 : -1)
    // 3. Skapa HTML
    .map(({ firstName, lastName, email, birthDate }) => `
    <section class="person">
      <p><b>First name:</b> ${firstName}</p>
      <p><b>Last name:</b> ${lastName}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Age:</b> ${calculateAge(birthDate)}</p>
    </section>
  `)
    // 4. Slå ihop till en enda sträng
    .join('');

  // Ersätt innehållet i .people elementet
  document.querySelector('.people').innerHTML = filteredAndSortedPeople;

}

// Huvudfunktion för att ladda data och sätta upp händelselyssnare
document.addEventListener('DOMContentLoaded', async () => {
  // Ladda personer
  try {
    people = await (await fetch('people.json')).json();
  } catch (error) {
    console.error("Kunde inte ladda people.json:", error);
    document.querySelector('.people').innerHTML = '<p>Kunde inte ladda personuppgifter.</p>';
    return;
  }

  // Lägg till händelselyssnare på sökfältet
  const searchField = document.querySelector('.search-field');
  if (searchField) {
    searchField.addEventListener('keyup', event => {
      // Anropar render med sökfältets aktuella värde
      render(event.target.value);
    });
  }

  // Initial rendering av listan
  render();
});