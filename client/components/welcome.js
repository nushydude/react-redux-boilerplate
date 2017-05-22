import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


class Welcome extends Component {
  componentWillMount() {
    if (this.props.authenticated) {
      let date = new Date();
      this.props.history.push('/dashboard');
    } else {
      this.props.history.push('/login')
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(Welcome);
