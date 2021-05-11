import React, { Component } from "react";
import AppRouter from "./routing/AppRouter";
import BackgroundProvider from './components/context/BackgroundProvider';
import ForegroundProvider from "./components/context/ForegroundProvider";

class App extends Component {

  /*
  componentDidMount() {
     Promise.all(R.take(limit, imgUrls).map(checkImage)).then(() => {
       this.setState(() => ({ imagesLoaded: true })
    )}, () => {
      console.error('could not load images')
    })
  }

  checkImage = path =>
    new Promise(resolve => {
        const img = new Image()
        img.onload = () => resolve(path)
        img.onerror = () => reject()

        img.src = path
    })*/
       
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