const { exec } = require('child_process');
const B2 = require('backblaze-b2');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const b2 = new B2({
    applicationKeyId: '005321031cac7100000000002',
    applicationKey: 'K005O4xFnJtBPCoxVWScN9bLy7P7PxY',
});

const Project_ID = process.env.PROJECT_ID;
const bucketName = 'codeCast-outputs';

async function init() {
    console.log("executing index.js...");

    const outDirPath = path.join(__dirname, "output");

    const Process = exec(`cd ${outDirPath} && npm install && npm run build`);

    // consoling logs
    Process.stdout.on('data', (data) => {
        console.log(data.toString());
    })

    Process.stderr.on('error', (data) => {
        console.log("Error", data.toString());
    })

    Process.on('close', async () => {
        console.log('Build complete');
        const distFolderPath = path.join(__dirname, "output", "dist");
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        // now we will read the file and upload it to B2
        await b2.authorize();
        const bucket = await b2.getBucket({ bucketName: bucketName });
        const bucketId = bucket.data.buckets[0].bucketId;
        const { data: uploadData } = await b2.getUploadUrl({
            bucketId: bucketId,
        });

        for (const filePath of distFolderContents) {
            if (fs.lstatSync(filePath).isDirectory()) continue;

            // const fileData = await fs.promises.readFile(filePath);
            const fileName = `__outputs/${Project_ID}/${filePath.split('/').pop()}`;

            // by this our objects will start uploading to our B2 container
            console.log(`Uploading ${filePath}...`);
            await b2.uploadFile({
                uploadUrl: uploadData.uploadUrl,
                uploadAuthToken: uploadData.authorizationToken,
                fileName,
                data: fs.createReadStream(filePath),
                contentType: mime.lookup(filePath),
            });

            console.log(`Uploaded: ${filePath}`);
        }
        console.log("Done...");
    })
}