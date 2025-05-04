import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateContactoDto {
  @ApiProperty({ example: 'jose1' })
  @IsString()
  @MinLength(1)
  nombres: string;

  @ApiProperty({ example: 'obeso1' })
  @IsString()
  @MinLength(1)
  apellidos: string;

  @ApiProperty({ example: 'padre' })
  @IsString()
  @MinLength(1)
  parentesco: string;

  @ApiProperty({ example: '234234234' })
  @IsString()
  @MinLength(1)
  telefono: string;

  @ApiProperty({ example: 'jose1@example.com' })
  @IsString()
  @MinLength(1)
  email: string;

  @ApiProperty({ example: 'manzana 11' })
  @IsString()
  @MinLength(1)
  direccion: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  esContactoEmergencia: boolean;

  @ApiProperty({ example: 1, })
  @IsNotEmpty()
  @IsNumber()
  id_deportista: number;
}
