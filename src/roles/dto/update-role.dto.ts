import { IsArray, IsOptional, IsString } from "class-validator";
import { RoleType } from "../../common/tiporole.enum";

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name: RoleType;
    
    @IsOptional()
    @IsArray()
    permisoId: number[];
}
