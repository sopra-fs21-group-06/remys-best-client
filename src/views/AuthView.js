import React from 'react';
import { withRouter } from 'react-router-dom';
import { linksMode } from '../helpers/constants';
import View from './View';

class AuthView extends React.Component {

  render() {
    return (
        <View linksMode={linksMode.AUTH} {...this.props}/>
    );
  }
}

export default withRouter(AuthView);