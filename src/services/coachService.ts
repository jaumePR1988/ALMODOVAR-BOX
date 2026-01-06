import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Coach {
    id?: string;
    firstName: string;
    lastName: string;
    specialty: string;
    // We allow multi-group selection (e.g. ['box', 'fit']) but UI might restrict to one
    groups: ('box' | 'fit')[];
    photoURL?: string;
    bio?: string;
    instagram?: string;
    active: boolean;
    createdAt?: any;
}

const COLLECTION_NAME = 'coaches';

/**
 * Upload a coach's photo to Storage
 */
const uploadCoachPhoto = async (file: File): Promise<string> => {
    try {
        const path = `coach-photos/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("Error uploading coach photo:", error);
        throw error;
    }
};

/**
 * Get all coaches
 */
const getCoaches = async (): Promise<Coach[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('firstName', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Coach));
    } catch (error) {
        console.error("Error fetching coaches:", error);
        throw error;
    }
};

/**
 * Add a new coach
 */
const addCoach = async (coachData: Omit<Coach, 'id'>, photoFile?: File) => {
    try {
        let photoURL = '';
        if (photoFile) {
            photoURL = await uploadCoachPhoto(photoFile);
        }

        const newCoach = {
            ...coachData,
            photoURL: photoURL || coachData.photoURL || '',
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), newCoach);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding coach:", error);
        throw error;
    }
};

/**
 * Update an existing coach
 */
const updateCoach = async (id: string, coachData: Partial<Coach>, photoFile?: File) => {
    try {
        let updateData = { ...coachData };

        if (photoFile) {
            const photoURL = await uploadCoachPhoto(photoFile);
            updateData.photoURL = photoURL;
        }

        const coachRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(coachRef, updateData);
        return { success: true };
    } catch (error) {
        console.error("Error updating coach:", error);
        throw error;
    }
};

/**
 * Delete a coach
 */
const deleteCoach = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return { success: true };
    } catch (error) {
        console.error("Error deleting coach:", error);
        throw error;
    }
};

export const coachService = {
    getCoaches,
    addCoach,
    updateCoach,
    deleteCoach,
    uploadCoachPhoto
};
