import React, {Component} from "react";
import Alert from "../alert/Alert";
import { FadeInOut } from "../transitions/FadeInOut";

export const ForegroundContext = React.createContext();

export const withForegroundContext = WrappedComponent => props => (
    <ForegroundContext.Consumer>
        {value => <WrappedComponent {...props} foregroundContext={value}/>}
    </ForegroundContext.Consumer>
);

class ForegroundProvider extends Component {

  constructor() {
    super();
    this.state = {
      isAlertShown: false,
      componentToShowAsAlert: null,
      countdown: null,
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
      }
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

  render() {
    let {componentToShowAsAlert, isAlertShown, countdown} = this.state
    return (
        <ForegroundContext.Provider value={this.state}>
            <div className="foreground">
                <FadeInOut in={isAlertShown}>
                  <Alert component={componentToShowAsAlert} countdown={countdown} />
                </FadeInOut>
                {this.props.children}
            </div>
        </ForegroundContext.Provider>
    );
  }
}

export default ForegroundProvider;