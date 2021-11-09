import { gazeCell, calibrateAdvance } from "./util.js";

(function () {
    const grid = document.querySelector('#gazeGrid');
    for (let i = 1; i < 10; ++i) {
        const cell = new gazeCell(i);
        grid.appendChild(cell.element)
    }
    // Do this when you are ready to start the calibration
    // Should connect this to the 'start calibration' button
    calibrateAdvance(1)
})(gazeCell, calibrateAdvance);