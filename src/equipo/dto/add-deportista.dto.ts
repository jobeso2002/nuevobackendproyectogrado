import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDeportistaDto {
  @ApiProperty({ example: 1, })
  @IsNotEmpty()
  @IsNumber()
  id_deportista: number;

  @ApiProperty({ example: '2023-01-01', description: 'Fecha de ingreso al equipo', required: false })
  @IsOptional()
  @IsDate()
  fecha_ingreso?: Date;
}