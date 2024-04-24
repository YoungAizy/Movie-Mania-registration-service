import { HttpException, Injectable } from '@nestjs/common';
import {
  User,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, storage } from './config/firebase';
import {
  getDownloadURL,
  ref as storageRef,
  uploadString,
} from 'firebase/storage';
import { RegistrationException } from './utils/registration.exception';

interface ErrorObject {
  statusCode: number;
  message: string;
}

@Injectable()
export class AppService {
  errorHandler: ErrorObject;

  getHello() {
    return { payload: JSON.stringify({ msg: 'Hello World!' }) };
  }

  async authenticate(email: string, password: string) {
    console.log('service:', email, password);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return { data: user, type: 'registered' };
    } catch (error) {
      console.log('ERROR:', error);
      // this.errorHandler.statusCode = error.statusCode;
      // this.errorHandler.message = error.message;
      throw new RegistrationException(error.message, error.statusCode);
    }
  }

  async storePicture(
    picture: string,
    user: Promise<{ data: User; type: string }>,
    metadata: string,
  ) {
    console.log('entered store picture');
    try {
      const userResult = (await user).data;
      const reference = storageRef(storage, 'profile_pics/' + userResult.uid);
      const result = await uploadString(reference, picture, 'data_url', {
        contentType: metadata,
      });
      const url = result && (await getDownloadURL(reference));
      await updateProfile((await user).data, { photoURL: url });
      console.log('DOWNLOAD URL:', url);
      console.log('Upload result', result);

      return url;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  async saveUsername(
    displayName: string,
    user: Promise<{ data: User; type: string }>,
  ) {
    try {
      const x = await updateProfile((await user).data, { displayName });
      console.log('Username uploaded:', x);
      return 'username saved';
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
