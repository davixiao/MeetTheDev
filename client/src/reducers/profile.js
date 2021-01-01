import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from '../actions/types';

const initialState = {
  profile: null, // when we visit a profile page, retrieve it from data base and store in this key
  profiles: [], // this is a list of profiles
  repos: [], // github repos
  loading: true,
  error: {}, //for errors
};

const profileReducer = (state = initialState, { type, paylaod }) => {
  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: paylaod,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: paylaod,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
};

export default profileReducer;
