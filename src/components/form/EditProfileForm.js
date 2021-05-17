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
  email: '',
  password: ''
};

const rules = {
  email: [
    [value => value != '', 'Fill in a email'],
  ],
  password: [
    [value => value != '', 'Fill in a password'],
  ],
};

const handlers = {
  // edit profile on submit
  onFormSubmit: async (values) => {
    try {
        const requestBody = JSON.stringify({
            email : values.email,
            password: values.password,
        });
        const response = await api.put(`/users`, requestBody);
    } catch (error) {
        return error;
    }
  }
}



const EditProfileForm = withFormValidation(initialValues, rules, handlers, EditProfileFormSkeleton);

export default withRouter(EditProfileForm);