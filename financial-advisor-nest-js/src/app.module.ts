import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummationModule } from './application/summation/summation.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

/**
 * App module - Composition root
 * Wires together all layers following onion architecture:
 *
 * Layer structure (innermost to outermost):
 * 1. CoreModule: Domain entities and repository contracts
 * 2. SummationModule: Application logic and use cases
 * 3. InfrastructureModule: Repository implementations and external dependencies
 *
 * Dependency injection happens here - infrastructure provides implementations
 * of interfaces defined in core, which are used by application layer.
 *
 * IMPORTANT: InfrastructureModule must be imported before application modules
 * to ensure repository providers are available.
 */
@Module({
  imports: [
    InfrastructureModule, // Provides repository implementations - MUST BE FIRST
    SummationModule, // Uses repositories via DI
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [InfrastructureModule], // Export to make repositories available globally
})
export class AppModule {}
