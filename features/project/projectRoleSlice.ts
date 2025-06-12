import { createSlice } from '@reduxjs/toolkit';

import { ProjectMemberRoleEnum } from '@/definitions/enums';

export interface ProjectRoleState {
  projectRole: ProjectMemberRoleEnum | undefined;
  projectId: string;
}

const initialState: ProjectRoleState = {
  projectRole: undefined,
  projectId: ''
};

const projectRoleSlice = createSlice({
  name: 'projectRole',
  initialState,
  reducers: {
    setProjectRole: (state, action) => {
      state.projectRole = action.payload.role;
      state.projectId = action.payload.projectId;
    }
  }
});

export const { setProjectRole } = projectRoleSlice.actions;
export default projectRoleSlice.reducer;
