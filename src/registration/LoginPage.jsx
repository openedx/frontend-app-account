import React from 'react';
import { Input } from '@edx/paragon';


export default () => (
  <div className="form-group">
    <div className="d-flex align-items-start">
      <h6 aria-level="3">Password</h6>
      <Input
        name={name}
        id={id}
        type="email"
        value={value}
        onChange={handleChange}
      />
    </div>
  </div>
);
