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
    

function render(search = '') {

  // A modern programming pattern (in many languages)
  // is using a chain of array methods to calculate a result
  // filter, storting, mapping until we're happy :)

  // Using map instead of a loop
  // to convert our array of objects (people) to html
  let html = people
    // return true on filtering if search is an empty string
    // or firstName starts with the search
    .filter(({ firstName }) => search === ''
      || firstName.toLowerCase().startsWith(search.toLowerCase()))
    // sort by firstName
    .toSorted((a, b) => a.firstName > b.firstName ? 1 : - 1)
    // map to convert each element to a string with html
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
