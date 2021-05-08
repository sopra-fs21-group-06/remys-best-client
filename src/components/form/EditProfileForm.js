import { withFormValidation }  from './withFormValidation';
import { withRouter, Link } from 'react-router-dom';
import { api } from "../../helpers/api";
import { ServerError, SubmitButton, ValidatedInput} from "../../helpers/formUtils"

const EditProfileFormSkeleton = (props) => {
  const {
    onFormValueChange,
    onFormSubmit,
    values,
    fieldErrors,
    serverError,
    isSubmitting,
    history
  } = props;

  const handleOnFormSubmit = async () => {
    try {
      await onFormSubmit();
      history.push("/home");
    } catch (e) {
      // errors are handled directly in onFormSubmit
    }
  }

  return (
    <div>
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
            value="Save changes" 
            onClick={handleOnFormSubmit}
        />
        <p className="below-btn"><Link to="/home">Return to Home</Link></p>
    </div>
  )
}

const initialValues = {
  username: '',
  email: '',
  password: ''
};

const rules = {
  username: [
    [value => value != '', 'Fill in a username'],
  ],
  email: [
    [value => value != '', 'Fill in a email'],
  ],
  password: [
    [value => value != '', 'Fill in a password'],
  ]
};

const handlers = {
  // edit profile on submit
  onFormSubmit: async (values) => {
    try {
        /*
        TODO
        const requestBody = JSON.stringify({
            usernameOrEmail: values.usernameOrEmail,
            password: values.password
        });
        const response = await api.post(`/users/login`, requestBody);
        // Get the returned user and update a new object.
        const user = new User(response.data);

        // Store the token into the local storage.
        localStorage.setItem('token', user.token);

        // Login successfully worked --> navigate to the route /game in the GameRouter*/
        //history.push(`/home`);
    } catch (error) {
        return error;
    }
  }
}

const EditProfileForm = withFormValidation(initialValues, rules, handlers, EditProfileFormSkeleton);

export default withRouter(EditProfileForm);