
// Create grid using gazeCell
import { gazeCell } from "./util.js";

(function () {
    const grid = document.querySelector('#gazeGrid');
    for (let i = 1; i < 10; ++i) {
        const cell = new gazeCell(i);
        grid.appendChild(cell.element)
    }
})(gazeCell);


// Get a random cell id
var min = 1
var max = 9
var randomCell = Math.floor(Math.random() * (max - min + 1) + min);
console.log('randomCell-----------------> ' + randomCell);

// Create svg element in the selected cell
var svg = document.createElementNS('svg', 'svg');
svg.setAttribute('id', 'stimCell');
document.getElementById(randomCell).appendChild(svg);


// Add symbol to the selected cell
document.getElementById(randomCell).style.backgroundColor = 'green';

d3.select("#stimCell")
    .append("path")
    .attr("d", d3.symbol().type("diamond"));
