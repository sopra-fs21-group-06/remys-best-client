import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import Avatar from "../../components/Avatar"
import BlurredElement from '../../components/BlurredElement';
//import { BackgroundContext } from './components/Background';
import Board from "../../components/Board";
import Box from "../../components/Box";

class ChoosePlace extends React.Component {

  constructor() {
    super();
    this.state = {
      username: "Sandro"
    };
  }

  // TODO board dynamic size
  render() {
    return (
      <View className="choose-place" linkMode={viewLinks.BASIC}>
        <main>
            <div className="col-left">
              <div className="above-box">
                <h1>Choose your place</h1>
                <p className="intro">Almost done! A new game will be started after everybody has picked a place</p>  
              </div>
              <Box>
                <p><span>Siddhant</span> – not chosen yet</p>
                <p><span>Andrina</span> – yellow</p>
                <p><span>Edouard</span> – not chosen yet</p>
                <p><span>You</span> – green</p>
                <p><span>You</span> are with <span>Andrina</span></p>
              </Box>
              <div className="below-box"><Link to="/game">Leave and return to Home</Link></div>
            </div>
            <div className="col-right">
              <div className="board-container" style={{width: 500, height: 500}}>
                <Board size="300"/>
                <Avatar color="blue" />
                <Avatar color="green" />
                <Avatar color="red" />
                <Avatar color="yellow" />
              </div>
            </div>
          </main>
      </View>
    );
  }
}

export default withRouter(ChoosePlace);



/*

<BackgroundContext.Consumer>
            {context => (
              <div>
                <button onClick={() => context.dispatch({type: "blue-bottom"})}>Change blue</button>
                <button onClick={() => context.dispatch({type: "yellow-bottom"})}>Change yellow</button>
                <button onClick={() => context.dispatch({type: "red-bottom"})}>Change red</button>
                <button onClick={() => context.dispatch({type: "green-bottom"})}>Change green</button>
              </div>
            )} 
          </BackgroundContext.Consumer>


          */