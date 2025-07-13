// src/evento/dto/cambiar-estado.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

export class CambiarEstadoDto {
  @ApiProperty({
    description: 'Nuevo estado del evento',
    enum: ['en_curso', 'finalizado', 'cancelado'],
  })
  @IsNotEmpty()
  @IsEnum(['en_curso', 'finalizado', 'cancelado'])
  estado: string;

  @ApiProperty({ description: 'ID del usuario que realiza el cambio' })
  @IsNotEmpty()
  @IsNumber()
  idUsuario: number;
}