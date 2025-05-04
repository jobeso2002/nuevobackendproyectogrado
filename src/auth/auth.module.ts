import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsuarioModule, ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        
        
          signOptions: { expiresIn: "1d" },
        
     }),
      inject: [ConfigService],
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
export class AuthModule {}
