const TeamRolePermission = {
  owner: [
    'manage_team',
    'manage_project',
    'assign_roles',
    'delete_project',
    'invite_members',
    'remove_members'
  ],
  admin: ['manage_project', 'invite_member', 'assign_roles', 'remove_members'],
  manager: ['manage_project'],
  viewer: ['view_content']
};

type Role = keyof typeof TeamRolePermission;

export function hasPermission(role: Role, action: string): boolean {
  return TeamRolePermission[role]?.includes(action) || false;
}
