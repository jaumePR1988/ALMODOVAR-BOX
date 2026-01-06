import { db } from '../firebase';
import { collection, doc, runTransaction, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export interface BookingResult {
    success: boolean;
    error?: string;
    type?: 'booking' | 'waitlist';
}

export const bookingService = {
    /**
     * Book a class for a user with transaction to handle concurrency and limits.
     */
    bookClass: async (userId: string, classData: any): Promise<BookingResult> => {
        try {
            return await runTransaction(db, async (transaction) => {
                // 1. References
                const classRef = doc(db, 'classes', classData.id);
                // We store bookings in a top-level collection for easier querying, or subcollection?
                // Using top-level 'bookings' collection is often better for indexes.
                const bookingId = `${classData.id}_${userId}`;
                const bookingRef = doc(db, 'bookings', bookingId);
                const userRef = doc(db, 'users', userId);

                // 2. Reads (Must come before Writes in Firestore Transactions)
                const classDoc = await transaction.get(classRef);
                const bookingDoc = await transaction.get(bookingRef);
                const userDoc = await transaction.get(userRef);

                if (!classDoc.exists()) {
                    throw "La clase ya no existe.";
                }

                if (bookingDoc.exists() && bookingDoc.data().status === 'active') {
                    throw "Ya estás apuntado a esta clase.";
                }

                if (!userDoc.exists()) {
                    throw "Usuario no encontrado.";
                }

                const currentClassData = classDoc.data();
                const enrolled = currentClassData.enrolled || 0;
                const capacity = currentClassData.capacity || 0;
                const isFull = enrolled >= capacity;

                // 3. User Limits Check (This would ideally be a separate aggregation query or counter on user doc)
                // For now, we trust the client-side check or simple implementation. 
                // To be robust, we should query active bookings count here, but queries inside transactions strictly need
                // to be careful. Let's rely on optimisic checks for weekly limits for now or a counter on user profile.
                // Assuming simple capacity check first.

                // 4. Writes
                if (isFull) {
                    // Waitlist Logic (if implemented)
                    // For now, we might just reject or add to waitlist
                    // transaction.set(waitlistRef, ...)
                    return { success: false, error: "Clase completa.", type: 'waitlist' };
                }

                // Create Booking
                transaction.set(bookingRef, {
                    classId: classData.id,
                    userId: userId,
                    classDate: classData.date, // Store for query convenience
                    classTime: classData.time,
                    status: 'active',
                    createdAt: serverTimestamp(),
                    userDisplayName: userDoc.data().displayName || 'Usuario', // Denormalize for list
                    userPhotoURL: userDoc.data().photoURL || null
                });

                // Update Class Count
                transaction.update(classRef, {
                    enrolled: enrolled + 1
                });

                return { success: true, type: 'booking' };
            });
        } catch (e: any) {
            console.error("Booking Transaction Failed:", e);
            return { success: false, error: typeof e === 'string' ? e : "Error al reservar." };
        }
    },

    /**
     * Cancel a booking.
     */
    cancelBooking: async (userId: string, classId: string): Promise<BookingResult> => {
        try {
            return await runTransaction(db, async (transaction) => {
                const bookingId = `${classId}_${userId}`;
                const bookingRef = doc(db, 'bookings', bookingId);
                const classRef = doc(db, 'classes', classId);

                const bookingDoc = await transaction.get(bookingRef);
                const classDoc = await transaction.get(classRef);

                if (!bookingDoc.exists()) {
                    throw "No tienes reserva para esta clase.";
                }

                // Delete booking (or set to cancelled)
                transaction.delete(bookingRef);

                if (classDoc.exists()) {
                    const currentEnrolled = classDoc.data().enrolled || 0;
                    transaction.update(classRef, {
                        enrolled: Math.max(0, currentEnrolled - 1)
                    });
                }

                return { success: true };
            });
        } catch (e: any) {
            console.error("Cancellation Failed:", e);
            return { success: false, error: typeof e === 'string' ? e : "Error al cancelar." };
        }
    },

    /**
     * Get user's active bookings.
     */
    getUserBookings: async (userId: string) => {
        const q = query(
            collection(db, 'bookings'),
            where('userId', '==', userId),
            where('status', '==', 'active'),
            // orderBy('createdAt', 'desc') // Requires composite index if mixing equality and range
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => d.data());
    }
};
