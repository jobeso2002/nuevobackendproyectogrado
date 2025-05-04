import { applyDecorators, UseGuards } from "@nestjs/common";
import { PermisoType } from "../../common/permiso.enum";
import { RoleType } from "../../common/tiporole.enum";
import { Roles } from "./role.decorator";
import { Permiso } from "./permiso.decorator";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";

export function Authen(role: RoleType, ...permiso: PermisoType[]) {
    
    return applyDecorators(Roles(role), Permiso(...permiso), UseGuards(AuthGuard, RolesGuard))
}