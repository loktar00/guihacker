// Chooses a random element from an array
function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// A collection of jargon
jargonWords = {
   acronyms: 
      ["TCP", "HTTP", "SDD", "RAM", "GB", "CSS", "SSL", "AGP", "SQL", "FTP", "PCI", "AI", "ADP",
       "RSS", "XML", "EXE", "COM", "HDD", "THX", "SMTP", "SMS", "USB", "PNG", "PHP", "UDP", 
       "TPS", "RX", "ASCII", "CD-ROM", "CGI", "CPU", "DDR", "DHCP", "BIOS", "IDE", "IP", "MAC", 
       "MP3", "AAC", "PPPoE", "SSD", "SDRAM", "VGA", "XHTML", "Y2K", "GUI", "EPS"], 
   adjectives:
      ["auxiliary", "primary", "back-end", "digital", "open-source", "virtual", "cross-platform",
       "redundant", "online", "haptic", "multi-byte", "bluetooth", "wireless", "1080p", "neural",
       "optical", "solid state", "mobile", "unicode", "backup", "high speed", "56k", "analog", 
       "fiber optic", "central", "visual", "ethernet", "Griswold"], 
   nouns:
      ["driver", "protocol", "bandwidth", "panel", "microchip", "program", "port", "card", 
       "array", "interface", "system", "sensor", "firewall", "hard drive", "pixel", "alarm", 
       "feed", "monitor", "application", "transmitter", "bus", "circuit", "capacitor", "matrix", 
       "address", "form factor", "array", "mainframe", "processor", "antenna", "transistor", 
       "virus", "malware", "spyware", "network", "internet", "field", "acutator", "tetryon",
       "beacon", "resonator"], 
   participles:
      ["backing up", "bypassing", "hacking", "overriding", "compressing", "copying", "navigating", 
       "indexing", "connecting", "generating", "quantifying", "calculating", "synthesizing", 
       "inputting", "transmitting", "programming", "rebooting", "parsing", "shutting down", 
       "injecting", "transcoding", "encoding", "attaching", "disconnecting", "networking",
       "triaxilating", "multiplexing", "interplexing", "rewriting", "transducing",
       "acutating", "polarising"
]};

// Generates a random piece of jargon
function jargon() {
    let raw = choose(jargonWords.participles) + " " + choose(jargonWords.adjectives) + " " +
        choose(jargonWords.acronyms) + " " + choose(jargonWords.nouns);
    return raw.capitalizeFirstLetter()
}

/* Graphics stuff */
function Square(z) {
    this.width = settings.canvas.width/2;
    this.height = settings.canvas.height;
    z = z || 0;

    var canvas = settings.canvas;

    this.points = [
        new Point({
            x: (canvas.width / 2) - this.width,
            y: (canvas.height / 2) - this.height,
            z: z,
        }),
        new Point({
            x: (canvas.width / 2) + this.width,
            y: (canvas.height / 2) - this.height,
            z: z
        }),
        new Point({
            x: (canvas.width / 2) + this.width,
            y: (canvas.height / 2) + this.height,
            z: z
        }),
        new Point( {
            x: (canvas.width / 2) - this.width,
            y: (canvas.height / 2) + this.height,
            z: z
        })
    ];
    this.dist = 0;
}

Square.prototype.update = function () {
    for (var p = 0; p < this.points.length; p++) {
        this.points[p].rotateZ(0.001);
        this.points[p].z -= 3;
        if (this.points[p].z < -300) {
            this.points[p].z = 2700;
        }
        this.points[p].map2D();
    }
};

Square.prototype.render = function () {
    settings.ctx.beginPath();
    settings.ctx.moveTo(this.points[0].xPos, this.points[0].yPos);

    for (var p = 1; p < this.points.length; p++) {
        if (this.points[p].z > -(settings.focal - 50)) {
            settings.ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
        }
    }

    settings.ctx.closePath();
    settings.ctx.stroke();

    this.dist = this.points[this.points.length - 1].z;
};

function Point(pos) {
    this.x = pos.x - settings.canvas.width / 2 || 0;
    this.y = pos.y - settings.canvas.height / 2 || 0;
    this.z = pos.z || 0;

    this.cX = 0;
    this.cY = 0;
    this.cZ = 0;

    this.xPos = 0;
    this.yPos = 0;

    this.map2D();
}

Point.prototype.rotateZ = function (angleZ) {
    var cosZ = Math.cos(angleZ),
        sinZ = Math.sin(angleZ),
        x1 = this.x * cosZ - this.y * sinZ,
        y1 = this.y * cosZ + this.x * sinZ;

    this.x = x1;
    this.y = y1;
};

Point.prototype.map2D = function () {
    var scaleX = settings.focal / (settings.focal + this.z + this.cZ),
        scaleY = settings.focal / (settings.focal + this.z + this.cZ);

    this.xPos = settings.vpx + (this.cX + this.x) * scaleX;
    this.yPos = settings.vpy + (this.cY + this.y) * scaleY;
};

// ** Main function **//
function GuiHacker(){
    this.squares = [];

    this.barVals = [];
    this.sineVal = [];

    for (var i = 0; i < 15; i++) {
        this.squares.push(new Square(-300 + (i * 200)));
    }

    // Console stuff
    this.responses      = [
                            'Authorizing ',
                            'Authorized...',
                            'Access Granted..',
                            'Going Deeper....',
                            'Compression Complete.',
                            'Compilation of Data Structures Complete..',
                            'Entering Security Console...',
                            'Encryption Unsuccesful Attempting Retry...',
                            'Waiting for response...',
                            '....Searching...',
                            'Calculating Space Requirements '
                            ];
    this.isProcessing = false;
    this.processTime = 0;
    this.lastProcess = 0;

    this.render();
    this.consoleOutput();
}

