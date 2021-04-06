import React from 'react';
  
export default class InputField extends React.Component {
    
    constructor() {
        super();
    }

    render() {
        let errorMessage = this.props.errorMessage ? this.props.errorMessage : 'Please fill in this field';

        let classNames = "";
        if(!this.props.isValid) {
            classNames += " borderRed"
        }
        
        return (
            <div className="inputWrapper">
                {this.props.label ? <label>{this.props.label}</label> : null}
                <span className={this.props.isClearable ? 'clearable' : ''}>
                    <input
                        type={this.props.type}
                        className={classNames}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        onClick={this.props.onClick}
                    />
                    {!this.props.isClearable ? '' : <i className="clearIcon" onClick={this.props.onClearValue}>&times;</i>}
                </span>
                {this.props.isValid ? '' : <div className="errorMessage">{errorMessage}</div>}
            </div>
        );
    }
}