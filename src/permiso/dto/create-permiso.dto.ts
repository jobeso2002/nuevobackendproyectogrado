import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PermisoType } from "src/common/permiso.enum";

export class CreatePermisionDto {
    @ApiProperty({example: 'WRITE'})
    @IsEnum(PermisoType, {message:"no permiso"})
    name: PermisoType;
}
