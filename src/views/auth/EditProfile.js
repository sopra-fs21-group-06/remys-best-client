import React from 'react';
import { withRouter } from 'react-router-dom';
import EditProfileForm from '../../components/form/EditProfileForm';
import View from "../View";
import { viewLinks } from "../../helpers/constants"

class EditProfile extends React.Component {

  render() {
    return (
      <View className="edit-profile" title="Edit your profile" linkMode={viewLinks.BASIC}>
          <main className="small">
            <EditProfileForm />
          </main>
      </View>
    );
  }
}

export default withRouter(EditProfile);