import React from "react";
import { useRouter } from "next/navigation"; // For navigation
import { useAuth } from "../context/AuthContext"; // Import AuthContext to handle logout
import toast from "react-hot-toast";

const LogoutButton = () => {
    const router = useRouter();
    const { logout } = useAuth(); // Access the logout function from AuthContext

    const handleLogout = async () => {
        try {
            // Call the backend to log out the user
            const response = await fetch("http://localhost:8000/api/logout", {
                method: "GET", // Assuming it's a POST request, change to GET if necessary
                credentials: "include", // To include cookies in the request if needed
            });

            if (response.ok) {
                // Clear the login state using the context's logout function
                logout();
                toast.success("You've been logged out", {
                    position: "top-right",
                });
                // Redirect the user to the login page
                router.push("/login");
            } else {
                console.error("Logout failed");
                toast.error("Logout failed", {
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;
