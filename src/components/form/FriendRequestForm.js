import React from 'react';
import { withFormValidation }  from './withFormValidation';
import { withRouter } from 'react-router-dom';
import { api } from "../../helpers/api";
import { ServerError, SubmitButton, ValidatedInput} from "../../helpers/formUtils"

const FriendRequestFormSkeleton = (props) => {
  const {
    onFormValueChange,
    onFormSubmit,
    values,
    fieldErrors,
    serverError,
    isSubmitting
  } = props;
  
  return (
      <div>
          <ServerError serverError={serverError}/>
          <ValidatedInput 
              type="text"
              placeholder="Your friend's username"
              error={fieldErrors.username}
              onChange={onFormValueChange} 
              value={values.username}
              name="username"
          />
          <SubmitButton 
              isSubmitting={isSubmitting}
              value="Send friend request" 
              onClick={onFormSubmit}
          />
      </div>
  )
}

const initialValues = {
  username: ''
};

const rules = {
  username: [
    [value => value != '', 'Fill in a username'],
  ]
};

const handlers = {
  onFormSubmit: async (values) => {
    try {
      const requestBody = JSON.stringify({
          receiverName: values.username
      });
      const response = await api.post(`/friendrequests`, requestBody);


      // server
      //response.data.error.message


      // status OK -> alert firned successfully requested -> triggered pending reload


    } catch (error) {
        return error;
    }
  }
}

const FriendRequestForm = withFormValidation(initialValues, rules, handlers, FriendRequestFormSkeleton);

export default withRouter(FriendRequestForm);