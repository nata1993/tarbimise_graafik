
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
            const SVG_Width = document.getElementById("NPS_CSV").getBoundingClientRect().width;

            // CSV file variables
            const CSV_File_Data_Length = CSV_File_Results.data.length; // Length of CSV data
            const CSV_File_Data = CSV_File_Results.data; // CSV data itself
            const CSV_File_Data_Results_To_Ignore = 11; // The first results are form headers in Elektrilevi CSV file
            
            const eleringData = res.data.ee;
            let width = 0; // Reusable variable

            // Filter out highest and lowest consumption within given data sample
            const highestConsumption = maxConsumption(CSV_File_Data_Results_To_Ignore, CSV_File_Data_Length, CSV_File_Data);
            const lowestConsumption = minConsumption(CSV_File_Data_Results_To_Ignore, CSV_File_Data_Length, CSV_File_Data);
            const totalConsumption = CSV_File_Data[5][4];
            
            // Filter out highest and lowest price within given data sample
            const highestPrice = maxPrice(eleringData);
            const lowestPrice = minPrice(eleringData);
            const highestPriceOnGraph = Math.ceil(highestPrice);

            // Get SVG container base elements
            const baseGraph = document.getElementById("npsBaseGraph");
            const verticleGroup = document.getElementById("npsPriceVector");
            const textGroup = document.getElementById("npsText");
            const Data_Points_Group = document.getElementById("csvConsumptionVector");

            // Clear SVG contents if there has been drawn previously something 
            baseGraph.innerHTML = "";
            verticleGroup.innerHTML = "";
            Data_Points_Group.innerHTML = "";
            textGroup.innerHTML = "";

            // Graph sizing
            const offsetFromEnd = 70;   // Defines offset from SVG container end in pixels
            const endPosition = SVG_Width - offsetFromEnd; // Defines base graph horizontal graph end position
            
            // Coordinates for base graph vectors starts and ends
            let baseGraphCoordinates = {
                x: [60, 58, 60, 62, 60, 60, 60, endPosition, endPosition, endPosition, endPosition, endPosition-2, endPosition, endPosition+2],
                y: [25, 30, 25, 30, 25, 200, 200, 200, 200, 25, 25, 30, 25, 30, 25]
            };

            // Draw base graph
            for(let i = 0; i < baseGraphCoordinates.x.length; i+=2) {
                baseGraph.innerHTML += `<line x1="${baseGraphCoordinates.x[i]}" y1="${baseGraphCoordinates.y[i]}"
                                        x2="${baseGraphCoordinates.x[i+1]}" y2="${baseGraphCoordinates.y[i+1]}" />`;
            }

            // Draws small strokes to base graph horisontal line - needs improvements
            const eDataStart = 0;
            const eDataEnd = eleringData.length-2; // -2 because last hour of data is over the CSV file date span and data is 0 indexed
            const countOfDataPoints = eDataEnd - eDataStart;
            const horizontalWidthBetweenStrokes = (endPosition - 61)/ countOfDataPoints;
            let strokesStr = "";
            console.log(eDataEnd-eDataStart, "Elering");
            console.log(CSV_File_Data_Length-11, "CSV");
            
            // Draws small strokes to base graph vertical line on the left side - also needs improvements to reduce those damn iffffffsssssss
            let nRatio = 0; // Ratio number to display next to vertical graph. Essentially a graph segmentation ratio.
            if (highestPriceOnGraph < 100) {
                nRatio = 5;
            }
            else if (highestPriceOnGraph >= 100 && highestPriceOnGraph < 200) {
                nRatio = 10;
            }
            else if (highestPriceOnGraph >= 200 && highestPriceOnGraph < 300) {
                nRatio = 15;
            }
            else if (highestPriceOnGraph >= 300 && highestPriceOnGraph < 400) {
                nRatio = 20;
            }
            else if (highestPriceOnGraph >= 400 && highestPriceOnGraph < 500) {
                nRatio = 25;
            }
            else if (highestPriceOnGraph >= 500 && highestPriceOnGraph < 600) {
                nRatio = 30;
            }
            else if (highestPriceOnGraph >= 600 && highestPriceOnGraph < 700) {
                nRatio = 35;
            }
            else if (highestPriceOnGraph >= 700 && highestPriceOnGraph < 800) {
                nRatio = 40;
            }
            else if (highestPriceOnGraph >= 800 && highestPriceOnGraph < 900) {
                nRatio = 45;
            }
            else if (highestPriceOnGraph >= 900 && highestPriceOnGraph < 1000) {
                nRatio = 50;
            }
            else if (highestPriceOnGraph >= 1000 && highestPriceOnGraph < 1100) {
                nRatio = 55;
            }
            else if (highestPriceOnGraph >= 1100 && highestPriceOnGraph < 1200) {
                nRatio = 60;
            }
            else if (highestPriceOnGraph >= 1200 && highestPriceOnGraph < 1300) {
                nRatio = 65;
            }
            else if (highestPriceOnGraph >= 1300 && highestPriceOnGraph < 1400) {
                nRatio = 70;
            }
            else if (highestPriceOnGraph >= 1400 && highestPriceOnGraph < 1500) {
                nRatio = 75;
            }
            else if (highestPriceOnGraph >= 1500 && highestPriceOnGraph < 1600) {
                nRatio = 80;
            }
            else if (highestPriceOnGraph >= 1600 && highestPriceOnGraph < 1700) {
                nRatio = 85;
            }
            else if (highestPriceOnGraph >= 1700 && highestPriceOnGraph < 1800) {
                nRatio = 90;
            }
            else if (highestPriceOnGraph >= 1800 && highestPriceOnGraph < 1900) {
                nRatio = 95;
            }
            else if (highestPriceOnGraph >= 1900 && highestPriceOnGraph < 2000) {
                nRatio = 100;
            }
            else if (highestPriceOnGraph >= 2000 && highestPriceOnGraph < 2100) {
                nRatio = 105;
            }
            else if (highestPriceOnGraph >= 2100 && highestPriceOnGraph < 2200) {
                nRatio = 110;
            }
            else if (highestPriceOnGraph >= 2200 && highestPriceOnGraph < 2300) {
                nRatio = 115;
            }
            else if (highestPriceOnGraph >= 2300 && highestPriceOnGraph < 2400) {
                nRatio = 120;
            }
            else if (highestPriceOnGraph >= 2400 && highestPriceOnGraph < 2500) {
                nRatio = 125;
            }
            else if (highestPriceOnGraph >= 2500 && highestPriceOnGraph < 2600) {
                nRatio = 130;
            }
            else if (highestPriceOnGraph >= 2600 && highestPriceOnGraph < 2700) {
                nRatio = 135;
            }
            else if (highestPriceOnGraph >= 2700 && highestPriceOnGraph < 2800) {
                nRatio = 140;
            }
            else if (highestPriceOnGraph >= 2800 && highestPriceOnGraph < 2900) {
                nRatio = 145;
            }
            else if (highestPriceOnGraph >= 2900 && highestPriceOnGraph < 3000) {
                nRatio = 150;
            }
            else if (highestPriceOnGraph >= 3000 && highestPriceOnGraph < 3100) {
                nRatio = 155;
            }
            else if (highestPriceOnGraph >= 3100 && highestPriceOnGraph < 3200) {
                nRatio = 160;
            }
            else if (highestPriceOnGraph >= 3200 && highestPriceOnGraph < 3300) {
                nRatio = 165;
            }
            else if (highestPriceOnGraph >= 3300 && highestPriceOnGraph < 3400) {
                nRatio = 170;
            }
            else if (highestPriceOnGraph >= 3400 && highestPriceOnGraph < 3500) {
                nRatio = 175;
            }
            else if (highestPriceOnGraph >= 3500 && highestPriceOnGraph < 3600) {
                nRatio = 180;
            }
            else if (highestPriceOnGraph >= 3600 && highestPriceOnGraph < 3700) {
                nRatio = 185;
            }
            else if (highestPriceOnGraph >= 3700 && highestPriceOnGraph < 3800) {
                nRatio = 190;
            }
            else if (highestPriceOnGraph >= 3800 && highestPriceOnGraph < 3900) {
                nRatio = 195;
            }
            else if (highestPriceOnGraph >= 3900 && highestPriceOnGraph < 4000) {
                nRatio = 200;
            }
            else if (highestPriceOnGraph >= 4000 && highestPriceOnGraph < 4100) {
                nRatio = 205;
            }
            else if (highestPriceOnGraph >= 4100 && highestPriceOnGraph < 4200) {
                nRatio = 210;
            }
            else if (highestPriceOnGraph >= 4200 && highestPriceOnGraph < 4300) {
                nRatio = 215;
            }
            else if (highestPriceOnGraph >= 4300 && highestPriceOnGraph < 4400) {
                nRatio = 220;
            }
            else if (highestPriceOnGraph >= 4400 && highestPriceOnGraph < 4500) {
                nRatio = 225;
            }
            else if (highestPriceOnGraph >= 4500 && highestPriceOnGraph < 4600) {
                nRatio = 230;
            }
            else if (highestPriceOnGraph >= 4600 && highestPriceOnGraph < 4700) {
                nRatio = 235;
            }
            else if (highestPriceOnGraph >= 4700 && highestPriceOnGraph < 4800) {
                nRatio = 240;
            }
            else if (highestPriceOnGraph >= 4800 && highestPriceOnGraph < 4900) {
                nRatio = 245;
            }

            const highestPriceLevel = highestPrice / nRatio;
            const verticalWidthBetweenPoints = 150 / highestPriceLevel;
            for (var i = 0; i < highestPriceLevel+1; i++) {
                width = 200 - (i * verticalWidthBetweenPoints);
                strokesStr += `<line x1="${60}" y1="${width}" x2="${55}" y2="${width}" />`;
            }

            // Draws small strokes to base graph vertical line on the right side
            let widthBetweenPoints = 150 / 8;
            let y = 200 - widthBetweenPoints;
            for (let i = 0; i < 8; i++) {
                strokesStr += `<line x1="${endPosition}" y1="${y}" x2="${endPosition+5}" y2="${y}"/>`;
                y -= widthBetweenPoints;
            }
            baseGraph.innerHTML += strokesStr;

            // Draws continuous line of prices on graph
            const base_y = 200;
            let x1 = 61;
            let x2 = 61 + horizontalWidthBetweenStrokes;
            const price_ratio = 150 / ( highestPrice / 1.2 ); // Ratio between 150px of vertical graph length and highest price, divide by 1.2 because before we multiplied by 1.2 in maxPrice function
            let graphStr = "";
            console.log(eleringData);
            console.log(CSV_File_Data);
            for (let i = eDataStart; i < eDataEnd; i++) {
                const hourPrice = eleringData[i]["price"];
                let y = base_y - hourPrice * price_ratio;
                if (hourPrice <= 50) {
                    graphStr += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0A0" stroke-width="3"/>`;
                }
                else if (hourPrice > 50 && hourPrice <= 110) {
                    graphStr += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#FF0" stroke-width="3"/>`;
                }
                else if (hourPrice >= 1000) {
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
            verticleGroup.innerHTML = graphStr;

            // Adds CSV file datapoints to the graph in second group of SVG container;
            let lineStr = "";
            const consumption_ratio = 150 / highestConsumption;
            x1 = 61;
            x2 = 61 + horizontalWidthBetweenStrokes;
            for(let i = CSV_File_Data_Results_To_Ignore; i < CSV_File_Data_Length; i++) {
                let consumption = parseFloat(CSV_File_Data[i][4].replace(",", "."));
                let y = 200 - consumption * consumption_ratio;
                lineStr += `<line id="${consumption}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="2" />`;
                x1 += horizontalWidthBetweenStrokes;
                x2 += horizontalWidthBetweenStrokes;
            }
            Data_Points_Group.innerHTML += lineStr;

            // Add text to graph
            let textStr = "";
            textStr += `<text x="10" y="13">NPS price</text>`;
            textStr += `<text x="10" y="23">€/MWh</text>`;
            textStr += `<text x="10" y="33">Inc. 20%</text>`;
            textStr += `<text x="${SVG_Width/2}" y="235">Hours</text>`;
            textStr += `<circle cx="${endPosition-100}" cy="233" r="2" stroke="#F0F" fill="#F0F"/>`;
            textStr += `<text x="${endPosition-90}" y="235">Extreme price(s)</text>`;
            textStr += `<text x="${endPosition+10}" y="13">Consumption</text>`;
            textStr += `<text x="${endPosition+10}" y="23">KWh</text>`;
            textStr += `<line x1="75" y1="235" x2="90" y2="235" stroke="#F00" stroke-width="2" />`;
            textStr += `<text x="100" y="238">Over 110 €/MWh</text>`;
            textStr += `<line x1="175" y1="235" x2="190" y2="235" stroke="#FF0" stroke-width="2" />`;
            textStr += `<text x="200" y="238">Between 50 and 110 €/MWh</text>`;
            textStr += `<line x1="315" y1="235" x2="330" y2="235" stroke="#0A0" stroke-width="2" />`;
            textStr += `<text x="340" y="238">Below 50 €/MWh</text>`;
            textStr += `<line x1="${(SVG_Width / 2) + 235}" y1="235" x2="${(SVG_Width / 2) + 250}" y2="235" stroke="#000" stroke-width="2" />`;
            textStr += `<text x="${(SVG_Width / 2) + 260}" y="238">Consumption</text>`;
            

            // Add hours below horizontal graph - needs improvements
            /*let x = 30 + horizontalWidthBetweenStrokes;
            for (let i = 0; i < countOfDataPoints; i++) {
                textStr += `<text x="${x}" y="215">${i} - ${i+1}</text>`;
                x += horizontalWidthBetweenStrokes;
            }*/

            // Add price segments next to vertical graph on the left
            let textY = 202; // +2 is for centering text
            let count = 150 / verticalWidthBetweenPoints;
            for (let i = 0; i < count+1; i++) {
                textStr += `<text x="30" y="${textY}">${nRatio * i}</text>`;
                textY -= verticalWidthBetweenPoints;
            }

            textGroup.style.fontFamily = "arial";
            textGroup.style.fontSize = "8px";
            textGroup.innerHTML += textStr;
            
            // Fill lowest and highest prices asw ell as consumption to HTML
            document.getElementById("highestPrice").innerHTML = `Period highest price: ${Number((highestPrice) / 10).toFixed(3)} \u00A2/KWh`;
            document.getElementById("lowestPrice").innerHTML = `Period lowest price: ${Number((lowestPrice) / 10).toFixed(3)} \u00A2/KWh`;
            document.getElementById("highestConsumption").innerHTML = `Period highest consumption: ${highestConsumption} KWh`;
            document.getElementById("lowestConsumption").innerHTML = `Period lowest consumption: ${lowestConsumption} KWh`;
            document.getElementById("totalConsumption").innerHTML = `Period total consumption: ${totalConsumption.replace(",", ".")} KWh`;
        
            // Draw second graph - from Cost_Graph.js file
            drawCostGraph(eleringData, CSV_File_Data, horizontalWidthBetweenStrokes);
        })
        .catch(err => { throw err });
}

// Helper function for filtering out max price within dataset with VAT
function maxPrice(data) {
    let max = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].price > max) {
            max = data[i].price;
        }
    }
    return max * 1.2;
}

// Helper function for filtering out min price within dataset with VAT
function minPrice(data) {
    let min = data[0].price;
    for (var i = 0; i < data.length; i++) {
        if (data[i].price < min) {
            min = data[i].price;
        }
    }
    return min * 1.2;
}

// Helper function for rounding up to the closesth tenth - 87 -> 90, 93 -> 90
function roundUp(price) {
    return Math.round(price / 10) * 10;
}

// Helper function to find highest consumption within data
function maxConsumption(data_start, data_length, data) {
    let maxConsum = 0;
    for (let i = data_start; i < data_length; i++) {
        let h = data[i][4].replace(",",".");
        if(h >= maxConsum) {
            maxConsum = h;
        }
    }
    return maxConsum;
}

// Helper function to find lowest consumption within data
function minConsumption(data_start, data_length, data) {
    let minConsum = data[11][4].replace(",", ".");
    for (let i = data_start; i < data_length; i++) {
        let m = data[i][4].replace(",", ".");
        if(m <= minConsum) {
            minConsum = m;
        }
    }
    return minConsum;
}