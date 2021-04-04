let dinosaurArray = []; // remove before turning in

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
    this.diet = diet.toLowerCase();
}

// Constructor function to create the dinosaurs
function Dinos(specimen) { // units are lbs and inches
    this.species = specimen.species;
    this.weight = specimen.weight;
    this.height = specimen.height;
    this.diet = specimen.diet;
    this.where = specimen.where;
    this.when = specimen.when;
    this.fact = specimen.fact;
}

Dinos.prototype.compareWeight = function (weight) { // compare weight in argument to dino weight.
    if (weight > this.weight) {
        return `You outweigh a ${this.species} by ${(weight - this.weight).toLocaleString()} pounds.`;
    } else if (weight < this.weight) {
        return `A ${this.species} is ${(this.weight - weight).toLocaleString()} pounds heavier than you.`;
    } else {
        return `You and a ${this.species} weigh exactly the same.`;
    }
};

Dinos.prototype.compareHeight = function (height) {
    if (height > this.height) { // Execute if human is taller than dinosaur
        return `You are ${convertInches(height - this.height)} taller than a ${this.species}!`;
    } else if (height < this.height) { // Execute if dinosaur is taller than human
        return `A ${this.species} is ${convertInches(this.height - height)} taller than you!`;
    } else { // execute if neither human nor dinosaur is taller
        return `You are the same height as a ${this.species}.`;
    }
};

Dinos.prototype.compareDiet = function(diet) {
    const humanDiet = diet.toLowerCase();
    const dinoDiet = this.diet.toLowerCase();
    if (humanDiet === dinoDiet) {
        return `You and ${this.species} are both ${dinoDiet}s.`
    } else {
        return `${this.species} is ${(dinoDiet[0] === 'c') ? 'a' : 'an'} ${dinoDiet}.`;
    }
};

Dinos.prototype.geography = function() {
    switch (this.where) {
        case 'North America':
            return `${this.species} lived in ${this.where}`;
            break;
        case 'North America, Europe, Asia':
            return `${this.species} could be found in North America, Europe and Asia.`;
            break;
        case 'World Wide':
            return `${this.species} could be found all over the world.`;
            break;
    }
};

Dinos.prototype.period = function() {
    return `${this.species} lived during the ${this.when} period.`;
};


function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

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
            
            // console.log(`The random fact for ${currentDino.species} is ${currentDino.randomFact}`);
            
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
    img.setAttribute('src', `images/${specimen.species}.png`);
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