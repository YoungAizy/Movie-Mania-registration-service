import { USER_SERVICE_NAME, UserDto, UserServiceClient } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  private userServiceClient: UserServiceClient;
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userServiceClient =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  hello() {
    this.userServiceClient.hello({}).subscribe((x) => console.log('g', x));
  }

  register(user: UserDto) {
    console.log('passing user object', user);
    const res = this.userServiceClient.createUser(user);

    return res;
  }
}
