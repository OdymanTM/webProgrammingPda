import { Storage } from '@google-cloud/storage';

// Create a new instance of the Storage class
const storage = new Storage({
    projectId: 'dynamic-circle-422510-u6',
}
);

// Function to upload a file to the bucket
async function uploadFile(bucketName, filePath, destinationFileName) {
    try {
        const bucket = storage.bucket(bucketName);
        await bucket.upload(filePath, {
            destination: destinationFileName,
        });
        console.log('File uploaded successfully.');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

// Function to download a file from the bucket
async function downloadFile(bucketName, fileName, destinationFilePath) {
    try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);
        await file.download({ destination: destinationFilePath });
        console.log('File downloaded successfully.');
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

// Function to delete a file from the bucket
async function deleteFile(bucketName, fileName) {
    try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);
        await file.delete();
        console.log('File deleted successfully.');
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

async function listFiles(bucketName) {
    const [files] = await storage.bucket(bucketName).getFiles();
    console.log('Files:');
    files.forEach(file => {
      console.log(file.name);
    });
}

export { uploadFile, downloadFile, deleteFile, listFiles };