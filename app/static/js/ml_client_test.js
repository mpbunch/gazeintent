export class gridBuilder {
    makeGrid = (cells = 9, type = 'test', div = 'gazeGrid') => {
        const grid = document.querySelector(`#${div}`);
        if (!grid) return

        // create each cell/zone
        for (let i = 1; i <= cells; ++i) {
            this.element = document.createElement('div');
            this.element.className = 'gaze-cell';
            this.element.id = `gaze-${i}`;
            this.element.dataset.cell = i;
            this.element.dataset.gazed = 0;
            this.element.dataset.position = '0,0,0,0';
            grid.appendChild(this.element);
        }

        let gridCells = document.querySelectorAll('.gaze-cell')
        Array.from(gridCells).map(elem => {
            let position = this.get_position(elem);
            elem.dataset.position = position
        })
    }

    test = (grid_cells = 9, div = 'gazeGrid', actual_gaze = false) => {
        if (!actual_gaze) return
        // get active calibartion cell
        let active_cell = document.querySelector(`.active-cell`);
        if (!active_cell) return
        if (active_cell.id == 'gaze-1') active_cell.dataset.start = Date.now();
        let position = active_cell.dataset.position.split(',');
        let cell_position = [position[0], position[1], [position[2], position[3]]];

        let size = 3;
        let gaze_position = [[actual_gaze.x, size], [actual_gaze.y, size]];
        let hit = this.collision(cell_position, gaze_position);
        // if gaze hits active cell
        // add dataset.gazed += 1
        // if dataset.gazed == 5
        // advance to next cell
        let threshold = 8;
        let active_cell_gazed = parseInt(active_cell.dataset.gazed);
        let rect = active_cell.getBoundingClientRect();
        let x = rect.x + active_cell.offsetWidth / 2;
        let y = rect.y + active_cell.offsetHeight / 2;
        let clicker = document.querySelector('#clicker');
        clicker.setAttribute('style', `left: ${x}px; top: ${y}px`)
        if (hit && active_cell_gazed < threshold) {
            // calibration is working
            active_cell.dataset.gazed = active_cell_gazed ? active_cell_gazed + 1 : 1
            // click
            // document.elementFromPoint(x, y).click();
            clicker.click();
        }
    }

    reset = () => {
        webgazer.clearData();
    }


    sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    collision = (p1, p2) => {
        let r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    get_position = (elem) => {
        let pos, width, height;
        pos = elem.getBoundingClientRect();
        width = elem.offsetWidth / 2;
        height = elem.offsetHeight;
        return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
    }

    loading = (waiting = true, div = 'gazeGrid') => {
        // wait for webgazer to fully load
        if (waiting) {
            const grid = document.querySelector(`#${div}`);
            let loading = document.createElement('div');
            loading.id = 'webgazerLoading';
            loading.innerHTML = '<div id="webgazerLoading"><div class="spinner-box"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>';
            grid.append(loading);
        } else {
            let loading = document.getElementById('webgazerLoading');
            if (loading) loading.remove()
        }
    }
}
