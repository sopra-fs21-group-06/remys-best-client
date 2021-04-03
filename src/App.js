import React, { Component } from "react";
import Header from "./views/Header";
import AppRouter from "./components/shared/routers/AppRouter";
import BackgroundProvider, { BackgroundContext } from './components/Background';

class App extends Component {
  render() {
    return (
      <BackgroundProvider>
        <div className="foreground">
          <AppRouter />
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
        </div>
      </BackgroundProvider>
    );
  }
}

export default App;
