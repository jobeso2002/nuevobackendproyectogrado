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
    const requiredPermissions = this.reflector.getAllAndOverride<PermisoType[]>(
      PERMISION_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Si no hay permisos requeridos, permitir acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permisos) {
      throw new ForbiddenException('Usuario no autenticado o sin permisos');
    }

    // Verificar si el usuario tiene todos los permisos requeridos
    const hasAllPermissions = requiredPermissions.every(permission =>
      user.permisos.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Requiere permisos: ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }
}