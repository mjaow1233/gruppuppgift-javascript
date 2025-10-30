// reading json file
const peopleRaw = await fetch('people.json');
const people = await peopleRaw.json();

// age calculation function
function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// adding age to each person
const peopleWithAge = people.map(person => ({
  ...person,
  age: calculateAge(person.birthDate)
}));

function render(search = '') {
  
  const ageFilter = parseInt(search);
  let html = peopleWithAge
    .filter(({ age }) => search === '' || age >= ageFilter)
    
    .toSorted((a, b) => a.age - b.age)
    
    .map(({ firstName, lastName, email, age }) => `
      <section class="person">
        <p><b>First name:</b> ${firstName}</p>
        <p><b>Last name:</b> ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Age:</b> ${age}</p>
      </section>
    `)
    .join('');

  document.querySelector('.people').innerHTML = html;
}

// event listener for search input
document.querySelector('.search-field')
  .addEventListener('keyup', event => {
    render(event.target.value);
  });

// initial render
render();
