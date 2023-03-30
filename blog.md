# About creation of this thing...

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

```html
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

JavaScript

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

### So SLOW!!!

When you have a lot of datapoints and you have to iterate all of them through, you know it will take
some time to iterate through. And then you face the wall of waiting... Its already irritating when its
not snappy, its irritating when it takes couple of seconds, even worse when it takes even longer
offcourse. I needed to draw a graph from roughly 700 datapoints. Its not much per se but it took around
1.7-2 seconds to itretare through and draw a graph from it. The graph was still incomplite so in the
process of making such file to have already 1.7-2 seconds of data reading and partial graph drawing,
well its already too much and only on roughtly 700 datapoints.
Lets see what we can do first and the simpliest.

JavaScript

```javascript
let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for(let i = 0; i < array.length; i++) {
    // do stuff
}
```

Whats wrong here? Perfectly working code realy. Perfectly fine code also! Its also very readable.
It is also not incorrect in any way realy since such code has its places all the time afterall.
So whats the problem here?
The problem is with reading the array length.
When you have big array and you have to read its lenght many times, lets say three times or more, its
better to read such array lenght once by asigning array lenght to a variable:

JavaScript

```javascript
let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const arrayLength = array.length;
for(let i = 0; i < arrayLength; i++) {
    // do stuff
}
```

Now its just a bit faster code! How much faster? In my very small data of 700 datapoints in array
and drawing just small strokes on a graph using for loop, instead of reading seven times array by
asigning array lenght to separate variable, gave me during small test very roughly 0.2 seconds of
time reduction on complite data reading and graph drawing. 0.2 seconds on just seven array lenght
readings that were moved to the separate variable.

## Fifth hardship!

### Comma is not a comma...

Remember those times when in floating numbers the comma means decimal points in those number? How
about a dot represents same thing? In real life depending on where you live, there is a possibility
that there are rules on what represents a floating point number on paper, lets say a math lesson.
I remember when floating points was acceptable to write down as 0,53 or 0.53, same thing on paper.
But not in CS or software development. So here we are, trying to use JavasScript built-in parseFloat()
function or Number.parseFloat() class function to parse a floating point number in its string
representation. The number was a string in a CSV file, so we need to convert it to a number. Easy right?
Not unless you remember that comma is not representing a decimal point in software development but
dot does. So when you try to parse 0,53, you will get NaN. However parsing 0.53 will give you a floating
point number.

JavaScript

```javascript
const number = "0,53";
parseFloat(number);
// Returns NaN
```

```javascript
const number = "0,53";
parseFloat(number.replace(",", "."));
// Returns 0.53, a number
```

Took some hours to figure out the problem but did not solve the next problem that came
because of exact problem of NaN after trying to parse incorrectly floating point number in its string
representation. For some reason even after fixing parsing of floating point number, the NaN error did
not go away in SVG drawing circle. For some reason drawing circle on cy position still returned NaN
error. That brings us to the.......

## Sixth hardship...

#### "Double or no deal..." - Home Alone 3, parrot words

### Floating point parsing continues

After having troubles with already parsing floating point numbers using parseFloat() built-in
JavaScript function, there were still some problems with NaN during drawing a graph in SVG.
Funny thing is JavaScript is very forgiving language on how you can work with numbers and strings.
Want to convert string to number? Lets say you have a string of 0,53. Multiply it by 1 and you get
number. Easy? Well such things eventually come and bite you hard! Just like it bit me...
Long before stumbling upon parseing problem I already worked with string represented numbers which
by the way were converted to numbers exactly because of such multiplication jokes while trying to
find the highest value or the lowest value without using built-in methods. Simple for loop, thats it.
Aparently when you evaluate numerical strings, the evaluation passes simply because that string-number
magic mumbo jumbo! Here is the code on how I found the highest consumption:

JavaScript

```javascript
let maxConsumption = 0;
    for (let i = 0; i < CSV_File_Data_Length; i++) {
        if(CSV_File_Results[i][4] >= maxConsumption) {
            maxConsumption = CSV_File_Results[i][4];
        }
    }
