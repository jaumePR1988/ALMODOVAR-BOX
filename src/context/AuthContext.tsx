import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export type UserRole = 'cliente' | 'coach' | 'admin' | 'director' | null;

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
                setUser(firebaseUser);

                // 1. Optimistic Cache Load
                const cachedData = localStorage.getItem(`almodovar_user_data_${firebaseUser.uid}`);
                if (cachedData) {
                    try {
                        const parsed = JSON.parse(cachedData);
                        setUserData(parsed);
                        if (firebaseUser.email === 'admin@almodovarbox.com') {
                            setRole('admin');
                            setIsApproved(true);
                        } else if (firebaseUser.email === 'coach@almodovarbox.com') {
                            setRole('coach');
                            setIsApproved(true);
                        } else {
                            const cachedRole = parsed.role as UserRole;
                            setRole(cachedRole);

                            if (cachedRole === 'admin') {
                                setIsApproved(true);
                            } else {
                                setIsApproved(parsed.approved === true);
                            }
                        }
                        setLoading(false); // Unblock UI immediately
                    } catch (e) {
                        console.error("Error parsing cached user data", e);
                    }
                } else {
                    setLoading(true); // Only block if no cache exists
                }

                // 3. Real-time Listener (Background Update)
                unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (userDoc) => {
                    const email = firebaseUser.email || '';
                    if (userDoc.exists()) {
                        const data = userDoc.data();

                        // Update cache
                        localStorage.setItem(`almodovar_user_data_${firebaseUser.uid}`, JSON.stringify(data));
                        setUserData(data);

                        // SUPER ADMIN: Always Approved
                        if (email === 'admin@almodovarbox.com') {
                            setRole('admin');
                            setIsApproved(true);
                        } else {
                            // Standard Logic: Trust DB
                            const userRole = data.role as UserRole || 'cliente';
                            setRole(userRole);

                            // If DB says approved, you are approved. 
                            // If you are 'admin' in DB, you are approved (assuming manual promotion).
                            if (userRole === 'admin') {
                                setIsApproved(true);
                            } else {
                                setIsApproved(data.approved === true);
                            }
                        }
                    } else {
                        // ... (New user logic) - First time seen in Firestore
                        if (email === 'admin@almodovarbox.com') {
                            setRole('admin');
                            setIsApproved(true);
                        } else {
                            setRole('cliente');
                            setIsApproved(false); // STRICT: New users always pending
                        }
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user doc:", error);
                    // On error, we DO NOT unblock. User sees loading or error.
                    // Or we could set loading(false) but approved(false).
                    // Strict mode: let's show loading or kick to login? 
                    // Let's just stop loading but deny access.
                    setLoading(false);
                    setIsApproved(false);
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
        // Clear specific user data, or all app data? 
        // Safer to keep cache for next login unless explicitly clearing on debug.
        // But for security/privacy on shared devices, maybe clear.
        // Let's clear current user cache key if we had it in state, but 
        // user state is nullified instantly.
        // Accessing user.uid here might be racy if state updates fast.
        // A simple approach: keep cache. It's standard for mobile-like apps. 
        // If we strictly want to clear: 
        if (user) {
            localStorage.removeItem(`almodovar_user_data_${user.uid}`);
        }

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
