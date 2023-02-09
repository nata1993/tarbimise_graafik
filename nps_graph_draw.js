
// Draw Nord Pool Spot prices based on user selected date range
function calculate() {
    // Take 
    const date_start = document.getElementById("date_start").value;
    const date_end = document.getElementById("date_end").value;
    const date_settings = [];
    date_settings.push(date_start, date_end);

    // Check if user did not choose date range
    if (date_start.length == 0 || date_end.length == 0) {
        // Drawing note for user to canvas if not chosen date range
        let canvas = document.getElementById("npsPrices");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#CCC";
        ctx.fillRect(0, 0, 500, 250);
        ctx.fillStyle = "#000";
        ctx.font = "30px arial";
        ctx.fillText("Please select date range", 100, 100);
    }
    else {
        const before = Date.now()/1000; 
        getDataFromElering(date_settings);
        const after = Date.now()/1000;
        console.log("Time elapsed: ", after - before);
    }
}

// Use user set date range for retrieving Nord Pool Spot electricity prices
// from Elering API and generate prices graph
function getDataFromElering(date_setting) {
    const url = `https://dashboard.elering.ee/api/nps/price?start=${date_setting[0]}T00%3A00%3A00.000Z&end=${date_setting[1]}T00%3A00%3A00.000Z`;
    fetch(url)
        .then((response) => response.json())
        .then((res) => {
            const eleringData = res.data.ee;
            let width = 0; // Reusable variable

            // Get canvas parent container calculated width
            const svgWidth = document.getElementById("npsPrices").getBoundingClientRect().width;

            // Clear SVG before drawing incase of redrawing
            const baseGraph = document.getElementById("npsBaseGraph");
            const verticleGroup = document.getElementById("npsPriceVector");
            const textGroup = document.getElementById("npsText");

            // Prepare clear SVG if there has been drawn something previously
            baseGraph.innerHTML = "";
            verticleGroup.innerHTML = "";
            textGroup.innerHTML = "";

            // Graph sizing
            const offsetFromEnd = 50;   // Defines offset from SVG container end in pixels
            const endPosition = svgWidth - offsetFromEnd; // Defines base graph horizontal graph end position
            const strokesEndPosition = endPosition - 85; // Defines how far strokes go on horizontal graph
            
            // Coordinates for base graph vectors starts and ends
            let baseGraphCoordinates = {
                x: [60, 58, 60, 62, 60, 60, 60, endPosition, endPosition, endPosition-5, endPosition, endPosition-5],
                y: [25, 30, 25, 30, 25, 200, 200, 200, 200, 202, 200, 198]
            };

            // Draw base graph
            for(let i = 0; i < baseGraphCoordinates.x.length; i+=2) {
                baseGraph.innerHTML += `<line x1="${baseGraphCoordinates.x[i]}" y1="${baseGraphCoordinates.y[i]}" x2="${baseGraphCoordinates.x[i+1]}" y2="${baseGraphCoordinates.y[i+1]}" />`;
            }

            // Draws small strokes to base graph horisontal line
            const dataPointCount = eleringData.length+1;
            const horWidthBetweenPoints = strokesEndPosition / dataPointCount;
            let strokePosition = 60;
            for (var i = 0; i < dataPointCount; i++) {
                width = strokePosition + (i * horWidthBetweenPoints);
                baseGraph.innerHTML += `<line x1="${width}" y1="${200}" x2="${width}" y2="${205}" />`;
            }

            // Filter out highest and lowest price within given data sample
            const highestPrice = maxPrice(eleringData);
            const lowestPrice = minPrice(eleringData);

            // Special rounding to uppest tenth number
            const highestPriceOnGraph = Math.round(highestPrice / 10) * 10;
            let nRatio = 0;

            // Draws small strokes to vertical line
            let highestPriceLevel = null;
            if (highestPriceOnGraph < 100) {
                nRatio = 5;
                highestPriceLevel = highestPriceOnGraph / nRatio;
            }
            else if (highestPriceOnGraph >= 100 && highestPriceOnGraph < 200) {
                nRatio = 10;
                highestPriceLevel = highestPriceOnGraph / nRatio;
            }
            else if (highestPriceOnGraph >= 200 && highestPriceOnGraph < 300) {
                nRatio = 15;
                highestPriceLevel = highestPriceOnGraph / nRatio;
            }
            else if (highestPriceOnGraph >= 300 && highestPriceOnGraph < 400) {
                nRatio = 20;
                highestPriceLevel = highestPriceOnGraph / nRatio;
            }
            else if (highestPriceOnGraph >= 400 && highestPriceOnGraph < 500) {
                nRatio = 25;
                highestPriceLevel = highestPriceOnGraph / nRatio;
            }
            else if (highestPriceOnGraph >= 500 && highestPriceOnGraph < 600) {
                nRatio = 30;
                highestPriceLevel = highestPriceOnGraph / nRatio;
            }
            const verWidthBetweenPoints = 150 / highestPriceLevel;
            for (var i = 0; i < highestPriceLevel; i++) {
                width = 200 - (i * verWidthBetweenPoints);
                baseGraph.innerHTML += `<line x1="${60}" y1="${width}" x2="${55}" y2="${width}" />`;
            }

            // Draws continuous line of prices on graph
            let baseY = 200;
            let x1 = 60;
            let x2 = 60 + horWidthBetweenPoints;
            const ratio = 175 / highestPrice; // Ratio between 175px height of vertical graph and highest price
            for (const item of eleringData) {
                const hourPrice = item["price"];
                let y1 = baseY - hourPrice * ratio;
                let y2 = y1;
                if (hourPrice <= 50) {
                    verticleGroup.innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#0F0"/>`
                }
                else if (hourPrice > 50 && hourPrice <= 110) {
                    verticleGroup.innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FF0"/>`
                }
                else {
                    verticleGroup.innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F00"/>`
                }
                x1 += horWidthBetweenPoints;
                x2 += horWidthBetweenPoints;
                
            }

            // Add text to graph
            textGroup.style.fontFamily = "arial";
            textGroup.style.fontSize = "8px";
            textGroup.innerHTML += `<text x="50" y="210">0</text>`;
            textGroup.innerHTML += `<text x="10" y="25">NPS price</text>`;
            textGroup.innerHTML += `<text x="10" y="35">€/MWh</text>`;
            textGroup.innerHTML += `<text x="10" y="45">Inc. 20%</text>`;
            textGroup.innerHTML += `<text x="${(endPosition)/2}" y="235">Hours</text>`;
            let x = 30 + horWidthBetweenPoints;
            for (let i = 0; i < dataPointCount; i++) {
                textGroup.innerHTML += `<text x="${x}" y="215">${i} - ${i+1}</text>`;
                x += horWidthBetweenPoints;
            }
            let textY = 200 - verWidthBetweenPoints;
            for (let i = 0; i < 175/nRatio; i++) {
                textGroup.style.textAlign = "right";
                textGroup.innerHTML += `<text x="30" y="${textY}">${nRatio*i}</text>`;
                textY -= verWidthBetweenPoints;
            }
            
            // Fill lowest and highest prices to HTML
            document.getElementById("highestPrice").innerHTML = `Period highest price: ${Number(highestPrice / 10).toFixed(2)} \u00A2/KWh`;
            document.getElementById("lowestPrice").innerHTML = `Period lowest price: ${Number(lowestPrice / 10).toFixed(2)} \u00A2/KWh`;
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
    let low = data[0].price;
    for (var i = 0; i < data.length; i++) {
        if (data[i].price < low) {
            low = data[i].price;
        }
    }
    return low * 1.2;
}