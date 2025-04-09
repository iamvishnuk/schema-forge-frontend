import { combineReducers } from '@reduxjs/toolkit';

import schemaReducer from '../features/schema-editor/schema';
import schemaEditorReducer from '../features/schema-editor/schemaEditorUI';
import teamRoleReducer from '../features/team/teamRoleSlice';

const rootReducer = combineReducers({
  teamRole: teamRoleReducer,
  schemaEditorUI: schemaEditorReducer,
  schema: schemaReducer
});

export default rootReducer;
