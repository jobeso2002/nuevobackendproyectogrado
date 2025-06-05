import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateEventoDto {
  @ApiProperty({ example: 'setima ganada ' })
  @IsString()
  @MinLength(1)
  nombre: string;

  @ApiProperty({ example: 'celebracion 7 de voleibol' })
  @IsString()
  @MinLength(1)
  descripcion: string;

  @ApiProperty({ example: '1989-01-22' })
  @Type(() => Date)
  @IsDate()
  fechaInicio: Date;

  @ApiProperty({ example: '1989-01-22' })
  @Type(() => Date)
  @IsDate()
  fechaFin: Date;

  @ApiProperty({ 
    example: 'torneo', 
    description: 'Tipo de evento',
    enum: ['torneo', 'amistoso', 'clasificatorio', 'championship'] 
  })
  @IsNotEmpty()
  @IsEnum(['torneo', 'amistoso', 'clasificatorio', 'championship'])
  tipo: string;

  @ApiProperty({ example: 'cancha 7 de octubre' })
  @IsString()
  @MinLength(1)
  ubicacion: string;

  @ApiProperty({ example: 1, description: 'ID del usuario organizador' })
  @IsNotEmpty()
  @IsNumber()
  id_usuario_organizador: number;
}
