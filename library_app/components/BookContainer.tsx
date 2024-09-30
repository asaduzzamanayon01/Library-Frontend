"use client";
import React, { useEffect, useState } from "react";
import Book from "@/components/Book";
import RightIcon from "@/components/RightIcon";
import LeftIcon from "@/components/LeftIcon";
import type { TBook } from "@/types";
import { fetchBooks } from "@/utils/requests";
import LoadingSpinner from "@/components/LoadingSpinner";

interface HomePageProps {
    genre_id: number;
    genre: string;
}

const BookContainer: React.FC<HomePageProps> = ({ genre, genre_id }) => {
    const [books, setBooks] = useState<TBook[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [moreBooksAvailable, setMoreBooksAvailable] = useState(true);
    const [visibleBooks, setVisibleBooks] = useState<TBook[]>([]);

    const fetchNextBooks = async (reset: boolean = false) => {
        setLoading(true);

        try {
            const { books: newBooks, hasMoreBooks: moreBooks } =
                await fetchBooks(reset ? 1 : page, genre_id);

            if (newBooks.length > 0) {
                setBooks(
                    reset
                        ? newBooks
                        : (prevBooks) => [...prevBooks, ...newBooks]
                );
                setPage(reset ? 2 : (prevPage) => prevPage + 1);
                setMoreBooksAvailable(moreBooks);
            } else {
                setMoreBooksAvailable(false);
            }
        } catch (error) {
            console.error(
                `Failed to fetch books for genre ${genre_id}:`,
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNextBooks();
    }, []); // fetch books when the component mounts

    useEffect(() => {
        setVisibleBooks(
            () => books.slice(currentIndex, currentIndex + 5) || []
        );
    }, [currentIndex, books]);

    const handleNext = async () => {
        if (currentIndex + 5 >= books.length && moreBooksAvailable) {
            await fetchNextBooks();
        }
        setCurrentIndex((prevIndex) => prevIndex + 5);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 5);
        }
    };

    return (
        <div>
            <div className="m-4">
                <h1 className="text-3xl my-20 ml-4 font-bold">{genre}</h1>
                <div className="flex gap-5 justify-center items-center my-24 h-64">
                    {!loading && (
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                        >
                            <LeftIcon className="w-10 h-10" />
                        </button>
                    )}
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        visibleBooks.map((book, index) => (
                            <Book key={book.book_id || index} book={book} />
                        ))
                    )}
                    {!loading && (
                        <button
                            onClick={handleNext}
                            disabled={loading || !moreBooksAvailable}
                        >
                            <RightIcon className="w-10 h-10" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookContainer;
