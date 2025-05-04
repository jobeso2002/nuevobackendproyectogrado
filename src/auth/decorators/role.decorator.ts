import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../../common/tiporole.enum";
export const ROLES_KEY = 'role'

export const Roles = (roles: RoleType) => SetMetadata(ROLES_KEY, roles)