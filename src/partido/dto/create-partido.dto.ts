import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePartidoDto {
  @ApiProperty({ example: '1989-01-22' })
  @Type(() => Date)
  @IsDate()
  fechaHora: Date;

  @ApiProperty({ example: 'cancha 12 de octubre ' })
  @IsString()
  @MinLength(1)
  ubicacion: string;

  @ApiProperty({
    example: 3,
    description: 'ID del árbitro principal',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id_arbitro_principal?: number;

  @ApiProperty({
    example: 4,
    description: 'ID del árbitro secundario',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id_arbitro_secundario?: number;

  @ApiProperty({ example: 1, description: 'ID del evento' })
  @IsNotEmpty()
  @IsNumber()
  id_evento: number;

  @ApiProperty({ example: 1, description: 'ID del club local' })
  @IsNotEmpty()
  @IsNumber()
  id_club_local: number;

  @ApiProperty({ example: 2, description: 'ID del club visitante' })
  @IsNotEmpty()
  @IsNumber()
  id_club_visitante: number;
}
