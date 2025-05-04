import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateClubDto {
  @ApiProperty({ example: 'los ganadores' })
  @IsString()
  @MinLength(1)
  nombre: string;

  @ApiProperty({ example: '1985-01-22' })
  @Type(() => Date)
  @IsDate()
  fundacion: Date;

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

  @ApiProperty({ example: 'ganador logo' })
  @IsString()
  @MinLength(1)
  logo: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  id_usuario_responsable: number;
}
