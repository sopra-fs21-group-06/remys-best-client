import React, { useCallback } from 'react';
import { withFormValidation }  from './withFormValidation';
import { withRouter, Link } from 'react-router-dom';
import { api } from "../../helpers/api";
import { ServerError, SubmitButton, ValidatedClearableInput} from "../../helpers/formUtils"
import BoxWithUsers from "../BoxWithUsers"
import debounce from 'lodash.debounce'

const ManageFriendsFormSkeleton = (props) => {
  const {
    onFormValueChange,
    onFormSubmit,
    values,
    fieldErrors,
    serverError,
    isSubmitting
  } = props;

  const submitWithDelay = useCallback(
		debounce(async () => {
      try {
        await onFormSubmit();
      } catch (e) {
        // errors are handled directly in onFormSubmit
      }
    }, 500),
		[]
	);

	const searchOnValueChanged = (event) => {
		onFormValueChange(event);
		submitWithDelay();
	};

  let users = [
      {username: "Andrina", email: "andrina@andrina.ch", status: "Request"},
      {username: "Peter", email: "peter@peter.ch", status: "Friends"},
      {username: "Edi", email: "edi@edi.ch", status: "Friends"},
      {username: "Pascal", email: "pascalemmenegger@hotmail.com", status: "Pending"},
      {username: "Siddhant", email: "siddhant@andrina.ch", status: "Confirm"},
      {username: "George Clooney", email: "clooney@gmbh.ch", status: "Request"},
      {username: "David Beckham", email: "becks@david.ch", status: "Friends"},
      {username: "Remy", email: "remyegloff@egloff.ch", status: "Friends"}
    ]

  return (
    <div>
        <ServerError serverError={serverError}/>
        <ValidatedClearableInput 
            type="text"
            placeholder="Search for username or email"
            error={fieldErrors.usernameOrEmail}
            onChange={searchOnValueChanged} 
            value={values.usernameOrEmail}
            name="usernameOrEmail"
        />
        <BoxWithUsers withFilter users={users} isSubmitting={isSubmitting} />
        <p className="below-btn"><Link to="/home">Return to Home</Link></p>
    </div>
  )
}

const initialValues = {
  usernameOrEmail: ''
};

const rules = {
  usernameOrEmail: [
    [value => value != '', 'Fill in a username or email'],
  ]
};

const handlers = {
  // edit profile on submit
  onFormSubmit: async (values) => {
    try {
        console.log("SUBMIT WITH " + values.usernameOrEmail)


        // TODO server call

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

const ManageFriendsForm = withFormValidation(initialValues, rules, handlers, ManageFriendsFormSkeleton);

export default withRouter(ManageFriendsForm);