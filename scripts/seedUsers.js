
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import 'dotenv/config';

// Config from environment (or hardcoded if running outside vite context easily)
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: 'almodovar-box-2026', // Explicitly setting based on user input to be sure
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockUsers = [
    { name: 'Juan Pérez', group: 'morning', email: 'juan@test.com', role: 'cliente', photoURL: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Maria Gomez', group: 'morning', email: 'maria@test.com', role: 'cliente', photoURL: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Carlos Ruiz', group: 'afternoon', email: 'carlos@test.com', role: 'cliente', photoURL: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Laura Dias', group: 'morning', email: 'laura@test.com', role: 'cliente', photoURL: 'https://i.pravatar.cc/150?u=4' },
    { name: 'Pedro Silva', group: 'morning', email: 'pedro@test.com', role: 'cliente', photoURL: 'https://i.pravatar.cc/150?u=5' }
];

async function seed() {
    console.log('Checking for existing users...');
    const colRef = collection(db, 'users');
    const snapshot = await getDocs(colRef);

    if (snapshot.size > 0) {
        console.log(`Found ${snapshot.size} users. Skipping seed.`);
        return;
    }

    console.log('Seeding users...');
    for (const user of mockUsers) {
        await addDoc(colRef, user);
        console.log(`Added ${user.name}`);
    }
    console.log('Done!');
    process.exit(0);
}

seed().catch(console.error);
