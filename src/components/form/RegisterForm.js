import { withFormValidation }  from './withFormValidation';
import { withRouter, Link } from 'react-router-dom';
import { api } from "../../helpers/api";
import { ServerError, SubmitButton, ValidatedInput} from "../../helpers/formUtils"
import User from "../models/shared/User";

const RegisterFormSkeleton = (props) => {
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
            label="Username"
            placeholder="Username"
            error={fieldErrors.username}
            onChange={onFormValueChange} 
            value={values.username}
            name="username"
        />
        <ValidatedInput 
            type="email"
            label="Email"
            placeholder="Email"
            error={fieldErrors.email}
            onChange={onFormValueChange} 
            value={values.email}
            name="email"
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
            value="Sign up" 
            onClick={onFormSubmit}
        />
        <p className="below-btn">Have an account? <Link to="/login">Sign in</Link></p>
    </div>
  )
}

const initialValues = {
  username: '',
  email: '',
  password: '',
};

const rules = {
  username: [
    [value => value != '', 'Fill in a username'],
  ],
  email: [
    [value => value != '', 'Fill in an email'],
    // TODO add email validation rules
  ],
  password: [
    [value => value != '', 'Fill in a password'],
  ]
};

const handlers = {
  // register on form submit
  onFormSubmit: async (values) => {
    try {
      const requestBody = JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password
      });
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/home`);
    } catch (error) {
      return error;
    }
  }
}

const RegisterForm = withFormValidation(initialValues, rules, handlers, RegisterFormSkeleton);

export default withRouter(RegisterForm);