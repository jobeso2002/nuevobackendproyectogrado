import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateEstadisticaPartidoDto {
  @ApiProperty({
    example: 15,
    description: 'Número de saques realizados',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  saques: number;

  @ApiProperty({
    example: 30,
    description: 'Número de ataques realizados',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  ataques: number;

  @ApiProperty({
    example: 10,
    description: 'Número de bloqueos efectuados',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  bloqueos: number;

  @ApiProperty({
    example: 25,
    description: 'Número de defensas realizadas',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  defensas: number;

  @ApiProperty({
    example: 75,
    description: 'Puntos totales obtenidos',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  puntos: number;

  @ApiProperty({
    example: 5,
    description: 'Número de errores cometidos',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  errores: number;

  @IsInt()
  @IsPositive()
  partidoId: number;

  @IsInt()
  @IsPositive()
  deportistaId: number;
}
