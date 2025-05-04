import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateContactoDto } from './create-contacto.dto';

export class UpdateContactoDto extends PartialType(CreateContactoDto) {
    @ApiProperty({ example: 1, description: 'ID del deportista relacionado', required: false })
    id_deportista?: number;
}
