import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export type UserRole = 'cliente' | 'coach' | 'admin' | null;

interface AuthContextType {
    user: User | null;
    userData: any | null;
    role: UserRole;
    isApproved: boolean;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    role: null,
    isApproved: false,
    loading: true,
    logout: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [isApproved, setIsApproved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeDoc: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Important: Set loading to true immediately to prevent premature routing
                // while we fetch the user's data from Firestore.
                setLoading(true);
                setUser(firebaseUser);

                // Escuchar cambios en el documento del usuario en tiempo real
                unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (userDoc) => {
                    const email = firebaseUser.email || '';

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(data);

                        // Bypass de desarrollo para visualización rápida
                        if (email === 'admin@almodovarbox.com') {
                            setRole('admin');
                            setIsApproved(true);
                        } else if (email === 'coach@almodovarbox.com') {
                            setRole('coach');
                            setIsApproved(true);
                        } else if (email === 'usuario@almodovarbox.com') {
                            setRole('cliente');
                            setIsApproved(true);
                        } else {
                            setRole(data.role as UserRole);
                            setIsApproved(data.approved === true);
                        }
                    } else {
                        // Usuario recién creado o sin documento
                        if (email === 'admin@almodovarbox.com') {
                            setRole('admin');
                            setIsApproved(true);
                        } else if (email === 'coach@almodovarbox.com') {
                            setRole('coach');
                            setIsApproved(true);
                        } else if (email === 'usuario@almodovarbox.com') {
                            setRole('cliente');
                            setIsApproved(true);
                        } else {
                            // Default for new users
                            setRole('cliente');
                            setIsApproved(false);
                        }
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user doc:", error);
                    setRole('cliente');
                    setIsApproved(false);
                    setLoading(false);
                });
            } else {
                setUser(null);
                setRole(null);
                setIsApproved(false);
                setUserData(null);
                setLoading(false);
                if (unsubscribeDoc) unsubscribeDoc();
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    const logout = async () => {
        await auth.signOut();
        setUser(null);
        setUserData(null);
        setRole(null);
        setIsApproved(false);
    };

    return (
        <AuthContext.Provider value={{ user, userData, role, isApproved, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
