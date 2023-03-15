
/*
    Graph drawing is made in order:
    1) Clearing graph container
    2) Drawing base graph
        - Vertical and horizontal graph vectors with arros on the end.
    3) Drawing strokes on horizontal line
        - Small vertical strokes representing hours
    4) Drawing strokes on vertical line
        - Small horizontal strokes representing price segment with VAT
    5) Drawing real price vector
        - Continuos line representing price level on the graph. Graph
        height depends on Nord Pool Spot prices. VAT included.
    6) Draw text on the graph
        - Text of hours on below horizontal graph
        - Text of price segments next to vertical graph with VAT
        - basic graph meaning text next to both horizontal and vertical graphs
*/


// Draw Nord Pool Spot prices based on user selected date range
function drawGraphs() {
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
            NPS_CSV_Graph_Generator(results);
            const after = Date.now()/1000;
            console.log("Time elapsed: ", after - before, "seconds");
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
    
}

// Use user set date range for retrieving Nord Pool Spot electricity prices
// from Elering API and generate prices graph with consumption graph
function NPS_CSV_Graph_Generator(CSV_File_Results) {
    // Take date span from CSV file, rearange it for API and fetch with it for needed data
    const date_span = CSV_File_Results.data[2][1];

    // Manipulate date from CSV file to include the day before CSV file start day because timezones matter
    let date = date_span.substring(0, 10);
    let year = Number(date.substring(6, 10));
    let month = Number(date.substring(3, 5))-1;
    let day = Number(date.substring(0, 2));    
    let dd = new Date(year, month, day);    // 01.02.2023 -> Wed Feb 01 2023 00:00:00 GMT+0200 (Eastern European Standard Time)

    // Start date minus one day and take later 22th element from array
    const date_start = dd.toISOString();    // 01.02.2023 -> 2023-01-31T22:00:00.000Z
    const date_end = date_span[19] + date_span[20] + date_span[21] + date_span[22]  + "-" + date_span[16] + date_span[17] + "-" + date_span[13] + date_span[14];

    const url = `https://dashboard.elering.ee/api/nps/price?start=${date_start}&end=${date_end}T23%3A59%3A59.999Z`;
    fetch(url)
        .then((response) => response.json())
        .then((res) => {
            // Get SVG parent container calculated width
            const SVG_Width = document.getElementById("NPS_CSV_Cost").getBoundingClientRect().width;

            // CSV file variables
            const CSV_File_Data_Length = CSV_File_Results.data.length; // Length of CSV data
            const CSV_File_Data = CSV_File_Results.data; // CSV data itself
            const CSV_File_Data_Results_To_Ignore = 11; // The first results are form headers in Elektrilevi CSV file
            const CSV_Normalized_Data = CSVdataNormalization(CSV_File_Data_Results_To_Ignore, CSV_File_Data_Length, CSV_File_Data);  // Take only consumption data from file
            const CSV_Normalized_Data_Length = CSV_Normalized_Data.length;

            // Elering variables
            const Elering_Normalized_Data = EleringDataNormalization(res.data.ee);
            const Elering_Normalized_Data_length = Elering_Normalized_Data.length;

            // Merging two datasets into one
            const Merged_Data = FullDataNormalization(Elering_Normalized_Data, CSV_Normalized_Data);
            console.log(Merged_Data);

            // Filter out highest and lowest consumption within given data sample
            const Highest_Consumption = maxConsumption(Merged_Data);
            const Lowest_Consumption = minConsumption(Merged_Data);
            const Total_Consumption = CSV_File_Data[5][4].replace(",", ".");
            const Average_Consumption = avgConsumption(Merged_Data);
            
            // Filter out highest and lowest price within given data sample
            const Highest_Price = maxPrice(Merged_Data);
            const Lowest_Price = minPrice(Merged_Data);
            const Average_Price = avgPrice(Merged_Data);
            const Highest_Price_On_Graph = Math.ceil(Highest_Price);

            // Get SVG container base elements
            const Base_Graph = document.getElementById("npsBaseGraph");
            const Verticle_Group = document.getElementById("npsPriceVector");
            const Text_Group = document.getElementById("npsText");
            const Data_Points_Group = document.getElementById("csvConsumptionVector");
            const Graph_Title = document.getElementById("graphOneTitle");

            // Clear SVG contents if there has been drawn previously something 
            Base_Graph.innerHTML = "";
            Verticle_Group.innerHTML = "";
            Data_Points_Group.innerHTML = "";
            Text_Group.innerHTML = "";
            Graph_Title.innerHTML = "";

            // Graph sizing
            const offsetFromEnd = 70;   // Defines offset from SVG container end in pixels
            const endPosition = SVG_Width - offsetFromEnd; // Defines base graph horizontal graph end position
            const base_y = 275;
            const graphHeigth = 200;
            
            // Coordinates for base graph vectors starts and ends
            let baseGraphCoordinates = {
                x: [60, 58, 60, 62, 60, 60, 60, endPosition, endPosition, endPosition, endPosition, endPosition-2, endPosition, endPosition+2],
                y: [50, 55, 50, 55, 50, base_y, base_y, base_y, base_y, 50, 50, 55, 50, 55, 50]
            };

            // Draw base graph
            for(let i = 0; i < baseGraphCoordinates.x.length; i+=2) {
                Base_Graph.innerHTML += `<line x1="${baseGraphCoordinates.x[i]}" y1="${baseGraphCoordinates.y[i]}"
                                        x2="${baseGraphCoordinates.x[i+1]}" y2="${baseGraphCoordinates.y[i+1]}" />`;
            }

            // Draws small strokes to base graph horisontal line - needs improvements
            const eDataStart = 0;
            const eDataEnd = Elering_Normalized_Data_length;
            const countOfDataPoints = eDataEnd - eDataStart;
            const horizontalWidthBetweenStrokes = (endPosition - 61)/ countOfDataPoints;
            let strokesStr = "";
            console.log(eDataEnd-eDataStart, "Elering");
            console.log(CSV_Normalized_Data_Length, "CSV");
            console.log(Merged_Data, "Merged");
            
            // Draws small strokes to base graph vertical line on the left side - also needs improvements to reduce those damn iffffffsssssss
            let nRatio = priceRatio(Highest_Price_On_Graph); // Ratio number to display next to vertical graph. Essentially a graph segmentation ratio.
            let width = 0;
            const highestPriceLevel = Highest_Price / nRatio;
            const verticalWidthBetweenPoints = graphHeigth / highestPriceLevel;
            for (let i = 0; i < highestPriceLevel + 1; i++) {
                width = base_y - (i * verticalWidthBetweenPoints);
                strokesStr += `<line x1="${60}" y1="${width}" x2="${55}" y2="${width}" />`;
            }

            // Draws small strokes to base graph vertical line on the right side
            let widthBetweenPoints = graphHeigth / 8;
            let y = base_y - widthBetweenPoints;
            for (let i = 0; i < 8; i++) {
                strokesStr += `<line x1="${endPosition}" y1="${y}" x2="${endPosition+5}" y2="${y}"/>`;
                y -= widthBetweenPoints;
            }
            Base_Graph.innerHTML += strokesStr;

            // Draws continuous line of prices on graph
            let x1 = 61;
            let x2 = 61 + horizontalWidthBetweenStrokes;
            const price_ratio = graphHeigth / Highest_Price; // Ratio between 150px of vertical graph length and highest price
            let graphStr = "";
            for (let i = eDataStart; i < eDataEnd; i++) {
                const hourPrice = Merged_Data[i]["price"];
                let y = base_y - hourPrice * price_ratio;
                if (hourPrice <= 5) {
                    graphStr += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0A0" stroke-width="3"/>`;
                }
                else if (hourPrice > 5 && hourPrice <= 12) {
                    graphStr += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#FF0" stroke-width="3"/>`;
                }
                else if (hourPrice >= 100) {
                    graphStr += `<circle cx="${x1}" cy="${y}" r="1.5" stroke="#F0F" fill="#F0F"/>`;
                    graphStr += `<circle cx="${x1+(horizontalWidthBetweenStrokes/2)}" cy="${y}" r="1.5" stroke="#F0F" fill="#F0F"/>`;
                    graphStr += `<circle cx="${x2}" cy="${y}" r="1.5" stroke="#F0F" fill="#F0F"/>`;
                    graphStr += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#F0F"/>`;
                }
                else {
                    graphStr += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#F00" stroke-width="3"/>`;
                }
                x1 += horizontalWidthBetweenStrokes;
                x2 += horizontalWidthBetweenStrokes;
            }
            Verticle_Group.innerHTML = graphStr;

            // Adds CSV file datapoints to the graph in second group of SVG container;
            let lineStr = "";
            const consumption_ratio = graphHeigth / Highest_Consumption;
            x1 = 61;
            x2 = 61 + horizontalWidthBetweenStrokes;
            for(let i = 0; i < CSV_Normalized_Data_Length; i++) {
                let consumption = Merged_Data[i]["consumption"];
                let y = base_y - consumption * consumption_ratio;
                lineStr += `<line id="${consumption}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="2" />`;
                x1 += horizontalWidthBetweenStrokes;
                x2 += horizontalWidthBetweenStrokes;
            }
            Data_Points_Group.innerHTML += lineStr;

            // Add text to graph
            let textOffsetBelowGraph = base_y + 25;
            let textStr = "";
            Text_Group.style.fontFamily = "arial";
            Text_Group.style.fontSize = "10px";
            textStr += `<text x="10" y="25">NPS price</text>`;
            textStr += `<text x="10" y="35">\u00A2/KWh</text>`;
            textStr += `<text x="10" y="45">Inc. 20%</text>`;
            textStr += `<text x="${(SVG_Width/2) - 15}" y="${textOffsetBelowGraph}">Hours</text>`;
            textStr += `<circle cx="${endPosition - 100}" cy="${textOffsetBelowGraph - 2}" r="2" stroke="#F0F" fill="#F0F"/>`;
            textStr += `<text x="${endPosition - 90}" y="${textOffsetBelowGraph}">Extreme price(s)</text>`;
            textStr += `<text x="${endPosition + 4}" y="35">Consumption</text>`;
            textStr += `<text x="${endPosition + 4}" y="45">KWh</text>`;
            textStr += `<line x1="75" y1="${textOffsetBelowGraph}" x2="90" y2="${textOffsetBelowGraph}" stroke="#F00" stroke-width="2" />`;
            textStr += `<text x="100" y="${textOffsetBelowGraph + 3}">Over 11 \u00A2/KWh</text>`;
            textStr += `<line x1="190" y1="${textOffsetBelowGraph}" x2="205" y2="${textOffsetBelowGraph}" stroke="#FF0" stroke-width="2" />`;
            textStr += `<text x="215" y="${textOffsetBelowGraph + 3}">Between 5 and 11 \u00A2/KWh</text>`;
            textStr += `<line x1="350" y1="${textOffsetBelowGraph}" x2="365" y2="${textOffsetBelowGraph}" stroke="#0A0" stroke-width="2" />`;
            textStr += `<text x="375" y="${textOffsetBelowGraph + 3}">Below 5 \u00A2/KWh</text>`;
            textStr += `<line x1="${(SVG_Width / 2) + 235}" y1="${textOffsetBelowGraph}" x2="${(SVG_Width / 2) + 250}" y2="${textOffsetBelowGraph}" stroke="#000" stroke-width="2" />`;
            textStr += `<text x="${(SVG_Width / 2) + 260}" y="${textOffsetBelowGraph + 3}">Consumption</text>`;

            // Add price segments next to vertical graph on the left
            let textY = base_y + 2; // +2 is for centering text
            let count = graphHeigth / verticalWidthBetweenPoints;
            for (let i = 0; i < count+1; i++) {
                textStr += `<text x="30" y="${textY}">${nRatio * i}</text>`;
                textY -= verticalWidthBetweenPoints;
            }

            Text_Group.innerHTML += textStr;

            Graph_Title.style.fontSize = "16px";
            Graph_Title.innerHTML += `<text x="${(SVG_Width/2) - 135}" y="${textOffsetBelowGraph + 25}">NPS price and electricity consumption</text>`;;

            // Fill lowest and highest prices asw ell as consumption to HTML
            document.getElementById("period").innerHTML = `Period: ${CSV_File_Data[2][1]}`;
            document.getElementById("highestPrice").innerHTML = `${Highest_Price} \u00A2/KWh`;
            document.getElementById("lowestPrice").innerHTML = `${Lowest_Price} \u00A2/KWh`;
            document.getElementById("averagePrice").innerHTML = `${Average_Price} \u00A2/KWh`
            document.getElementById("highestConsumption").innerHTML = `${Highest_Consumption} KWh`;
            document.getElementById("lowestConsumption").innerHTML = `${Lowest_Consumption} KWh`;
            document.getElementById("totalConsumption").innerHTML = `${Total_Consumption} KWh`;
            document.getElementById("averageConsumption").innerHTML = `${Average_Consumption} KWh`
        
            // Draw second graph - from Cost_Graph.js file
            drawCostGraph(Merged_Data, horizontalWidthBetweenStrokes);
        })
        .catch(err => { throw err });
}

