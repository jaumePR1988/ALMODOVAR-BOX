import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface ClassData {
    name: string;
    group: 'box' | 'fit';
    date: string;
    startTime: string;
    endTime: string;
    coachId: string;
    capacity: number;
    description: string;
    isRecurring: boolean;
    recurringDays: string[];
    repeatAllYear: boolean;
    imageFile?: File;
    status: 'active' | 'cancelled';
}

const uploadCoverImage = async (file: File): Promise<string> => {
    try {
        // Create a unique path: class-covers/timestamp_filename
        const path = `class-covers/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, path);

        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

const createClass = async (data: ClassData) => {
    try {
        let imageUrl = '';

        // 1. Upload Image if exists
        if (data.imageFile) {
            imageUrl = await uploadCoverImage(data.imageFile);
        }

        // 2. Prepare Firestore Data
        const classDoc = {
            name: data.name,
            group: data.group,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            coachId: data.coachId,
            capacity: data.capacity,
            enrolled: 0,
            description: data.description,
            imageUrl: imageUrl,
            isRecurring: data.isRecurring,
            recurringDays: data.recurringDays,
            repeatAllYear: data.repeatAllYear,
            status: 'active',
            createdAt: serverTimestamp(),
        };

        // 3. Save to Firestore
        const docRef = await addDoc(collection(db, 'classes'), classDoc);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating class:", error);
        return { success: false, error: error };
    }
};

export const classService = {
    uploadCoverImage,
    createClass
};
