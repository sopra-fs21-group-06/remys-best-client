import React from 'react';
import { withRouter } from 'react-router-dom';
import { linksMode } from '../helpers/constants';
import View from './View';

class InGameView extends React.Component {

  render() {
    return (
        <View linksMode={linksMode.IN_GAME} withFooterHidden withDogImgHidden {...this.props}/>
    );
  }
}

export default withRouter(InGameView);