// Helper function for filtering out max price within dataset with VAT
function maxPrice(data) {
    let max = 0;
    const length = data.length;
    for (let i = 0; i < length; i++) {
        if (data[i].price > max) {
            max = data[i]["price"];
        }
    }
    return max.toFixed(3);
}

// Helper function for filtering out min price within dataset with VAT
function minPrice(data) {
    let min = data[0].price;
    const length = data.length;
    for (let i = 0; i < length; i++) {
        if (data[i].price < min) {
            min = data[i]["price"];
        }
    }
    return min.toFixed(3);
}

// Helper function to find average price within data with VAT
function avgPrice(data) {
    let avg = 0;
    const length = data.length;
    for(let i = 0; i < length; i++) {
        avg += data[i]["price"];
    }
    avg = avg / length;
    return avg.toFixed(3);
}

// Helper function to find highest consumption within data
function maxConsumption(data) {
    let maxConsum = 0;
    const length = data.length;
    for (let i = 0; i < length; i++) {
        let h = data[i]["consumption"];
        if(h > maxConsum) {
            maxConsum = h;
        }
    }
    return maxConsum;
}

// Helper function to find lowest consumption within data
function minConsumption(data) {
    let minConsum = data[0]["consumption"];
    const length = data.length;
    for (let i = 0; i < length; i++) {
        let m = data[i]["consumption"];
        if( m != null ) {
            if( m <= minConsum ) {
                minConsum = m;
            }
        }
    }
    return minConsum;
}

