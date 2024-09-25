// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import AddedBooks from "@/components/AddedBooks";
// import { useAuth } from "@/context/AuthContext";
// import { FetchedData } from "@/types";
// import LikedBooks from "@/components/LikedBooks";

// const Page = () => {
//     const { isLoggedIn } = useAuth();
//     const [userData, setUserData] = useState<FetchedData | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         if (isLoggedIn) {
//             // Fetch user data here
//             fetch("http://localhost:8000/api/users", {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 credentials: "include", // Include cookies if needed
//             })
//                 .then((response) => response.json())
//                 .then((data) => {
//                     setUserData(data);
//                     setIsLoading(false);
//                 });
//         }
//     }, [isLoggedIn]);

//     if (!isLoggedIn) {
//         return (
//             <div className="px-14 py-4 space-y-16">
//                 <div className="text-xl">
//                     You need to be logged in to view this page.
//                 </div>
//                 <Link href="/login">
//                     <div className="w-36 text-center mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                         Go to Login
//                     </div>
//                 </Link>
//             </div>
//         );
//     }

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="px-14 py-4 space-y-16">
//             <div className="text-xl">Welcome, {userData?.username}</div>
//             <div className="text-xl">Want to add a new book?</div>
//             <Link href="/add">
//                 <div className="w-36 text-center mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                     Add Books
//                 </div>
//             </Link>
//             <div className="text-xl">Your Added books</div>
//             <AddedBooks userInfo={userData?.added_books} />
//             <div className="text-xl">Your liked books</div>
//             <LikedBooks
//                 liked_books={userData?.liked_books}
//                 userId={userData?.user_id}
//             />
//         </div>
//     );
// };

// export default Page;

"use client";
import React from "react";
import Link from "next/link";
import AddedBooks from "@/components/AddedBooks";
import { useAuth } from "@/context/AuthContext";
import LikedBooks from "@/components/LikedBooks";

const Page = () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return (
            <div className="px-14 py-4 space-y-16">
                <div className="text-xl">
                    You need to be logged in to view this page.
                </div>
                <Link href="/login">
                    <div className="w-36 text-center mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Go to Login
                    </div>
                </Link>
            </div>
        );
    }

    return (
        <div className="px-14 py-4 space-y-16">
            <div className="text-xl">Hello</div>
            <div className="text-xl">Want to add a new book?</div>
            <Link href="/add">
                <div className="w-36 text-center mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Books
                </div>
            </Link>
            <div className="text-xl">Your Added Books</div>
            <AddedBooks />

            <div className="text-xl">Your Liked Books</div>
            <LikedBooks />
        </div>
    );
};

export default Page;
