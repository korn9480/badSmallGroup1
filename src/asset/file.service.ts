import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class FileService {
  // large class
  public async streamFile(res: Response, filePath: string): Promise<void> {
    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
  // large class
  removeImageInServer(pathImg: string) {
    try {
      fs.unlink(pathImg, (error) => {
        console.log(error, '==');
      });
      return { status: 'ok' };
    } catch (error) {
      return { status: `${error.error}` };
    }
  }
}