// Helper function to find average consumption within data
function avgConsumption(data) {
    let avgConsum = 0;
    const length = data.length;
    for(let i = 0; i < length; i++){
        avgConsum += data[i]["consumption"];
    }
    avgConsum = avgConsum / length;
    return avgConsum.toFixed(3);
}

// Replaces comma with dot and then string to number
function CSVdataNormalization(ignoreBeginning, length, data) {
    const normalizedData = [];
    for (let i = ignoreBeginning; i < length; i++) {
        normalizedData.push(Number(data[i][4].replace(",", ".")));
    }
    return normalizedData; 
}

// Adds 20% tax to elering prices
function EleringDataNormalization(data) {
    let normalizedData = [];
    const length = data.length;
    for(let i = 0; i < length - 2; i++) {
        normalizedData.push({
            timestamp : data[i]["timestamp"],
            price : ((data[i]["price"] * 1.2) / 10) // Divide by 10 because MWh -> KWh
        });
    }
    return normalizedData;
}

// Merges two datasets together
function FullDataNormalization(data1, data2) {
    let data = [];
    const length = data1.length;
    for(let i = 0; i < length; i++){
        const timestamp = data1[i]["timestamp"]
        const price = data1[i]["price"];
        let consumption = data2[i];

        if(typeof consumption === "undefined" || consumption === NaN )
        {
            consumption = null;
        }

        data.push({
            timestamp : timestamp,
            price : price,
            consumption : consumption
        });
    }

    return data;
}

