import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateTransferenciaDto {
    @ApiProperty({ example: 2, description: 'ID del nuevo club de destino', required: false })
  @IsOptional()
  @IsNumber()
  id_club_destino?: number;

  @ApiProperty({ example: '2023-02-20', description: 'Nueva fecha de transferencia (YYYY-MM-DD)', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaTransferencia: Date;

  @ApiProperty({ example: 'Nuevo motivo de transferencia', description: 'Actualización del motivo', required: false })
  @IsOptional()
  @IsString()
  motivo?: string;
}
