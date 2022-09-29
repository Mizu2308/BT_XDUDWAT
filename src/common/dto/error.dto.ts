import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  statusCode: string;

  @ApiProperty({
    oneOf: [
      {type: 'string'},
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  @IsString()
  message: string | string[];

  @ApiProperty({
    type: String,
  })
  @IsString()
  timestamp: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  path: string;
}
