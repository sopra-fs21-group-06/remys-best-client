import React, {Component} from "react";
import Alert from "../alert/Alert";
import Overlay from "../overlay/Overlay";
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
      alertCountdown: null,
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
      setAlertCountdown: (alertCountdown) => {
        this.setState({alertCountdown: alertCountdown})
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

    this.closeOverlay = this.closeOverlay.bind(this)
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
      componentToOpenInOverlay: componentToOpenInOverlay,
    })
  }

  closeOverlay() {
    this.setState({
      isOverlayOpened: false,
    })
  }

  displayCurrentTurnMessage(playerName) {
    this.setState({
      isTurnMessageDisplayed: true,
      turnNameToDisplay: playerName
    })  

    setTimeout(() => { 
      this.setState({
        isTurnMessageDisplayed: false,
      })
    }, 1000); // 1/2 of animation duration
  }

  render() {
    let {componentToShowAsAlert, isAlertShown, alertCountdown, isOverlayOpened, componentToOpenInOverlay, isTurnMessageDisplayed, turnNameToDisplay} = this.state
    return (
        <ForegroundContext.Provider value={this.state}>
            <div className="foreground" id="foreground">
                <FadeInOut in={isAlertShown}>
                  <Alert component={componentToShowAsAlert} alertCountdown={alertCountdown} />
                </FadeInOut>
                <FadeInOut in={isOverlayOpened}>
                  <Overlay component={componentToOpenInOverlay} closeOverlay={this.closeOverlay} />
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