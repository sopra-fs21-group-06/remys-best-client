import React, {Component} from "react";
import Alert from "../alert/Alert";
import { FadeInOut } from "../transitions/FadeInOut";

export const ForegroundContext = React.createContext();

export const withForegroundContext = WrappedComponent => props => (
    <ForegroundContext.Consumer>
        {value => <WrappedComponent {...props} foregroundContextValue={value}/>}
    </ForegroundContext.Consumer>
);

class ForegroundProvider extends Component {

  constructor() {
    super();
    this.state = {
      isAlertShown: false,
      componentToShowAsAlert: null,
      showAlert: (componentToShowAsAlert, removeAfterInMilliseconds) => {
        this.showAlert(componentToShowAsAlert, removeAfterInMilliseconds)
      },
    };
  }

  showAlert(componentToShowAsAlert, removeAfterInMilliseconds) {
    this.setState({
      componentToShowAsAlert: componentToShowAsAlert
    }, this.setState({
      isAlertShown: true,
    }, () => {
      setTimeout(() => { 
        this.setState({
          isAlertShown: false,
        })
      }, removeAfterInMilliseconds);
    }))
  }

  render() {
    let {componentToShowAsAlert, isAlertShown} = this.state
    return (
        <ForegroundContext.Provider value={this.state}>
            <div className="foreground">
                <FadeInOut in={isAlertShown}>
                  <Alert component={componentToShowAsAlert}/>
                </FadeInOut>
                {this.props.children}
            </div>
        </ForegroundContext.Provider>
    );
  }
}

export default ForegroundProvider;