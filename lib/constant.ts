import {
  ProjectMemberRoleEnum,
  ProjectTemplateEnum
} from '@/definitions/enums';
import { MongooseIcon, PrismaIcon, TypeOrmIcon } from '@/icons';

export const TEAM_ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' }
];

export const TEAM_MEMBER_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'invited', label: 'Invited' },
  { value: 'suspended', label: 'Suspended' }
];

export const PROJECT_MEMBER_ROLES: {
  value: ProjectMemberRoleEnum;
  label: string;
}[] = [
  { value: ProjectMemberRoleEnum.OWNER, label: 'Owner' },
  { value: ProjectMemberRoleEnum.EDITOR, label: 'Editor' },
  { value: ProjectMemberRoleEnum.VIEWER, label: 'Viewer' }
];

export const DATABASE_TYPE_OPTIONS = [
  { label: 'MySQL (coming soon)', value: 'mysql', disabled: true },
  { label: 'PostgreSQL (coming soon)', value: 'postgresql', disabled: true },
  { label: 'SQLite (coming soon)', value: 'sqlite', disabled: true },
  { label: 'MongoDB', value: 'mongodb', disabled: false }
] as const;

export const PROJECT_TEMPLATES_OPTIONS: {
  label: string;
  value: ProjectTemplateEnum;
}[] = [
  { label: 'None', value: ProjectTemplateEnum.NONE },
  { label: 'Blog', value: ProjectTemplateEnum.BLOG },
  { label: 'E-Commerce', value: ProjectTemplateEnum.ECOMMERCE },
  { label: 'CRM', value: ProjectTemplateEnum.CRM },
  { label: 'Social Network', value: ProjectTemplateEnum.SOCIAL_NETWORK },
  { label: 'Task Manger', value: ProjectTemplateEnum.TASK_MANAGER }
];

export const MONGO_DB_ORM_OPTIONS = [
  { label: 'Mongoose', value: 'mongoose', icon: MongooseIcon, disabled: false },
  { label: 'Prisma', value: 'prisma', icon: PrismaIcon, disabled: false }
] as const;

export const POSTGRESQL_ORM_OPTIONS = [
  { label: 'Prisma', value: 'prisma', icon: PrismaIcon, disabled: false },
  { label: 'TypeORM', value: 'typeorm', icon: TypeOrmIcon, disabled: false }
] as const;
