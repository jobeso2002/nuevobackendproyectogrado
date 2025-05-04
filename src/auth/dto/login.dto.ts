import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({example: 'pepe@example.com'})
    @IsEmail({}, { message: 'Correo inválido' })
    email: string;
    
    @ApiProperty({example: '1234567'})
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}
