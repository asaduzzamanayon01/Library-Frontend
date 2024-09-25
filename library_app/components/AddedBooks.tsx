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

const AddedBooks = () => {
    const [addedBooks, setAddedBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAddedBooks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/users",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                const data = await response.json();
                setAddedBooks(data.added_books);
            } catch (error) {
                console.error("Error fetching added books:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddedBooks();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            {addedBooks.length === 0 ? (
                <p>You haven't added any books yet.</p>
            ) : (
                <ul className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {addedBooks.map((book, index) => (
                            <li key={index} className="flex space-x-4">
                                <div
                                    onClick={() =>
                                        router.push(`/details/${book.book_id}`)
                                    }
                                    className="cursor-pointer"
                                >
                                    <img
                                        src={
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
        </div>
    );
};

export default AddedBooks;
