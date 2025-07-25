import { PartialType } from "@nestjs/swagger";
import { CreateUsuarioDto } from "./create-usuario.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @IsOptional()
    @IsString()
    resetToken?: string | null;
  
    @IsOptional()
    resetTokenExpiry?: Date | null;
}
