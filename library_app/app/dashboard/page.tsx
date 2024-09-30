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
