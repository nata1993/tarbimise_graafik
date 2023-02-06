
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
        worker: false,
        comments: false,
        step: undefined,
        // Upon parsing fully the data, graph is drawn
        complete: function(results) {
            let svgContainer = document.getElementById("userConsumption");
            let svgWidth = svgContainer.getBoundingClientRect().width;
            let offsetFromEnd = 50; // in pixels
            let endPosition = svgWidth-offsetFromEnd; // Defines how far the horisontal graph should go
            let strokesEndPosition = endPosition - 100; // Defines how far the strokes on horisontal graph should go
            // Get SVG container first group, the graph vertical and horisontal lines
            let g =  document.getElementById("graph");
            // X and Y coordinates for lines
            const coordinates = {
                x : [60, 60, 60, endPosition, 60, 58, 60, 62, endPosition, endPosition-5, endPosition, endPosition-5],
                y : [25, 200, 200, 200, 20, 25, 20, 25, 200, 202, 200, 198]
            };
            // For the sake of it, X and Y are pairs so X and Y arrays are the same length
            const size = coordinates.x.length;
            for(let i = 0; i < size; i+=2) {
                g.innerHTML += `<line x1="${coordinates.x[i]}" y1="${coordinates.y[i]}" x2="${coordinates.x[i+1]}" y2="${coordinates.y[i+1]}" />`;
            }
            // Find highest and lowest consumption
            let maxConsumption = 0;
            let firstResultsToIgnore = 12;
            for (let i = firstResultsToIgnore; i < results.data.length-1; i++) {
                // console.log(results.data[i][4]);
                if(results.data[i][4] >= maxConsumption) {
                    maxConsumption = results.data[i][4];
                }
            }
            let minConsumption = results.data[12][4];
            for (let i = firstResultsToIgnore; i < results.data.length-1; i++) {
                if(results.data[i][4] <= minConsumption) {
                    minConsumption = results.data[i][4];
                }
            }
            document.getElementById("highestConsumption").innerHTML = `Period highest consumption: ${maxConsumption} KWh`;
            document.getElementById("lowestConsumption").innerHTML = `Period lowest consumption: ${minConsumption} KWh`;
            // Small vertical strokes on horisontal line
            let strokesCount = results.data.length;
            const hzWidth = strokesEndPosition/strokesCount;
            for(let i = 1; i < strokesCount; i++) {
                g.innerHTML += `<line x1="${60 + hzWidth*i}" y1="${200}" x2="${60 + hzWidth*i}" y2="${205}" />`;
            }
            // Add small strokes to vertical graph
            let widthBetweenPoints = 150/8;
            let y = 200 - widthBetweenPoints;
            for (let i = 0; i < 8; i++) {
                g.innerHTML += `<line x1="${60}" y1="${y}" x2="${55}" y2="${y}"/>`;
                y -= widthBetweenPoints;
            }
            // Adds text to the graph
            let middleOfHorisontalGraph = strokesEndPosition/2;
            let textGroup = document.getElementById("text");
            textGroup.style.fontSize = "8px";
            textGroup.style.fontFamily = "arial";
            textGroup.innerHTML += `<text x="${middleOfHorisontalGraph}" y="235">Hours</text>`;
            textGroup.innerHTML += '<text x="10" y="25">NPS price</text>';
            textGroup.innerHTML += '<text x="10" y="35">€/MWh</text>';
            textGroup.innerHTML += '<text x="50" y="210">0</text>';
            
        },
        error: undefined,
        download: false,
        downloadRequestHeaders: undefined,
        downloadRequestBody: undefined,
        skipEmptyLines: false,
        chunk: undefined,
        chunkSize: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    });
};