import { PartialType } from '@nestjs/swagger';
import { CreateEstadisticaPartidoDto } from './create-estadistica-partido.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateEstadisticaPartidoDto extends PartialType(
  CreateEstadisticaPartidoDto,
) {
  @IsInt()
  @IsPositive()
  @IsOptional()
  partidoId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  deportistaId?: number;
}
