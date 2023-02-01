// take 
let g =  document.getElementById("graph");
let n = [60, 25, 60, 200, 60, 200, 475, 200, 60, 20, 58, 25, 60, 20, 62, 25, 475, 200, 470, 202, 475, 200, 470, 198];
for(let i = 0; i < n.length; i+=4) {
    g.innerHTML += `<line x1="${n[i]}" y1="${n[i+1]}" x2="${n[i+2]}" y2="${n[i+3]}" />`;
}
let hzWidth = 400/25;
for(let i = 1; i < 25; i++) {
    g.innerHTML += `<line x1="${60 + hzWidth*i}" y1="${195}" x2="${60 + hzWidth*i}" y2="${205}" />`;
}