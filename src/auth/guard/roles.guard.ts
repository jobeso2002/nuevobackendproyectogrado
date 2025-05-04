import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermisoType } from "../../common/permiso.enum";
import { RoleType } from "../../common/tiporole.enum";
import { ROLES_KEY } from "../decorators/role.decorator";
import { PERMISION_KEY } from "../decorators/permiso.decorator";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<RoleType>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<PermisoType[]>(PERMISION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar rol requerido
    if (requiredRole) {
      const hasRole = user.role.name === requiredRole || user.role.name === RoleType.ADMIN;
      if (!hasRole) {
        throw new ForbiddenException('No tienes el rol necesario para acceder a este recurso');
      }
    }

    // Verificar permisos requeridos
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        user.permisos.includes(permission)
      );
      
      if (!hasAllPermissions) {
        throw new ForbiddenException('No tienes los permisos necesarios para acceder a este recurso');
      }
    }

    return true;
  }
}