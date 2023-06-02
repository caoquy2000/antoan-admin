import { storage } from "./firebase";


export const uploadFile = async (file, folder) => {
    try {
        let imgLink;
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`${folder}/${Date.now().toString() + file.name}`);
        let metaData = {
            contentType: 'image/jpeg',
        };
        let uploadTask = storage.ref(`${folder}/${file.name}`).put(file, metaData);
        const uploadTaskSnapshot = await fileRef.put(file, metaData);
        const downloadUrl = await uploadTaskSnapshot.ref.getDownloadURL();
        imgLink = downloadUrl;
        return imgLink;
    } catch (error) {
        console.log('Error at UploadFile to Firebase: ', error);
    }
};

export const uploadBase64 = async (folder, base64) => {
    try {
        let imgLink;
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`${folder}/${Date.now().toString()}`);
        let metaData = {
            contentType: 'image/jpeg',
        };
        const uploadTaskSnapshot = await fileRef.putString(base64, "base64", metaData);
        const downloadUrl = await uploadTaskSnapshot.ref.getDownloadURL();
        imgLink = downloadUrl;
        return imgLink;
    } catch (error) {
        console.log('Error at upload base 64 to Firebase:  ', error);
    }
};