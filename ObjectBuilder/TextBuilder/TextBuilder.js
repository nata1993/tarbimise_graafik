class TextBuilder {
    static AddElectricityGraphText (id) {
        const element = document.getElementById(id);
        element.style.fontFamily = "Arial";
        element.style.fontSize = 8;
        element.style.color = "#000000";
        element.style.opacity = 0.5;
        text = "";
        text += `<text x="${25}" y="${25}">Electricity price</text>`;
        text += `<text x="${50}" y="${50}"></text>`;
        text += `<text x="${100}" y="${100}"></text>`;
        text += `<text x="${100}" y="${100}"></text>`;
        text += `<text x="${100}" y="${100}"></text>`;
        text += `<text x="${100}" y="${100}"></text>`;
        text += `<text x="${100}" y="${100}"></text>`;
        element.innerHTML += text;
    }
/*
    static AddConsumptionGraphText (id) {
        const element = document.getElementById(id);
        element.style.fontFamily = "Arial";
        element.style.fontSize = 8;
        element.style.opacity = 0.5;
        text = "";
        text += `<text x="${}" y="${}">Consumption</text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        element.innerHTML += text;
    }

    static AddCostGraphText (id) {
        const element = document.getElementById(id);
        element.style.fontFamily = "Arial";
        element.style.fontSize = 8;
        element.style.opacity = 0.5;
        text = "";
        text += `<text x="${}" y="${}">Cost</text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        text += `<text x="${}" y="${}"></text>`;
        element.innerHTML += text;
    }
    */
}