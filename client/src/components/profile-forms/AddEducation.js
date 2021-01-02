import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';
import { Link, withRouter } from 'react-router-dom';

const AddEducation = ({ addEducation, history }) => {
  const fields = [
    'school',
    'degree',
    'fieldofstudy',
    'from',
    'to',
    'current',
    'description',
  ];

  const initialState = fields.reduce((acc, field) => {
    acc[field] = '';
    if (field === 'current') {
      acc[field] = false;
    }
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);

  const [toDateDisabled, toggleDisabled] = useState(false);

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, history);
  };

  return (
    <>
      <h1 class='large text-primary'>Add An Education</h1>
      <p class='lead'>
        <i class='fas fa-code-branch'></i> Add any schools or other educations
      </p>
      <small>* = required field</small>
      <form class='form' onSubmit={onSubmit}>
        <div class='form-group'>
          <input
            type='text'
            placeholder='* Education Title'
            name='school'
            value={school}
            onChange={onChange}
            required
          />
        </div>
        <div class='form-group'>
          <input
            type='text'
            placeholder='* Degree, diploma, or certificate'
            name='degree'
            value={degree}
            onChange={onChange}
            required
          />
        </div>
        <div class='form-group'>
          <input
            type='text'
            placeholder='Field of Study (e.g. Computer Science)'
            name='fieldofstudy'
            value={fieldofstudy}
            onChange={onChange}
          />
        </div>
        <div class='form-group'>
          <h4>From Date</h4>
          <input type='date' name='from' value={from} onChange={onChange} />
        </div>
        <div class='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              checked={current}
              value={current}
              onChange={(e) => {
                if (!toDateDisabled) {
                  setFormData({ ...formData, current: !current, to: '' });
                } else {
                  setFormData({ ...formData, current: !current });
                }
                toggleDisabled(!toDateDisabled);
              }}
            />{' '}
            Current Education
          </p>
        </div>
        <div class='form-group'>
          <h4>To Date</h4>
          <input
            type='date'
            name='to'
            value={to}
            onChange={onChange}
            disabled={toDateDisabled ? 'disabled' : ''}
          />
        </div>
        <div class='form-group'>
          <textarea
            name='description'
            cols='30'
            rows='5'
            placeholder='Program Description'
            value={description}
            onChange={onChange}
          ></textarea>
        </div>
        <input type='submit' class='btn btn-primary my-1' />
        <Link class='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
