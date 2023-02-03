# About creation of this thing....

Since Eesti Gaas nor Eesti Energia nor Elektrilevi nor anyone is not giving simple way on
viewing how much and with what cost as well as calculated total was electricity used, I
decided to create this simple tool for such thing. Purely put of curiosity, nothing more.
There is little of value about such data to oneself but as a learning tool in software
development and above else the quriosity, this small child was created. Here we will explore
on hardships a novice software developer faced after graduading vocational school where he
got Junior Software Developer "degree". Almost zero knowledge, almost zero mentorship, all
on its own. Maybe its better that way... Anyway...

## First hardship...
### What do you mean width and height are not width and height?!
HTML attribute and CSS style are different thing apparently when there is exactly same word
used. HTML canvas element width and heigth attribute are totally different thing than CSS
style attribute width and height. Let look at this code snippet to get the grasp of what I
mean.

HTML

```
<canvas id="canvas" width="500" heigth="250"></canvas>
```

CSS

```javascript
#canvas {
    width: 500,
    heigth: 250
}
```

The width and height specified in HTML canvas element are attributes. Those numbers are IN
PIXELS! Can't set those to em, rm, or even %. Browser will ignore those and will just use 500
and 250 and they will be in pixels.
The width and height in CSS code, are the different kind of width and height. Canvas use two
systems: one for rendering aka internal size, one for rendering canvas (the container for 
rendering) itself. That means when you set only CSS style for canvas, the canvas container
will only be set, the canvas internal width and height will not be set. That has to be managed
somehow else - either use HTML attribute or create canvas element with all the needed computed
width and heights with javascript or use both.

## Second hardship...
### Hey Papa Parse!
PapaParse is nice library for reading .CSV files. It can be used server-side or it can be used
client-side. Well for starters the documentation on how to initalize for using PapaParse was
well, nonexistent. Offcourse you import it through HTML script tag either in head or in the body
part, both have pros and cons for that part. Offcourse you then just call it through its class 
calling:

```javascript
Papa.parse(file, {
    {
        // This all is default configuration options taken from PapaParse documentation
        delimiter: "",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        step: undefined,
        complete: undefined,
        error: undefined,
        download: false,
        downloadRequestHeaders: undefined,
        downloadRequestBody: undefined,
        skipEmptyLines: false,
        chunk: undefined,
        chunkSize: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    }
});
```

e is not assigned: type error.
file is not assigned: argument1 error.
file is undefined: argument1 error.
file is this, file is that, file is none knows what...

There are various ways on how to get that damn file from the input.

First is:

HTML

```javascript
<input type="file" accept=".csv" required onChange="getFile(this)">
```

JavaScript

```javascript
function getFile(file) {
    Papa.Parse(file, {config});
}
```

Errors all the way...

Tried other ways also until I sumbled upon one nice solution:

HTML

```javascript
<input id="graph" type="file" accept=".csv" requiredš>
```

JavaScript

```javascript
const file = document.getElementById("csvFileInput").files[0];
Papa.Parse(file, {config});
```

Now it finnaly worked like a charm and altho there are many ways to retrieve file from
input, this one worked finnaly for whatever reason.

## Third hardship...
### What do you mean you cant set canvas size easily?!
Since I was not happy that initial canvas is only 500x250 px in size, I decided to increase its
width to maximum of its container size. But since my initial canvas was fully rendered in a function
where interpeter could not go until I pushed needed button, the canvas dimensions were set by
HTML attributes. Removed them, set the CSS style dimensions and nope, not gonna work... Not even when
set

CSS

```CSS
#canvas {
    width: inherit;
}
```
or

CSS

```CSS
#canvas {
    margin-left: 0px;
    margin-right: 0px;
}
```

Fixed it all by unfortunatelly moving setting canvas attributes from function scope to global scope
in javascript code. Why unfortunatelly? Because I was hoping I could get away with as less global
variables as possible initially.

## Fourth hardship...
### Ahhh... here we go again and let the fun begin!