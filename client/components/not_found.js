import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => (
  <div className="boxed-vew">
    <div>
      <h2>404</h2>
      <p>This is not the page you are looking for.</p>
      <Link className="button" to="/">Homepage</Link>
    </div>
  </div>
);
