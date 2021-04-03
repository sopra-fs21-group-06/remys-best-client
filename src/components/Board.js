import React from "react";
import wood from '../img/board.png';
import styled from 'styled-components';

const SIZE = 500;
const LINE_LENGTH = 4;
const FIELD_SIZE = SIZE/25;
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

const colors = {
	BLUE: "#5887F1",
	RED: "#D04F3A",
	YELLOW: "#EEBD41",
	GREEN: "#63A557",
}

const Field = styled.div`
    position: absolute;
    top: ${({ top }) => top + "px" };
    left: ${({ left }) => left + "px" };
    width: ${({ color }) => color ? (FIELD_SIZE + COLORED_BORDER_WIDTH*1.5) + "px" : FIELD_SIZE + "px"};
    height: ${({ color }) => color ? (FIELD_SIZE + COLORED_BORDER_WIDTH*1.5) + "px" : FIELD_SIZE + "px"};
    border-radius: 50%;
    background: #D0AE8B;
    box-shadow: inset 2px 2px 4px #ad9073,
                inset -2px -2px 4px #f3cca3;
    ${({ color }) => color ? "border-color: " + color + ";" : null}
    ${({ color }) => color ? "border-width: " + COLORED_BORDER_WIDTH + "px;" : null}
    ${({ color }) => color ? "border-style: solid;" : null}
`;

const Marble = styled.div`
    position: absolute;
    left: ${({ left }) => left+3 }px;
    top: ${({ top }) => top+3 }px;
    display: block;
    background: ${({ color }) => LightenDarkenColor(color, -70) };
    border-radius: 100%;
    height: ${FIELD_SIZE}px;
    width: ${FIELD_SIZE}px;
    margin: 0;
    background: radial-gradient(circle at ${FIELD_SIZE/3}px ${FIELD_SIZE/3}px, ${({ color }) => color }, ${({ color }) => LightenDarkenColor(color, -70) });
`;

