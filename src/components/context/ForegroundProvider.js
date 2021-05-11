import React, {Component} from "react";
import Alert from "../alert/Alert";
import Overlay from "../Overlay";
import { FadeInOut } from "../transitions/FadeInOut";
import { MoveOut } from "../transitions/MoveOut";
import TurnMessage from "../TurnMessage";

export const ForegroundContext = React.createContext();

export const withForegroundContext = WrappedComponent => {
  return React.forwardRef((props, forwardRef) => (
    <ForegroundContext.Consumer>
        {value => <WrappedComponent {...props} foregroundContext={value} ref={forwardRef}/>}
    </ForegroundContext.Consumer>
  ));
};

class ForegroundProvider extends Component {

  constructor() {
    super();
    this.state = {
      isAlertShown: false,
      componentToShowAsAlert: null,
      countdown: null,
      componentToOpenInOverlay: null,
      isTurnMessageDisplayed: false,
      turnNameToDisplay: "",
      showAlert: (componentToShowAsAlert, removeAfterInMilliseconds) => {
        this.showAlert(componentToShowAsAlert, removeAfterInMilliseconds)
      },
      openAlert: (componentToShowAsAlert) => {
        this.openAlert(componentToShowAsAlert)
      },
      closeAlert: () => {
        this.closeAlert()
      },
      setCountdown: (countdown) => {
        this.setState({countdown: countdown})
      },
      openOverlay: (componentToOpenInOverlay) => {
        this.openOverlay(componentToOpenInOverlay)
      },
      closeOverlay: () => {
        this.closeOverlay()
      },
      displayCurrentTurnMessage: (playerName) => {
        this.displayCurrentTurnMessage(playerName)
      },
    };
  }

  showAlert(componentToShowAsAlert, removeAfterInMilliseconds) {
    this.openAlert(componentToShowAsAlert)

    setTimeout(() => { 
      this.closeAlert()
    }, removeAfterInMilliseconds);
  }

  openAlert(componentToShowAsAlert) {
    this.setState({
      componentToShowAsAlert: componentToShowAsAlert
    }, this.setState({
      isAlertShown: true,
    }))
  }

  closeAlert() {
    this.setState({isAlertShown: false })
  }

  openOverlay(componentToOpenInOverlay) {
    this.setState({
      isOverlayOpened: true,
      componentToOpenInOverlay: componentToOpenInOverlay
    })
  }

  closeOverlay() {
    this.setState({
      isOverlayOpened: false,
    })
  }

  displayCurrentTurnMessage(playerName) {
    console.log(playerName)

    this.setState({
      isTurnMessageDisplayed: true,
      turnNameToDisplay: playerName
    })  

    setTimeout(() => { 
      this.setState({
        isTurnMessageDisplayed: false,
      })
    }, 500); // 1/2 of animation duration
  }

  render() {
    let {componentToShowAsAlert, isAlertShown, countdown, isOverlayOpened, componentToOpenInOverlay, isTurnMessageDisplayed, turnNameToDisplay} = this.state
    return (
        <ForegroundContext.Provider value={this.state}>
            <div className="foreground">
                <FadeInOut in={isAlertShown}>
                  <Alert component={componentToShowAsAlert} countdown={countdown} />
                </FadeInOut>
                <FadeInOut in={isOverlayOpened}>
                  <Overlay component={componentToOpenInOverlay} />
                </FadeInOut>
                <MoveOut in={isTurnMessageDisplayed}>
                  <TurnMessage turnNameToDisplay={turnNameToDisplay} />
                </MoveOut>
                {this.props.children}
            </div>
        </ForegroundContext.Provider>
    );
  }
}

export default ForegroundProvider;