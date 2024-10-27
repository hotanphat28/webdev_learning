var parent = document.querySelector(".parent");

function removeDirection(){
    parent.classList.remove("flex-column");
    parent.classList.remove("flex-reverse-column");
    parent.classList.remove("flex-reverse-row");
};

document.querySelector(".d-row-reverse").onclick = function() {
    removeDirection();
    parent.classList.add("flex-reverse-row");
};

document.querySelector(".d-col").onclick = function() {
    removeDirection();
    parent.classList.add("flex-column");
};

document.querySelector(".d-col-reverse").onclick = function() {
    removeDirection();
    parent.classList.add("flex-reverse-column");
};

function removeJustify(){
    parent.classList.remove("justify-start");
    parent.classList.remove("justify-around");
    parent.classList.remove("justify-between");
    parent.classList.remove("justify-evenly");
    parent.classList.remove("justify-center");
    parent.classList.remove("justify-end");
};

document.querySelector(".j-start").onclick = function() {
    removeJustify();
    parent.classList.add("justify-start");
};

document.querySelector(".j-around").onclick = function() {
    removeJustify();
    parent.classList.add("justify-around");
};

document.querySelector(".j-between").onclick = function() {
    removeJustify();
    parent.classList.add("justify-between");
};

document.querySelector(".j-evenly").onclick = function() {
    removeJustify();
    parent.classList.add("justify-evenly");
};

document.querySelector(".j-center").onclick = function() {
    removeJustify();
    parent.classList.add("justify-center");
};

document.querySelector(".j-end").onclick = function() {
    removeJustify();
    parent.classList.add("justify-end");
};

function removeAlign(){
    parent.classList.remove("align-start");
    parent.classList.remove("align-center");
    parent.classList.remove("align-end");
};

document.querySelector(".a-start").onclick = function() {
    removeAlign();
    parent.classList.add("align-start");
};

document.querySelector(".a-center").onclick = function() {
    removeAlign();
    parent.classList.add("align-center");
};

document.querySelector(".a-end").onclick = function() {
    removeAlign();
    parent.classList.add("align-end");
};