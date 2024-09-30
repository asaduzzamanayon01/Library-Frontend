"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import axios from "axios";
import { debounce } from "lodash";

const NavBar = () => {
    const { isLoggedIn } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (query.trim() === "") {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8000/api/books?search=${query}`
                );
                setSearchResults(response.data.books);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;
        setSearchTerm(searchQuery);
        debouncedSearch(searchQuery);
    };

    const handleResultClick = () => {
        setSearchTerm("");
        hideDropdown();
    };

    const hideDropdown = () => setShowDropdown(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                hideDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className="navbar p-10 bg-slate-300 rounded-b-lg">
                <div className="flex-1">
                    <Link
                        href="/"
                        className="btn btn-ghost font-extrabold text-5xl"
                    >
                        OLibrary
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
                        <div className="relative" ref={dropdownRef}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
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

                            {showDropdown && searchResults.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                                    {searchResults.map((book) => (
                                        <Link
                                            href={`/details/${book.book_id}`}
                                            key={book.book_id}
                                            onClick={handleResultClick}
                                            className="flex items-center px-4 py-2 hover:bg-gray-100"
                                        >
                                            <div className="flex-shrink-0 w-12 h-16 mr-4">
                                                <img
                                                    src={
                                                        book.cover_img &&
                                                        book.cover_img.startsWith(
                                                            "http"
                                                        )
                                                            ? book.cover_img
                                                            : `http://localhost:8000/${book.cover_img}`
                                                    }
                                                    alt={book.title}
                                                    className="object-cover rounded-xl w-12 h-16"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {book.title}
                                                </p>
                                            </div>
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
