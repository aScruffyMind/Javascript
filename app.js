// FUNCTIONS
const btnClick = (function () { // IIFE declaration to return function for button click event listener
    let readyToSubmit;
    const inputIDs = getInputIDs();
    const myForm = document.forms['dino-compare'];
    return function () { // return this function to the variable btnClick
        readyToSubmit = true; // assume form ok to submit unless variable becomes false
        for (f = 0; f < inputIDs.length; f++) { // run a for loop to check if each field is empty and required.
            const item = document.getElementById(inputIDs[f]);
            const required = item.hasAttribute('required');
            if (item.value === '' && required == true) { // check if field is empty and required
                item.classList.add('field-error'); // add a red border around input field
                readyToSubmit = false; // mark this form as not ready to submit
                // if the item checks out and has the field-error class, remove it.
            } else if (item.classList.contains('field-error')) item.classList.remove('field-error');
        }
        if (readyToSubmit) { // execute this code if readyToSubmit is true at this point
            const name = myForm.name.value;
            const feet = Number(myForm.feet.value);
            const inches = Number(myForm.inches.value);
            const weight = Number(myForm.weight.value);
            const diet = myForm.diet.value;
            human = new Human(name, feet, inches, weight, diet);
            document.getElementById('dino-compare').remove('');
            createGrid(human);
        };
    };
})();

function getInputIDs() { // gather the IDs of all inputs & selects on form
    const inputs = document.querySelectorAll('input');
    const select = document.querySelectorAll('select');
    const ids = []; // establish empty array to store input IDs
    for (i = 0; i < inputs.length; i++) ids.push(inputs[i].id); // populate input IDs into array
    for (s = 0; s < select.length; s++) ids.push(select[s].id); // populate select IDs into array
    return ids; // return array of IDs
}

// Constructor function to create new human object
function Human(name, feet, inches, weight, diet) {
    this.species = 'human';
    this.name = name;
    this.feet = feet;
    this.inches = inches;
    this.height = (function () {
        return feet * 12 + inches;
    })();
    this.weight = weight;
    this.diet = diet;
}

// Constructor function to create the dinosaurs
function Dinos(specimen) {
    this.species = specimen.species;
    this.weight = specimen.weight;
    this.height = specimen.height;
    this.diet = specimen.diet;
    this.where = specimen.where;
    this.when = specimen.when;
    this.fact = specimen.fact;
}

Dinos.prototype.compareWeight = function () {
    console.log(`this will compare your weight to the dinos.`);
};

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createGrid(human) {
    const dinosaurs = (function createDinos() {
        let dinoArray = [];
        for (d = 0; d < data.Dinos.length; d++) {
            let currentDino = new Dinos(data.Dinos[d]);
            dinoArray.push(currentDino);
        }
        return dinoArray;
    })();

    let dinoOrder = (function () {
        let numOfDinos = dinosaurs.length;
        let myArr = [];
        for (i = 0; i < numOfDinos; i++) {
            myArr.push(i);
        };
        return myArr;
    })();
    dinoOrder.sort(() => Math.random() - 0.5);

    for (g = 0; g < dinosaurs.length; g++) {
        (g === 4) ? specimen = 'human': specimen = 'dinosaur'
        if (g === 4) {
            createGridItem(human);
            createGridItem(dinosaurs[dinoOrder[g]]);
        } else {
            createGridItem(dinosaurs[dinoOrder[g]]);
        }
    }
}

function createGridItem(specimen) {
    let title;
    (specimen.species === 'human') ? title = specimen.name: title = specimen.species;
    const grid = document.getElementById('grid');
    const gridItem = document.createElement('div');
    const img = document.createElement('img');
    const titleBox = document.createElement('div');
    const factBox = document.createElement('div');
    gridItem.classList.add('grid-item');
    grid.appendChild(gridItem);
    img.setAttribute('src', `images/${specimen.species}.png`);
    gridItem.appendChild(img);
    titleBox.classList.add('grid-text', 'name');
    titleBox.innerHTML = `<h2>${title}</h2>`;
    gridItem.appendChild(titleBox);
    if (specimen.species != 'human') {
        factBox.classList.add('grid-text', 'fact');
        factBox.innerHTML = `<h2>${specimen.fact}</h2>`
        gridItem.appendChild(factBox);
    }
}

document.getElementById('btn').addEventListener('click', btnClick);

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches. 


// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.


// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.