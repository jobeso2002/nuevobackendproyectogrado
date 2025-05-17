// src/equipo/dto/equipo-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Club } from '../../club/entities/club.entity';

export class EquipoResponseDto {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    nombre: string;
    
    @ApiProperty()
    rama: string;
    
    @ApiProperty()
    categoria: string;
    
    @ApiProperty()
    color_principal?: string;
    
    @ApiProperty()
    color_secundario?: string;
    
    @ApiProperty({ type: () => Club })
    club: Club;
}