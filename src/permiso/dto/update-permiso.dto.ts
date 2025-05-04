import { IsOptional } from "class-validator";
import { PermisoType } from "../../common/permiso.enum";
import { Column } from "typeorm";

export class UpdatePermisoDto {
    @Column({
        type: 'enum',
        enum: PermisoType
    })  
    @IsOptional()
    name: PermisoType
}
