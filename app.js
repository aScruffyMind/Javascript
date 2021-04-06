let dinosaurArray = []; // remove before turning in

// FUNCTIONS
const btnClick = (() => { // IIFE declaration to return function for button click event listener
    let readyToSubmit; // initialize the readyToSubmit flag in the closure
    const inputIDs = (() =>{ // IIFE to return all inputIDs in an array
        const ids = []; // establish empty array to store input IDs
        document.querySelectorAll('input, select').forEach((x) => ids.push(x.id)); // populate ids array from DOM    
        return ids;
    })(); 
    const myForm = document.forms['dino-compare'];

    return function() { // return this function to the variable btnClick
        readyToSubmit = true; // assume form ok to submit unless this flag becomes false

        inputIDs.forEach((id)=> { // loop to check form for invalid fields before submitting
            const item = document.getElementById(id);
            const required = item.hasAttribute('required');
            if (item.value === '' && required == true) { // check if field is empty and required
                item.classList.add('field-error'); // add a red border around input field
                readyToSubmit = false; // mark this form as not ready to submit
            // else if the item checks out and has the field-error class, remove it.
            } else if (item.classList.contains('field-error')) item.classList.remove('field-error');
        });

        if (readyToSubmit) { // execute this code if readyToSubmit is true at this point
            // stuff form fields into variables to pass into the constructor function
            const name = myForm.name.value;
            const feet = Number(myForm.feet.value);
            const inches = Number(myForm.inches.value);
            const weight = Number(myForm.weight.value);
            const diet = myForm.diet.value;
            // pass the variables above into the human constructor function.
            human = new Human(name, feet, inches, weight, diet);
            document.getElementById('dino-compare').remove(); // remove the form from the DOM
            createGrid(human); // pass the human into the grid creator... let's go!
        };
    };
})();

// Constructor function to create new human object
function Human(name, feet, inches, weight, diet) {
    this.species = 'human';
    this.name = name;
    this.height = (function () {
        return feet * 12 + inches;
    })();
    this.weight = weight;
    this.diet = diet.toLowerCase();
}

// Constructor function to create the dinosaurs
function Dinos(d) { // units are lbs and inches
    this.species = d.species;
    this.weight = d.weight;
    this.height = d.height;
    this.diet = d.diet;
    this.where = d.where;
    this.when = d.when;
    this.fact = d.fact;
}

Dinos.prototype.compareWeight = function (h) { // compare weight from argument to dino weight.
    const d = this.weight;
    const s = this.species;
    if (h > d) return `You outweigh a ${s} by ${(h - d).toLocaleString()} pounds.`;
    else if (h < d) return `A ${s} is ${(d - h).toLocaleString()} pounds heavier than you.`;
    else return `You and a ${s} weigh exactly the same.`;
};

Dinos.prototype.compareHeight = function (h) {
    const d = this.height;
    const s = this.species;
    if (h > d) return `You are ${convertInches(h - d)} taller than a ${s}!`;
    else if (h < d) return `A ${s} is ${convertInches(d - h)} taller than you!`;
    else return `You are the same height as a ${s}.`;
};

Dinos.prototype.compareDiet = function(diet) {
    const h = diet.toLowerCase();
    const d = this.diet.toLowerCase();
    const s = this.species;
    if (h === d) return `You and ${s} are both ${d}s.`;
    else return `${s} is ${(d[0] === 'c') ? 'a' : 'an'} ${d}.`;
};

Dinos.prototype.geography = function() {
    const s = this.species;
    const w = this.where;
    switch (w) {
        case 'North America':
            return `${s} lived in ${w}`;
        case 'North America, Europe, Asia':
            return `${s} could be found in North America, Europe and Asia.`;
        case 'World Wide':
            return `${s} could be found all over the world.`;
    }
};

Dinos.prototype.period = function() {
    return `${this.species} lived during the ${this.when} period.`;
};


// function shuffle(array) {
//     array.sort(() => Math.random() - 0.5);
// }

function createGrid(human) { // human variable is accessible here
    const dinosaurs = (function createDinos() {
        let dinoArray = [];
        let possibleFacts = ['height', 'weight', 'diet', 'where', 'when'];

        for (d = 0; d < data.Dinos.length; d++) {
            let currentDino = new Dinos(data.Dinos[d]); // add RandomFact here

            currentDino.displayFact = (function() {
                if (currentDino.species === 'Pigeon') return currentDino.fact;
                if (Math.floor(Math.random() * 100) < 40) return currentDino.fact;
                let randomFact;
                let rando = Math.floor(Math.random() * possibleFacts.length);
                                
                switch (rando) {
                    case 0:
                        randomFact = currentDino.compareHeight(human.height);
                        break;
                    case 1:
                        randomFact = currentDino.compareWeight(human.weight);
                        break;
                    case 2:
                        randomFact = currentDino.compareDiet(human.diet);
                        break;
                    case 3:
                        randomFact = currentDino.geography();
                        break;
                    case 4:
                        randomFact = currentDino.period();
                        break;
                    default: 
                        randomFact = currentDino.fact;
                    }

                return randomFact;
                })();
                        
            dinoArray.push(currentDino);
        }
        dinosaurArray = dinoArray;
        
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
    img.setAttribute('src', `images/${(specimen.species).toLowerCase()}.png`);
    gridItem.appendChild(img);
    titleBox.classList.add('grid-text', 'name');
    titleBox.innerHTML = `<h2>${title}</h2>`;
    gridItem.appendChild(titleBox);
    if (specimen.species != 'human') {
        factBox.classList.add('grid-text', 'fact');
        factBox.innerHTML = `<h2>${specimen.displayFact}</h2>`
        gridItem.appendChild(factBox);
    }
}

document.getElementById('btn').addEventListener('click', btnClick);

function convertInches(i) {
    let feet = Math.floor(i / 12);
    let inches = i % 12;
    return `${(feet === 0) ? '' : feet + `'`}${(inches === 0) ? '' : inches + `"`}`;
}