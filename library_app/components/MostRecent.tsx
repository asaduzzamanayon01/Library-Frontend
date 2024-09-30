"use client";
import React, { useState, useEffect } from "react";
import LeftIcon from "./LeftIcon";
import RightIcon from "./RightIcon";
import Book from "./Book";
import type { TypeResponse } from "@/types";
import LoadingSpinner from "./LoadingSpinner";

const MostRecentBooks = () => {
    const [booksData, setBooksData] = useState<TypeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchBooks = async (offset: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/mostRecent?offset=${offset}`
            );
            const data: TypeResponse = await response.json();
            setBooksData(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(currentIndex);
    }, [currentIndex]);

    const handleNext = () => {
        if (booksData && booksData.hasMoreBooks) {
            setCurrentIndex((prevIndex) => prevIndex + 5);
        }
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 5));
    };

    const visibleBooks =
        booksData?.books.slice(currentIndex % 5, (currentIndex % 5) + 5) || [];

    return (
        <div>
            <div className="m-4 ">
                <h1 className="text-3xl mb-6 ml-4 font-bold">
                    Most Recent Books
                </h1>

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
                            disabled={
                                loading ||
                                (booksData ? !booksData.hasMoreBooks : true)
                            }
                        >
                            <RightIcon className="w-10 h-10" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MostRecentBooks;

// "use client";
// import React, { useState, useEffect } from "react";
// import LeftIcon from "./LeftIcon";
// import RightIcon from "./RightIcon";
// import Book from "./Book";
// import type { TypeResponse } from "@/types";
// import LoadingSpinner from "./LoadingSpinner";

// interface BookListProps {
//     refetchTrigger: number;
// }

// const MostRecentBooks: React.FC<BookListProps> = ({ refetchTrigger }) => {
//     const [booksData, setBooksData] = useState<TypeResponse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const fetchBooks = async (offset: number) => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 `http://localhost:8000/api/mostRecent?offset=${offset}`
//             );
//             const data: TypeResponse = await response.json();
//             setBooksData(data);
//         } catch (error) {
//             console.error("Error fetching books:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBooks(currentIndex);
//     }, [currentIndex, refetchTrigger]); // Add refetchTrigger to dependencies

//     const handleNext = () => {
//         if (booksData && booksData.hasMoreBooks) {
//             setCurrentIndex((prevIndex) => prevIndex + 5);
//         }
//     };

//     const handlePrev = () => {
//         setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 5));
//     };

//     const visibleBooks =
//         booksData?.books.slice(currentIndex % 5, (currentIndex % 5) + 5) || [];

//     return (
//         <div>
//             <div className="m-4 ">
//                 <h1 className="text-3xl mb-6 ml-4 font-bold">
//                     Most Recent Books
//                 </h1>

//                 <div className="flex gap-5 justify-center items-center my-24 h-64">
//                     {!loading && (
//                         <button
//                             onClick={handlePrev}
//                             disabled={currentIndex === 0}
//                         >
//                             <LeftIcon className="w-10 h-10" />
//                         </button>
//                     )}

//                     {loading ? (
//                         <LoadingSpinner />
//                     ) : (
//                         visibleBooks.map((book, index) => (
//                             <Book key={book.book_id || index} book={book} />
//                         ))
//                     )}

//                     {!loading && (
//                         <button
//                             onClick={handleNext}
//                             disabled={
//                                 loading ||
//                                 (booksData ? !booksData.hasMoreBooks : true)
//                             }
//                         >
//                             <RightIcon className="w-10 h-10" />
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MostRecentBooks;
