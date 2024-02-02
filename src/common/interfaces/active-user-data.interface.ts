import { Role } from 'src/users/entities/role.entity';

export interface ActiveUserData {
  code_student: string;
  role: Role;
  profile: string;
  tokenId: string;
}
