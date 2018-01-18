$("#canvas").click(function(e){
    var position = getPosition(e); 
    switch(currentTool){
        case 'DRAW':
            addNewPoints(position);
            break;
        case 'MOVE':
            if(moveFigure.figureSelected){
                figures[moveFigure.indexFigure].points[moveFigure.indexPoint] = position;
                moveFigure.figureSelected = false;
                currentFigureNumber = moveFigure.indexFigure;
                reDraw();
            }
            else{
                clickOnFigure(position);
            }
            break;
        case 'CLONE':
            if(moveFigure.figureSelected){
                figures[moveFigure.indexFigure].points.push(position);
                moveFigure.figureSelected = false;
                currentFigureNumber = moveFigure.indexFigure;
                reDraw();
            }
            else{
                clickOnFigure(position);
            }
            break;
        case 'DELETE':
            console.log('delete');
            clickOnFigure(position);
            if(moveFigure.figureSelected){
                console.log('delete this point');
                figures[moveFigure.indexFigure].points.splice(moveFigure.indexPoint, 1);
                moveFigure.figureSelected = false;
                currentFigureNumber = moveFigure.indexFigure;
                reDraw();
            }
            break;
        default:
            break;
    }
});
 


function clickOnFigure(coord){
    var index;
    for (index = figures.length - 1; index >= 0; --index) {
        switch(figures[index].styleMode){
            case 'points':  
                figures[index].points.forEach(function (point, number){
                    if(positionInCircle(point, coord, figures[index].pointSize)){
                        moveFigure = {
                            'indexFigure': index,
                            'indexPoint': number,
                            'figureSelected': true,
                            'point': point
                        }
                        return;
                    }
                });
            break;
            case 'line':  
                figures[index].points.forEach(function (point, number){
                    if(positionInCircle(point, coord, figures[index].pointSize)){
                        moveFigure = {
                            'indexFigure': index,
                            'indexPoint': number,
                            'figureSelected': true,
                            'point': point
                        }
                        return;
                    }
                });
                break;
            default:
                alert( 'Unknown Mode' );
        };
    }
}
function positionInCircle(point, position, pointSize){
    if( (position.coordX <= point.coordX+pointSize*2) && (position.coordX >= point.coordX-pointSize*2) &&
        (position.coordY <= point.coordY+pointSize*2) && (position.coordY >= point.coordY-pointSize*2))
    {
            return true;
    }
    return false;
}
function getPosition(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    var coord = {
        'coordX':x,
        'coordY':y
    }
    return coord; 
};

function addNewPoints(coord){
    points.push(coord);   
    switch(styleMode){
        case 'points':  // if (x === 'value1')
            drawCoordinates(coord.coordX,coord.coordY,pointSize,currentColor);
            break;
        case 'line':  // if (x === 'value1')
            drawLines(points, pointSize);
            break;
        default:
            alert( 'Unknown Mode' );
    };  
}

function drawCoordinates(x,y,size,color){	

    var ctx = document.getElementById("canvas").getContext("2d");

    ctx.fillStyle = color; // Red color

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.fill();
};

/* ключевые кадры анимации */
var currentTool = 'NONE';

/* перемещение фигуры */
var moveFigure = {
    'indexFigure': 0,
    'indexPoint': 0,
    'figureSelected':false,
    'point': {}
}


/* ключевые кадры анимации */
var frames = [];

/* фигуры на текущем кадре */
var figures = [];

/* стиль отображения точек */
var styleMode = 'points';

/* Текущий размер кругов */
var pointSize = document.getElementById('size').value;

/* Точки текущей фигуры */
var points = [];

/* Текущий цвет */
var currentColor = 'black';

/* рисуемая фигура */
var currentDrawFigure = {
    'points': points,
    'styleMode': styleMode,
    'pointSize': pointSize,
    'color': currentColor
}

/* Текущая фигура */
var currentFigureNumber = -1;

/* Изменение диаметра кругов */
$("#size").bind("click change",function(e){
    pointSize = $(this).val();
    if(styleMode === 'points'){
        reDraw();
    }
});

/**
 * 
 * @param {*} curentPoints 
 * @param {*} size 
 */
