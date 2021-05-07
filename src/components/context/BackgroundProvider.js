import React, {Component} from "react";
import bg from '../../img/bg.png';

export const BackgroundContext = React.createContext();

export const withBackgroundContext = WrappedComponent => props => (
    <BackgroundContext.Consumer>
        {value => <WrappedComponent {...props} backgroundContextValue={value}/>}
    </BackgroundContext.Consumer>
);

class BackgroundProvider extends Component {

  constructor() {
    super();
    this.state = {
      bgMaxSize: 0,
      bottomColorClass: "BLUE-bottom",
      isTransformationDurationEnabled: false,
      dispatch: action => this.bottomColorReducer(action)
    };
    this.transitionDuration = 2;
  }

  componentDidMount() {
    this.updateSize()
    window.addEventListener('resize', () => this.updateSize());
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateSize());
  }
  
  updateSize() {
    let curWidth = window.innerWidth;
    let curHeight = window.innerHeight;

    // set diagonal as size
    this.setState({ 
      bgMaxSize: Math.ceil(Math.sqrt(curWidth*curWidth + curHeight*curHeight))
    });
  }

  bottomColorReducer(action) {
    switch (action.type) {
        case "BLUE-bottom":
            this.updateBottomColor("BLUE-bottom");
            break;
        case "GREEN-bottom":
            this.updateBottomColor("GREEN-bottom");
            break;
        case "RED-bottom":
            this.updateBottomColor("RED-bottom");
            break;
        case "YELLOW-bottom":
            this.updateBottomColor("YELLOW-bottom");
            break;
        default:
            this.updateBottomColor("BLUE-bottom");
    }
  };

  updateBottomColor(bottomColorClass) {
    this.setState({ 
      bottomColorClass: bottomColorClass,
      isTransformationDurationEnabled: true
    });
    // after rotation via css
    setTimeout(function(){ 
      this.setState({ 
        isTransformationDurationEnabled: false
      });
    }.bind(this), this.transitionDuration * 1000);
  }

  render() {
    let bgStyles = {
      width: this.state.bgMaxSize, 
      height: this.state.bgMaxSize, 
      transitionDuration: this.state.isTransformationDurationEnabled ? this.transitionDuration + "s" : 'inherit'
    }

    return (
        <BackgroundContext.Provider value={this.state}>
            <img className={'background ' + this.state.bottomColorClass} src={bg} style={bgStyles} />
            {this.props.children}
        </BackgroundContext.Provider>
    );
  }
}

export default BackgroundProvider;