// src/club/dto/asignar-deportista.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt } from 'class-validator';

export class AsignarDeportistaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_deportista: number;

  @ApiProperty({ example: '2023-01-01' })
  @IsDate()
  fecha_ingreso: Date;
}