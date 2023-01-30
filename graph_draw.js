let baseEleringData = null;

// Returns user date range from inputs
function dateRange () {
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
            baseEleringData = res.data.ee;
            // Prepare canvas
            let canvas = document.getElementById("npsPrices");
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#CCC";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Vertical graph line
            ctx.beginPath();
            ctx.moveTo(60, 25);
            ctx.lineTo(58, 30);
            ctx.moveTo(60, 25);
            ctx.lineTo(62, 30);
            ctx.moveTo(60, 25);
            ctx.lineTo(60, 200);
            // Horizontal graph line
            ctx.lineTo(475, 200);
            ctx.lineTo(470, 202);
            ctx.moveTo(475, 200);
            ctx.lineTo(470, 198);
            // Add text to graph
            ctx.font = "8px arial";
            ctx.fillStyle = "#000";
            ctx.fillText("0", 50, 210)
            ctx.fillText("NPS price", 10, 40);
            ctx.fillText("MWh", 10, 50);
            ctx.fillText("Hours", 425, 235);
            // Draws small strokes to horisontal line
            let widthBetweenPoints = 385/res.data.ee.length; // 385 is graph line length
            let dataPointCount = res.data.ee.length;
            let strokeStart = 60 + widthBetweenPoints;
            let strokeEnd = 57 + widthBetweenPoints;
            ctx.moveTo(strokeStart, 200);
            for(var i = 0; i < dataPointCount; i++) {
                let width = strokeStart + (i * widthBetweenPoints);
                ctx.moveTo(width, 195);
                ctx.lineTo(width, 205);
            }
            ctx.moveTo(strokeStart, 205);
            // Draws diagonal lines to small strokes on horisontal line
            for(var i = 0; i < dataPointCount; i++) {
                let width = strokeStart + (i * widthBetweenPoints);
                let width2 = strokeEnd + (i * widthBetweenPoints) - 1;
                ctx.moveTo(width, 205);
                ctx.lineTo(width2, 212);
                ctx.fillText(i+1, width2-5, 222);
            }
            // Filter out highest and lowest price within given data sample
            const highestPrice = maxPrice(res.data.ee);
            const lowestPrice = minPrice(res.data.ee);
            // Special rounding to uppest tenth number
            const highestPriceOnGraph = Math.round(highestPrice/10)*10;
            // Draws small strokes to vertical line
            dataPointCount = highestPriceOnGraph/5;
            widthBetweenPoints = 150/dataPointCount;
            let y = 200 - widthBetweenPoints;
            strokeStart = 55;
            strokeEnd = 65;
            for(var i = 0; i < dataPointCount; i++) {
                let width = y - (i * widthBetweenPoints);
                ctx.fillText(`${5 * (i + 1)}`, strokeStart-15, width);
                ctx.moveTo(strokeStart, width);
                ctx.lineTo(strokeEnd, width);
            }

            // Finalize graph drawing
            ctx.stroke();

            // Draws small coloured dots where hour price is on graph
            const fullCircleInRadians = 360*Math.PI/180

            widthBetweenPoints = 385/res.data.ee.length; // 385 is graph line length
            let calculatedX = 60;
            let calculatedY = 0;
            let baseY = 200;    

            for(const item of res.data.ee) {
                calculatedX += widthBetweenPoints;
                calculatedY = baseY - item["price"];
                hourPrice = item["price"];
                if(hourPrice <= 50) {
                    ctx.fillStyle = "#0F0";
                }
                else if(hourPrice > 50 && hourPrice <= 110) {
                    ctx.fillStyle = "#FF0";
                }
                else {
                    ctx.fillStyle = "#F00";
                }

                ctx.beginPath();
                ctx.arc(calculatedX, calculatedY, 3, 0, fullCircleInRadians, false);
                ctx.fill();

                // Fill lowest and highest prices to HTML
                document.getElementById("highestPrice").innerHTML = `Day highest price: ${highestPrice} €/KWh`;
                document.getElementById("lowestPrice").innerHTML = `Day lowest price: ${lowestPrice} €/KWh`;
            };
        })
        .catch(err => {throw err});
}

// Draw  Nord Pool Spot prices based on user selected date range
function calculate() {
    // Check if user did not choose date range
    let value1 = document.getElementById("date_start").value;
    let value2 = document.getElementById("date_end").value;
    if(value1.length == 0 || value2.length == 0) {
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
    const areaPrices = Object.values(eleringData);
    let max = 0;
    for(var i = 0; i < eleringData.length; i++) {
        if (areaPrices[i].price > max) {
            max = areaPrices[i].price;
        }
    }
    return max*1.2;
}

// Helper function for filtering out min price within dataset with VAT
function minPrice(eleringData) {
    const areaPrices = Object.values(eleringData);
    let low = areaPrices[0].price;
    for(var i = 0; i < eleringData.length; i++) {
        if(areaPrices[i].price < low) {
            low = areaPrices[i].price;
        }
    }
    return low*1.2;
}