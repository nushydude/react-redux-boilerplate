import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends Component {
  renderNavLinks() {
    if (this.props.authenticated) {
      return <NavLink className="button--link-text" to='/logoff'>Log off</NavLink>;
    } else {
      return [
        <NavLink className="button--link-text" key={1} to='/login'>Log in</NavLink>,
        <NavLink className="button--link-text" key={2} to='/register'>Register</NavLink>
      ];
    }
  }

  renderSubtitle() {
    if (this.props.subtitle) {
      return <h2 className="header-container__title__sub">{this.props.subtitle}</h2>;
    }
  }

  render() {
    return (
      <div className="header">
        <div className="header__content">
          <div className="header__title">
            <h1>{this.props.title}</h1>
            {this.renderSubtitle()}
          </div>
          <div className="header__nav">
            {this.renderNavLinks()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.authenticated,
  };
};

export default connect(mapStateToProps)(Header);
