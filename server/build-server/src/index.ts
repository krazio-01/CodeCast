import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { lookup } from 'mime-types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// 1. Validate Environment Variables
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const BUCKET_NAME = process.env.S3_BUCKET || 'codecast-outputs';

if (!S3_ENDPOINT || !S3_ACCESS_KEY || !S3_SECRET_KEY || !PROJECT_ID) {
    console.error('Error: Missing required environment variables.');
    process.exit(1);
}

// 2. Initialize S3 Client
const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
    },
});

async function init() {
    console.log('Executing build script...');

    const outDirPath = path.join(__dirname, '../output'); // Adjusted assuming compiled code is in /dist

    if (!fs.existsSync(outDirPath)) {
        console.error("ERROR: 'output' directory not found!");
        return;
    }

    console.log('Starting Build Process...');

    const buildProcess = exec(`cd ${outDirPath} && npm install && npm run build`);

    buildProcess.stdout?.on('data', (data) => {
        console.log(data.toString());
    });

    buildProcess.stderr?.on('data', (data) => {
        console.error('Error/Log:', data.toString());
    });

    buildProcess.on('close', async (code) => {
        console.log(`Build complete with code ${code}`);

        if (code !== 0) {
            console.error('Build failed.');
            return;
        }

        const distFolderPath = path.join(outDirPath, 'dist');

        if (!fs.existsSync(distFolderPath)) {
            console.error("ERROR: 'dist' folder not found. Did the build fail?");
            return;
        }

        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true }) as string[];

        console.log('Starting upload to MinIO...');

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);

            // Skip directories
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log(`Uploading ${file}...`);
            const s3Key = `__outputs/${PROJECT_ID}/${file.replace(/\\/g, '/')}`;

            const contentType = lookup(filePath) || 'application/octet-stream';

            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: fs.createReadStream(filePath),
                ContentType: contentType,
            });

            try {
                await s3Client.send(command);
                console.log(`Uploaded: ${file}`);
            } catch (err: any) {
                console.error(`Failed to upload ${file}:`, err.message);
            }
        }

        console.log('All files uploaded successfully.');
        process.exit(0);
    });
}

init();
