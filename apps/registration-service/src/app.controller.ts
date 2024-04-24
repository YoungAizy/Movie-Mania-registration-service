import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  UserDto,
  UserServiceController,
  UserServiceControllerMethods,
  Json,
} from '@app/common';
import { ReplaySubject, Observable, of } from 'rxjs';

@Controller()
@UserServiceControllerMethods()
export class AppController implements UserServiceController {
  constructor(private readonly appService: AppService) {}

  hello() {
    return this.appService.getHello();
  }

  createUser(user: UserDto): Observable<Json> {
    console.log('user object', user);
    const subject = new ReplaySubject<Json>();
    const onNext = async (x: any) => {
      const promise = await x;
      subject.next({ payload: JSON.stringify(promise) });
    };
    const onComplete = async () => {
      const timeout = 1000 * 30;
      setTimeout(() => {
        console.log('DONE!');
        subject.complete();
      }, timeout);
    };

    const asyncCalls = () => {
      const result = this.appService.authenticate(user.email, user.password);

      if (user.picture) {
        return of(
          result,
          this.appService.saveUsername(user.username, result),
          this.appService.storePicture(user.picture, result, user.metadata),
        );
      } else {
        return of(result, this.appService.saveUsername(user.username, result));
      }
    };

    const observable = asyncCalls();

    observable.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
