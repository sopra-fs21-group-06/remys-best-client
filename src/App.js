import React, { Component } from "react";
import AppRouter from "./routing/AppRouter";
import BackgroundProvider from './components/context/BackgroundProvider';
import ForegroundProvider from "./components/context/ForegroundProvider";
import { cardImages } from "./helpers/constants";
import dogCard from "./img/dog-card.png"

class App extends Component {

  // preload card images
  componentDidMount() {
    Object.keys(cardImages).forEach((cardCode) => {
        const img = new Image();
        img.src = cardImages[cardCode]
    });

    const img = new Image();
    img.src = dogCard
  }
       
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