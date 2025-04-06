import { createSlice } from '@reduxjs/toolkit';

import { TeamRoleEnum } from '@/definitions/enums';

interface TeamRoleState {
  teamRole: TeamRoleEnum | undefined;
  teamId: string;
}

const initialState: TeamRoleState = {
  teamRole: undefined,
  teamId: ''
};

const teamRoleSlice = createSlice({
  name: 'teamRole',
  initialState,
  reducers: {
    setTeamRole: (state, action) => {
      state.teamRole = action.payload.role;
      state.teamId = action.payload.teamId;
    }
  }
});

export const { setTeamRole } = teamRoleSlice.actions;
export default teamRoleSlice.reducer;
