import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {email, required, minLength} from './../../validators';

import * as actions from './../../actions';

class Register extends Component {
  renderAuthErrorMessage() {
    if (this.props.errorMessage) {
      return <p>{this.props.errorMessage}</p>;
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

  onSubmit(values) {
    this.props.registerUser({
      email: values.email,
      password: values.password
    }, () => {
      this.props.history.push('/dashboard');
    });
  }

  render() {
    const {handleSubmit, submitting} = this.props;

    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h2>Register account</h2>
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
              validate={[required, minLength(6)]}
            />
            <Field
              name="passwordConfirm"
              label="Re-enter Password"
              type="password"
              onFocus={this.handleFocus.bind(this)}
              component={this.renderField}
              validate={required}
            />
            <button className="button" type="submit" disabled={submitting}>Login</button>
          </form>
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    );
  }
}

function validate(values) {
  let error = {};
  if (values.password !== values.passwordConfirm) {
    error.passwordConfirm = 'Passwords do not match';
  }
  return error;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  };
}

export default reduxForm({
  validate,
  form: 'RegisterAccount',
})(
  connect(mapStateToProps, actions)(Register)
);
