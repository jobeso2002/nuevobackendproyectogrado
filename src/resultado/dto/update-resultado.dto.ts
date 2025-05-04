import { PartialType } from '@nestjs/swagger';
import { CreateResultadoDto } from './create-resultado.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateResultadoDto extends PartialType(CreateResultadoDto) {
    @IsInt()
    @IsPositive()
    @IsOptional()
    usuarioRegistraId?: number;
}
