
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
            var data = results;
            console.log(data);

            // Get SVG container first group, the graph vertical and horisontal lines
            let g =  document.getElementById("graph");
            // X and Y coordinates for lines
            const coordinates = {
                x : [60, 60, 60, 475, 60, 58, 60, 62, 475, 470, 475, 470],
                y : [25, 200, 200, 200, 20, 25, 20, 25, 200, 202, 200, 198]
            };
            // For the sake of it, X and Y are pairs so X and Y arrays are the same length
            const size = coordinates.x.length;
            for(let i = 0; i < size; i+=2) {
                g.innerHTML += `<line x1="${coordinates.x[i]}" y1="${coordinates.y[i]}" x2="${coordinates.x[i+1]}" y2="${coordinates.y[i+1]}" />`;
            }
            // Small vertical strokes on horisontal line
            const hzWidth = 400/25;
            for(let i = 1; i < 25; i++) {
                g.innerHTML += `<line x1="${60 + hzWidth*i}" y1="${195}" x2="${60 + hzWidth*i}" y2="${205}" />`;
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