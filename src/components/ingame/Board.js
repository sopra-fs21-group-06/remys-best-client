import React from "react";
import wood from '../../img/board.png';
import styled from 'styled-components';
import { lightenOrDarkenColor, computeFields } from '../../helpers/remysBestUtils';
import Marble from './Marble';
import Field from './Field';
import { colors } from '../../helpers/constants'

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size, // this.props.size? -> always width 100% make wrapper around each board with dynamic sizes? on resize recompute
            fields: [],
            marbles: []
        };
    }

    componentDidMount() {
        let fields = computeFields(this.state.size);
        let marbles = [];

        for (let i = 1; i <= 16; i++) {
            var color;

            if(i % 4 == 0) {
                color = colors.BLUE
            }
            else if(i % 4 == 1) {
                color = colors.GREEN
            }
            else if(i % 4 == 2) {
                color = colors.RED
            }
            else if(i % 4 == 3) {
                color = colors.YELLOW
            }
            
            marbles.push({
                id: i,
                fieldId: 0 + i,
                color: color
            });
        }
       
        this.setState({
            fields: fields,
            marbles: marbles
        })
    }

    render() {
        return (
            <div className="board" style={{width: this.state.size, height: this.state.size}}>
                <img className="wood" src={wood} />
                <div className="fields">
                    {this.state.fields.map(field => {
                        return (
                            <Field 
                                key={field.id} 
                                field={field}
                            />
                        );
                    })}
                </div>
                <div className="marbles">
                    {this.state.marbles.map(marble => {
                        let field = this.state.fields.find(field => field.id === marble.fieldId)
                        return (
                            <Marble 
                                key={marble.id} 
                                field={field}
                                color={marble.color}                               
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Board;