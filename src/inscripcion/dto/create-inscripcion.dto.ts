import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateInscripcionDto {
  @ApiProperty({ example: '1989-01-22' })
  @Type(() => Date)
  @IsDate()
  fechaInscripcion: Date;

  @ApiProperty({ example: 1, description: 'ID del evento' })
  @IsNotEmpty()
  @IsNumber()
  id_evento: number;

  @ApiProperty({ example: 1, description: 'ID del club' })
  @IsNotEmpty()
  @IsNumber()
  id_club: number;

  @ApiProperty({ example: 1, description: 'ID del usuario que registra la inscripción' })
  @IsNotEmpty()
  @IsNumber()
  id_usuario_registra: number;
}
