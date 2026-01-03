import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { ClassRating } from '../types/rating';

export const saveClassRating = async (ratingData: Omit<ClassRating, 'id' | 'createdAt'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, 'ratings'), {
            ...ratingData,
            createdAt: Date.now()
        });
        console.log("Rating saved successfully with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding rating: ", e);
        throw e;
    }
};
