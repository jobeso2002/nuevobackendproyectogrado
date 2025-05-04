import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermisoService } from './permiso.service';
import { CreatePermisionDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('permiso')
export class PermisoController {
  constructor(private readonly permisoService: PermisoService) {}

  @ApiBearerAuth('mi secreto1')
  @Post()
  create(@Body() createPermisoDto: CreatePermisionDto) {
    return this.permisoService.create(createPermisoDto);
  }

  @Get()
  findAll() {
    return this.permisoService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePermisionDto: UpdatePermisoDto) {
    return this.permisoService.update(id, updatePermisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.permisoService.remove(id);
  }
}
