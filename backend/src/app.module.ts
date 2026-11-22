import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './modules/admin/admin.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { UserModule } from './modules/user/user.module';
import { ConsultationModule } from './modules/consultation/consultation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://127.0.0.1:27017/newcare',
        retryAttempts: 2,
        retryDelay: 500,
        serverSelectionTimeoutMS: 5000,
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    DoctorModule,
    UserModule,
    ConsultationModule,
  ],
})
export class AppModule {}