```

As you can see maxConsumption variable is a number and we are evaluating strings to the number.
Since javascript is very flexible on such things, the string is internaly converted to number,
evaluated and then it all passes, no problem at all. There is no === evaluation possible when
trying to see if a number is higher or lower than. That means no >== or <== evaluations. That
has to be done separately.
And that is where parsing bit me finnaly...

## Seventh hardship...

### I am getting used to it!

SVG is such great thing compared to Canvas that zooming page in or out scales perfectly the SVG
container albeit the internals are not scaled by itself. Canvas however did not automatically scale when
page is zoomed in or out... So... Its either rewrite Canvas to SVG since SVG is much more customizable
with CSS or do some flexbox etc magic. Better rewrite it to SVG, I like it more anyway after working
with both of them at the same time.

## Eighth hardship

### Redraw, redraw, redraw - why it takes so long to redraw?!

SVG is very powerful stuff but it comes with small negative side. When drawing something with SVG
you put a lot of stuff into DOM during drawing. When you redraw without clearing SVG container of
previously drawed stuff, it will take a lot and I mean a lot more time to draw stuff. And when it
does finish finnaly drawing, it draws stuff on top of previously drawn stuff because stuff was
in DOM already when you add even more stuff to DOM. The simple fix is to just clear the previously
drawn stuff out before drawing new stuff. Simple fix for that is this small piece of code:

Javascript

```javascript
document.getElementById("SVG").innerHTML = "";
```

Apply it to whatever you need to clear inside SVG and you will improve drastically speed of redrawing
if you need to draw a lot of stuff. In my case, drawing just roughly 700 small lines with all the needed
x and y vector calculations took on average 3.8 seconds. Redrawing before clearing DOM took over 12
seconds. Clearing DOM before redrawing, reduced redrawing speed back to 3.8 seconds. I clearly have to
find a way to increase SVG drawing speed because 3.8 seconds is still a lot of time to just do the
calculations on 700 elements and then it takes a second-two to actually show what has been calculated
and drawn.

## Nineth hardship

### Still, why it takes so long to draw SVG?!?!?!

Accessing DOM is time consuming, thats for sure. There are many ways how to reduce DOM access times
and access ammounts. Here is one:

JavaScript

```javascript
document.getElementById("SVG").innerHTML = "Something something";
/// vs
const element = document.getElementById("SVG");
element.innerHTML = "Something something";
```

The first way is useful when you need to do it 2-5 times. The second one is when you need to do it
hundret times. What about thousant times?
In that case is faster to do it this way:

JavaScript

```javascript
const element = document.getElementById("SVG");
let str = "";
for (let i = 0; i < 1000; i++) {
    str += "Something Something";
}
element.innerHTML = str;
```

How much faster? It increased speed of rendering SVG graph with Papa Parse library from 4 seconds down
to two seconds. Impressive speed increase but there surely is more ways to increase rendering speed
I hope because 2 seconds for doing work on data + some time more for actual graph rendering with SVG
is still in my opinion quite slow. Better than 4 seconds realy and finally graphs are starting to be
somewhat usefull. But on other graph, the Nord Pool Spot graph, it went from over 15 second rendering
of prices for 3 month time span to down to near instantly! Some serious speed increases right there!
By implementing same method for CSV graph generation, the speedreduction was outrageously massive
for roughly 700 datapoints - from 3.5 seconds down to 0.01 seconds! Now I am bound only by how fast
I can download data from Elering...

## Tenth hardship

### GMT+1? No no... GMT+2!

So we got so far that two initial separate graphs (consumption and price) have been merged into one.
Even more, the graph is filled with data automatically by selecting apropriate range of dates for
consumption and prices. Now we add cost graph based on consumption and prices for given period. But
before that we have massive problem of timezones... Where I live is GMT+2, where NPS prices come from
is GMT+1. The problem with that is that when prices come in, they are shown in my timezone starting
from 01:00 till next day 01:00. But I need them to start from 00:00 and end at 00:00. In essence
if data would come from 00:00 to 00:00, I would only need to ask for 24 hours of price data.
But since data that comes in starts from 01:00 and ends at 01:00 on the next day, I have to ask for
48 hours of data. Why? Because price data comes in 24 hour batches. So I have to select previous day
00:00-01:00 price, then select other 23 hours from the next day prices. Simple in words, a bit
troublesome in reality when little experience with timezoned data.
Days later still struggling albeit with at least some progress.
Many days later after I quit on the problem for a while only to return to it with fresh mind, I found
that converting date strings to ISO formats, takes into conideration the timeones. When parsing a date
of lets say 01.02.2023 00:00 GMT+2, the ISO format will substract the GMT+2 and the new date will be
2023-01-31T22:00:00.000Z, which suits me well for my needs I guess since substraction of GTM+2 is enough
for fetching proper data from Elering.
Since my date span comes in the form of 01.01.2023 - 31.01.2023 I had to convert it to better form for
Date constructor before I could work with time.

JavaScript

```javascript
// Take start date from 01.01.2023 - 31.01.2023
let date = date_span.substring(0, 10);
// Take substrings from start date string and feed them to Date constructor
let year = Number(date.substring(6, 10));
let month = Number(date.substring(3, 5))-1;     // Months is zero indexed
let day = Number(date.substring(0, 2));    
let dd = new Date(year, month, day);            // 01.02.2023 -> Wed Feb 01 2023 00:00:00 GMT+0200 (Eastern European Standard Time)

