import { createSlice } from '@reduxjs/toolkit';

import { IProject } from '@/definitions/interface';

export interface ProjectState {
  project: IProject | undefined;
}

const initialState: ProjectState = {
  project: undefined
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
    clearProject: (state) => {
      state.project = undefined;
    }
  }
});

export const { setProject, clearProject } = projectSlice.actions;
export default projectSlice.reducer;
