import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, isInt, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen del logo',
    required: false
  })
  @IsOptional()
  fotoFile?: any;

  @ApiProperty({ example: 'A+', enum: ['A+', 'A-', 'B+', 'B-','AB+','AB-','O+','O-'] })
  @IsString()
  @IsIn(['A+', 'A-', 'B+', 'B-','AB+','AB-','O+','O-'])
  tipo_sangre: string;

  @ApiProperty({ example: '3998887987' })
  @IsString()
  @MinLength(1)
  telefono: string;

  @ApiProperty({ example: 'central' })
  @IsString()
  @MinLength(1)
  posicion: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  numero_camiseta: number;

  @ApiProperty({ example: 'jugador1@example.com' })
  @IsString()
  @MinLength(1)
  email: string;

  @ApiProperty({ example: 'manzana 75' })
  @IsString()
  @MinLength(1)
  direccion: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo PDF del documento de identidad',
    required: false
  })
  @IsOptional()
  documentoIdentidadFile?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo PDF del registro civil',
    required: false
  })
  @IsOptional()
  registroCivilFile?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo PDF de afiliación',
    required: false
  })
  @IsOptional()
  afiliacionFile?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo PDF del certificado EPS',
    required: false
  })
  @IsOptional()
  certificadoEpsFile?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo PDF del permiso del responsable',
    required: false
  })
  @IsOptional()
  permisoResponsableFile?: any;
}