function priceRatio (price) {
    let ratio = 0;
    if (price < 10) {
        ratio = 5;
    }
    else if (price >= 10 && price < 30) {
        ratio = 1;
    }
    else if (price >= 30 && price < 50) {
        ratio = 2;
    }
    else if (price >= 50 && price < 70) {
        ratio = 3;
    }
    else if (price >= 70 && price < 90) {
        ratio = 4;
    }
    else if (price >= 90 && price < 110) {
        ratio = 5;
    }
    else if (price >= 110 && price < 130) {
        ratio = 6;
    }
    else if (price >= 130 && price < 150) {
        ratio = 7;
    }
    else if (price >= 150 && price < 170) {
        ratio = 8;
    }
    else if (price >= 170 && price < 190) {
        ratio = 9;
    }
    else if (price >= 190 && price < 210) {
        ratio = 10;
    }
    else if (price >= 210 && price < 230) {
        ratio = 11;
    }
    else if (price >= 230 && price < 250) {
        ratio = 12;
    }
    else if (price >= 250 && price < 270) {
        ratio = 13;
    }
    else if (price >= 270 && price < 290) {
        ratio = 14;
    }
    else if (price >= 290 && price < 310) {
        ratio = 15;
    }
    else if (price >= 310 && price < 330) {
        ratio = 16;
    }
    else if (price >= 330 && price < 350) {
        ratio = 17;
    }
    else if (price >= 350 && price < 370) {
        ratio = 18;
    }
    else if (price >= 370 && price < 390) {
        ratio = 19;
    }
    else if (price >= 390 && price < 410) {
        ratio = 20;
    }
    else if (price >= 410 && price < 430) {
        ratio = 21;
    }
    else if (price >= 430 && price < 450) {
        ratio = 22;
    }
    else if (price >= 450 && price < 470) {
        ratio = 23;
    }
    else if (price >= 470 && price < 490) {
        ratio = 24;
    }
    else if (price >= 490 && price < 510) {
        ratio = 25;
    }


    return ratio;
}

function consumptionRatio(consum) {
    let ratio = 0;
    if(consum < 1) {
        ratio = 8;
    }
    else if (consum < 2) {
        ratio = 16;
    }
    else if (consum < 3) {
        ratio = 24;
    }

    return ratio;
}