var canvas = document.querySelector(".hacker-3d-shiz"),
    ctx = canvas.getContext("2d"),
    canvasBars = document.querySelector(".bars-and-stuff"),
    ctxBars = canvasBars.getContext("2d"),
    outputConsole = document.querySelector(".output-console");

canvas.width = (window.innerWidth/3)*2;
canvas.height = window.innerHeight / 3;

canvasBars.width = window.innerWidth/3;
canvasBars.height = canvas.height;

outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
outputConsole.style.top = window.innerHeight / 3 + 'px'


/* Graphics stuff */
function Square(z) {
    this.width = canvas.width/2;
    this.height = canvas.height;
    z = z || 0;

    this.points = [
    new Point({
        x: (canvas.width / 2) - this.width,
        y: (canvas.height / 2) - this.height,
        z: z
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
    new Point({
        x: (canvas.width / 2) - this.width,
        y: (canvas.height / 2) + this.height,
        z: z
    })];
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
}

Square.prototype.render = function () {
    ctx.beginPath();
    ctx.moveTo(this.points[0].xPos, this.points[0].yPos);
    for (var p = 1; p < this.points.length; p++) {
        if (this.points[p].z > -(focal - 50)) {
            ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
        }
    }

    ctx.closePath();
    ctx.stroke();

    this.dist = this.points[this.points.length - 1].z;

};

function Point(pos) {
    this.x = pos.x - canvas.width / 2 || 0;
    this.y = pos.y - canvas.height / 2 || 0;
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
}

Point.prototype.map2D = function () {
    var scaleX = focal / (focal + this.z + this.cZ),
        scaleY = focal / (focal + this.z + this.cZ);

    this.xPos = vpx + (this.cX + this.x) * scaleX;
    this.yPos = vpy + (this.cY + this.y) * scaleY;
};

// Init graphics stuff
var squares = [],
    focal = canvas.width / 2,
    vpx = canvas.width / 2,
    vpy = canvas.height / 2,
    barVals = [],
    sineVal = 0;

for (var i = 0; i < 15; i++) {
    squares.push(new Square(-300 + (i * 200)));
}

//ctx.lineWidth = 2;
ctx.strokeStyle = ctxBars.strokeStyle = ctxBars.fillStyle = '#00FF00';

/* fake console stuff */
var commandStart = ['Performing DNS Lookups for',
                'Searching ',
                'Analyzing ',
                'Estimating Approximate Location of ',
                'Compressing ',
                'Requesting Authorization From : ',
                'wget -a -t ',
                'tar -xzf ',
                'Entering Location ',
                'Compilation Started of ',
                 'Downloading '],
    commandParts = ['Data Structure',
                    'http://wwjd.com?au&2',
                    'Texture',
                    'TPS Reports',
                    ' .... Searching ... ',
                    'http://zanb.se/?23&88&far=2',
                    'http://ab.ret45-33/?timing=1ww'],
    commandResponses = ['Authorizing ',
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
                ],
    isProcessing = false,
    processTime = 0,
    lastProcess = 0;


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    squares.sort(function (a, b) {
        return b.dist - a.dist;
    });
    for (var i = 0, len = squares.length; i < len; i++) {
        squares[i].update();
        squares[i].render();
    }

    ctxBars.clearRect(0, 0, canvasBars.width, canvasBars.height);

    ctxBars.beginPath();
    var y = canvasBars.height/6;
    ctxBars.moveTo(0,y);

    for(i = 0; i < canvasBars.width; i++){
        var ran = (Math.random()*20)-10;
        if(Math.random() > 0.98){
             ran = (Math.random()*50)-25
        }
        ctxBars.lineTo(i, y + ran);
    }

    ctxBars.stroke();

    for(i = 0; i < canvasBars.width; i+=20){
        if(!barVals[i]){
            barVals[i] = {
                val : Math.random()*(canvasBars.height/2),
                freq : 0.1,
                sineVal : Math.random()*100
            };
        }

        barVals[i].sineVal+=barVals[i].freq;
        barVals[i].val+=Math.sin(barVals[i].sineVal*Math.PI/2)*5;
        ctxBars.fillRect(i+5,canvasBars.height,15,-barVals[i].val);
    }

    requestAnimationFrame(render);
}

function consoleOutput(){
    var textEl = document.createElement('p');

    if(isProcessing){
        textEl = document.createElement('span');
        textEl.textContent += Math.random() + " ";
        if(Date.now() > lastProcess + processTime){
            isProcessing = false;
        }
    }else{
        var commandType = ~~(Math.random()*4);
        switch(commandType){
            case 0:
                textEl.textContent = commandStart[~~(Math.random()*commandStart.length)] + commandParts[~~(Math.random()*commandParts.length)];
                break;
            case 3:
                isProcessing = true;
                processTime = ~~(Math.random()*5000);
                lastProcess = Date.now();
            default:
                 textEl.textContent = commandResponses[~~(Math.random()*commandResponses.length)];
            break;
        }
    }

    outputConsole.scrollTop = outputConsole.scrollHeight;
    outputConsole.appendChild(textEl);

    if (outputConsole.scrollHeight > window.innerHeight) {
       var removeNodes = outputConsole.querySelectorAll('*');
       for(var n = 0; n < ~~(removeNodes.length/3); n++){
            outputConsole.removeChild(removeNodes[n]);
        }
    }

    setTimeout(consoleOutput, ~~(Math.random()*200));
}

render();
consoleOutput();


window.addEventListener('resize', function(){
      canvas.width = (window.innerWidth/3)*2;
      canvas.height = window.innerHeight / 3;

      canvasBars.width = window.innerWidth/3;
      canvasBars.height = canvas.height;

      outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
      outputConsole.style.top = window.innerHeight / 3 + 'px';

      focal = canvas.width / 2;
      vpx = canvas.width / 2;
      vpy = canvas.height / 2;
      ctx.strokeStyle = ctxBars.strokeStyle = ctxBars.fillStyle = '#00FF00';
});