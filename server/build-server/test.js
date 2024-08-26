const mime = require('mime-types');
const B2 = require('backblaze-b2');
const fs = require('fs');

const b2 = new B2({
    applicationKeyId: '005321031cac7100000000002',
    applicationKey: 'K005O4xFnJtBPCoxVWScN9bLy7P7PxY',
});

const getBucket = async (bucketName) => {
    await b2.authorize();

    try {
        const bucket = await b2.getBucket({ bucketName: bucketName });

        if (bucket && bucket.data.buckets.length > 0) {
            const bucketId = bucket.data.buckets[0].bucketId;
            console.log(`Bucket '${bucketName}' found.`);
            return bucketId;
        }

        else {
            console.log(`Bucket '${bucketName}' not found. Creating...`);
            const { data } = await b2.createBucket({ bucketName, bucketType: 'allPrivate' });
            return data.bucketId;
        }
    } catch (error) {
        console.log(error);
    }
}

async function uploadToBucket(bucketName, filePath) {
    const id = await getBucket(bucketName);
    const { data } = await b2.getUploadUrl({
        bucketId: id,
    });

    const fileData = await fs.promises.readFile(filePath);

    const uploadResponse = await b2.uploadFile({
        uploadUrl: data.uploadUrl,
        uploadAuthToken: data.authorizationToken,
        fileName: filePath.split('/').pop(),
        data: fileData,
    });

    console.log(`File uploaded successfully: ${uploadResponse.data.fileName}`);
}

const bucketName = 'ob8vc3rq';
const filePath = 'E:\\VsCode\\Web_Development\\Web_Ideas\\CodeCast\\server\\build-server\\test.js';

uploadToBucket(bucketName, filePath)
    .then(() => console.log('Process completed!'))
    .catch((error) => console.error('Error:', error.response.data));
