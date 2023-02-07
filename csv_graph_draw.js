
// Draw graph from CSV file
function drawCSVgraph(){
    // Retrieve file from input
    const file = document.getElementById("csvFileInput").files[0];
    Papa.parse(file, {
        // Default configuration for parsing CSV files
        delimiter: "",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: true,
        comments: false,
        step: undefined,
        // Upon parsing fully the data, graph is drawn
        complete: function(results) {
            const before = Date.now()/1000; 
            SVGdraw(results);
            const after = Date.now()/1000;
            console.log("Time elapsed: ", after - before);
        },
        error: undefined,
        download: false,
        downloadRequestHeaders: undefined,
        downloadRequestBody: undefined,
        skipEmptyLines: true,
        chunk: undefined,
        chunkSize: undefined,
        fastMode: false,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    });
};

function SVGdraw (CSV_File_Results) {
    const CSV_File_Data_Length = CSV_File_Results.data.length-1; // Length of CSV data
    const CSV_File_Data = CSV_File_Results.data; // CSV data itself
    const firstResultsToIgnore = 12; // The first results are form headers
    let svgContainer = document.getElementById("userConsumption");
    let svgWidth = svgContainer.getBoundingClientRect().width; // Width of SVG container
    let offsetFromEnd = 50; // Defines offset from SVG container end in pixels
    let endPosition = svgWidth - offsetFromEnd; // Defines how far the horisontal graph should go
    let strokesEndPosition = endPosition - 85; // Defines how far the strokes on horisontal graph should go
    // Get SVG container first group, the graph vertical and horisontal lines
    let g =  document.getElementById("graph");
    // X and Y coordinates for vertical and horizontal graph lines
    const baseGraphCoordinates = {
        x : [60, 60, 60, endPosition, 60, 58, 60, 62, endPosition, endPosition-5, endPosition, endPosition-5],
        y : [25, 200, 200, 200, 20, 25, 20, 25, 200, 202, 200, 198]
    };
    // For the sake of it, X and Y are pairs so X and Y arrays are the same length
    const XYarraySize = baseGraphCoordinates.x.length;
    for (let i = 0; i < XYarraySize; i+=2) {
        g.innerHTML += `<line x1="${baseGraphCoordinates.x[i]}" y1="${baseGraphCoordinates.y[i]}" x2="${baseGraphCoordinates.x[i+1]}" y2="${baseGraphCoordinates.y[i+1]}" />`;
    }
    // Find highest and lowest consumption
    let maxConsumption = 0;
    for (let i = firstResultsToIgnore; i < CSV_File_Data_Length; i++) {
        if(CSV_File_Data[i][4] >= maxConsumption) {
            maxConsumption = CSV_File_Data[i][4];
        }
    }
    maxConsumption = parseFloat(maxConsumption.replace(",","."));
    let minConsumption = CSV_File_Data[12][4];
    for (let i = firstResultsToIgnore; i < CSV_File_Data_Length; i++) {
        if(CSV_File_Data[i][4] <= minConsumption) {
            minConsumption = CSV_File_Data[i][4];
        }
    }
    document.getElementById("highestConsumption").innerHTML = `Period highest consumption: ${maxConsumption} KWh`;
    document.getElementById("lowestConsumption").innerHTML = `Period lowest consumption: ${minConsumption} KWh`;
    // Small vertical strokes on horisontal line
    const hzWidth = strokesEndPosition/CSV_File_Data_Length;
    for(let i = 1; i < CSV_File_Data_Length; i++) {
        g.innerHTML += `<line x1="${60 + hzWidth*i}" y1="${200}" x2="${60 + hzWidth*i}" y2="${205}" />`;
    }
    // Add small strokes to vertical graph
    let widthBetweenPoints = 150/8;
    let y = 200 - widthBetweenPoints;
    for (let i = 0; i < 8; i++) {
        g.innerHTML += `<line x1="${60}" y1="${y}" x2="${55}" y2="${y}"/>`;
        y -= widthBetweenPoints;
    }
    // Adds datapoints to the graph in second group of SVG container
    let dataPointGroup = document.getElementById("priceVerticle");
    let x = strokesEndPosition/CSV_File_Data_Length;
    const ratio = 150/maxConsumption;
    let number = 0;
    let y2 = 0;
    for(let i = firstResultsToIgnore; i < CSV_File_Data_Length; i++) {
        number = parseFloat(CSV_File_Data[i][4].replace(",", "."));
        y2 = 200 - number * ratio;
        dataPointGroup.innerHTML += `<circle cx="${60 + x*i}" cy="${y2}" r="1.5" fill="black" stroke="#000" />`;
    }
    // Adds text to the graph in third group of SVG container
    let middleOfHorisontalGraph = strokesEndPosition/2;
    let textGroup = document.getElementById("text");
    textGroup.style.fontSize = "8px";
    textGroup.style.fontFamily = "arial";
    textGroup.innerHTML += `<text x="${middleOfHorisontalGraph}" y="235">Hours</text>`;
    textGroup.innerHTML += '<text x="10" y="25">NPS price</text>';
    textGroup.innerHTML += '<text x="10" y="35">€/MWh</text>';
    textGroup.innerHTML += '<text x="50" y="210">0</text>';
}