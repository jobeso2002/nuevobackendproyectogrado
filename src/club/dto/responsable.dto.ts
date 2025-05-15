import { ApiProperty } from "@nestjs/swagger";

export class ResponsableDto {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    username: string;
    
    @ApiProperty()
    email: string;
  }