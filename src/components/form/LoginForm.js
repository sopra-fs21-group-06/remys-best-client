import React, { useContext } from 'react'
import { withFormValidation }  from './withFormValidation';
import { withRouter, Link } from 'react-router-dom';
import { api } from "../../helpers/api";
import { ServerError, SubmitButton, ValidatedInput} from "../../helpers/formUtils"
import { WebsocketContext } from '../context/WebsocketProvider';

const LoginFormSkeleton = (props) => {
  const {
    onFormValueChange,
    onFormSubmit,
    values,
    fieldErrors,
    serverError,
    isSubmitting,
    history
  } = props;

  const websocketContext = useContext(WebsocketContext);

  const handleOnFormSubmit = async () => {
    try {
      await onFormSubmit();

      // go to home & establish websocket connection
      history.push("/home");
      websocketContext.connect();

    } catch (e) {
      // errors are handled directly in onFormSubmit
    }
  }

  return (
    <div className="login-form">
        <ServerError serverError={serverError}/>
        <ValidatedInput 
            type="text"
            label="Username or email"
            placeholder="Username or email"
            error={fieldErrors.usernameOrEmail}
            onChange={onFormValueChange} 
            value={values.usernameOrEmail}
            name="usernameOrEmail"
        />
        <ValidatedInput 
            type="password"
            label="Password"
            placeholder="Password"
            error={fieldErrors.password}
            onChange={onFormValueChange} 
            value={values.password}
            name="password"
        />
        <SubmitButton 
            isSubmitting={isSubmitting}
            value="Sign in" 
            onClick={handleOnFormSubmit}
        />
        <p className="below-btn">Don't have an account? <Link to="/register">Sign up</Link></p>
    </div>
  )
}

const initialValues = {
  usernameOrEmail: '',
  password: ''
};

const rules = {
  usernameOrEmail: [
    [value => value != '', 'Fill in a username or email'],
  ],
  password: [
    [value => value != '', 'Fill in a password'],
  ]
};

const handlers = {
  // login on form submit
  onFormSubmit: async (values) => {
    try {
      const requestBody = JSON.stringify({
          usernameOrEmail: values.usernameOrEmail,
          password: values.password
      });
      const response = await api.post(`/users/login`, requestBody);

      // Store the token into the local storage.
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
    } catch (error) {
      return error;
    }
  }
}

const LoginForm = withFormValidation(initialValues, rules, handlers, LoginFormSkeleton);

export default withRouter(LoginForm);