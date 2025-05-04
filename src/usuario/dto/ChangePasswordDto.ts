import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({example: '12345678'})
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}