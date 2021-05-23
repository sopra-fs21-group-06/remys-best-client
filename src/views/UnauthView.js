import React from 'react';
import { withRouter } from 'react-router-dom';
import { linksMode } from '../helpers/constants';
import View from './View';

class UnauthView extends React.Component {

  render() {
    return (
        <View linksMode={linksMode.UNAUTH} {...this.props}/>
    );
  }
}

export default withRouter(UnauthView);