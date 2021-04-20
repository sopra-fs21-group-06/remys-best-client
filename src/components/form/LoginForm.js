import { withFormValidation }  from './withFormValidation';
import { withRouter, Link } from 'react-router-dom';
import { api } from "../../helpers/api";
import { ServerError, SubmitButton, ValidatedInput} from "../../helpers/formUtils"
import User from "../models/shared/User";

const LoginFormSkeleton = (props) => {
  const {
    onFormValueChange,
    onFormSubmit,
    values,
    fieldErrors,
    serverError,
    isSubmitting
  } = props;

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
            onClick={onFormSubmit}
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
      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
    } catch (error) {
      return error;
    }
  },
  // Login successfully worked --> navigate to the route /game in the GameRouter
  routeOnSuccess: "/home"
}

const LoginForm = withFormValidation(initialValues, rules, handlers, LoginFormSkeleton);

export default withRouter(LoginForm);