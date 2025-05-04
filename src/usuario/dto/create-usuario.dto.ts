import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @ApiProperty({example: 'pepe'})
    @IsString()
    @MinLength(1)
    username: string;

    @ApiProperty({example: 'pepe@example.com'})
    @IsEmail({}, { message: 'Correo inválido' })
    email: string;

    @ApiProperty({example: '1234567'})
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({example: 1})
    @IsInt()
    @IsPositive()
    id_rol: number;
}
