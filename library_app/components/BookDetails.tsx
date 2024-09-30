"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import type { TBook } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

interface BookDetailsProps {
    bookId: number;
}

const BookDetails: React.FC<BookDetailsProps> = ({ bookId }) => {
    const { isLoggedIn } = useAuth();
    const [book, setBook] = useState<TBook | null>(null);
    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);
    const [liked, setLiked] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch book details and likes on component mount
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/details/${bookId}`,
                    {
                        cache: "no-cache",
                    }
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch book details");
                }
                const data = await res.json();
                //general
                // const bookData = data.books[0];

                //for elasticsearch
                const bookData = data.book;
                const likesData = data.likes;
                const dislikesData = data.dislikes;

                if (!bookData) {
                    setLoading(false);
                    throw new Error("Book not found");
                }
                setBook(bookData);
                setLikes(likesData);
                setDislikes(dislikesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    // Fetch whether the user has liked this book on mount
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/getLikes?book_id=${bookId}`,
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                setLiked(data.isLiked);
            } catch (error) {
                console.error("Error fetching like status:", error);
            }
        };

        fetchLikeStatus();
    }, [bookId]);
    //     try {
    //         const response = await fetch(
    //             "http://localhost:8000/api/interaction",
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 credentials: "include",
    //                 body: JSON.stringify({
    //                     book_id: bookId,
    //                     like: like,
    //                 }),
    //             }
    //         );

    //         if (response.ok) {
    //             setLiked(like);
    //         }
    //     } catch (error) {
    //         console.error("Error handling interaction:", error);
    //     }
    // };

    const handleInteraction = async (like: boolean) => {
        try {
            const payload = {
                book_id: book?.book_id,
                like: like,
            };

            // Log payload for debugging
            console.log("Sending payload:", payload);

            const response = await fetch(
                "http://localhost:8000/api/interaction",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                // Log the response for debugging
                const errorData = await response.json();
                console.error("Error response:", errorData);
                throw new Error(
                    `Failed to process interaction: ${response.statusText}`
                );
            }

            // If the request is successful, update the liked state
            setLiked(like);
        } catch (error) {
            console.error("Error handling interaction:", error);
        }
    };

    const handleLikeClick = () => {
        handleInteraction(true);
        if (isLoggedIn) {
            toast("You've liked this book!", {
                icon: "👏",
                position: "top-right",
            });
        } else {
            toast.error("You need to be logged in to like this book", {
                position: "top-right",
            });
        }
    };

    const handleDislikeClick = () => {
        handleInteraction(false);
        if (isLoggedIn) {
            toast("You've disliked this book!", {
                icon: "😥",
                position: "top-right",
            });
        } else {
            toast.error("You need to be logged in to dislike this book", {
                position: "top-right",
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!book) {
        return <p>Book not found</p>;
    }

    return (
        <div className="flex gap-10 p-14 h-[750px]">
            <div className="flex flex-col gap-4">
                <div className="w-96 h-full ">
                    {book.cover_img ? (
                        <img
                            className="w-full h-full rounded-lg"
                            src={
                                book.cover_img.startsWith("http")
                                    ? book.cover_img
                                    : `http://localhost:8000/${book.cover_img}`
                            }
                            alt={book.title}
                        />
                    ) : (
                        <img
                            className="w-full h-full rounded-lg"
                            src="https://via.placeholder.com/150"
                            alt="Placeholder"
                        />
                    )}
                </div>
                <div className="flex justify-around">
                    <AiOutlineDislike
                        className={`w-10 h-10 cursor-pointer ${
                            liked === false ? "text-red-500" : ""
                        }`}
                        onClick={handleDislikeClick}
                    />
                    <AiOutlineLike
                        className={`w-10 h-10 cursor-pointer ${
                            liked === true ? "text-green-500" : ""
                        }`}
                        onClick={handleLikeClick}
                    />
                </div>
            </div>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold pb-6">{book.title}</h1>
                <p className="pb-10">{book.description_text}</p>
                <p>Price: ${book.price}</p>
                <p>Publish Date: {formatDate(book.publish_date)}</p>
                <p>Publisher: {book.publisher}</p>

                <div className="text-xl">{likes} people liked this book</div>
                {/* <div className="text-xl">
                    {dislikes} people disliked this book
                </div> */}
            </div>
        </div>
    );
};

export default BookDetails;
