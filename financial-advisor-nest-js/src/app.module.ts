import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummationModule } from './summation/summation.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

/**
 * App module - Composition root
 * Wires together all layers following onion architecture:
 * - InfrastructureModule: Outer layer (repositories, external dependencies)
 * - SummationModule: Inner layer (domain logic, use cases)
 */
@Module({
  imports: [
    InfrastructureModule, // Infrastructure layer - must be imported first
    SummationModule, // Application/Domain layer
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
