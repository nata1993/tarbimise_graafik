
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
            let endPositionStrokes = endPosition - 100;
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
            // Small vertical strokes on horisontal line
            const hzWidth = endPositionStrokes/25;
            for(let i = 1; i < 25; i++) {
                g.innerHTML += `<line x1="${60 + hzWidth*i}" y1="${200}" x2="${60 + hzWidth*i}" y2="${205}" />`;
            }

            // Draw small vertical strokes
            let maxConsumption = 0;
            let firstResultsToIgnore = 12;
            for (let i = firstResultsToIgnore; i < results.data.length-1; i++) {
                console.log(results.data[i][4]);
                if(results.data[i][4] >= maxConsumption) {
                    maxConsumption = results.data[i][4];
                }
            }
            let widthBetweenPoints = 150/8;
            let y = 200 - widthBetweenPoints;
            for (let i = 0; i < 8; i++) {
                g.innerHTML += `<line x1="${60}" y1="${y}" x2="${55}" y2="${y}"/>`;
                y -= widthBetweenPoints;
            }
            
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