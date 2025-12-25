import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummationModule } from './summation/summation.module';

@Module({
  imports: [SummationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
