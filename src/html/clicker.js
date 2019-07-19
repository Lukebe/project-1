/**
 * we need to unserstand events in browser
 */
let clikcCounter = localStorage.getItem('clicks') || 0;

let currentValue = 0;
const clickCounter = document.getElementById('click-counter');
const clikcBox = document.getElementById("click-box");

// not a great solution
// clikcBox.onclick = () => {
//     handleClick();
// }

// twos styles of event propagation
// 1. capturing
// 2. bubbling

// default: bubbling
// capturing: happens first

// Adding an event listener
clikcBox.addEventListener('click', () => {
    handleClick();
    event.stopPropagation();
}, true);

package.addEventListener('click', (event) => {
    console.log("p clicked!");
    event.stopPropogation();
}, true);

console.log(clikcBox);


function handleClick(){
    currentValue++;
    localStorage('')
    clickCounter.innerText = currentValue;
};