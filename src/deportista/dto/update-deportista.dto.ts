import { PartialType } from '@nestjs/swagger';
import { CreateDeportistaDto } from './create-deportista.dto';
import { IsOptional } from 'class-validator';

export class UpdateDeportistaDto extends PartialType(CreateDeportistaDto) {
    @IsOptional()
    fotoFile?: any;
    
    @IsOptional()
    documentoIdentidadFile?: any;
    
    @IsOptional()
    registroCivilFile?: any;
    
    @IsOptional()
    afiliacionFile?: any;
    
    @IsOptional()
    certificadoEpsFile?: any;
    
    @IsOptional()
    permisoResponsableFile?: any;
}
