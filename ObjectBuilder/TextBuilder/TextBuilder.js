class TextBuilder {
    static SetTextVariablesAndBuildText(id, x, y, font, fontSize, opacity) {
        const element = document.getElementById(id);
        element.style.fontFamily = font;
        element.style.fontSize = fontSize;
        element.style.opacity = opacity;
        text = "";

        text += this._AddEleringGraphText(text, x, y[0]);
        text += this._AddConsumptionGraphText(text, x, y[1]);
        text += this._AddCostGraphText(text, x, y[2]);

        element.innerHTML += text;
    }

    static _AddEleringGraphText (_text, x, y) {
        _text += `<text x="${x}" y="${y}">NPS price</text>`;
        _text += `<text x="${x}" y="${y}">€/kWh</text>`;
        _text += `<text x="${x}" y="${y}">0</text>`;
        _text += `<text x="${x}" y="${y}">insert max price</text>`;
        return _text;
    }
    static _AddConsumptionGraphText (_text, x, y) {
        _text += `<text x="${x}" y="${y}">Consumption</text>`;
        _text += `<text x="${x}" y="${y}">kWh</text>`;
        _text += `<text x="${x}" y="${y}">0</text>`;
        _text += `<text x="${x}" y="${y}">insert max consumption</text>`;
        return _text;
    }
    static _AddCostGraphText (_text, x, y) {
        _text += `<text x="${x}" y="${y}">Cost</text>`;
        _text += `<text x="${x}" y="${y}">€</text>`;
        _text += `<text x="${x}" y="${y}">0</text>`;
        _text += `<text x="${x}" y="${y}">insert max cost</text>`;
        return _text;
    }
}