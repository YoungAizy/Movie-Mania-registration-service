import { ApiGatewayService } from './api-gateway.service';
import { UserDto } from '@app/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @SubscribeMessage('greet')
  greet(@MessageBody() msg, @ConnectedSocket() client: Socket) {
    console.log(msg);
    // client.emit('hello');
    setInterval(() => client.send('hello'), 2500);
    // this.apiGatewayService.hello()
    return 'help';
  }

  @SubscribeMessage('register')
  create(@MessageBody() user: UserDto, @ConnectedSocket() client: Socket) {
    console.log(user);
    const next = (val: any) => {
      console.log(val);
      client.emit('success', JSON.parse(val.payload));
    };

    const complete = () => {
      console.log('COMPLETE!');
      client.disconnect(true);
    };

    const error = (error: any) => {
      console.log('ERROR:', error);
      client.emit('failure', error);
    };
    this.apiGatewayService.register(user).subscribe({
      next,
      complete,
      error,
    });
  }
}