// Convert now proper DateTime to ISO Date Time which substracts GMT+2
const date_start = dd.toISOString();    // 01.01.2023 -> 2022-12-31T22:00:00.000Z
```

This is how I finnaly solved headache of timezones since timestamp is not timeone dependent.

## Eleventh hardship

### ES6 2015...

When I was learning in school, I remember we were using NodeJs for creating some of our miniprojects.
I remember we were using ES6 import-export modules stuff. Well it was great until it is not!
Importing and exporting is easy in JavaScript. Just write is like this:

JavaScript

```javascript
export default function Foo() {
    let bar = "tou";
    return bar;
}
```

And then when you want to import:

JavaScript

```javascript
import Foo from 'exported_module.js';
```

Looks simple, works simple, easy to understand. But here is the thing, you cant do it just like that.
In HTML you have to add one thing more, the type="module":

HTML

```html
<script src="exported_module.js" type="module"></script>
```

Should work now! Great! NOT! Unfortunatelly you cant use import-export of ES6 in local mode. You have
to use them when you have your application running on server. In my case we were using NodeJS for that,
hence no problems for us at that point in time. But we didnt learn about it back then and so started the
rabid hole of CORS! Back to doing stuff oldstyle since this application wil be fully local anyway. So we
are back to square one by just basic script tag in HTML code and src path to other JavaSript file. This
works but makes code quite a bit more bloated. Remember to add at least a small comment to reference from
where function'n'stuff came from.

## Twelvth hardship

### Y U NO LOOP OVER?!

Now this is some funny stuff that I have yet encountered by my memory only on javascript. Beg to pardon if
I am incorrect, memory fails me on this.
Looping over array with for loop in JavaScript has one small problem.

Javascript

```javascript
for (let i = 0; i < length; i++) {
    return array[i];
}
```

This piece of code works perfectly fine!

Javascript

```javascript
for (let i = 0; i < length; i++) {
    return array[i+1];
}
```

Now this piece did not work for whatever reason. Now before you start shouting ofcourse it does not work, I know
why this code does not work but let me show you where exacly same thing did not work but it should have worked.

Javascript

```javascript
let array = [a, b, c];
let array2 = [d, e, f, g, h, i];
for (let i = 0; i < array.length; i++) {
    return array[i] * array2[i+3];
}
```

Yep, this one should work and it doesnt.
It wont work even if I modify it a little.

Javascript

```javascript
let array = [a, b, c];
let array2 = [d, e, f, g, h, i];
let index = 3;
for (let i = 0; i < array.length; i++) {
    index += i;
    return array[i] * array2[index];
}
```

Again does not work! However, if I put inde into the for loop, then both of the last examples work!

Javascript

```javascript
let array = [a, b, c];
let array2 = [d, e, f, g, h, i];
for (let i = 0; i < array.length; i++) {
    let index = i + 3;
    return array[i] * array2[index];
}
```

Unfortunatelly this was incorrect way for me because the data was such that output was incorrect because
for whatever reason index did not increment but stayed at  value 3. Eventually I took the easier route
and just normalized data. Those two arrays had data: one with price, other from CSV file data.
CSV file data had lots of blank info like strings of text which I did not need at all. After all the text
the numbers came and the count of these numbers was exactly same as in the first array. So simple solution
was to loop over the second array and remove all the unnecessary parts to get two same length arrays. And
then ofcourse I could do the multiplication looping over arrays without any problems anymore.

Javascript

```javascript
let array = [a, b, c];
let array2 = [d, e, f, g, h, i];
let array3 = [];
for (let i = 3; i < array2.length; i++) {
    array3.push(array2[i]);
}

