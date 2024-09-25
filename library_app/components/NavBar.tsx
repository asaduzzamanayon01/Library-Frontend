"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import axios from "axios"; // Import axios to handle HTTP requests

const NavBar = () => {
    const { isLoggedIn } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]); // Store search results
    const [showDropdown, setShowDropdown] = useState(false); // Control dropdown visibility
    // Function to handle result click
    const handleResultClick = () => {
        setSearchTerm(""); // Clear the search input field
        hideDropdown(); // Hide the dropdown
    };
    // Function to handle search input changes
    const handleSearchChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const searchQuery = e.target.value;
        setSearchTerm(searchQuery);

        if (searchQuery.trim() === "") {
            setSearchResults([]); // Clear results if input is empty
            setShowDropdown(false);
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8000/api/books?search=${searchQuery}`
            );
            setSearchResults(response.data.books);
            setShowDropdown(true); // Show dropdown if results are available
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    // Function to hide the dropdown
    const hideDropdown = () => setShowDropdown(false);

    return (
        <div>
            <div className="navbar p-10 bg-slate-300 rounded-b-lg">
                <div className="flex-1">
                    <Link
                        href="/"
                        className="btn btn-ghost font-extrabold text-5xl"
                    >
                        Open Library
                    </Link>
                </div>
                {isLoggedIn && (
                    <div className="flex-1 underline">
                        <Link
                            href="/dashboard"
                            className="btn btn-ghost font-normal text-base ml-5"
                        >
                            My Dashboard
                        </Link>
                    </div>
                )}
                <div className="flex-none gap-2 relative">
                    <div className="form-control w-80">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange} // Trigger search on input change
                                placeholder="Search"
                                className="input input-bordered w-full pr-16"
                            />
                            <button className="btn btn-ghost absolute top-0 right-0 rounded-l-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>

                            {/* Search results dropdown */}
                            {showDropdown && searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    {searchResults.map((book) => (
                                        <Link
                                            href={`/details/${book.book_id}`}
                                            key={book.book_id}
                                            onClick={handleResultClick} // Hide dropdown when a result is clicked
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                        >
                                            {book.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <LogoutButton />
                    ) : (
                        <>
                            <Link
                                href="/registration"
                                className="btn bg-blue-500 text-white"
                            >
                                Sign Up
                            </Link>
                            <Link
                                href="/login"
                                className="btn bg-green-500 text-white"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
