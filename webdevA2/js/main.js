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
const winAudio = new Audio ("audio/win_sfx.wav");
const correctAudio = new Audio ("audio/correct_sfx.wav");
let deviceType = "";
let initialX = 0, initialY = 0;
let currentElement = "";
let moveElement = false;

//Detect touch device
const isTouchDevice = () => {
    try {
        //We try to create Touch Event (It would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};
let count = 0;
//Random value from Array
const randomValueGenerator = () => {
    return data[Math.floor(Math.random() * data.length)];
};
//Win Game Display
const stopGame = () => {
    controls.classList.remove("hide");
    startButton.classList.remove("hide");
};
//Drag & Drop Functions
function dragStart(e) {
    if (isTouchDevice()) {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
        //Start movement for touch
        moveElement = true;
        currentElement = e.target;
    } else {
        //For non touch devices set data to be transfered
        e.dataTransfer.setData("text", e.target.id);
    }
}
//Events fired on the drop target
function dragOver(e) {
    e.preventDefault();
}
//For touchscreen movement
const touchMove = (e) => {
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
        e.preventDefault();

        initialX = newX;
        initialY = newY;
    }
};
const drop = (e) => {
    e.preventDefault();
    //For touch screen
    if (isTouchDevice()) {
        moveElement = false;
        //Select app name div using the custom attribute
        const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
        //Get boundaries of div
        const currentDropBound = currentDrop.getBoundingClientRect();
        //if the position of image falls inside the bounds of the app name
        if (
            initialX >= currentDropBound.left &&
            initialX <= currentDropBound.right &&
            initialY >= currentDropBound.top &&
            initialY <= currentDropBound.bottom
        ) {
            currentDrop.classList.add("dropped");
            //hide actual image
            currentElement.classList.add("hide");
            currentDrop.innerHTML = ``;
            //Insert new img element
            currentDrop.insertAdjacentHTML(
                "afterbegin",
                `<img src="images/${currentElement.id}.jpg">`
            );
            count += 1;
            correctAudio.play();
        }
    } else {
        //Access data
        const draggedElementData = e.dataTransfer.getData("text");
        //Get custom attribute value
        const droppableElementData = e.target.getAttribute("data-id");
        if (draggedElementData === droppableElementData) {
            const draggedElement = document.getElementById(draggedElementData);
            //dropped class
            e.target.classList.add("dropped");
            //hide current img
            draggedElement.classList.add("hide");
            //draggable set to false
            draggedElement.setAttribute("draggable", "false");
            e.target.innerHTML = ``;
            //insert new img
            e.target.insertAdjacentHTML(
                "afterbegin",
                `<img src="images/${draggedElementData}.jpg">`
            );
            count += 1;
            correctAudio.play();
        }
    }
    //Win
    if (count == 3) {
        result.innerText = `You Won!`;
        stopGame();
        winAudio.play();
    }
};
//Creates apps and names
const creator = () => {
    dragContainer.innerHTML = "";
    dropContainer.innerHTML = "";
    let randomData = [];
    //for string random values in array
    for (let i = 1; i <= 3; i++) {
        let randomValue = randomValueGenerator();
        if (!randomData.includes(randomValue)) {
            randomData.push(randomValue);
        } else {
            //If value already exists then decrement i by 1
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
    //Sort the array randomly before creating app divs
    randomData = randomData.sort(() => 0.5 - Math.random());
    for (let i of randomData) {
        const appDiv = document.createElement("div");
        appDiv.innerHTML = `<div class='apps' data-id='${i}'>
    ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>
    `;
        dropContainer.appendChild(appDiv);
    }
};
//Start Game
startButton.addEventListener(
    "click",
    (startGame = async () => {
        currentElement = "";
        controls.classList.add("hide");
        startButton.classList.add("hide");
        //This will wait for creator to create the images and then move forward
        await creator();
        count = 0;
        dropPoints = document.querySelectorAll(".apps");
        draggableObjects = document.querySelectorAll(".draggable-image");
        //Events
        draggableObjects.forEach((element) => {
            element.addEventListener("dragstart", dragStart);
            //for touch screen
            element.addEventListener("touchstart", dragStart);
            element.addEventListener("touchend", drop);
            element.addEventListener("touchmove", touchMove);
        });
        dropPoints.forEach((element) => {
            element.addEventListener("dragover", dragOver);
            element.addEventListener("drop", drop);
        });
    })
);

//select all subtopic pages
function hideall() { //function to hide all pages
    for (let onepage of allpages) { //go through all subtopic pages
        onepage.style.display = "none"; //hide it
    }
}
function show(pgno) { //function to show selected page no
    hideall();
    //select the page based on the parameter passed in
    let onepage = document.querySelector("#page" + pgno);
    onepage.style.display = "block"; //show the page
}
/*Listen for clicks on the buttons, assign anonymous
eventhandler functions to call show function*/
page1btn.addEventListener("click", function () {
    show(1);
});
page2btn.addEventListener("click", function () {
    show(2);
});
page3btn.addEventListener("click", function () {
    show(3);
});
page4btn.addEventListener("click", function () {
    show(4);
});
page5btn.addEventListener("click", function () {
    show(5);
});
page6btn.addEventListener("click", function () {
    show(6);
});
hideall();
show(1);

menuOpenButton.addEventListener("click", () => {
    //Toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");
});

//Close the menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

// Timed fade-in of hero image
window.addEventListener("load", () => {
  setTimeout(() => {
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
      heroImage.classList.add("fade-in");
    }
  }, 1000); // 2-second delay
});
