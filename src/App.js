import React, { Component } from "react";
import AppRouter from "./route/AppRouter";
import BackgroundProvider, { BackgroundContext } from './components/Background';

class App extends Component {
  render() {
    return (
      <BackgroundProvider>
        <div className="foreground">
          <AppRouter />
        </div>
      </BackgroundProvider>
    );
  }
}

export default App;



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