import React from 'react';
import { withRouter } from 'react-router-dom';
import EditProfileForm from '../../components/form/EditProfileForm';
import View from "../View";
import { viewLinks } from "../../helpers/constants"

class CreateNewGame extends React.Component {

  render() {
    return (
      <View className="create-new-game" title="Create new game" linkMode={viewLinks.BASIC}>
          <main className="small">
            
          </main>
      </View>
    );
  }
}

export default withRouter(CreateNewGame);