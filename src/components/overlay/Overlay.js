import React from 'react';
import Blurred from '../Blurred';

class Overlay extends React.Component {

    componentDidMount() {
        
        var element = document.getElementById("foreground");
        element.classList.add("fixed");
        element = document.getElementById("view");
        element.classList.add("fixed");
    }

    componentWillUnmount() {
        var element = document.getElementById("foreground");
        element.classList.remove("fixed");
        element = document.getElementById("view");
        element.classList.remove("fixed");
     
    }

    render() {
        return (
            <Blurred className="overlay">
                {this.props.component}
                <div className="close">
                    <a onClick={() => this.props.closeOverlay()}>Close</a>
                </div>
            </Blurred>
        );
    }
}

export default Overlay;