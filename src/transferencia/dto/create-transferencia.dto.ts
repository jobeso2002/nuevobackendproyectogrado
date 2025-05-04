import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTransferenciaDto {

  @ApiProperty({ example: 1, description: 'ID del deportista a transferir' })
  @IsNotEmpty()
  @IsNumber()
  id_deportista: number;
  
  @ApiProperty({ example: 1, description: 'ID del club de origen' })
  @IsNotEmpty()
  @IsNumber()
  id_club_origen: number;

  @ApiProperty({ example: 2, description: 'ID del club de destino' })
  @IsNotEmpty()
  @IsNumber()
  id_club_destino: number;

  @ApiProperty({ example: '1989-01-22' })
  @Type(() => Date)
  @IsDate()
  fechaTransferencia: Date;

  @ApiProperty({ example: 'me mude ' })
  @IsString()
  @MinLength(1)
  motivo: string;

  @ApiProperty({ example: 1, description: 'ID del usuario que registra la transferencia' })
  @IsNotEmpty()
  @IsNumber()
  id_usuario_registra: number;
}
