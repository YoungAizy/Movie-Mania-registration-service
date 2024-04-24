/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface Empty {
}

export interface Json {
  payload: string | undefined;
}

export interface UserDto {
  email: string;
  password: string;
  username: string;
  picture?: string | undefined;
  metadata?: string | undefined;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  createUser(request: UserDto): Observable<Json>;

  hello(request: Empty): Observable<Json>;
}

export interface UserServiceController {
  createUser(request: UserDto): Observable<Json>;

  hello(request: Empty): Promise<Json> | Observable<Json> | Json;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createUser", "hello"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
