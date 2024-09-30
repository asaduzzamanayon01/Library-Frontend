"use client";
import React from "react";
import type { TBook } from "@/types";
import Link from "next/link";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { useState, useEffect } from "react";

const Book: React.FC<{ book: TBook }> = ({ book }) => {
    const [booksData, setBooksData] = useState<TBook | null>(null);
    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/details/${book.book_id}`,
                    {
                        cache: "no-cache",
                    }
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch book details");
                }
                const data = await res.json();
                const likesData = data.likes;
                const dislikesData = data.dislikes;
                setLikes(likesData);
                setDislikes(dislikesData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBookDetails();
    }, []);
    return (
        <div className="h-96 w-72 flex flex-col justify-between border border-transparent p-2 rounded-xl via-pink-500 to-red-500 shadow-lg">
            <Link href={`/details/${book.book_id}`}>
                {book.cover_img ? (
                    <img
                        className="rounded-xl h-64 w-72"
                        src={
                            book.cover_img.startsWith("http")
                                ? book.cover_img
                                : `http://localhost:8000/${book.cover_img}`
                        }
                        alt={book.title}
                    />
                ) : (
                    <img
                        className="rounded-xl h-80 w-72"
                        src="https://via.placeholder.com/150"
                        alt={book.title}
                    />
                )}
            </Link>
            <div className="flex flex-col gap-3">
                <div className="text-sm ">{book.title}</div>
                <div className="flex gap-4">
                    <div className="flex justify-center items-center">
                        <div className="">{dislikes}</div>
                        <AiOutlineDislike className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="">{likes}</div>
                        <AiOutlineLike className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;
