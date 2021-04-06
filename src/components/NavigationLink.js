import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class NavigationLink extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
        <div className={"navigation-link " + this.props.position + "-link"}>
            <Link to={this.props.to}>{this.props.name}</Link>
        </div>
    );
  }
}

export default withRouter(NavigationLink);