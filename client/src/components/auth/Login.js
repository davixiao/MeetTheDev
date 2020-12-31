import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Login = () => {
  // formData is where we store the state.
  // SetFormData is a function that takes in values and changes formData to those values
  // inside the useState, we have an initial value of what is in the state.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); // stops the thing from doing what it does default. In this case, prevents it from
    // submitting the form
    console.log('SUCCESS');
  };
  return (
    <>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/Register'>Sign Up</Link>
      </p>
    </>
  );
};