for(let i = 0; i < array.length; i++) {
    return array[i] * array2[i];
}
```

## Thirtheenth hardship

### Programming design pattern - Builder pattern

Supposedly it is the most used pattern in software development. It simplifies object creation by eliminating
all those confusing statements when assigning variables to the object.
Here is how the usual object is created

JavaScript

```javascript
class Object {
    constructor(variable1, variable2){
        this.foo = variable1,
        this.bar = variable2
    }

    method() {
        // Do some stuff
    }
}
```

And you use it like this:

JavaScript

```javascript
Main(){
    const obj = Object("Hello", "World!");
    console.log(obj.foo, obj.bar)
}
```

The problem is when you have a lot of variables to feed to Object when creating object. The problem is
even bigger when you dont have XML style comments or any other easy and fast reference to know what
variable goes exactly where. Same thing could easily be accidentally reversed. Lets see on this example:

JavaScript

```javascript
class Object {
    constructor(variable1, variable2){
        this.gasoline = variable1,
        this.withLPGdevice = variable2
    }

    method() {
        // Do some stuff
    }
}

Main(){
    const obj = Object(true, false);
    console.log(obj.gasoline, obj.withLPGdevice)
}
```

Great! You have lets say a car, that is now running on gasoline and it has extra LPG fuel system
to use alternative fuel. But then you make programming error:

JavaScript

```javascript
class Object {
    constructor(variable1, variable2){
        this.gasoline = variable1,
        this.withLPGdevice = variable2
    }

    method() {
        // Do some stuff
    }
}

Main(){
    const obj = Object(false, true);
    console.log(obj.gasoline, obj.withLPGdevice)
}
```

You dont know exactly when using objects this way if the gasoline object variable is the first variable
feeded and created during object construction. Behold the builder pattern that promises to solve this!
We basically nest a class within a second class. It is becoming a little of an assembly line - take one
wire and insert it to fast connector, second wire goes there to, etc and one all the wires are in place,
we get finished product. Translate it to programming language:

JavaScript

```javascript
// Still have our Object
class FastConnector {
    constructor(fastConnectorType, wireCount, wireType){
        this.FastConnectorType = fastConnectorType,
        this.WireCount = wireCount,
        this.WireType = wireType
    }
}

// Now we add object builder - the builder pattern emerges
class FastConnectorBuilder {
    SetFastConnectorType(fcType) {
        this.FastConnectorType = fsType;
        return this;
    }
    SetWireCount(count) {
        this.WireCount = count;
        return this;
    }
    SetWireType (type) {
        this.WireType = type;
        return this;
    }
    
    BuildFastConnector() {
        return new FastConnector(this.FastConnectorType, this.WireCount, this.WireType);
    }
}