function LightenDarkenColor(col, amt) {
  
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


class Board extends React.Component {

    constructor() {
        super();
        this.state = {
            size: SIZE,
        };
    }

    addFieldPosition(fieldPositions, left, top, color) {
        fieldPositions.push({left: left, top: top, color: color})
    }

    addKennel(fieldPositions, curLeft, curTop, color) {
        curLeft += SIZE/10 - directions.TO_RIGHT.leftDiff;
        this.addStraightLine(fieldPositions, curLeft, curTop, directions.TO_RIGHT, color);
    }

    addFinishZone(fieldPositions, curLeft, curTop, color) {
        curTop -= SIZE/12;
        curLeft -= SIZE/100;
        this.addFieldPosition(fieldPositions, curLeft, curTop, color);
        curTop -= Math.ceil(Math.sqrt(FIELD_GAP*FIELD_GAP + FIELD_GAP*FIELD_GAP));
        curLeft -= SIZE/200;
        this.addFieldPosition(fieldPositions, curLeft, curTop, color);
        curTop += directions.TO_TOP_RIGHT.topDiff
        curLeft += directions.TO_TOP_RIGHT.leftDiff
        this.addFieldPosition(fieldPositions, curLeft, curTop, color);
        curTop += directions.TO_TOP_RIGHT.topDiff
        curLeft += directions.TO_TOP_RIGHT.leftDiff
        this.addFieldPosition(fieldPositions, curLeft, curTop, color);
    }

    addStraightLine(fieldPositions, curLeft, curTop, direction, color) {
        for(let i = 0; i < LINE_LENGTH; i++) {
            curLeft += direction.leftDiff;
            curTop += direction.topDiff;
            this.addFieldPosition(fieldPositions, curLeft, curTop, color);
        }
        return [curLeft, curTop];
    }

    addCurvedLine(fieldPositions, curLeft, curTop, direction) {
        for(let i = LINE_LENGTH/2 - 1; i >= 0; i--) {
            curLeft += direction.leftDiff + ((i+1) * direction.leftOffset * 0.333);
            curTop += direction.topDiff + ((i+1) * direction.topOffset * 0.333);
            this.addFieldPosition(fieldPositions, curLeft, curTop, null);
        }
        for(let i = 0; i < LINE_LENGTH/2; i++) {
            curLeft += direction.leftDiff - ((i+1) * direction.leftOffset * 0.333);
            curTop += direction.topDiff - ((i+1) * direction.topOffset * 0.333);
            this.addFieldPosition(fieldPositions, curLeft, curTop, null);
        }
        return [curLeft, curTop];
    }

    rotateAndAddFieldPositions(fieldPositions, fieldPositionsToRotateAndAdd, degrees, color) {
        let centerLeft = SIZE/2 - FIELD_GAP/2.5;
        let centerTop = SIZE/2 - FIELD_GAP/2.5;

        for(let i = 0; i < fieldPositionsToRotateAndAdd.length; i++) {
            let fieldPosition = fieldPositionsToRotateAndAdd[i];
            var left = (fieldPosition.left - centerLeft) * Math.cos(degrees * Math.PI / 180) - (fieldPosition.top - centerTop) * Math.sin(degrees * Math.PI / 180) + centerLeft;
            var top = (fieldPosition.left - centerLeft) * Math.sin(degrees * Math.PI / 180) + (fieldPosition.top - centerTop) * Math.cos(degrees * Math.PI / 180) + centerTop;
            color = fieldPosition.color ? color : null
            this.addFieldPosition(fieldPositions, left, top, color);
        }
    }

    computeAndRenderFields() {
        let startingLeft = Math.ceil(SIZE/4.8192771084);
        let startingTop = Math.ceil(SIZE/1.0869565217);
        var curPosition = [startingLeft, startingTop];
        
        // compute
        let blueFieldPositions = [];
        this.addFieldPosition(blueFieldPositions, curPosition[0], curPosition[1], colors.BLUE);
        this.addKennel(blueFieldPositions, startingLeft, startingTop, colors.BLUE)
        this.addFinishZone(blueFieldPositions, startingLeft, startingTop, colors.BLUE)
        curPosition = this.addStraightLine(blueFieldPositions, curPosition[0], curPosition[1], directions.TO_TOP_RIGHT)
        curPosition = this.addCurvedLine(blueFieldPositions, curPosition[0], curPosition[1], directions.TO_RIGHT)
        curPosition = this.addStraightLine(blueFieldPositions, curPosition[0], curPosition[1], directions.TO_BOTTOM_RIGHT)
        curPosition = this.addCurvedLine(blueFieldPositions, curPosition[0], curPosition[1], directions.TO_TOP_RIGHT)

        let yellowFieldPositions = [];
        this.rotateAndAddFieldPositions(yellowFieldPositions, Array.from(blueFieldPositions), 90, colors.YELLOW);

        let redFieldPositions = [];
        this.rotateAndAddFieldPositions(redFieldPositions, Array.from(blueFieldPositions), 180, colors.RED);

        let greenFieldPositions = [];
        this.rotateAndAddFieldPositions(greenFieldPositions, Array.from(blueFieldPositions), 270, colors.GREEN);

        // remove overlapping last field
        blueFieldPositions.splice(-1,1)
        yellowFieldPositions.splice(-1,1)
        redFieldPositions.splice(-1,1)
        greenFieldPositions.splice(-1,1)

        // render
        let fieldPositions = blueFieldPositions.concat(greenFieldPositions, redFieldPositions, yellowFieldPositions); 
		let fields = [];

		for (let i = 0; i < fieldPositions.length; i++) {
            let fieldPosition = fieldPositions[i];
            fields.push(<Field 
                key={i} 
                top={fieldPosition.top} 
                left={fieldPosition.left} 
                color={fieldPosition.color} 
            />);
        }

		return fields;
    }

    addMarble(marbles, left, top, color) {
        marbles.push(
            <Marble color={color} left={left} top={top}/>
        )
    }

    computeAndRenderMarbles() {
        let startingLeft = Math.ceil(SIZE/4.8192771084) + SIZE/10;
        let startingTop = Math.ceil(SIZE/1.0869565217);
        let blueMarblePositions = [];

        blueMarblePositions.push({left: startingLeft, top: startingTop, color: colors.BLUE})
        blueMarblePositions.push({left: startingLeft + 1*directions.TO_RIGHT.leftDiff, top: startingTop, color: colors.BLUE})
        blueMarblePositions.push({left: startingLeft + 2*directions.TO_RIGHT.leftDiff, top: startingTop, color: colors.BLUE})
        blueMarblePositions.push({left: startingLeft + 3*directions.TO_RIGHT.leftDiff, top: startingTop, color: colors.BLUE})

        let yellowMarblePositions = [];
        this.rotateAndAddFieldPositions(yellowMarblePositions, Array.from(blueMarblePositions), 90, colors.YELLOW);

        let redMarblePositions = [];
        this.rotateAndAddFieldPositions(redMarblePositions, Array.from(blueMarblePositions), 180, colors.RED);

        let greenMarblePositions = [];
        this.rotateAndAddFieldPositions(greenMarblePositions, Array.from(blueMarblePositions), 270, colors.GREEN);

        let marblePositions = blueMarblePositions.concat(yellowMarblePositions, redMarblePositions, greenMarblePositions); 
		let marbles = [];

        for (let i = 0; i < marblePositions.length; i++) {
            let marble = marblePositions[i];
            marbles.push(<Marble 
                key={i} 
                top={marble.top} 
                left={marble.left} 
                color={marble.color} 
            />);
        }

		return marbles;
    }

    render() {
        return (
            <div className="board" style={{width: this.state.size, height: this.state.size}}>
                <img className='wood' src={wood} />
                <div className='fields'>
                    {this.computeAndRenderFields()}
                </div>
                <div className='marbles'>
                    {this.computeAndRenderMarbles()}
                </div>
            </div>
        );
    }
}

export default Board;


/*

<div className="blue-marble" style={{top: 100, left: 200}}></div>
                    <div className="green-marble" style={{top: 100, left: 220}}></div>
                    <div className="red-marble" style={{top: 100, left: 240}}></div>
                    <div className="yellow-marble" style={{top: 100, left: 260}}></div>


                    */