function drawLines(curentPoints,size){
    var context = document.getElementById("canvas").getContext("2d");
    //if(points.length > 0){
        context.beginPath();
        curentPoints.forEach(function (element, index){
            if (index === curentPoints.length - 1)
            { 
                console.log("Last callback call at index " + " with value "); 
            }
            else
            {
                context.moveTo(element.coordX, element.coordY);
                context.lineTo(curentPoints[index+1].coordX, curentPoints[index+1].coordY, size);  
                context.strokeStyle = '#000000';
                context.stroke();
            }
        });
    //}
    /*else{
        context.fillStyle = 'black'; // Red color
        context.beginPath();
        context.arc(points[0].coordX, points[0].coordY, 2
            , 0, Math.PI * 2, true);
        context.fill();
    } */
};

/**
 * переключение режима в отображение линий
 */
$("#line").click(function(e){
    styleMode = 'line';
    if (currentFigureNumber >0){
        figures[currentFigureNumber].styleMode = styleMode;
    }
    reDraw();
});

/**
 * переключение режима в отображение точек
 */
$("#points").click(function(e){
    styleMode = 'points';
    if (currentFigureNumber >0){
        figures[currentFigureNumber].styleMode = styleMode;
    }
    reDraw();
});
/**
 * Перерисовка канваса
 * 
 */
function reDraw(){
    var context = document.getElementById("canvas").getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    //перерисовать все фигуры
    reDrawAllFigures();
    //и текущую
    if(points!=0){
        console.log('reDraw');
        switch(styleMode){
            case 'points':  // if (x === 'value1')
                points.forEach(function (el){
                
                    drawCoordinates(el.coordX, el.coordY, pointSize,currentColor);
                });
                break;
            case 'line':  // if (x === 'value1')
                drawLines(points,pointSize);
                break;
            default:
                alert( 'Unknown Mode' );
        };
    }
    
};

/**
 * Перейти к созданию новой фигуры
 */
$("#figure").click(function(e){

    if(points.length != 0)
    {
        addNewFigureToArray();
    }	
});

/**
 * Перейти к созданию новой фигуры
 */
$(".figure-number").click(function(e){

});

function addNewFigureToArray(){
    var figureObject = {
        'points': points,
        'styleMode': styleMode,
        'pointSize': pointSize,
        'color': currentColor
    }
    figures.push(figureObject);
    points = [];

    //обновление интерфейса
    createNewFigure();
}
function createNewFigure(){
    var newLi = document.createElement('li');
    var number = figures.length;
    newLi.innerHTML = '' + number;
    var layers = document.getElementById('layers');
    layers.appendChild(newLi);
}
function reDrawAllFigures(){
    figures.forEach(function (el){
        switch(el.styleMode){
            case 'points':  // if (x === 'value1')
                el.points.forEach(function (element){
                // alert('el pointSize '+ el.pointSize);
                    drawCoordinates(element.coordX, element.coordY, el.pointSize,el.color);
                });
                break;
            case 'line':  // if (x === 'value1')
            // el.points.forEach(function (element){
                drawLines(el.points, el.pointSize);
            // });
                break;
            default:
                alert( 'Unknown Mode' );
        };
    });
};

$(".colors li").click(function(e){
    //currentColor = this.getAttribute('data-color');
    currentColor = this.dataset.color;
    $(".colors li").removeClass('active');
    $(this).addClass('active');
    //figures[currentFigureNumber].color = currentColor;
    reDraw();
});

/**
 * переключение инструмента
 */
$("#draw-button").click(function(e){
    currentTool = 'DRAW';
});
$("#move-button").click(function(e){
    currentTool = 'MOVE';
    if(points.length!=0){
        addNewFigureToArray();
    }
});
$("#clone-button").click(function(e){
    currentTool = 'CLONE';
    if(points.length!=0){
        addNewFigureToArray();
    }
});
$("#delete-button").click(function(e){
    currentTool = 'DELETE';
    if(points.length!=0){
        addNewFigureToArray();
    }
});
$("#add-frame").click(function(e){
    createNewFrame();
});
function addNewFrame(){
    if(frames.length == 0){
        console.log('add 0 frame' , frames);
        frames.push(figures);
    }
    console.log('new 1 frame', frames);
    frames.push(figures);
    points = [];
    //обновление интерфейса
    createNewFrame();
    
}
function createNewFrame(){
    var newLi = document.createElement('li');
    console.log('frames', frames);
    
    newLi.innerHTML = '2';
    var frames = document.getElementById('frames');
    frames.appendChild(newLi);
}