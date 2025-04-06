import { combineReducers } from '@reduxjs/toolkit';

import teamRoleReducer from '../features/team/teamRoleSlice';

const rootReducer = combineReducers({
  teamRole: teamRoleReducer
});

export default rootReducer;
