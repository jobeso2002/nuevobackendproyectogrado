import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateEquipoDto {
  @ApiProperty({ example: 'los ganadores' })
  @IsString()
  @MinLength(1)
  nombre: string;

  @ApiProperty({ example: 'masculino' })
  @IsString()
  @MinLength(1)
  rama: string;

  @ApiProperty({ example: 'sub-17' })
  @IsString()
  @MinLength(1)
  categoria: string;

  @ApiProperty({ example: 'Azul', })
  @IsString()
  color_principal?: string;

  @ApiProperty({ example: 'Blanco', })
  @IsString()
  color_secundario?: string;

  @ApiProperty({ example: 1})
  @IsNotEmpty()
  @IsNumber()
  id_club: number;

  
}
