import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {email, required} from './../../validators';

import * as actions from './../../actions';

class Login extends Component {

  onSubmit(values) {
    this.props.loginUser({
      email: values.email,
      password: values.password
    }, () => {
      let date = new Date();
      this.props.history.push('/dashboard');
    });
  }

  renderAuthErrorMessage() {
    if (this.props.errorMessage) {
      return <div className="form__error form__error--major">{this.props.errorMessage}</div>;
    }
  }

  componentWillMount() {
    this.props.resetAuthError();
  }

  handleFocus() {
    this.props.resetAuthError();
  }

  renderField(field) {
    return (
      <div className="form__field">
        <label className="form__label">{field.label}</label>
        <input
          className="form__input"
          {...field.input}
          placeholder={field.label}
          type={field.type}
        />
        {
          (field.meta.touched && field.meta.error)
          ?
          <div className="form__error">{field.meta.error}</div> : null
        }
      </div>
    );
  }


  render() {
    const {handleSubmit, submitting} = this.props;

    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h2>Login</h2>
          {this.renderAuthErrorMessage()}
          <form className="form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <Field
              name="email"
              label="Email"
              type="email"
              onFocus={this.handleFocus.bind(this)}
              component={this.renderField}
              validate={[required, email]}
            />
            <Field
              name="password"
              label="Password"
              type="password"
              onFocus={this.handleFocus.bind(this)}
              component={this.renderField}
              validate={[required]}
            />
            <button className="button" type="submit" disabled={submitting}>Login</button>
          </form>
          <Link to="/register">Don't have an account?</Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  };
}

export default reduxForm({
  form: 'LoginAccount',
})(
  connect(mapStateToProps, actions)(Login)
);
