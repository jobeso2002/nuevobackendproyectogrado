import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateResultadoDto {
  @ApiProperty({
    example: 2,
    description: 'Sets ganados por el equipo local',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  setsLocal: number;

  @ApiProperty({
    example: 1,
    description: 'Sets ganados por el equipo visitante',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  setsVisitante: number;

  @ApiProperty({
    example: 25,
    description: 'Puntos totales del equipo local',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  puntosLocal: number;

  @ApiProperty({
    example: 20,
    description: 'Puntos totales del equipo visitante',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  puntosVisitante: number;

  @ApiProperty({
    example: 90,
    description: 'Duración del partido en minutos',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duracion?: number;

  @ApiProperty({
    example: 'El partido se suspendió por lluvia',
    description: 'Observaciones adicionales del partido',
    required: false,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsInt()
  @IsPositive()
  partidoId: number;

  @IsInt()
  @IsPositive()
  usuarioRegistraId: number;
}
