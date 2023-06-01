import { db } from "./firebase";


export const addDoc = async (collection: string, data: any) => {
    try {
        console.log('db  ', db);
        db.collection(collection).doc('test').set(data)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            })
    } catch (e) {
        console.error('Error add document -> ', e);
    }
}