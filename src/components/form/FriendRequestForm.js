import React, { useContext } from 'react';
import { withFormValidation }  from './withFormValidation';
import { withRouter } from 'react-router-dom';
import { api } from "../../helpers/api";
import { ServerError, SubmitButton, ValidatedInput} from "../../helpers/formUtils"
import InfoMessage from "../alert/InfoMessage"
import { ForegroundContext } from '../context/ForegroundProvider';

const FriendRequestFormSkeleton = (props) => {
  const {
    onFormValueChange,
    onFormSubmit,
    clearValue,
    values,
    fieldErrors,
    serverError,
    isSubmitting
  } = props;

  const foregroundContext = useContext(ForegroundContext);

  const handleOnFormSubmit = async () => {
    try {
      await onFormSubmit();
      foregroundContext.showAlert(<InfoMessage text={`${values.username} successfully requested`}/>, 3000);
      props.refreshUsers();
    } catch (e) {
      // errors are handled directly in onFormSubmit
    } finally {
      clearValue("username");
    }
  }
  
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
              onClick={handleOnFormSubmit}
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
      await api.post(`/friendrequests`, requestBody);
    } catch (error) {
        return error;
    }
  }
}

const FriendRequestForm = withFormValidation(initialValues, rules, handlers, FriendRequestFormSkeleton);

export default withRouter(FriendRequestForm);