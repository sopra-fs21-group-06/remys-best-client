import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import InputField from './InputField';
import ButtonPrimary from './ButtonPrimary';
import User from "../shared/models/User";
import {api, handleError} from "../../helpers/api";

class RegisterForm extends React.Component {

	constructor() {
		super();
		this.state = {
            username: '',
            email: '',
            password: '',
            errorMessageUsername: null,
            errorMessageEmail: null,
            errorMessagePassword: null,
            isUsernameValid: true,
            isEmailValid: true,
            isPasswordValid: true,
            serverError: ''
        };
        this.submit = this.submit.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.register = this.register.bind(this);
    }

    submit(resolve) {
        let usernameValue = this.state.username;
        let emailValue = this.state.email;
        let passwordValue = this.state.password;

        if(this.isFormValid(usernameValue, emailValue, passwordValue)) {
            this.register(resolve, usernameValue, emailValue, passwordValue)
        } else {
			resolve();
		}
    }

    isFormValid(usernameValue, emailValue, passwordValue) {
        let isFormValid = true;
        this.setState({
            isUsernameValid: true,
            isEmailValid: true,
            isPasswordValid: true,
            serverError: null
        });

        if(!usernameValue || usernameValue === '') {
			this.setState({
				errorMessageUsername: 'Please fill in this field',
				isUsernameValid: false,
            });
            isFormValid = false;
		}
        if(!emailValue || emailValue === '') {
			this.setState({
				errorMessageEmail: 'Please fill in this field',
				isEmailValid: false,
            });
            isFormValid = false;
		}
        if(!passwordValue || passwordValue === '') {
			this.setState({
				errorMessagePassword: 'Please fill in this field',
				isPasswordValid: false,
            });
            isFormValid = false;
        } 

        return isFormValid;
    }

    async register(resolve, usernameValue, emailValue, passwordValue) {
        try {
            const requestBody = JSON.stringify({
                email: emailValue,
                username: usernameValue,
                password: passwordValue
            });
            const response1 = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response1.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            this.props.history.push(`/home`);
        } catch (error) {
            this.setState({
                serverError: handleError(error)
            })
        }
        finally{
            resolve();
        }
    }

	render() {
		return (
			<div>
                {this.state.serverError ? 
                    <p className="server-error">{this.state.serverError}</p> : null
                }
				<InputField	
                    type="text"
                    label="Username"
                    placeholder="Username"
                    value={this.state.username}
                    isValid={this.state.isUsernameValid}	
                    errorMessage={this.state.errorMessageUsername}
                    onChange={(e) => this.setState({username: e.target.value})}	
                />
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
                    value="Sign up" 
                    submitFunction={this.submit}
                />
                <p className="below-btn">Have an account? <Link to="/login">Sign in</Link></p>
			</div>
		);
	}
}

export default withRouter(RegisterForm);