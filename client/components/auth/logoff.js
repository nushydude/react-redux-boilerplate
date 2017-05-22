import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import * as actions from './../../actions'

class Logoff extends Component {
  componentWillMount() {
    if (!this.props.authenticated) {
      browserHistory.push('/login');
    }
  }

  componentDidMount() {
    this.props.logoffUser();
  }

  renderMessage() {
    if (this.props.authenticated) {
      return <p>Logging off. Please wait...</p>;
    }
    return <p>You have successfully logged off</p>
  }

  render() {
    return (
      <div>
        {this.renderMessage()}
        {
          this.props.authenticated ? 
          null :
          <Link to="/login">Log back in</Link>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps, actions)(Logoff);
