import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, MinLength } from 'class-validator';

export class CreateDeportistaDto {
  @ApiProperty({ example: '14324234' })
  @IsString()
  @MinLength(1)
  documentoIdentidad: string;

  @ApiProperty({ example: 'cedula' })
  @IsString()
  @MinLength(1)
  tipoDocumento: string;

  @ApiProperty({ example: 'jose' })
  @IsString()
  @MinLength(1)
  primer_nombre: string;

  @ApiProperty({ example: 'alfredo' })
  @IsString()
  @MinLength(1)
  segundo_nombre: string;
  @ApiProperty({ example: 'obeso' })
  @IsString()
  @MinLength(1)
  primer_apellido: string;

  @ApiProperty({ example: 'lora' })
  @IsString()
  @MinLength(1)
  segundo_apellido: string;

  @ApiProperty({ example: '1986-01-22' })
  @Type(() => Date)
  @IsDate()
  fechaNacimiento: Date;

  @ApiProperty({ example: 'masculino' })
  @IsString()
  @MinLength(1)
  genero: string;

  @ApiProperty({ example: 'foto' })
  @IsString()
  @MinLength(1)
  foto: string;

  @ApiProperty({ example: '3998887987' })
  @IsString()
  @MinLength(1)
  telefono: string;

  @ApiProperty({ example: 'jugador1@example.com' })
  @IsString()
  @MinLength(1)
  email: string;

  @ApiProperty({ example: 'manzana 75' })
  @IsString()
  @MinLength(1)
  direccion: string;

  
}
