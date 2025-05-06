import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({example: '12345678'})
  @IsString()
  @Transform(({value}) => value.trim())
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}