GuiHacker.prototype.render = function(){
    var ctx = settings.ctx,
        canvas = settings.canvas,
        ctxBars = settings.ctxBars,
        canvasBars = settings.canvasBars;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.squares.sort(function (a, b) {
        return b.dist - a.dist;
    });

    for (var i = 0, len = this.squares.length; i < len; i++) {
        var square = this.squares[i];
        square.update();
        square.render();
    }

    ctxBars.clearRect(0, 0, canvasBars.width, canvasBars.height);

    ctxBars.beginPath();
    var y = canvasBars.height/6;
    ctxBars.moveTo(0,y);

    for(i = 0; i < canvasBars.width; i++){
        var ran = (Math.random()*20)-10;
        if(Math.random() > 0.98){
             ran = (Math.random()*50)-25;
        }
        ctxBars.lineTo(i, y + ran);
    }

    ctxBars.stroke();

    for(i = 0; i < canvasBars.width; i+=20){
        if(!this.barVals[i]){
            this.barVals[i] = {
                val : Math.random()*(canvasBars.height/2),
                freq : 0.1,
                sineVal : Math.random()*100
            };
        }

        var barVal = this.barVals[i];
        barVal.sineVal+=barVal.freq;
        barVal.val+=Math.sin(barVal.sineVal*Math.PI/2)*5;
        ctxBars.fillRect(i+5,canvasBars.height,15,-barVal.val);
    }

    var self = this;
    requestAnimationFrame(function(){self.render();});
};

// Generates a random binary, hexadecimal or floating-point number (as a string)
function scaryNum() {
    let rand = Math.random()
    let rand2 = Math.random()
    
    if (rand2 > 0.7) {
        let bigNum = rand * 1000000000
        return bigNum.toString(16).split('.')[0] // big hexadecimal
    } else if (rand2 > 0.4) {
        let longNum = rand * 100000000000
        return longNum.toString(2).split('.')[0] // big binary
    } else {
        return rand.toString() // float
    }
}

GuiHacker.prototype.consoleOutput = function(){
    var textEl = document.createElement('p');

    if(this.isProcessing){
        textEl = document.createElement('span');
        textEl.textContent += scaryNum() + " ";
        if(Date.now() > this.lastProcess + this.processTime){
            this.isProcessing = false;
        }
    }else{
        var commandType = ~~(Math.random()*4);
        switch(commandType){
            case 0:
                textEl.textContent = jargon()
                break;
            case 3:
                this.isProcessing = true;
                this.processTime = ~~(Math.random()*5000);
                this.lastProcess = Date.now();
                break;
            default:
                 textEl.textContent = this.responses[~~(Math.random()*this.responses.length)];
            break;
        }
    }

    var outputConsole = settings.outputConsole;
    outputConsole.scrollTop = outputConsole.scrollHeight;
    outputConsole.appendChild(textEl);

    if (outputConsole.scrollHeight > window.innerHeight) {
       var removeNodes = outputConsole.querySelectorAll('*');
       for(var n = 0; n < ~~(removeNodes.length/3); n++){
            outputConsole.removeChild(removeNodes[n]);
        }
    }

    var self = this;
    setTimeout(function(){self.consoleOutput();}, ~~(Math.random()*200));
};


// Settings
var settings = {
       canvas           : document.querySelector(".hacker-3d-shiz"),
       ctx              : document.querySelector(".hacker-3d-shiz").getContext("2d"),
       canvasBars       : document.querySelector(".bars-and-stuff"),
       ctxBars          : document.querySelector(".bars-and-stuff").getContext("2d"),
       outputConsole    : document.querySelector(".output-console"),
       vpx              : 0,
       vpy              : 0,
       focal            : 0,
       color            : "#00FF00",
       title            : "Gui Hacker",
       gui              : true
    },
    hash = decodeURIComponent(document.location.hash.substring(1)),
    userSettings = {};

if (hash){
    userSettings = JSON.parse(hash);
    if(userSettings && userSettings.title !== undefined){
        document.title = userSettings.title;
    }

    if(userSettings && userSettings.gui !== undefined){
        settings.gui = userSettings.gui;
    }

    settings.color = userSettings.color || settings.color;
}

var adjustCanvas = function(){
    if(settings.gui){
        settings.canvas.width = (window.innerWidth/3)*2;
        settings.canvas.height = window.innerHeight / 3;

        settings.canvasBars.width = window.innerWidth/3;
        settings.canvasBars.height = settings.canvas.height;

        settings.outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
        settings.outputConsole.style.top = window.innerHeight / 3 + 'px';

        settings.focal = settings.canvas.width / 2;
        settings.vpx = settings.canvas.width / 2;
        settings.vpy = settings.canvas.height / 2;

        settings.ctx.strokeStyle = settings.ctxBars.strokeStyle = settings.ctxBars.fillStyle = settings.color;
    }else{
        document.querySelector(".hacker-3d-shiz").style.display = "none";
        document.querySelector(".bars-and-stuff").style.display = "none";
    }
        document.body.style.color = settings.color;
    }(),
    guiHacker = new GuiHacker(settings);


window.addEventListener('resize', adjustCanvas);
