import {Injectable} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello QTI!';
  }

  async getZipCloud(zipcode: string) {
    const result = await axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);

    return result.data;
  }
}
