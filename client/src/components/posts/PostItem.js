import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
}) => {
  return (
    <div class='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img class='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p class='my-1'>{text}</p>
        <p class='post-date'>Posted on {formatDate(date)}</p>
        <button
          onClick={(e) => addLike(_id)}
          type='button'
          class='btn btn-light'
        >
          <i class='fas fa-thumbs-up'></i>{' '}
          {likes.length > 0 ? (
            <span class='comment-count'>{likes.length}</span>
          ) : null}
        </button>
        <button
          onClick={(e) => removeLike(_id)}
          type='button'
          class='btn btn-light'
        >
          <i class='fas fa-thumbs-down'></i>
        </button>
        <Link to={`/post/${_id}`} class='btn btn-primary'>
          Discussion{' '}
          {comments.length > 0 ? (
            <span class='comment-count'>{comments.length}</span>
          ) : null}
        </Link>
        {!auth.loading && user === auth.user._id ? (
          <button
            onClick={(e) => deletePost(_id)}
            type='button'
            class='btn btn-danger'
          >
            <i class='fas fa-times'></i>
          </button>
        ) : null}
      </div>
    </div>
  );
};

PostItem.propTypes = {
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
