import React, { Component } from "react";
import AppRouter from "./routing/AppRouter";
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