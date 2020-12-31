import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Register = () => {
  // formData is where we store the state.
  // SetFormData is a function that takes in values and changes formData to those values
  // inside the useState, we have an initial value of what is in the state.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); // stops the thing from doing what it does default. In this case, prevents it from
    // submitting the form
    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      console.log('success');
      /*
      without redux, we can do this:
      const newUser = {
        name,
        email,
        password,
      };
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const body = JSON.stringify(newUser); // payload/body

        const res = await axios.post('/api/users', body, config); // we have proxy, so no need for localhost:5000 instead of 3000.
        console.log(res.data);
      } catch (err) {
        console.log(err.response.data);
      }
      */
    }
  };
  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </>
  );
};
