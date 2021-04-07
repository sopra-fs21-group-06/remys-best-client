import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import InputField from './InputField';
import ButtonPrimary from './ButtonPrimary';

class ResetPasswordForm extends React.Component {

	constructor() {
		super();
		this.state = {
            email: '',
            errorMessageEmail: null,
            isEmailValid: true
        };
        this.submit = this.submit.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.login = this.resetPassword.bind(this);
    }

    submit(resolve) {
        let emailValue = this.state.email;

        if(this.isFormValid(emailValue)) {
            this.resetPassword(resolve, emailValue)
        } else {
			resolve();
		}
    }

    isFormValid(emailValue) {
        let isFormValid = true;
        this.setState({
            isEmailValid: true
        });

        if(!emailValue || emailValue === '') {
			this.setState({
				errorMessageEmail: 'Please fill in this field',
				isEmailValid: false,
            });
            isFormValid = false;
		}

        return isFormValid;
    }

    async resetPassword(resolve, emailValue) {
        
        /*
        try {
        const requestBody = JSON.stringify({
            username: this.state.username,
            name: this.state.name
        });
        const response = await api.post('/users', requestBody);

        // Get the returned user and update a new object.
        const user = new User(response.data);

        // Store the token into the local storage.
        localStorage.setItem('token', user.token);

        // Login successfully worked --> navigate to the route /game in the GameRouter
        this.props.history.push(`/game`);
        } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
        }*/


        // return resolve after having received a response from the api
        resolve();
    }

	render() {
		return (
			<div className="reset-password-form">
				<InputField	
                    type="email"
                    label="Email"
                    placeholder="Email"
                    value={this.state.email}
                    isValid={this.state.isEmailValid}	
                    errorMessage={this.state.errorMessageEmail}
                    onChange={(e) => this.setState({email: e.target.value})}	
                />
                <InputField	
                    type="password"
                    label="Password"
                    placeholder="Password"
                    value={this.state.password}
                    isValid={this.state.isPasswordValid}	
                    errorMessage={this.state.errorMessagePassword}
                    onChange={(e) => this.setState({password: e.target.value})}	
                />
                <ButtonPrimary 
                    value="Continue" 
                    submitFunction={this.submit}
                />
                <p className="below-btn"><Link to="/login">Return to sign in</Link></p>
			</div>
		);
	}
}

export default withRouter(ResetPasswordForm);