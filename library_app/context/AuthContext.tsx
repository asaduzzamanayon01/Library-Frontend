"use client";
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // Load the login state from localStorage when the component mounts
    useEffect(() => {
        const storedLoginState = localStorage.getItem("isLoggedIn");
        if (storedLoginState === "true") {
            setIsLoggedIn(true);
        }
    }, []);

    // Function to log in and store the state in localStorage
    const login = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true"); // Persist login state
    };

    // Function to log out and remove the state from localStorage
    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn"); // Remove login state
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the Auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
