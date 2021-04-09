import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import InputField from './InputField';
import ButtonPrimary from './ButtonPrimary';
import {api, handleError} from "../../helpers/api";
import User from "../shared/models/User";

class LoginForm extends React.Component {

	constructor() {
		super();
		this.state = {
            usernameOrEmail: '',
            password: '',
            errorMessageUsernameOrEmail: null,
            errorMessagePassword: null,
            isUsernameOrEmailValid: true,
            isPasswordValid: true
        };
        this.submit = this.submit.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.login = this.login.bind(this);
    }

    submit(resolve) {
         this.props.history.push('/home');

         
        let usernameOrEmailValue = this.state.usernameOrEmail;
        let passwordValue = this.state.password;

        if(this.isFormValid(usernameOrEmailValue, passwordValue)) {
            this.login(resolve, usernameOrEmailValue, passwordValue)
        } else {
			resolve();
		}
    }

    isFormValid(usernameOrEmailValue, passwordValue) {
        let isFormValid = true;
        this.setState({
            isUsernameOrEmailValid: true,
            isPasswordValid: true
        });

        if(!usernameOrEmailValue || usernameOrEmailValue === '') {
			this.setState({
				errorMessageUsernameOrEmail: 'Please fill in this field',
				isUsernameOrEmailValid: false,
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

        async login(resolve, usernameOrEmailValue, passwordValue){
            try{
                const requestBody = JSON.stringify({
                    usernameOrEmail: usernameOrEmailValue,
                    password: passwordValue
                });
                const response = await api.post(`/users/login`, requestBody);
                // Get the returned user and update a new object.
                const user = new User(response.data);

                // Store the token into the local storage.
                localStorage.setItem('token', user.token);

                // Login successfully worked --> navigate to the route /game in the GameRouter
                this.props.history.push(`/home`);
            } catch (error) {
                this.setState(Object.assign({}, {usernameOrEmailValue: this.state.usernameOrEmailValue}, {password: this.state.password},
                    {errorMessageUsernameOrEmail: error}, {errorMessagePassword: this.state.errorMessagePassword}, {isUsernameOrEmailValid: false},
                    {isPasswordValid: this.state.isPasswordValid}));
            }
            finally {
                // return resolve after having received a response from the api
                resolve();
            }
        }




    // TODO add link "forgot password?"
	render() {
		return (
			<div className="login-form">
				<InputField	
                    type="text"
                    label="Username or email"
                    placeholder="Username or email"
                    value={this.state.usernameOrEmail}
                    isValid={this.state.isUsernameOrEmailValid}	
                    errorMessage={this.state.errorMessageUsernameOrEmail}
                    onChange={(e) => this.setState({usernameOrEmail: e.target.value})}	
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
                    value="Sign in" 
                    submitFunction={this.submit}
                />
                <p className="below-btn">Don't have an account? <Link to="/register">Sign up</Link></p>
			</div>
		);
	}
}

export default withRouter(LoginForm);