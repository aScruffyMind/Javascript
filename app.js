// This function coverts inches into a feet-and-inches string, to look pretty on the grid.
function convertInches(i) {
    let feet = Math.floor(i / 12);
    let inches = i % 12;
    return `${(feet === 0) ? '' : feet + `'`}${(inches === 0) ? '' : inches + `"`}`;
}

/* This function creates each item to display on the grid.
 * It takes in each object as a 'specimen', creates a div containing
 * an image, a title, and a fact box, and then places it into the DOM.
 */
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

/* If the specimen is not human (ie, dinosaur), then create the fact box.
 * This bypasses the fact box on the human tile.
 */
    if (specimen.species != 'human') {
        factBox.classList.add('grid-text', 'fact');
        factBox.innerHTML = `<h2>${specimen.displayFact}</h2>`
        gridItem.appendChild(factBox);
    }
    gridItem.appendChild(img);
    gridItem.appendChild(titleBox);
    grid.appendChild(gridItem);
}

/* The button click function.
 * This function is created by an IIFE to capture readyToSubmit, inputIDs, and myForm variables
 * in a closure. readyToSubmit is a boolean that flags false if there is a problem with the form.
 * If readyToSubmit is true after the fields are deemed valid then the code proceeds to create the grid.
 */
const btnClick = (() => { 
    let readyToSubmit;
    const inputIDs = (() => { 
        const ids = []; 
        document.querySelectorAll('input, select').forEach((x) => ids.push(x.id));
        return ids;
    })();
    const myForm = document.forms['dino-compare'];
    return function () {
        readyToSubmit = true; 

        /* Validation loop for the form fields.
         * Loops over each input field to check if it is blank but required.
         * If a blank required field is found, add a field-error class to it which turns the
         * border red to indicate it needs attention before proceeding.  At this time it will also
         * flip the readyToSubmit flag to false so we don't proceed to grid creation yet.
         * 
         * In the else if statement, I'm checking to see if the field has the field-error class, and if
         * it does then remove it.
         */
        inputIDs.forEach((id) => { 
            const item = document.getElementById(id);
            const required = item.hasAttribute('required');
            if (item.value === '' && required == true) { 
                item.classList.add('field-error');
                readyToSubmit = false;
            } else if (item.classList.contains('field-error')) item.classList.remove('field-error');
        });

        /* Ready to submit!
         * If the code is ready to submit then we pack the fields into variables to pass to the
         * Human constructor function. Once the new human is created we remove the form from the DOM and
         * pass the human into the createGrid function.
         */
        if (readyToSubmit) { 
            const name = myForm.name.value;
            const feet = Number(myForm.feet.value);
            const inches = Number(myForm.inches.value);
            const weight = Number(myForm.weight.value);
            const diet = myForm.diet.value;
            human = new Human(name, feet, inches, weight, diet);
            document.getElementById('dino-compare').remove(); 
            createGrid(human); 
        };
    };
})();

/* Human constructor function.
 * This constructor function creates the new Human object based off the fields
 * populated in the form. It does not store feet and inches separately, but rather
 * converts it all into inches and stored as 'height'. This will later be converted
 * into a feet-and-inches string when it is displayed on the grid.
 */
function Human(name, feet, inches, weight, diet) {
    this.species = 'human';
    this.name = name;
    this.height = (function () {
        return feet * 12 + inches;
    })();
    this.weight = weight;
    this.diet = diet.toLowerCase();
}

/* Dino constructor function
 * This constructor creates an object for each dino stored in the JSON file.
 */
function Dinos(d) { // units are lbs and inches
    this.species = d.species;
    this.weight = d.weight;
    this.height = d.height;
    this.diet = d.diet;
    this.where = d.where;
    this.when = d.when;
    this.fact = d.fact;
}

/* Dino method #1 - Compare weight
 * This method compares the dinos weight to the human.
 * If the human is heavier than the dinosaur then display one string, and if
 * the dino is heavier then display another. If neither is heavier, display a
 * string that the human & dinosaur are the same weight (seems like a very unlikely scenario!)
 */
Dinos.prototype.compareWeight = function (human) { 
    const dino = this.weight;
    const species = this.species;
    if (human > dino) return `You outweigh ${species} by ${(human - dino).toLocaleString()} pounds.`;
    else if (human < dino) return `${species} is ${(dino - human).toLocaleString()} pounds heavier than you.`;
    else return `You and ${species} weigh exactly the same.`;
};

