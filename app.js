function convertInches(i) {
    let feet = Math.floor(i / 12);
    let inches = i % 12;
    return `${(feet === 0) ? '' : feet + `'`}${(inches === 0) ? '' : inches + `"`}`;
}

function createGridItem(specimen) {
    const title = (specimen.species === 'human') ? specimen.name : specimen.species;
    const grid = document.getElementById('grid');
    const gridItem = document.createElement('div');
    const img = document.createElement('img');
    const titleBox = document.createElement('div');
    const factBox = document.createElement('div');

    gridItem.classList.add('grid-item');
    img.setAttribute('src', `images/${(specimen.species).toLowerCase()}.png`);
    titleBox.classList.add('grid-text', 'name');
    titleBox.innerHTML = `<h2>${title}</h2>`;

    if (specimen.species != 'human') {
        factBox.classList.add('grid-text', 'fact');
        factBox.innerHTML = `<h2>${specimen.displayFact}</h2>`
        gridItem.appendChild(factBox);
    }
    gridItem.appendChild(img);
    gridItem.appendChild(titleBox);
    grid.appendChild(gridItem);
}

const btnClick = (() => { // IIFE declaration to return function for button click event listener
    let readyToSubmit; // initialize the readyToSubmit flag in the closure
    const inputIDs = (() => { // IIFE to return all inputIDs in an array
        const ids = []; // establish empty array to store input IDs
        document.querySelectorAll('input, select').forEach((x) => ids.push(x.id)); // populate ids array from DOM    
        return ids;
    })();
    const myForm = document.forms['dino-compare'];
    return function () { // return this function to the variable btnClick
        readyToSubmit = true; // assume form ok to submit unless this flag becomes false

        inputIDs.forEach((id) => { // loop to check form for invalid fields before submitting
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

Dinos.prototype.compareWeight = function (human) { // compare weight from argument to dino weight.
    const dino = this.weight;
    const species = this.species;
    if (human > dino) return `You outweigh ${species} by ${(human - dino).toLocaleString()} pounds.`;
    else if (human < dino) return `${species} is ${(dino - human).toLocaleString()} pounds heavier than you.`;
    else return `You and ${species} weigh exactly the same.`;
};

Dinos.prototype.compareHeight = function (human) {
    const dino = this.height;
    const species = this.species;
    if (human > dino) return `You are ${convertInches(human - dino)} taller than ${species}.`;
    else if (human < dino) return `${species} is ${convertInches(dino - human)} taller than you.`;
    else return `You are the same height as ${species}.`;
};

Dinos.prototype.compareDiet = function (diet) {
    const human = diet.toLowerCase();
    const dino = this.diet.toLowerCase();
    const species = this.species;
    if (human === dino) return `You and ${species} are both ${dino}s.`;
    else return `${species} is ${(dino[0] === 'c') ? 'a' : 'an'} ${dino}.`;
};

Dinos.prototype.geography = function () {
    const species = this.species;
    const where = this.where;
    switch (where) {
        case 'North America':
            return `${species} lived in ${where}`;
        case 'North America, Europe, Asia':
            return `${species} could be found in North America, Europe and Asia.`;
        case 'World Wide':
            return `${species} could be found all over the world.`;
    }
};

Dinos.prototype.period = function () {
    return `${this.species} lived during the ${this.when} period.`;
};

function createGrid(human) { // human variable is accessible here
    const dinosaurs = (() => {
        let dinoArray = [];
        let facts = ['height', 'weight', 'diet', 'where', 'when', 'fact', 'random'].sort(() => Math.random() - 0.5);
        for (d = 0; d < data.Dinos.length; d++) {
            let currentDino = new Dinos(data.Dinos[d]);
            currentDino.displayFact = (() => {
                if (currentDino.species === 'Pigeon') return currentDino.fact;
                let x = Math.floor(Math.random() * facts.length);
                switch (facts[(facts[d] === 'random') ? x : x = d]) {
                    case 'height':
                        return currentDino.compareHeight(human.height);
                    case 'weight':
                        return currentDino.compareWeight(human.weight);
                    case 'diet':
                        return currentDino.compareDiet(human.diet);
                    case 'where':
                        return currentDino.geography();
                    case 'when':
                        return currentDino.period();
                    case 'fact':
                        return currentDino.fact;
                    default:
                        return currentDino.fact;
                }
            })();
            dinoArray.push(currentDino);
        }
        return dinoArray.sort(() => Math.random() - 0.5);
    })();

    for (g = 0; g < dinosaurs.length; g++) {
        (g === 4) ? specimen = 'human': specimen = 'dinosaur'
        if (g === 4) {
            createGridItem(human);
            createGridItem(dinosaurs[g]);
        } else createGridItem(dinosaurs[g]);
    }
}

document.getElementById('btn').addEventListener('click', btnClick);