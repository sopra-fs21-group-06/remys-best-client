import { colors } from './constants'
import { createField } from './modelUtils'

export const generateUUID = () => { // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const lightenOrDarkenColor = (col, amt) => {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

export const getCardNameFromCode = (code) => {
    if(code === "X1" || code === "X2") {
        return "Joker"
    }

    let cardName = ""
    let value = code.slice(0, 1)
    let suit = code.slice(1, 2)

    if(suit === "C") {
        cardName += "Clubs"
    } else if(suit === "D") {
        cardName += "Diamonds"
    } else if(suit === "H") {
        cardName += "Hearts"
    } else if(suit === "S") {
        cardName += "Spades"
    }

    cardName += " "

    if(value === "2") {
        cardName += "Two"
    } else if(value === "3") {
        cardName += "Three"
    } else if(value === "4") {
        cardName += "Four"
    } else if(value === "5") {
        cardName += "Five"
    } else if(value === "6") {
        cardName += "Six"
    } else if(value === "7") {
        cardName += "Seven"
    } else if(value === "8") {
        cardName += "Eight"
    } else if(value === "9") {
        cardName += "Nine"
    } else if(value === "0") {
        cardName += "Ten"
    } else if(value === "J") {
        cardName += "Jack"
    } else if(value === "Q") {
        cardName += "Queen"
    } else if(value === "K") {
        cardName += "King"
    } else if(value === "A") {
        cardName += "Ace"
    } 

    return cardName;
}

export const computeFields = (boardSize) => {

    const SIZE = boardSize;
    const LINE_LENGTH = 4;
    const FIELD_SIZE = SIZE/27;
    const FIELD_GAP = SIZE/25;
    const COLORED_BORDER_WIDTH = SIZE/125;
    const CURVE_OFFSET = FIELD_GAP/2 * 1.25;
    
    const directions = {
        TO_TOP_RIGHT: {
            leftDiff: FIELD_GAP,
            topDiff: FIELD_GAP * -1,
            leftOffset: CURVE_OFFSET/2,
            topOffset: CURVE_OFFSET/2
        },
        TO_RIGHT: {
            leftDiff: Math.ceil(Math.sqrt(FIELD_GAP*FIELD_GAP + FIELD_GAP*FIELD_GAP)),
            topDiff: 0,
            leftOffset: 0,
            topOffset: CURVE_OFFSET
        },
        TO_BOTTOM_RIGHT: {
            leftDiff: FIELD_GAP,
            topDiff: FIELD_GAP
        },
    }

    const addFieldPosition = (fieldPositions, left, top, color) => {
        fieldPositions.push({left: left, top: top, color: color})
    }

    const addKennel = (fieldPositions, curLeft, curTop, color) => {
        curLeft += SIZE/10 - directions.TO_RIGHT.leftDiff;
        addStraightLine(fieldPositions, curLeft, curTop, directions.TO_RIGHT, color);
    }

    const addFinishZone = (fieldPositions, curLeft, curTop, color) => {
        curTop -= SIZE/12;
        curLeft -= SIZE/100;
        addFieldPosition(fieldPositions, curLeft, curTop, color);
        curTop -= Math.ceil(Math.sqrt(FIELD_GAP*FIELD_GAP + FIELD_GAP*FIELD_GAP));
        curLeft -= SIZE/200;
        addFieldPosition(fieldPositions, curLeft, curTop, color);
        curTop += directions.TO_TOP_RIGHT.topDiff
        curLeft += directions.TO_TOP_RIGHT.leftDiff
        addFieldPosition(fieldPositions, curLeft, curTop, color);
        curTop += directions.TO_TOP_RIGHT.topDiff
        curLeft += directions.TO_TOP_RIGHT.leftDiff
        addFieldPosition(fieldPositions, curLeft, curTop, color);
    }

    const addStraightLine = (fieldPositions, curLeft, curTop, direction, color) => {
        for(let i = 0; i < LINE_LENGTH; i++) {
            curLeft += direction.leftDiff;
            curTop += direction.topDiff;
            addFieldPosition(fieldPositions, curLeft, curTop, color);
        }
        return [curLeft, curTop];
    }

    const addCurvedLine = (fieldPositions, curLeft, curTop, direction) => {
        for(let i = LINE_LENGTH/2 - 1; i >= 0; i--) {
            curLeft += direction.leftDiff + ((i+1) * direction.leftOffset * 0.333);
            curTop += direction.topDiff + ((i+1) * direction.topOffset * 0.333);
            addFieldPosition(fieldPositions, curLeft, curTop, null);
        }
        for(let i = 0; i < LINE_LENGTH/2; i++) {
            curLeft += direction.leftDiff - ((i+1) * direction.leftOffset * 0.333);
            curTop += direction.topDiff - ((i+1) * direction.topOffset * 0.333);
            addFieldPosition(fieldPositions, curLeft, curTop, null);
        }
        return [curLeft, curTop];
    }

    const rotateAndAddFieldPositions = (fieldPositions, blueFields, degrees, color) => {
        let centerLeft = SIZE/2 - FIELD_GAP/2.5;
        let centerTop = SIZE/2 - FIELD_GAP/2.5;

        for(let i = 0; i < blueFields.length; i++) {
            let fieldPosition = blueFields[i];
            var left = (fieldPosition.left - centerLeft) * Math.cos(degrees * Math.PI / 180) - (fieldPosition.top - centerTop) * Math.sin(degrees * Math.PI / 180) + centerLeft;
            var top = (fieldPosition.left - centerLeft) * Math.sin(degrees * Math.PI / 180) + (fieldPosition.top - centerTop) * Math.cos(degrees * Math.PI / 180) + centerTop;
            color = fieldPosition.color ? color : null
            addFieldPosition(fieldPositions, left, top, color);
        }
    }

    let startingLeft = Math.ceil(SIZE/4.8192771084);
    let startingTop = Math.ceil(SIZE/1.0869565217);
    var curPosition = [startingLeft, startingTop];
    let fields = [];

    // compute and add blue fields
    addFieldPosition(fields, curPosition[0], curPosition[1], colors.BLUE);
    addKennel(fields, startingLeft, startingTop, colors.BLUE)
    addFinishZone(fields, startingLeft, startingTop, colors.BLUE)
    curPosition = addStraightLine(fields, curPosition[0], curPosition[1], directions.TO_TOP_RIGHT)
    curPosition = addCurvedLine(fields, curPosition[0], curPosition[1], directions.TO_RIGHT)
    curPosition = addStraightLine(fields, curPosition[0], curPosition[1], directions.TO_BOTTOM_RIGHT)
    curPosition = addCurvedLine(fields, curPosition[0], curPosition[1], directions.TO_TOP_RIGHT)
    fields.splice(-1,1)
    let blueFields = Array.from(fields);

    // compute and add green fields
    rotateAndAddFieldPositions(fields, blueFields, 270, colors.GREEN);

    // compute and add red fields
    rotateAndAddFieldPositions(fields, blueFields, 180, colors.RED);

    // compute and add yellow fields
    rotateAndAddFieldPositions(fields, blueFields, 90, colors.YELLOW);

    // add additional attributes
    for (let i = 0; i < fields.length; i++) {
        fields[i].id = i;
        fields[i].size = FIELD_SIZE;
        fields[i].borderWidth = COLORED_BORDER_WIDTH;
    }

    // mapping to model
    fields = fields.map(field => {
        let fieldModel = createField(field.id, field.left, field.top, field.color, field.size, field.borderWidth);
        return fieldModel;
    })

    return fields;
}

export const moveMarble = (marble, newFieldId) => {

}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}