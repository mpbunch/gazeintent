// edited copy of mb_utils 
// for client test grid, cells and symbols
// work in progress, much yet to do

export class doGazeTest {
    constructor(...grid) {
        this.grid = grid
    }

    #makeGrid = (gridSize, type = 'test') => {
        console.log('Make Grid');
        console.log('Grid Size: ' + gridSize);
        const grid = document.querySelector('#gazeGrid');

        if (grid) {
            for (let i = 1; i <= gridSize; ++i) {
                this.element = document.createElement('div');
                this.element.className = 'gazeCell';
                this.element.id = i;

                if (type === 'calibrate') {
                    console.log('calibration')

                    this.center_element = document.createElement('button');
                    this.center_element.className = 'gazeCellCalibrate btn btn-primary btn-sm';
                    this.center_element.innerHTML = '<i class="bi bi-check-lg"></i>';
                    this.center_element.id = `cell-btn-${i}`;
                    this.center_element.disabled = true;

                    this.center_element.addEventListener('click', () => {
                        console.log('Click');
                        console.log(document.getElementById(`cell-btn-${i}`), i)
                        let btn = document.getElementById(`cell-btn-${i}`);
                        btn.setAttribute('style', 'background-color:red;')
                    });
                }

                if (type === 'test') {
                    console.log('type: test')

                    this.center_element = document.createElement('button');
                    this.center_element.className = 'gazeCellTest';
                    this.center_element.id = `gazeCellTest-${i}`;

                    this.center_element.addEventListener('click', () => {
                        console.log('Click');
                        console.log(document.getElementById(`gazeCellTest-${i}`), i)
                        let div = document.getElementById(`gazeCellTest-${i}`);
                        div.setAttribute('style', 'background-color:orange;')
                    });
                }

                this.element.append(this.center_element);
                grid.appendChild(this.element);
            }
        } else {
            console.log('No div with id gazeGrid found.')
        }
    }

    loading = (waiting = true) => {
        // wait for webgazer to fully load
        if (waiting) {
            console.log('loading')
            const grid = document.querySelector('#gazeGrid');
            let loading = document.createElement('div');
            loading.id = 'webgazerLoading';
            loading.innerHTML = '<div id="webgazerLoading"><div class="spinner-box"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>';
            grid.append(loading);
        } else {
            console.log('not loading --1')
            let loading = document.getElementById('webgazerLoading');
            if (loading) loading.remove()
        }
    }

    
    calibrate = (gridSize = 9) => {
        console.log('Calibration');
        var helpers = {}
        // Make calibration Grid
        if (gridSize) this.#makeGrid(gridSize);
        let accuracy = document.createElement('div');
        accuracy.id = 'accuracy'
        document.getElementById('gazeGrid').parentElement.append(accuracy)
        // Define calibration start function
        const start = (cellId = 1) => {
            helpers.advance(cellId);
            console.log('Calibration Start');
        };

        // Define calibration stop funciton
        const end = () => {
            console.log('Calibration Stop');
        };

        helpers.compare = (target, tracker) => {

        }

        // Define calibration advance function
        helpers.advance = (cellId) => {
            console.log('ADVANCE')
            let elements = document.getElementsByClassName('gazeCell');
            Array.from(elements).forEach(element => {
                let button = element.getElementsByTagName('button')[0];
                button.disabled = true;
                if (element.id == cellId) button.disabled = false;
            });
        }

        return { start: start, end: end }
    }

    test = (gridSize = 9) => {
        console.log('test');
        var helpers = {}
        // Make calibration Grid
        if (gridSize) this.#makeGrid(gridSize);
        let accuracy = document.createElement('div');
        accuracy.id = 'accuracy'
        document.getElementById('gazeGrid').parentElement.append(accuracy)
        // Define calibration start function
        const start = (cellId = 1) => {
            helpers.advance(cellId);
            console.log('##############TEST Start');
        };

        // Define calibration stop funciton
        const end = () => {
            console.log('#############TEST Stop');
        };

        helpers.compare = (target, tracker) => {

        }

        // Define calibration advance function
        helpers.advance = (cellId) => {
            console.log('ADVANCE')
            let elements = document.getElementsByClassName('gazeCell');
            Array.from(elements).forEach(element => {
                let button = element.getElementsByTagName('button')[0];
                button.disabled = true;
                if (element.id == cellId) button.disabled = false;
            });
        }

        return { start: start, end: end }
    }
};