class ErrorBuilder {
    /*
    static SetupErrorText (fontFamily, fontSize, id) {
        const element = document.getElementById(id);
        element.style.fontFamily = fontFamily;
        element.style.fontSize = fontSize;
        return this.element;
    }
    */
    static DisplayFeatureNotImplemented (fontFamily, fontSize, id) {
        let width = document.getElementById("graph_main_container").getBoundingClientRect().width;
        let height = document.getElementById("graph_main_container").getBoundingClientRect().height;
        
        width = width / 4;
        height = height / 4;

        const element = document.getElementById(id);
        element.style.fontFamily = fontFamily;
        element.style.fontSize = fontSize;
        element.innerHTML = `<text x="${height}" y="${width}">Feature not yet implemented</text>`;
    }
    static DisplayError (fontFamily, fontSize, id) {
        let width = document.getElementById("graph_main_container").getBoundingClientRect().width;
        let height = document.getElementById("graph_main_container").getBoundingClientRect().height;

        width = width / 4;
        height = height / 4;

        const element = document.getElementById(id);
        element.style.fontFamily = fontFamily;
        element.style.fontSize = fontSize;
        element.innerHTML = `<text x="${height}" y="${width}">There was an error. Bugfix is not yet implemented.</text>`;
    } 
}