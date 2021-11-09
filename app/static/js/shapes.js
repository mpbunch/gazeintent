
// get the canvas client dimensions
// get a random xy position within client dimension range
// random pick a shape
// random pick a colour
// append the shape to the position
// do math stuff and figure out which quadrant of the canvas it is in

// next to do: auto shape add/clear timer thing, routing, bootstrap layout, use d3 symbols.


// create svg element:
var svg = d3.select("#svgCanvas").append("svg");

// get current dimensions of div
var clientDivX = document.getElementById('container').clientWidth;
var clientDivY = document.getElementById('container').clientHeight;

console.log(clientDivX);
console.log(clientDivY);

// Get random X and Y values within range of div size
var randomX = function(d) {
    return Math.random() * clientDivX; // needs to be range?
}
var randomY = function(d) {
    return Math.random() * clientDivY; // needs to be range?
}

console.log(randomX());
console.log(randomY());

// Shapes list
var shapes = [
    "circle",
    "square",
    "rectangle"
]

// Color list
var colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet"
]

// get a random shape
var randomShape = shapes[Math.floor(Math.random() * shapes.length)];
console.log(randomShape);

// get a random colour
var randomColor = colors[Math.floor(Math.random() * colors.length)];
console.log(randomColor);

// Add the shape using the randomized positions, shape and color variables
//  Update to use svg symbols

if (randomShape === "square") {
    svg.append('rect')
        .attr('x', randomX)
        .attr('y', randomY)
        .attr('width', 20)
        .attr('height', 20)
        .attr('stroke', 'black')
        .attr('fill', randomColor);
} else if (randomShape === "circle") {
    svg.append('circle')
        .attr('cx', randomX)
        .attr('cy', randomY)
        .attr('r', 10)
        .attr('stroke', 'black')
        .attr('fill', randomColor);
} else if (randomShape === "rectangle") {
    svg.append('rect')
    .attr('x', randomX)
    .attr('y', randomY)
    .attr('width', 10)
    .attr('height', 30)
    .attr('stroke', 'black')
    .attr('fill', randomColor);
};
