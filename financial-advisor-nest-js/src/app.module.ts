import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummationModule } from './summation/summation.module';
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
 */
@Module({
  imports: [
    InfrastructureModule, // Provides repository implementations
    SummationModule, // Uses repositories via DI
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
