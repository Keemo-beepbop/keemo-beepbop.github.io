// --- Variable declarations remain unchanged ---

const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page4btn = document.querySelector("#page4btn");
const page5btn = document.querySelector("#page5btn");
const page6btn = document.querySelector("#page6btn");
var allpages = document.querySelectorAll(".page");

const menuOpenButton = document.querySelector('.button-open');
const menuCloseButton = document.querySelector('.button-close');

let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = ["unity", "unreal", "blender", "visualstudio", "godot", "construct"];
const winAudio = new Audio("audio/win_sfx.wav");
const correctAudio = new Audio("audio/correct_sfx.wav");
let deviceType = "";
let initialX = 0, initialY = 0;
let currentElement = "";
let moveElement = false;

// Detect touch device
function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
}

let count = 0;

// Random value from array
function randomValueGenerator() {
    return data[Math.floor(Math.random() * data.length)];
}

// Win game display
function stopGame() {
    controls.classList.remove("hide");
    startButton.classList.remove("hide");
}

// Drag & Drop Functions
function dragStart(e) {
    if (isTouchDevice()) {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
        moveElement = true;
        currentElement = e.target;
    } else {
        e.dataTransfer.setData("text", e.target.id);
    }
}

function dragOver(e) {
    e.preventDefault();
}

// Touch move for drag
function touchMove(e) {
    if (moveElement) {
        e.preventDefault();
        let newX = e.touches[0].clientX;
        let newY = e.touches[0].clientY;
        const touch = e.touches[0];
        let currentSelectedElement = document.getElementById(e.target.id);
        currentSelectedElement.style.position = 'fixed';
        currentSelectedElement.style.left = (touch.clientX - currentSelectedElement.offsetWidth / 2) + "px";
        currentSelectedElement.style.top = (touch.clientY - currentSelectedElement.offsetHeight / 2) + "px";
        currentSelectedElement.style.zIndex = 9999;

        initialX = newX;
        initialY = newY;
    }
}

function drop(e) {
    e.preventDefault();

    if (isTouchDevice()) {
        moveElement = false;
        const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
        const currentDropBound = currentDrop.getBoundingClientRect();

        if (
            initialX >= currentDropBound.left &&
            initialX <= currentDropBound.right &&
            initialY >= currentDropBound.top &&
            initialY <= currentDropBound.bottom
        ) {
            currentDrop.classList.add("dropped");
            currentElement.classList.add("hide");
            currentDrop.innerHTML = ``;
            currentDrop.insertAdjacentHTML("afterbegin", `<img src="images/${currentElement.id}.jpg">`);
            // if we dont use backticks //
            // currentDrop.insertAdjacentHTML("afterbegin", "<img src='images/" + currentElement.id + ".jpg'>");
            count += 1;
            correctAudio.play();
        }
    } else {
        const draggedElementData = e.dataTransfer.getData("text");
        const droppableElementData = e.target.getAttribute("data-id");

        if (draggedElementData === droppableElementData) {
            const draggedElement = document.getElementById(draggedElementData);
            e.target.classList.add("dropped");
            draggedElement.classList.add("hide");
            draggedElement.setAttribute("draggable", "false");
            e.target.innerHTML = ``;
            e.target.insertAdjacentHTML("afterbegin", `<img src="images/${draggedElementData}.jpg">`);
            count += 1;
            correctAudio.play();
        }
    }

    if (count == 3) {
        result.innerText = `You Won!`;
        stopGame();
        winAudio.play();
    }
}

// Create draggable and droppable items
function creator() {
    dragContainer.innerHTML = "";
    dropContainer.innerHTML = "";
    let randomData = [];

    for (let i = 1; i <= 3; i++) {
        let randomValue = randomValueGenerator();
        if (!randomData.includes(randomValue)) {
            randomData.push(randomValue);
        } else {
            i -= 1;
        }
    }

    for (let i of randomData) {
        const appDiv = document.createElement("div");
        appDiv.classList.add("draggable-image");
        appDiv.setAttribute("draggable", true);
        if (isTouchDevice()) {
            appDiv.style.position = "absolute";
        }
        appDiv.innerHTML = `<img src="images/${i}.jpg" id="${i}">`;
        dragContainer.appendChild(appDiv);
    }

    randomData = randomData.sort(function () {
        return 0.5 - Math.random();
    });

    for (let i of randomData) {
        const appDiv = document.createElement("div");
        appDiv.innerHTML = `<div class='apps' data-id='${i}'>
            ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
        </div>`;
        dropContainer.appendChild(appDiv);
    }
}

// Start game logic
startButton.addEventListener("click", function startGame() {
    currentElement = "";
    controls.classList.add("hide");
    startButton.classList.add("hide");

    creator(); // No .then() needed here

    count = 0;
    dropPoints = document.querySelectorAll(".apps");
    draggableObjects = document.querySelectorAll(".draggable-image");

    draggableObjects.forEach(function (element) {
        element.addEventListener("dragstart", dragStart);
        element.addEventListener("touchstart", dragStart);
        element.addEventListener("touchend", drop);
        element.addEventListener("touchmove", touchMove);
    });

    dropPoints.forEach(function (element) {
        element.addEventListener("dragover", dragOver);
        element.addEventListener("drop", drop);
    });
});

// --- Page Navigation ---
function hideall() {
    for (let onepage of allpages) {
        onepage.style.display = "none";
    }
}

function show(pgno) {
    hideall();
    let onepage = document.querySelector("#page" + pgno);
    onepage.style.display = "block";
}

page1btn.addEventListener("click", function () { show(1); });
page2btn.addEventListener("click", function () { show(2); });
page3btn.addEventListener("click", function () { show(3); });
page4btn.addEventListener("click", function () { show(4); });
page5btn.addEventListener("click", function () { show(5); });
page6btn.addEventListener("click", function () { show(6); });

hideall();
show(1);

// --- Mobile Menu ---
menuOpenButton.addEventListener("click", function () {
    document.body.classList.toggle("show-mobile-menu");
});

menuCloseButton.addEventListener("click", function () {
    menuOpenButton.click();
});

// --- Hero image fade-in on load ---
window.addEventListener("load", function () {
    setTimeout(function () {
        const heroImage = document.querySelector(".hero-image");
        if (heroImage) {
            heroImage.classList.add("fade-in");
        }
    }, 1000);
});