// Instead of working directly with the object we want to create, we delegate that work to
// object building object. This way its more explicit about what we actually do with the object
// we want to create
Main(){
    const fastConnector = FastConnectorBuilder();
    fastConnector.SetFastConnectorType("male");
    fastConnector.SetWireCount(10);
    fastConnector.SetWireType("halogen free");
    fastConnector.BuildFastConnector();
}
```

And in theory its all great and good! Until I faced a challenge where for some reason accessing
variable from created object did not work. Investigation lead to the deletion of object the
builder class should have worked with. In builder pattern you have object and that object builder.
In my investigation case I could not access object variable and was using all the time the object
builder variables. After finding this out, I deleted object and left only object builder class.
And it worked without any hickups! Now why is that?! How?! That left me puzzeling that maybe I am
doing something wrong...
And I was doing somerthing wrong. Instead of creating builder object and then working with the object
I should have chained everything from builder object together into one single argument. Like this:

JavaScript

```javascript
// Instead of working directly with the object we want to create, we delegate that work to
// object building object. This way its more explicit about what we actually do with the object
// we want to create.
Main(){
    const fastConnector = FastConnectorBuilder()
    .SetFastConnectorType("male")
    .SetWireCount(10)
    .SetWireType("halogen free")
    .BuildFastConnector();
}
```

This way I finnaly was not seeing any builder variables with what I was initially working. This way
I am getting real FastConnector object instead of FastConenctorBuilder object.
Also variable naming is a tad bit pain when you have object and object builder already. Yet there is even
director as an optional class for Builder pattern that will delegate what builder to use. The chain of
command will look like this with Director class used: Director assigns builder work -> Builder chooses
Object to work with -> Object.

It lasted not realy long... The goodnes of builder pattern... It lasted just so long until I had to
create one builder but more than one object to build. And then we suddenly had long chain of variables
to feed to builder, inside builder and to the object itself. Even worse, the variables needed to be
pretty much similar. So similar that using ususal upper-lower case variable naming was exhausted with
_ symbol variable naming. Guess I'll have to resort to using # symbol also in naming of variables.
Anyway, once I reached a moment, where one builder had to build much more than just one to three objects,
I will finnaly need optional director class to delegate work to builders, otherwise lots of repetitive
code writing. Lets try to keep it clean (never to be achieved...).

## Fourteenth hardship

### What comes first - a chicken or an egg?

In the first design, when big pile of sphagetty code was created and of course it was working as intended,
everything was fine. Well, besides enomurous "AI of ifffffs!" for calculating a ratio number.
Such number was calculated using ifs where taking highest price of electricity it was evaluated and
ratio number was returned. This ratio number was used then to create dynamic price segments for electricity
price. Similar way was created for consumption and cost graphs but without "AI of iffffffs" of over 40 ifs.

When it came to refactoring code to use Builder pattern, this finnaly bit me. Its easy to make if else
statements, its repetetive to create 40-50 of them but okey, fine, happens when prototyping. But now
I had to figure out maybe some formula to find out the ratio number with simple calculation.
Which brought me to the allfamous chicken and egg problem - which came first?
Here how it looked like:

JavaScript

```javascript
function priceRatio (price) {
    let ratio = 0;
    if (price < 10) {
        ratio = 5;
    }
    else if (price >= 10 && price < 30) {
        ratio = 1;
    }
    else if (price >= 30 && price < 50) {
        ratio = 2;
    }
    // and so on... 50 ifs.... Behold the AI of IFFFFFFFSSSSSS!

    return ratio;
}
```

In order to find ratio number I needed highest value or whatever: electricity, cost, consumption, you name it.
That I had, this is our egg. But the chicken is the ratio number.
In order to find out the price segments I need both highest price and ratio number. The division between them
gave me the price segment number. For an example: if highest price was 30, then ratio number would be 3, then
I would have three segments of price, each worth 10. The graph price segments then would be 0 -> 10 -> 20 -> 30.
So simple! Yet I need the ratio number first before I can do such calculations. Here how it all looks like:

JavaScript

```javascript
function main() {
    const price = 30;
    const ratio = priceRatio(price);
    const price_segment_count = price / ratio;

    for(let i = 0; i < price_segment_count; i++){
        console.log(`draw price segment: ${ratio * i}`);
    }
}

function priceRatio (price) {
    let ratio = 0;
    if (price < 10) {
        ratio = 5; // even smaller segmentation in case price is below 10
    }
    else if (price >= 10 && price < 20) {
        ratio = 2;
    }
    else if (price >= 20 && price < 30) {
        ratio = 3;
    }
    // and so on... 50 ifs.... Behold the AI of IFFFFFFFSSSSSS!

    return ratio;
}
```

But same ratio number was used also for finding highest price level and the highest price level
when was the highest point on the graph. From this highest point and the ratio number came the
price segment point where a line was drawn. This ratio number must come before anything else
but I cant find ratio number without anything else before, hence chicken and egg problem.

Solution? Find some other method on how to ratio price segments based on highest value.


## Fifteenth hardship
