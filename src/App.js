import React, { Component } from "react";
import AppRouter from "./routing/AppRouter";
import BackgroundProvider from './components/context/BackgroundProvider';
import ForegroundProvider from "./components/context/ForegroundProvider";

class App extends Component {
  render() {
    return (
      <BackgroundProvider>
        <ForegroundProvider>
          <AppRouter />
        </ForegroundProvider>
      </BackgroundProvider>
    );
  }
}

export default App;