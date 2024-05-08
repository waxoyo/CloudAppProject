import './firebase-config';
import { getFirestore, addDoc, setDoc, doc, collection, Timestamp, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

export const createOrUpdate = async (object, col1, id) => {
    if (!id){
        const snap = await addDoc(collection(db, col1),object);
        return(snap);
    }
    await setDoc(doc(db, col1, id), object);
}

export const deleteDocument = async (col, id) => {
    await deleteDoc(doc(db, col, id));
}

export function dbTimestamp(date) {
    const retVal = new Timestamp(date.seconds, date.nanoseconds);
    return (retVal);
}