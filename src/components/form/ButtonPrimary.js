import React from "react";

export default class ButtonPrimary extends React.Component {
    
    constructor() {
        super();
        this.state = {
            isSubmitting: false
        };
        this.submit = this.submit.bind(this);
    }

    submit() {
        this.setState({
            isSubmitting: true
        }, () => {
            this.executeSubmitFunction().then(() => {
                this.setState({
                    isSubmitting: false
                });
            });
        });
    }

    executeSubmitFunction() {
        return new Promise((resolve) => {
            this.props.submitFunction(resolve);
        });
    }
    
    render() {
        return (
            <button onClick={() => this.submit()} className="btn-primary">
                {this.state.isSubmitting ? 
                    <div className="loadingSubmit"></div> : 
                    this.props.value
                }
            </button>
        )
    }
}

