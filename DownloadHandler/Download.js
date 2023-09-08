
// Downloading electricity price, consumption and the cost data to file
const downloadData = () => {
    const heading = document.getElementById("period").innerText;
    if(heading !== "Periood: -") {
        const dataObjToWrite = CookieHandler.GetSessionCookie("Merged_data");
        const blob = new Blob([dataObjToWrite], { type: "text/json" });
        const link = document.createElement("a");

        link.download = `${heading}.json`;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(evt);
        link.remove()
    }
    else {
        alert("There is no data to archive! Please provide data.");
    } 
};