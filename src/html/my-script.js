/* Document Object Model */

const myElement = document.getElementById('primary-heading');
console.log(myElement);

setTimeout(() => {
    // innerHTML usage can lead to weakenesses related to xss
    myElement.innerHTML = 'Now the heading is this!'
}, 1000);

const mainContent = document.getElementById("main-content");

const newElement = document.createElement('p');
console.log(newElement);
newElement.innerText = 'This is a new p tag!';
mainContent.appendChild(newElement);

setTimeout(() => {
    newElement.innerText
})

// document.querySelector('header > h1')