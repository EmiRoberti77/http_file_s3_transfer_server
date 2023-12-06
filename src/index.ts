import express, { Express, Request, Response } from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Messages } from './util/messages';

dotenv.config();

const defaultBucket = 'emibucketai';
const port = process.env.PORT || 3005;
const bucket_name = process.env.BUCKET_NAME || defaultBucket;
console.log(new Date().toISOString());
const app: Express = express();
app.use(cors());
app.use(express.json());
//config multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
});

app.use(express.urlencoded({ extended: true }));
const s3Client = new S3Client({ region: 'us-east-1' });

app.get('/', (req: Request, res: Response) => {
  console.info(req.url);
});

app.post(
  '/transfer',
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(200).send('missing file').end();
      return;
    }
    try {
      const file = req.file;

      const uploadParams = {
        Bucket: bucket_name,
        Key: file.originalname,
        Body: file.buffer,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      res.status(200).json({
        message: true,
        body: Messages.FILE_TRANSFER_SUCCESS,
      });
    } catch (err: any) {
      res.status(501).send(err.message).end();
      return;
    }
  }
);

app.listen(port, () => {
  console.log(port, 'started');
});
