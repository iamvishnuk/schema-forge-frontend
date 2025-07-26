import { combineReducers } from '@reduxjs/toolkit';

import projectRoleReducer from '../features/project/projectRoleSlice';
import projectReducer from '../features/project/projectSlice';
import schemaReducer from '../features/schema-editor/schema';
import schemaEditorReducer from '../features/schema-editor/schemaEditorUI';
import teamRoleReducer from '../features/team/teamRoleSlice';

const rootReducer = combineReducers({
  teamRole: teamRoleReducer,
  schemaEditorUI: schemaEditorReducer,
  schema: schemaReducer,
  projectRole: projectRoleReducer,
  project: projectReducer
});

export default rootReducer;
