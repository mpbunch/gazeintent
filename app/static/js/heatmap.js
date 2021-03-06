heatmap = (myData) => {
    let totalCells = myData.length;

    for (let i = 0; i < totalCells; i++) {
        // clear data vis cell
        let cleardiv = document.getElementById(i + 1);
        cleardiv.style.opacity = 0;

        // get cell id from test event
        let id = myData[i]['cell'];
        let div = document.getElementById(id);
        // determine opacity for cell
        try {
            var percentage_cell = (myData[i]['gazeEnd'] - myData[i]['gazeStart']) / (myData[i]['stimEnd'] - myData[i]['stimStart']);
        } catch {
            // oops something went wrong
            percentage_cell = 0
        }

        // set opacity
        div.style.opacity = percentage_cell;
    }
}