import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { join } from 'path';
import { USER_PACKAGE_NAME } from '@app/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../../user.proto'),
        },
      },
    ]),
  ],
  controllers: [],
  providers: [ApiGatewayController, ApiGatewayService],
})
export class ApiGatewayModule {}
