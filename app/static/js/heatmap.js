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
        var percentage_cell = (myData[i]['gazeEnd'] - myData[i]['gazeStart']) / (myData[i]['stimEnd'] - myData[i]['stimStart']);

        // set opacity
        div.style.opacity = percentage_cell;
    }
}