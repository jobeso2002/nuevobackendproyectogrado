import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateClubDto {
  @ApiProperty({ example: 'los ganadores' })
  @IsString()
  @MinLength(1)
  nombre: string;

  @ApiProperty({ example: '1985-01-22' })
  @Type(() => Date)
  @IsDate()
  fundacion: Date;

  @ApiProperty({ example: 'sub-15', enum: ['sub-15', 'sub-17', 'sub-19', 'mayores', 'juvenil', 'infantil'] })
  @IsString()
  @IsIn(['sub-15', 'sub-17', 'sub-19', 'mayores', 'juvenil', 'infantil'])
  rama: string;

  @ApiProperty({ example: 'masculino' })
  categoria: string;

  @ApiProperty({ example: 'calle 1 #03' })
  @IsString()
  @MinLength(1)
  direccion: string;

  @ApiProperty({ example: '3008213278' })
  @IsString()
  @MinLength(1)
  telefono: string;

  @ApiProperty({ example: 'ganadoresclub@example.com' })
  @IsString()
  @MinLength(1)
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen del logo',
    required: false
  })
  @IsOptional()
  logoFile?: any;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  id_usuario_responsable: number;
}
