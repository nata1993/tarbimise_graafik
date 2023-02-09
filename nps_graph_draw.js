
// Get canvas parent container calculated width
const svgNPS = document.getElementById("npsPrices");
let svgWidth = svgNPS.getBoundingClientRect().width;

// Returns user date range from inputs
function dateRange() {
    const date_start = document.getElementById("date_start");
    const date_end = document.getElementById("date_end");
    const date_settings = [];
    date_settings.push(date_start.value, date_end.value);
    return date_settings;
}

// Use user set date range for retrieving Nord Pool Spot electricity prices
// from Elering API and generate prices graph
function getDataFromElering(date_setting) {
    const url = `https://dashboard.elering.ee/api/nps/price?start=${date_setting[0]}T00%3A00%3A00.000Z&end=${date_setting[1]}T00%3A00%3A00.000Z`;
    fetch(url)
        .then((response) => response.json())
        .then((res) => {
            // Clear SVG before drawing incase of redrawing
            let baseGraph = document.getElementById("npsBaseGraph");
            document.getElementById("npsPriceVector").innerHTML = "";
            document.getElementById("npsText").innerHTML = "";
            const data = res.data.ee;
            // Prepare canvas
            baseGraph.innerHTML = "";
            const offsetFromEnd = 50;   // Defines offset from SVG container end in pixels
            let endPosition = svgWidth - offsetFromEnd;
            const strokesEndPosition = endPosition - 85;
            let baseGraphCoordinates = {
                x: [60, 58, 60, 62, 60, 60, 60, endPosition, endPosition, endPosition-5, endPosition, endPosition-5],
                y: [25, 30, 25, 30, 25, 200, 200, 200, 200, 202, 200, 198]
            };
            for(let i = 0; i < baseGraphCoordinates.x.length; i+=2) {
                baseGraph.innerHTML += `<line x1="${baseGraphCoordinates.x[i]}" y1="${baseGraphCoordinates.y[i]}" x2="${baseGraphCoordinates.x[i+1]}" y2="${baseGraphCoordinates.y[i+1]}" />`;
            }
            // Draws small strokes to horisontal line
            const dataPointCount = res.data.ee.length+1;
            const horWidthBetweenPoints = strokesEndPosition / dataPointCount;
            let strokePosition = 60;
            for (var i = 0; i < dataPointCount; i++) {
                let width = strokePosition + (i * horWidthBetweenPoints);
                baseGraph.innerHTML += `<line x1="${width}" y1="${200}" x2="${width}" y2="${205}" />`;
            }
            // Filter out highest and lowest price within given data sample
            const highestPrice = maxPrice(data);
            const lowestPrice = minPrice(data);
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
                let width = 200 - (i * verWidthBetweenPoints);
                baseGraph.innerHTML += `<line x1="${60}" y1="${width}" x2="${55}" y2="${width}" />`;
            }
            // Draws continuous line of prices on graph
            let baseY = 200;
            let x1 = 60;
            let x2 = 60 + horWidthBetweenPoints;
            const ratio = 175 / highestPrice; // Ratio between 175px height of vertical graph and highest price
            let verticleGroup = document.getElementById("npsPriceVector");
            for (const item of data) {
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
            let textGroup = document.getElementById("npsText");
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

// Draw Nord Pool Spot prices based on user selected date range
function calculate() {
    // Check if user did not choose date range
    let value1 = document.getElementById("date_start").value;
    let value2 = document.getElementById("date_end").value;
    if (value1.length == 0 || value2.length == 0) {
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
        const date_setting = dateRange();
        getDataFromElering(date_setting);
    }
}

// Helper function for filtering out max price within dataset with VAT
function maxPrice(eleringData) {
    let max = 0;
    for (var i = 0; i < eleringData.length; i++) {
        if (eleringData[i].price > max) {
            max = eleringData[i].price;
        }
    }
    return max * 1.2;
}

// Helper function for filtering out min price within dataset with VAT
function minPrice(eleringData) {
    let low = eleringData[0].price;
    for (var i = 0; i < eleringData.length; i++) {
        if (eleringData[i].price < low) {
            low = eleringData[i].price;
        }
    }
    return low * 1.2;
}