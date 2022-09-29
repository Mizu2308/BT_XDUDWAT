import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(file: any, metadata: ArgumentMetadata) {
    //Check type of file
    if (metadata.data !== 'file') {
      throw new HttpException(`File don't support`, HttpStatus.HTTP_VERSION_NOT_SUPPORTED);
    }

    // // Check ext
    // console.log(file);
    // console.log(!extname(file.originalname).match(/\/(jpg|jpeg|png)$/gim));
    // if (!extname(file.originalname).match(/\/(jpg|jpeg|png)$/gim)) {
    //   throw new HttpException(
    //     `Unsupported file type ${extname(file.originalname)}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    //     // Check size
    //     console.log(file.size, fileUploadConfig.fileLimit);
    //     if (file.size > fileUploadConfig.fileLimit) {
    //       throw new HttpException(
    //         `Size of file ${file.originalname} is more than 3Mb`,
    //         HttpStatus.URI_TOO_LONG,
    //       );
    //     }

    return file;
  }
}