/* Dino method #2 - Compare height
 * Similar to the last method, this analyzes whether the human or the dinosaur is
 * taller and displays the corresponding text.  If neither is taller then the text displays
 * that human and dino are the same height.
 */
Dinos.prototype.compareHeight = function (human) {
    const dino = this.height;
    const species = this.species;
    if (human > dino) return `You are ${convertInches(human - dino)} taller than ${species}.`;
    else if (human < dino) return `${species} is ${convertInches(dino - human)} taller than you.`;
    else return `You are the same height as ${species}.`;
};

/* Dino method #3 - Compare diet
 * If the human and dinosaur share the same diet, then display text that says so.
 * If they do not share the same diet, then only show the dinosaurs diet.
 */
Dinos.prototype.compareDiet = function (diet) {
    const human = diet.toLowerCase();
    const dino = this.diet.toLowerCase();
    const species = this.species;
    if (human === dino) return `You and ${species} are both ${dino}s.`;
    else return `${species} is ${(dino[0] === 'c') ? 'a' : 'an'} ${dino}.`;
};

/* Dino method #4 - Where was the dinosaur from?
 * This method generates a string to display where the dinosaur was
 * located geographically. Since there were only 3 possible options,
 * the strings are contained within a switch statement with only the
 * three very specific options.  If none of the locations matches,
 * then just display something vague.
 */
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
        default: 
            return `${species} was located on planet Earth.`;
    }
};

/* Dino method #4 - Where was the dinosaur from?
 * This method displays what period of time the dinosaur lived in.
 */
Dinos.prototype.period = function () {
    return `${this.species} lived during the ${this.when} period.`;
};


/* Creating the grid! 
 * With the form filled out, and the human and dinosaur objects all created,
 * it's time to build the grid! This function first creates the elements for
 * a refresh button to be located beneath the grid.  Next it defines the
 * dinosaurs array with an IIFE; in this process, it creates a 'facts' array
 * and shuffles the values (randomizing which fact is displayed).  I chose to randomize
 * the facts this way because each fact-type will be displayed on every grid, and one
 * will be duplicated randomly. When displaying truly random facts, there was a lot
 * of duplication and some facts were rarely presented.
 */
function createGrid(human) {
    const button = document.createElement('button');
    const footer = document.querySelector('footer');
    button.innerHTML = `Go again, ${human.name}!`;
    button.classList.add('refresh');
    const dinosaurs = (() => {
        let dinoArray = [];
        let facts = ['height', 'weight', 'diet', 'where', 'when', 'fact', 'random'].sort(() => Math.random() - 0.5);
        
        /*  * Next we loop thru the dinosaurs.  First the code checks if the dino is the pigeon, 
         * and if so then we will only display the hard-coded fact that all birds are dinosaurs.
         * If it is not the pigeon then we create a random number that will be used to select the
         * 7th fact from the list. The switch statement then executes the method based on which fact
         * was pulled from the array.  This is stored in the object as displayFact - which will be
         * the fact that is displayed on that dinos tile. That dino is then packaged into the dinoArray
         * and we move on to the next one.
        */
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
        /* Now we return the new dinoArray (sorted at random) to the dinosaurs variable */ 
        return dinoArray.sort(() => Math.random() - 0.5);
    })();

    /* Create the grid!
     * Loop thru each object in the dinosaurs array and create it's grid item. On the 5th loop
     * we slip the human into the 5th tile and the next dino into the 6th.
     */
    for (g = 0; g < dinosaurs.length; g++) {
        (g === 4) ? specimen = 'human': specimen = 'dinosaur';
        if (g === 4) {
            createGridItem(human);
            createGridItem(dinosaurs[g]);
        } else createGridItem(dinosaurs[g]);
    }

    /* Add the refresh button
     * The next two lines insert the refresh button (variables declared at the beginning of 
     * this function) into the DOM and attach the event listener.  When the button is clicked,
     * the page is simply reloaded.
    */
    footer.parentNode.insertBefore(button, footer);
    document.querySelector('.refresh').addEventListener('click', () => location.reload());
}

/* The submit button listener.
 * This event listener keeps an ear on the submit form button, and when clicked it 
 * executes the btnClick function and sets everything into motion!
 */
document.getElementById('btn').addEventListener('click', btnClick);
