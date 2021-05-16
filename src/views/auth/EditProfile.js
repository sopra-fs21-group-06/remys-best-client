import React from 'react';
import { withRouter } from 'react-router-dom';
import EditProfileForm from '../../components/form/EditProfileForm';
import AuthView from '../AuthView';

class EditProfile extends React.Component {

  render() {
    return (
      <AuthView className="edit-profile" title="Edit your profile">
          <main className="small">
            <EditProfileForm />
          </main>
      </AuthView>
    );
  }
}

export default withRouter(EditProfile);