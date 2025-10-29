// read json from a url using fetch and get the response
const peopleRaw = await fetch('people.json');

// unpack the json into a data structure in memory ('deserialize')
const people = await peopleRaw.json();

// Or as a oneliner
// const people = await(await fetch('people.json')).json();

// A for...of loop with a destructuring assignment
// to get each property from a person as a separate
// variable inside the loop
/*let html = '';
for (let { firstName, lastName, email } of people) {
  html += `
    <div class="person">
      <p><b>First name:</b> ${firstName}</p>
      <p><b>Last name:</b> ${lastName}</p>
      <p><b>Email:</b> ${email}</p>
    </div>
  `;
}*/
  const calculateAge = (birthDateString) => {
    const today = new Date();
    const [y,m,d] = birthDateString.split('-').map(Number);
    
    const birth = new Date(y,m-1,d);
    let age = today.getFullYear() - birth.getFullYear();

    const hasNotHadBirthday = 
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

  if (hasNotHadBirthday) age--;
  return age;
};
    

let sortBy = 'firstName'; // standard-sortering
function render(search = '') {

  let html = people

    .filter(({ firstName, email }) => search === ''
      || firstName.toLowerCase().startsWith(search.toLowerCase())
      || email.toLowerCase().includes(search.toLowerCase()))

    .toSorted((a, b) => {
      if (sortBy === 'firstName')
        return a.firstName.localeCompare(b.firstName);
      else if (sortBy === 'email')
        return a.email.localeCompare(b.email);
    })

    .map(({ firstName, lastName, email, birthDate }) => `
    <section class="person">
      <p><b>First name:</b> ${firstName}</p>
      <p><b>Last name:</b> ${lastName}</p>  
      <p><b>Email:</b> ${email}</p>
      <p><b>Age:</b> ${calculateAge(birthDate)}</p>
    </section>
  `)
    // join to join our array of strings into one large string
    .join('');

  // replace the content of article.people element with our new html
  document.querySelector('.people').innerHTML = html;

}

// add event listeners to sort buttons
document.querySelector('#sort-firstname')
  .addEventListener('click', () => { 
    sortBy = 'firstName'; 
    render(document.querySelector('.search-field').value); 
  });

document.querySelector('#sort-email')
  .addEventListener('click', () => { 
    sortBy = 'email'; 
    render(document.querySelector('.search-field').value); 
  });
// End of sort button event listeners

// add a keyup event handler to our search field
document.querySelector('.search-field')
  .addEventListener('keyup', event => {
    // the event object has a target the html element
    // that trigger the event and all input element have a value
    render(event.target.value);
  });




// initial rendering of list of people to screen
render();

window.calculateAge = calculateAge;

