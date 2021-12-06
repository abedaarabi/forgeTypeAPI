import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connect } from './database/bim.db';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await connect();
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
