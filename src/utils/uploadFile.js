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