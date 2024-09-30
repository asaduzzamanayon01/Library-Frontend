"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

type Book = {
    title: string;
    book_id: number;
    author: string;
    language: string;
    cover_img: string;
};

const LikedBooks = () => {
    const [likedBooks, setLikedBooks] = useState<Book[]>([]);
    const [offset, setOffset] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreBooks, setHasMoreBooks] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchLikedBooks = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8000/api/users?limit=6&offset=0`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );
                const data = await response.json();
                setLikedBooks(data.liked_books);
                setHasMoreBooks(data.liked_books.length === 6);
            } catch (error) {
                console.error("Error fetching liked books:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLikedBooks();
    }, []);

    const loadMoreBooks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/users?limit=6&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();

            setLikedBooks((prevBooks) => [...prevBooks, ...data.liked_books]);
            setOffset((prevOffset) => prevOffset + 6);
            setHasMoreBooks(data.liked_books.length === 6);
        } catch (error) {
            console.error("Error loading more liked books:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {likedBooks?.length === 0 ? (
                <p>no books</p>
            ) : (
                <ul className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {likedBooks?.map((book, index) => (
                            <li key={index} className="flex space-x-4">
                                <div
                                    onClick={() =>
                                        router.push(`/details/${book.book_id}`)
                                    }
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={
                                            book.cover_img &&
                                            book.cover_img.startsWith("http")
                                                ? book.cover_img
                                                : `http://localhost:8000/${book.cover_img}`
                                        }
                                        alt={book.title}
                                        className="w-16 h-24 object-cover"
                                    />
                                </div>

                                <div>
                                    <h3
                                        className="text-lg font-bold"
                                        onClick={() =>
                                            router.push(
                                                `/details/${book.book_id}`
                                            )
                                        }
                                    >
                                        {book.title}
                                    </h3>
                                    <p className="text-sm">
                                        Author: {book.author}
                                    </p>
                                    <p className="text-sm">
                                        Language: {book.language}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </div>
                </ul>
            )}

            {hasMoreBooks && !isLoading && (
                <button
                    className="w-36 text-center mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={loadMoreBooks}
                >
                    Load More
                </button>
            )}

            {isLoading && <LoadingSpinner />}
        </div>
    );
};

export default LikedBooks;
