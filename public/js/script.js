
// !VEHICLE CLASS

class Vehicle {
    // *- Public property: name.
    constructor(name, dailyPrice) {
        this.name = name;
        this.#dailyPrice = dailyPrice;
        this.#isAvailable = true;
    }

    //! Private fields: #dailyPrice, #isAvailable.
    #dailyPrice;
    #isAvailable;

    // *getPrice() and setPrice(value) → accept only positive prices.
    getPrice() {
        return this.#dailyPrice;
    }

    setPrice(value) {
        if (value > 0) {
            this.#dailyPrice = value;
        }
    }

    getAvailability() {
        return this.#isAvailable;
    }

    // *دالة rent() ← ترفض العملية إذا كانت المركبة مستأجرة بالفعل.
    rent() {
        if (!this.#isAvailable) {
            return "Vehicle is already rented.";
        }

        this.#isAvailable = false;
        return "Vehicle rented successfully.";
    }

    // *دالة returnVehicle() ← ترفض العملية إذا كانت المركبة متاحة بالفعل.
    returnVehicle() {
        if (this.#isAvailable) {
            return "Vehicle is already available.";
        }

        this.#isAvailable = true;
        return "Vehicle returned successfully.";
    }

    calculateCost(days) {
        if (!Number.isInteger(days) || days <= 0) {
            return "Invalid number of days.";
        }

        return this.#dailyPrice * days;
    }
}

// Create children using extends and super():
// Class    Extra property    Cost calculation
// Car    hasAC = true    Price × days + 100 MAD
// Motorcycle    helmetIncluded = true    Price × days + 30 MAD
// Bicycle    isElectric = false    Price × days
// !CAR CLASS

class Car extends Vehicle {

    constructor(name, dailyPrice) {
        super(name, dailyPrice);
        this.hasAC = true;
    }
    calculateCost(days) {
        return super.calculateCost(days) + 100;
    }
}

// !MOTORCYCLE CLASS
class Motorcycle extends Vehicle {

    constructor(name, dailyPrice) {
        super(name, dailyPrice);
        this.helmetIncluded = true;
    }
    calculateCost(days) {
        return super.calculateCost(days) + 30;
    }
}

// !BICYCLE CLASS
class Bicycle extends Vehicle {

    constructor(name, dailyPrice) {
        super(name, dailyPrice);
        this.isElectric = false;
    }
    calculateCost(days) {
        return super.calculateCost(days);
    }
}
// !CONSOLE
const car = new Car("Peugeot", 250);
const motorcycle = new Motorcycle("Yamaha", 150);
const bicycle = new Bicycle("Btwin", 80);
console.log(car.name);
console.log(car.getPrice());
console.log(car.getAvailability());
console.log(car.calculateCost(3));

console.log(motorcycle.name);
console.log(motorcycle.getPrice());
console.log(motorcycle.getAvailability());
console.log(motorcycle.calculateCost(3));

console.log(bicycle.name);
console.log(bicycle.getPrice());
console.log(bicycle.getAvailability());
console.log(bicycle.calculateCost(3));

console.log(car.rent());
console.log(car.getAvailability());

console.log(car.returnVehicle());
console.log(car.getAvailability());

// !FORM
const vehicleForm = document.querySelector('#vehicleForm');
const vehicleName = document.querySelector('#vehicleName');
const vehicleType = document.querySelector('#vehicleType');
const dailyPrice = document.querySelector('#dailyPrice');
const vehiclesContainer = document.querySelector('#vehiclesContainer')
const vehicles = [];



vehicleForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = vehicleName.value.trim();
    const type = vehicleType.value;
    const price = Number(dailyPrice.value);


    if (name === "" || type === "" || price <= 0) {

        return;
    }
    if (type === "Car") {

        const car = new Car(name, price);
        vehicles.push(car);

    } else if (type === "Motorcycle") {

        const motorcycle = new Motorcycle(name, price);
        vehicles.push(motorcycle);

    } else if (type === "Bicycle") {

        const bicycle = new Bicycle(name, price);
        vehicles.push(bicycle);
    }
    renderVehicles();
});

// !RENDER VEHICLES
function renderVehicles() { 
    vehiclesContainer.innerHTML = ""; 

    for (let i = 0; i < vehicles.length; i++) { 
        const vehicle = vehicles[i]; 
        vehiclesContainer.innerHTML += ` 
            <div class="vehicle-card"> 
                <h3>${vehicle.name}</h3> 
                <p>${vehicle.constructor.name}</p> 
                <p>${vehicle.getPrice()} MAD / day</p> 
                <p class="vehicle-availability">${vehicle.getAvailability() ? "Available" : "Rented"}</p> 
                <input type="number" class="rental-days" placeholder="Rental days"> 
                <button class="rent-button" onclick="rentVehicle(${i})">Rent</button> 
                <button class="return-button" onclick="returnVehicle(${i})">Return</button> 
                <button class="estimate-button" onclick="estimateCost(${i})">Estimate cost</button> 
                <button class="remove-button" onclick="removeVehicle(${i})">Remove</button> 
                <p class="vehicle-message"></p>
            </div> `; 
    } 
}

function returnVehicle(index) {
    const vehicle = vehicles[index];
    const result = vehicle.returnVehicle();
    console.log(result);
    renderVehicles();
    updateCounters();
}


function estimateCost(index) {

    const vehicle = vehicles[index];
    const inputs = document.querySelectorAll('.rental-days');
    const cards = document.querySelectorAll('.vehicle-card');
    const days = Number(inputs[index].value);
    const result = vehicle.calculateCost(days);
    cards[index].querySelector('.vehicle-message').textContent =
        typeof result === "number" ? `Estimated cost: ${result} MAD` : result;
}


function removeVehicle(index) {

    const vehicle = vehicles[index];

    if (!vehicle.getAvailability()) {
        console.log("Cannot remove a rented vehicle.");
        return;
    }
    vehicles.splice(index, 1);
    renderVehicles();
    updateCounters();
}


function updateCounters() {

    const totalVehicles = document.querySelector('#totalVehicles');
    const availableVehicles = document.querySelector('#availableVehicles');
    const rentedVehicles = document.querySelector('#rentedVehicles');
    const fleetCount = document.querySelector('.count');

    totalVehicles.textContent = vehicles.length;
    let available = 0;

    for (let i = 0; i < vehicles.length; i++) {
        if (vehicles[i].getAvailability()) {
            available++;
        }
    }

    availableVehicles.textContent = available;
    rentedVehicles.textContent = vehicles.length - available;
    fleetCount.textContent = vehicles.length;
}
function rentVehicle(index) {
    const vehicle = vehicles[index];
    const cards = document.querySelectorAll('.vehicle-card');
    const message = cards[index].querySelector('.vehicle-message');
    const availability = cards[index].querySelector('.vehicle-availability');

    message.textContent = vehicle.rent();
    availability.textContent = vehicle.getAvailability() ? "Available" : "Rented";
    updateCounters();
}