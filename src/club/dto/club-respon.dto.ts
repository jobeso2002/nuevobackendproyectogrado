import { ApiProperty } from '@nestjs/swagger';
import { ResponsableDto } from './responsable.dto';

export class ClubResponseDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  nombre: string;
  
  @ApiProperty()
  fundacion: Date;
  
  @ApiProperty()
  direccion: string;
  
  @ApiProperty()
  telefono: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  logo: string;
  
  @ApiProperty()
  estado: string;
  
  @ApiProperty({ type: () => ResponsableDto })
  responsable: ResponsableDto;
}

