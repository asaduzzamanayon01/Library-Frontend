// import React from "react";
// import { fetchBooks } from "@/utils/requests";

// import type { BooksResponse } from "@/types";
// import BookContainer from "@/components/BookContainer";

// const Page = async () => {
//     const initialBooksResponse: BooksResponse = await fetchBooks(1, 0);
//     const initialBooksResponse2: BooksResponse = await fetchBooks(1, 11);
//     const initialBooksResponse3: BooksResponse = await fetchBooks(1, 20);
//     const initialBooksResponse4: BooksResponse = await fetchBooks(1, 30);
//     const initialBooksResponse5: BooksResponse = await fetchBooks(1, 40);
//     const genre = [{ id: 0 }, { id: 1 }, { id: 2 }];
//     return (
//         <>
//             <BookContainer
//                 key={initialBooksResponse.id}
//                 initialBooks={initialBooksResponse.books}
//                 hasMoreBooks={initialBooksResponse.hasMoreBooks}
//                 genre={initialBooksResponse.genre}
//                 genre_id={0}
//             />
//             <BookContainer
//                 key={initialBooksResponse2.id}
//                 initialBooks={initialBooksResponse2.books}
//                 hasMoreBooks={initialBooksResponse2.hasMoreBooks}
//                 genre={initialBooksResponse2.genre}
//                 genre_id={11}
//             />
//             <BookContainer
//                 key={initialBooksResponse3.id}
//                 initialBooks={initialBooksResponse3.books}
//                 hasMoreBooks={initialBooksResponse3.hasMoreBooks}
//                 genre={initialBooksResponse3.genre}
//                 genre_id={20}
//             />
//             <BookContainer
//                 key={initialBooksResponse4.id}
//                 initialBooks={initialBooksResponse4.books}
//                 hasMoreBooks={initialBooksResponse4.hasMoreBooks}
//                 genre={initialBooksResponse4.genre}
//                 genre_id={30}
//             />
//             <BookContainer
//                 key={initialBooksResponse5.id}
//                 initialBooks={initialBooksResponse5.books}
//                 hasMoreBooks={initialBooksResponse5.hasMoreBooks}
//                 genre={initialBooksResponse5.genre}
//                 genre_id={40}
//             />
//         </>
//     );
// };

// export default Page;

// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { fetchBooks } from "@/utils/requests";
// import BookContainer from "@/components/BookContainer";
// import { fetchGenres } from "@/utils/requests";
// import type { BooksResponse, GenreResponse } from "@/types";

// const Page = () => {
//     const [genres, setGenres] = useState<GenreResponse[]>([]);
//     const [genrePage, setGenrePage] = useState(1);
//     const [hasMoreGenres, setHasMoreGenres] = useState(true);
//     const [loadingGenres, setLoadingGenres] = useState(false);
//     const [booksData, setBooksData] = useState<BooksResponse[]>([]);

//     // Function to fetch genres with vertical pagination
//     const loadGenres = useCallback(async () => {
//         if (!hasMoreGenres || loadingGenres) return;

//         setLoadingGenres(true);
//         const limit = 2;
//         const offset = (genrePage - 1) * limit;

//         try {
//             // Fetch genres from the API
//             const { genres: newGenres, hasMoreGenres: moreGenres } =
//                 await fetchGenres(limit, offset);
//             setGenres((prevGenres) => [...prevGenres, ...newGenres]);
//             setHasMoreGenres(moreGenres);
//             setGenrePage((prevPage) => prevPage + 1);
//         } catch (error) {
//             console.error("Failed to fetch genres:", error);
//         } finally {
//             setLoadingGenres(false);
//         }
//     }, [genrePage, hasMoreGenres, loadingGenres]);

//     // Fetch books for each genre when genres are updated
//     useEffect(() => {
//         const fetchBooksForGenres = async () => {
//             const newBooksResponses: BooksResponse[] = [];

//             for (const genre of genres) {
//                 try {
//                     // Fetch books for the current genre
//                     const initialBooksResponse: BooksResponse =
//                         await fetchBooks(1, genre.genre_id);
//                     newBooksResponses.push(initialBooksResponse);
//                 } catch (error) {
//                     console.error(
//                         `Failed to fetch books for genre ${genre.genre_id}:`,
//                         error
//                     );
//                 }
//             }

//             setBooksData((prevBooksData) => [
//                 ...prevBooksData,
//                 ...newBooksResponses,
//             ]);
//         };

//         if (genres.length > 0) {
//             fetchBooksForGenres();
//         }
//     }, [genres]);

//     // Infinite scroll logic for genres
//     const observer = React.useRef<IntersectionObserver | null>(null);
//     const lastGenreElementRef = useCallback(
//         (node: HTMLElement | null) => {
//             if (loadingGenres) return;
//             if (observer.current) observer.current.disconnect();
//             observer.current = new IntersectionObserver((entries) => {
//                 if (entries[0].isIntersecting && hasMoreGenres) {
//                     loadGenres();
//                 }
//             });
//             if (node) observer.current.observe(node);
//         },
//         [loadingGenres, hasMoreGenres]
//     );

//     return (
//         <div>
//             {booksData.map((initialBooksResponse, index) => (
//                 <BookContainer
//                     key={initialBooksResponse.id}
//                     initialBooks={initialBooksResponse.books}
//                     hasMoreBooks={initialBooksResponse.hasMoreBooks}
//                     genre={initialBooksResponse.genre}
//                     genre_id={initialBooksResponse.genre_id}
//                 />
//             ))}
//             <div ref={lastGenreElementRef}>
//                 {loadingGenres && <p>Loading more genres...</p>}
//             </div>
//         </div>
//     );
// };

// export default Page;

// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { fetchBooks } from "@/utils/requests";
// import BookContainer from "@/components/BookContainer";
// import { fetchGenres } from "@/utils/requests";
// import type { BooksResponse, TGenre } from "@/types";

// const Page = () => {
//     const [genres, setGenres] = useState<TGenre[]>([]);
//     const [genrePage, setGenrePage] = useState(1); // Page state for genre pagination
//     const [hasMoreGenres, setHasMoreGenres] = useState(true); // Control if more genres are available
//     const [loadingGenres, setLoadingGenres] = useState(false); // Loading state for genres
//     const [booksData, setBooksData] = useState<BooksResponse[]>([]); // To store fetched books for each genre

//     // Function to load genres when "Load More Genres" button is clicked
//     const loadGenres = useCallback(async () => {
//         if (loadingGenres || !hasMoreGenres) return;

//         setLoadingGenres(true);
//         const limit = 5; // Number of genres to load each time
//         const offset = (genrePage - 1) * limit;

//         try {
//             // Fetch genres from the backend with pagination
//             const { genres: newGenres, hasMoreGenres: moreGenres } =
//                 await fetchGenres(limit, offset);
//             setGenres((prevGenres) => [...prevGenres, ...newGenres]); // Append new genres to the state
//             setHasMoreGenres(moreGenres); // Update if there are more genres to load
//             setGenrePage((prevPage) => prevPage + 1); // Increment page for next fetch
//         } catch (error) {
//             console.error("Failed to fetch genres:", error);
//         } finally {
//             setLoadingGenres(false);
//         }
//     }, [genrePage, hasMoreGenres, loadingGenres]);

//     // Fetch books for the newly loaded genres
//     useEffect(() => {
//         const fetchBooksForGenres = async () => {
//             const newBooksResponses: BooksResponse[] = [];

//             for (const genre of genres) {
//                 if (
//                     !booksData.some((data) => data.genreId === genre.genre_id)
//                 ) {
//                     // Fetch books only if they haven't been fetched already for this genre
//                     try {
//                         const initialBooksResponse: BooksResponse =
//                             await fetchBooks(1, genre.genre_id);
//                         newBooksResponses.push(initialBooksResponse);
//                     } catch (error) {
//                         console.error(
//                             `Failed to fetch books for genre ${genre.genre_id}:`,
//                             error
//                         );
//                     }
//                 }
//             }

//             if (newBooksResponses.length > 0) {
//                 setBooksData((prevBooksData) => [
//                     ...prevBooksData,
//                     ...newBooksResponses,
//                 ]); // Append new books responses
//             }
//         };

//         if (genres.length > 0) {
//             fetchBooksForGenres();
//         }
//     }, [genres, booksData]);

//     return (
//         <div>
//             {booksData.map((initialBooksResponse) => (
//                 <BookContainer
//                     key={initialBooksResponse.id}
//                     initialBooks={initialBooksResponse.books}
//                     hasMoreBooks={initialBooksResponse.hasMoreBooks}
//                     genre={initialBooksResponse.genre}
//                     genre_id={initialBooksResponse.genreId}
//                 />
//             ))}

//             {/* Load more genres button */}
//             {hasMoreGenres && (
//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button onClick={loadGenres} disabled={loadingGenres}>
//                         {loadingGenres ? "Loading..." : "Load More Genres"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Page;

// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { fetchBooks, fetchGenres } from "@/utils/requests";
// import BookContainer from "@/components/BookContainer";
// import type { BooksResponse, TGenre } from "@/types";

// const Page = () => {
//     const [genres, setGenres] = useState<TGenre[]>([]);
//     const [genrePage, setGenrePage] = useState(1);
//     const [hasMoreGenres, setHasMoreGenres] = useState(true);
//     const [loadingGenres, setLoadingGenres] = useState(false);
//     const [booksData, setBooksData] = useState<BooksResponse[]>([]);

//     const loadGenres = useCallback(async () => {
//         if (loadingGenres || !hasMoreGenres) return;

//         setLoadingGenres(true);
//         const limit = 5;
//         const offset = (genrePage - 1) * limit;

//         try {
//             const { genres: newGenres, hasMoreGenres: moreGenres } =
//                 await fetchGenres(limit, offset);
//             setGenres((prevGenres) => [...prevGenres, ...newGenres]);
//             setHasMoreGenres(moreGenres);
//             setGenrePage((prevPage) => prevPage + 1);
//         } catch (error) {
//             console.error("Failed to fetch genres:", error);
//         } finally {
//             setLoadingGenres(false);
//         }
//     }, [genrePage, hasMoreGenres, loadingGenres]);

//     useEffect(() => {
//         // Load initial genres on component mount
//         loadGenres();
//     }, []); // Empty dependency array ensures this runs only once on mount

//     useEffect(() => {
//         const fetchBooksForGenres = async () => {
//             const newBooksResponses: BooksResponse[] = [];

//             for (const genre of genres) {
//                 if (
//                     !booksData.some((data) => data.genreId === genre.genre_id)
//                 ) {
//                     try {
//                         const initialBooksResponse: BooksResponse =
//                             await fetchBooks(1, genre.genre_id);
//                         newBooksResponses.push(initialBooksResponse);
//                     } catch (error) {
//                         console.error(
//                             `Failed to fetch books for genre ${genre.genre_id}:`,
//                             error
//                         );
//                     }
//                 }
//             }

//             if (newBooksResponses.length > 0) {
//                 setBooksData((prevBooksData) => [
//                     ...prevBooksData,
//                     ...newBooksResponses,
//                 ]);
//             }
//         };

//         if (genres.length > 0) {
//             fetchBooksForGenres();
//         }
//     }, [genres, booksData]);

//     return (
//         <div>
//             {booksData.map((initialBooksResponse) => (
//                 <BookContainer
//                     key={initialBooksResponse.id}
//                     initialBooks={initialBooksResponse.books}
//                     hasMoreBooks={initialBooksResponse.hasMoreBooks}
//                     genre={initialBooksResponse.genre}
//                     genre_id={initialBooksResponse.genreId}
//                 />
//             ))}

//             {hasMoreGenres && (
//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button onClick={loadGenres} disabled={loadingGenres}>
//                         {loadingGenres ? "Loading..." : "Load More Genres"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Page;

// "use client";
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { fetchBooks, fetchGenres } from "@/utils/requests";
// import BookContainer from "@/components/BookContainer";
// import type { BooksResponse, TGenre } from "@/types";

// const Page = () => {
//     const [genres, setGenres] = useState<TGenre[]>([]);
//     const [genrePage, setGenrePage] = useState(1);
//     const [hasMoreGenres, setHasMoreGenres] = useState(true);
//     const [loadingGenres, setLoadingGenres] = useState(false);
//     const [booksData, setBooksData] = useState<BooksResponse[]>([]);
//     const initialLoadDone = useRef(false);

//     const loadGenres = useCallback(
//         async (isInitialLoad: boolean = false) => {
//             if (loadingGenres || (!hasMoreGenres && !isInitialLoad)) return;

//             setLoadingGenres(true);
//             const limit = 5;
//             const offset = isInitialLoad ? 0 : (genrePage - 1) * limit;

//             try {
//                 const { genres: newGenres, hasMoreGenres: moreGenres } =
//                     await fetchGenres(limit, offset);
//                 setGenres((prevGenres) => [...prevGenres, ...newGenres]);
//                 setHasMoreGenres(moreGenres);
//                 if (!isInitialLoad) {
//                     setGenrePage((prevPage) => prevPage + 1);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch genres:", error);
//             } finally {
//                 setLoadingGenres(false);
//             }
//         },
//         [genrePage, hasMoreGenres, loadingGenres]
//     );

//     useEffect(() => {
//         if (!initialLoadDone.current) {
//             loadGenres(true);
//             initialLoadDone.current = true;
//         }
//     }, [loadGenres]);

//     useEffect(() => {
//         const fetchBooksForGenres = async () => {
//             const newBooksResponses: BooksResponse[] = [];

//             for (const genre of genres) {
//                 if (
//                     !booksData.some((data) => data.genreId === genre.genre_id)
//                 ) {
//                     try {
//                         const initialBooksResponse: BooksResponse =
//                             await fetchBooks(1, genre.genre_id);
//                         newBooksResponses.push(initialBooksResponse);
//                     } catch (error) {
//                         console.error(
//                             `Failed to fetch books for genre ${genre.genre_id}:`,
//                             error
//                         );
//                     }
//                 }
//             }

//             if (newBooksResponses.length > 0) {
//                 setBooksData((prevBooksData) => [
//                     ...prevBooksData,
//                     ...newBooksResponses,
//                 ]);
//             }
//         };

//         if (genres.length > 0) {
//             fetchBooksForGenres();
//         }
//     }, [genres, booksData]);

//     return (
//         <div>
//             {booksData.map((initialBooksResponse) => (
//                 <BookContainer
//                     key={initialBooksResponse.id}
//                     initialBooks={initialBooksResponse.books}
//                     hasMoreBooks={initialBooksResponse.hasMoreBooks}
//                     genre={initialBooksResponse.genre}
//                     genre_id={initialBooksResponse.genreId}
//                 />
//             ))}

//             {hasMoreGenres && (
//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button
//                         onClick={() => loadGenres()}
//                         disabled={loadingGenres}
//                     >
//                         {loadingGenres ? "Loading..." : "Load More Genres"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Page;

// // "use client";

// // import React from "react";
// // import type { TBook } from "@/types";
// // import { AiOutlineLike } from "react-icons/ai";
// // import { AiOutlineDislike } from "react-icons/ai";

// // interface BookDetailsProps {
// //     book: TBook;
// // }

// // const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
// //     const [liked, setLiked] = React.useState(false);
// //     const [disliked, setDisliked] = React.useState(false);
// //     const handleLikeClick = () => {
// //         setLiked(!liked);
// //         setDisliked(false);
// //     };
// //     const handleDislikeClick = () => {
// //         setDisliked(!disliked);
// //         setLiked(false);
// //     };

// //     return (
// //         <div className="flex gap-10 p-14">
// //             <div className="flex flex-col gap-4">
// //                 <div className="w-96 h-full ">
// //                     {book.cover_img ? (
// //                         <img
// //                             className="w-full h-full rounded-lg"
// //                             src={book.cover_img}
// //                             alt=""
// //                         />
// //                     ) : (
// //                         <img
// //                             className="w-full h-full rounded-lg"
// //                             src="https://via.placeholder.com/150"
// //                             alt=""
// //                         />
// //                     )}
// //                 </div>
// //                 <div className="flex justify-around">
// //                     <AiOutlineDislike
// //                         className={`w-10 h-10 cursor-pointer ${
// //                             disliked ? "text-red-500" : ""
// //                         }`}
// //                         onClick={handleDislikeClick}
// //                     />
// //                     <AiOutlineLike
// //                         className={`w-10 h-10 cursor-pointer ${
// //                             liked ? "text-green-500" : ""
// //                         }`}
// //                         onClick={handleLikeClick}
// //                     />
// //                 </div>
// //             </div>
// //             <div className="space-y-4">
// //                 <h1 className="text-3xl font-bold pb-6">{book.title}</h1>
// //                 <p className="pb-10">{book.description_text}</p>
// //                 <p>Price: ${book.price}</p>
// //                 <p>
// //                     Publish Date:{" "}
// //                     {new Date(book.publish_date).toLocaleDateString()}
// //                 </p>
// //                 <p>Publisher: {book.publisher}</p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default BookDetails;

// "use client";
// import React, { useEffect, useState } from "react";
// import type { TBook } from "@/types";
// import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

// interface BookDetailsProps {
//     book: TBook;
//     likes: boolean;
// }

// const BookDetails: React.FC<BookDetailsProps> = ({ book, likes }) => {
//     const [liked, setLiked] = useState<boolean | null>(null);
//     console.log(likes);
//     const handleInteraction = async (like: boolean) => {
//         try {
//             const response = await fetch(
//                 "http://localhost:8000/api/interaction",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     credentials: "include",
//                     body: JSON.stringify({
//                         book_id: book.book_id,
//                         like: like,
//                     }),
//                 }
//             );

//             if (response.ok) {
//                 setLiked(like);
//             }
//         } catch (error) {
//             console.error("Error handling interaction:", error);
//         }
//     };

//     const handleLikeClick = () => {
//         handleInteraction(true);
//     };

//     const handleDislikeClick = () => {
//         handleInteraction(false);
//     };

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//             2,
//             "0"
//         )}-${String(date.getDate()).padStart(2, "0")}`;
//     };
//     return (
//         <div className="flex gap-10 p-14">
//             <div className="flex flex-col gap-4">
//                 <div className="w-96 h-full ">
//                     {book.cover_img ? (
//                         <img
//                             className="w-full h-full rounded-lg"
//                             src={book.cover_img}
//                             alt={book.title}
//                         />
//                     ) : (
//                         <img
//                             className="w-full h-full rounded-lg"
//                             src="https://via.placeholder.com/150"
//                             alt="Placeholder"
//                         />
//                     )}
//                 </div>
//                 <div className="flex justify-around">
//                     <AiOutlineDislike
//                         className={`w-10 h-10 cursor-pointer ${
//                             liked === false ? "text-red-500" : ""
//                         }`}
//                         onClick={handleDislikeClick}
//                     />
//                     <AiOutlineLike
//                         className={`w-10 h-10 cursor-pointer ${
//                             liked === true ? "text-green-500" : ""
//                         }`}
//                         onClick={handleLikeClick}
//                     />
//                 </div>
//             </div>
//             <div className="space-y-4">
//                 <h1 className="text-3xl font-bold pb-6">{book.title}</h1>
//                 <p className="pb-10">{book.description_text}</p>
//                 <p>Price: ${book.price}</p>
//                 <p>Publish Date: {formatDate(book.publish_date)}</p>
//                 <p>Publisher: {book.publisher}</p>

//                 <div className="text-xl">{likes} people liked this book</div>
//             </div>
//         </div>
//     );
// };

// export default BookDetails;

// "use client";
// import React, { useEffect } from "react";
// import Link from "next/link";
// import AddedBooks from "@/components/AddedBooks";
// import { useAuth } from "@/context/AuthContext";
// import { FetchedData } from "@/types";
// import LikedBooks from "@/components/LikedBooks";

// const Page = () => {
//     const { isLoggedIn } = useAuth();
//     const [userData, setUserData] = React.useState<FetchedData | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);

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
//             <LikedBooks liked_books={userData?.liked_books} />
//         </div>
//     );
// };

// export default Page;

// import React from "react";
// import "@/assets/styles/globals.css";
// import NavBar from "@/components/NavBar";
// import { AuthProvider } from "../context/AuthContext";

// type children = {
//     children: React.ReactNode;
// };

// const MainLayout = ({ children }: children) => {
//     return (
//         <html lang="en" data-theme="emerald" className="h-fit !scroll-smooth">
//             <body className="mx-80 bg-slate-100">
//                 <NavBar />
//                 <main className="mt-20">{children}</main>
//             </body>
//         </html>
//     );
// };

// export default MainLayout;

// const handleDislikeClick = () => {
//     handleInteraction(false);
//     if(isLoggedIn) {
//         toast("You've disliked this book!", {
//             icon: "😥",
//             position: "top-right",
//         });
//     } else {
//         toast.error("You need to be logged in to dislike this book", {
//             position: "top-right",
//     })
//     }
// };

// "use client";
// import React, { useEffect, useState } from "react";
// import Book from "@/components/Book";
// import RightIcon from "@/components/RightIcon";
// import LeftIcon from "@/components/LeftIcon";
// import type { TBook } from "@/types";
// import { fetchBooks } from "@/utils/requests";

// interface HomePageProps {
//     initialBooks: TBook[];
//     hasMoreBooks: boolean;
//     genre: string;
//     genre_id: number;
// }

// const BookContainer: React.FC<HomePageProps> = ({
//     initialBooks,
//     hasMoreBooks,
//     genre,
//     genre_id,
// }) => {
//     const [books, setBooks] = useState<TBook[]>(initialBooks);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [moreBooksAvailable, setMoreBooksAvailable] = useState(hasMoreBooks);
//     const [visibleBooks, setVisibleBooks] = useState<TBook[]>([]);
//     const [transitioning, setTransitioning] = useState(false);
//     const [direction, setDirection] = useState<"next" | "prev">("next");

//     const fetchNextBooks = async () => {
//         setLoading(true);
//         const { books: newBooks, hasMoreBooks: moreBooks } = await fetchBooks(
//             page,
//             genre_id
//         );
//         if (newBooks.length > 0) {
//             setBooks((prevBooks) => [...prevBooks, ...newBooks]);
//             setPage((prevPage) => prevPage + 1);
//             setMoreBooksAvailable(moreBooks);
//         } else {
//             setMoreBooksAvailable(false);
//         }
//         setLoading(false);
//     };

//     const handleNext = async () => {
//         if (visibleBooks.length < 5 && !moreBooksAvailable) return;
//         setDirection("next");
//         setTransitioning(true);
//         if (currentIndex + 5 >= books.length) {
//             await fetchNextBooks();
//         }
//         setTimeout(() => {
//             setCurrentIndex(currentIndex + 5);
//             setTransitioning(false);
//         }, 300);
//     };

//     const handlePrev = () => {
//         if (currentIndex > 0) {
//             setDirection("prev");
//             setTransitioning(true);
//             setTimeout(() => {
//                 setCurrentIndex(currentIndex - 5);
//                 setTransitioning(false);
//             }, 300);
//             if (currentIndex - 5 < books.length - 5) {
//                 setMoreBooksAvailable(true);
//             }
//         }
//     };

//     useEffect(() => {
//         setVisibleBooks(
//             () => books.slice(currentIndex, currentIndex + 5) || []
//         );
//     }, [currentIndex, books]);

//     return (
//         <div className="m-4">
//             <h1 className="text-3xl mb-6 ml-4">{genre}</h1>
//             <div className="flex gap-5 justify-center items-center mb-20 relative overflow-hidden">
//                 <button
//                     onClick={handlePrev}
//                     disabled={currentIndex === 0}
//                     className="z-10"
//                 >
//                     <LeftIcon className="w-10 h-10" />
//                 </button>

//                 <div
//                     className="flex gap-5 transition-transform duration-300 ease-in-out"
//                     style={{
//                         transform: transitioning
//                             ? `translateX(${
//                                   direction === "next" ? "-110%" : "110%"
//                               })`
//                             : "translateX(0)",
//                     }}
//                 >
//                     {loading ? (
//                         <p>Loading...</p>
//                     ) : (
//                         visibleBooks.map((book, index) => (
//                             <div
//                                 key={book.book_id || index}
//                                 className="transition-opacity duration-300 ease-in-out"
//                                 style={{ opacity: transitioning ? 0 : 1 }}
//                             >
//                                 <Book book={book} />
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 <button
//                     onClick={handleNext}
//                     disabled={loading || !moreBooksAvailable}
//                     className="z-10"
//                 >
//                     <RightIcon className="w-10 h-10" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BookContainer;

// "use client";
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { fetchBooks, fetchGenres } from "@/utils/requests";
// import BookContainer from "@/components/BookContainer";
// import type { BooksResponse, TGenre } from "@/types";
// import MostRecentBooks from "@/components/MostRecent";
// import MostLikedBooks from "@/components/MostLiked";

// const Page = () => {
//     const [genres, setGenres] = useState<TGenre[]>([]);
//     const [genrePage, setGenrePage] = useState(1);
//     const [hasMoreGenres, setHasMoreGenres] = useState(true);
//     const [loadingGenres, setLoadingGenres] = useState(false);
//     const [booksData, setBooksData] = useState<BooksResponse[]>([]);
//     const initialLoadDone = useRef(false);

//     const loadGenres = useCallback(
//         async (isInitialLoad: boolean = false) => {
//             if (loadingGenres || (!hasMoreGenres && !isInitialLoad)) return;

//             setLoadingGenres(true);
//             const limit = 5;
//             const offset = isInitialLoad ? 0 : genres.length;

//             try {
//                 const { genres: newGenres, hasMoreGenres: moreGenres } =
//                     await fetchGenres(limit, offset);
//                 setGenres((prevGenres) => [...prevGenres, ...newGenres]);
//                 setHasMoreGenres(moreGenres);
//                 if (!isInitialLoad) {
//                     setGenrePage((prevPage) => prevPage + 1);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch genres:", error);
//             } finally {
//                 setLoadingGenres(false);
//             }
//         },
//         [genres.length, hasMoreGenres, loadingGenres]
//     );

//     useEffect(() => {
//         if (!initialLoadDone.current) {
//             loadGenres(true);
//             initialLoadDone.current = true;
//         }
//     }, [loadGenres]);

//     useEffect(() => {
//         const fetchBooksForGenres = async () => {
//             const newBooksResponses: BooksResponse[] = [];

//             for (const genre of genres) {
//                 if (
//                     !booksData.some((data) => data.genreId === genre.genre_id)
//                 ) {
//                     try {
//                         const initialBooksResponse: BooksResponse =
//                             await fetchBooks(1, genre.genre_id);
//                         newBooksResponses.push(initialBooksResponse);
//                     } catch (error) {
//                         console.error(
//                             `Failed to fetch books for genre ${genre.genre_id}:`,
//                             error
//                         );
//                     }
//                 }
//             }

//             if (newBooksResponses.length > 0) {
//                 setBooksData((prevBooksData) => [
//                     ...prevBooksData,
//                     ...newBooksResponses,
//                 ]);
//             }
//         };

//         fetchBooksForGenres();
//     }, [genres]);

//     return (
//         <div>
//             <MostRecentBooks />
//             <MostLikedBooks />
//             {booksData.map((initialBooksResponse) => (
//                 <BookContainer
//                     key={initialBooksResponse.id}
//                     initialBooks={initialBooksResponse.books}
//                     hasMoreBooks={initialBooksResponse.hasMoreBooks}
//                     genre={initialBooksResponse.genre}
//                     genre_id={initialBooksResponse.genreId}
//                 />
//             ))}

//             {hasMoreGenres && (
//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button
//                         onClick={() => loadGenres()}
//                         disabled={loadingGenres}
//                     >
//                         {loadingGenres ? "Loading..." : "Load More Genres"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Page;

// import React, { useState, useEffect } from "react";
// import LeftIcon from "./LeftIcon";
// import RightIcon from "./RightIcon";
// import Book from "./Book";
// import type { TBook, TypeResponse } from "@/types";

// const MostRecentBooks = () => {
//     const [booksData, setBooksData] = useState<TypeResponse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const fetchBooks = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 `http://localhost:8000/api/mostRecent?offset=${currentIndex}&limit=10`
//             );
//             const data: TypeResponse = await response.json();
//             setBooksData((prevData) => {
//                 if (prevData) {
//                     return {
//                         ...data,
//                         books: [...prevData.books, ...data.books],
//                     };
//                 }
//                 return data;
//             });
//         } catch (error) {
//             console.error("Error fetching books:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBooks();
//     }, []);

//     const handleNext = () => {
//         if (
//             booksData &&
//             currentIndex + 5 >= booksData.books.length &&
//             booksData.hasMoreBooks
//         ) {
//             fetchBooks();
//         }
//         setCurrentIndex((prevIndex) => prevIndex + 5);
//     };

//     const handlePrev = () => {
//         setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 5));
//     };

//     const visibleBooks =
//         booksData?.books.slice(currentIndex, currentIndex + 5) || [];

//     return (
//         <div>
//             <div className="m-4">
//                 <h1 className="text-3xl mb-6 ml-4">Most Recent Books</h1>
//                 <div className="flex gap-5 justify-center items-center mb-20">
//                     <button onClick={handlePrev} disabled={currentIndex === 0}>
//                         <LeftIcon className="w-10 h-10" />
//                     </button>

//                     {loading && !booksData ? (
//                         <p>Loading...</p>
//                     ) : (
//                         visibleBooks.map((book, index) => (
//                             <Book key={book.book_id || index} book={book} />
//                         ))
//                     )}

//                     <button
//                         onClick={handleNext}
//                         disabled={
//                             loading ||
//                             (booksData ? !booksData.hasMoreBooks : true)
//                         }
//                     >
//                         <RightIcon className="w-10 h-10" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MostRecentBooks;

// import React, { useState, useEffect } from "react";
// import LeftIcon from "./LeftIcon";
// import RightIcon from "./RightIcon";
// import Book from "./Book";
// import type { TypeResponse } from "@/types";

// const MostLikedBooks = () => {
//     const [booksData, setBooksData] = useState<TypeResponse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const fetchBooks = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 `http://localhost:8000/api/mostLiked?offset=${currentIndex}&limit=5`
//             );
//             const data: TypeResponse = await response.json();
//             setBooksData((prevData) => {
//                 if (prevData) {
//                     return {
//                         ...data,
//                         books: [...prevData.books, ...data.books],
//                     };
//                 }
//                 return data;
//             });
//             console.log(data);
//         } catch (error) {
//             console.error("Error fetching books:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBooks();
//     }, []);

//     const handleNext = () => {
//         if (
//             booksData &&
//             currentIndex + 5 >= booksData.books.length &&
//             booksData.hasMoreBooks
//         ) {
//             fetchBooks();
//         }
//         setCurrentIndex((prevIndex) => prevIndex + 5);
//     };

//     const handlePrev = () => {
//         setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 5));
//     };

//     const visibleBooks =
//         booksData?.books.slice(currentIndex, currentIndex + 5) || [];

//     return (
//         <div>
//             <div className="m-4">
//                 <h1 className="text-3xl mb-6 ml-4">Most Liked Books</h1>
//                 <div className="flex gap-5 justify-center items-center mb-20">
//                     <button onClick={handlePrev} disabled={currentIndex === 0}>
//                         <LeftIcon className="w-10 h-10" />
//                     </button>

//                     {loading && !booksData ? (
//                         <p>Loading...</p>
//                     ) : (
//                         visibleBooks.map((book, index) => (
//                             <Book key={book.book_id || index} book={book} />
//                         ))
//                     )}

//                     <button
//                         onClick={handleNext}
//                         disabled={
//                             loading ||
//                             (booksData ? !booksData.hasMoreBooks : true)
//                         }
//                     >
//                         <RightIcon className="w-10 h-10" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MostLikedBooks;

// import React, { useState, useEffect } from "react";
// import LeftIcon from "./LeftIcon";
// import RightIcon from "./RightIcon";
// import Book from "./Book";
// import type { TypeResponse } from "@/types";

// const MostLikedBooks = () => {
//     const [booksData, setBooksData] = useState<TypeResponse | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const fetchBooks = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(
//                 `http://localhost:8000/api/mostLiked?offset=${currentIndex}&limit=5`
//             );
//             const data: TypeResponse = await response.json();
//             setBooksData((prevData) => {
//                 if (prevData) {
//                     return {
//                         ...data,
//                         books: [...prevData.books, ...data.books],
//                     };
//                 }
//                 return data;
//             });
//             console.log(data);
//         } catch (error) {
//             console.error("Error fetching books:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBooks();
//     }, []);

//     const handleNext = () => {
//         if (
//             booksData &&
//             currentIndex + 5 >= booksData.books.length &&
//             booksData.hasMoreBooks
//         ) {
//             fetchBooks();
//         }
//         setCurrentIndex((prevIndex) => prevIndex + 5);
//     };

//     const handlePrev = () => {
//         setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 5));
//     };

//     const visibleBooks =
//         booksData?.books.slice(currentIndex, currentIndex + 5) || [];

//     return (
//         <div>
//             <div className="m-4">
//                 <h1 className="text-3xl mb-6 ml-4">Most Liked Books</h1>
//                 <div className="flex gap-5 justify-center items-center mb-20">
//                     <button onClick={handlePrev} disabled={currentIndex === 0}>
//                         <LeftIcon className="w-10 h-10" />
//                     </button>

//                     {loading && !booksData ? (
//                         <p>Loading...</p>
//                     ) : (
//                         visibleBooks.map((book, index) => (
//                             <Book key={book.book_id || index} book={book} />
//                         ))
//                     )}

//                     <button
//                         onClick={handleNext}
//                         disabled={
//                             loading ||
//                             (booksData ? !booksData.hasMoreBooks : true)
//                         }
//                     >
//                         <RightIcon className="w-10 h-10" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MostLikedBooks;

// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";

// type Book = {
//     title: string;
//     book_id: number;
//     author: string;
//     language: string;
//     cover_img: string;
// };

// type AddedBooksProps = {
//     liked_books: Book[];
// };

// const LikedBooks = ({ liked_books }: AddedBooksProps) => {
//     const router = useRouter();
//     return (
//         <div>
//             {liked_books.length === 0 ? (
//                 <p>You haven't added any books yet.</p>
//             ) : (
//                 <ul className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         {liked_books.map((book, index) => (
//                             <li key={index} className="flex space-x-4">
//                                 <div
//                                     onClick={() =>
//                                         router.push(`/details/${book.book_id}`)
//                                     }
//                                     className="cursor-pointer"
//                                 >
//                                     <img
//                                         src={book.cover_img}
//                                         alt={book.title}
//                                         className="w-16 h-24 object-cover"
//                                     />
//                                 </div>

//                                 <div>
//                                     <h3
//                                         className="text-lg font-bold"
//                                         onClick={() =>
//                                             router.push(
//                                                 `/details/${book.book_id}`
//                                             )
//                                         }
//                                     >
//                                         {book.title}
//                                     </h3>
//                                     <p className="text-sm">
//                                         Author: {book.author}
//                                     </p>
//                                     <p className="text-sm">
//                                         Language: {book.language}
//                                     </p>
//                                 </div>
//                             </li>
//                         ))}
//                     </div>
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default LikedBooks;

// "use client";
// import BookDetails from "../../../components/BookDetails";
// export default async function BookPage({ params }: { params: { id: string } }) {
//     const res = await fetch(`http://localhost:8000/api/details/${params.id}`, {
//         cache: "no-cache",
//     });
//     if (!res.ok) {
//         throw new Error("Failed to fetch book details");
//     }

//     const data = await res.json();
//     const book = data.books[0];
//     const likes = data.likes;
//     console.log(data);
//     if (!book) return <div>Book not found</div>;

//     return (
//         <div>
//             <BookDetails book={book} likes={likes} />
//         </div>
//     );
// }

// "use client";
// import React, { useEffect, useState } from "react";
// import type { TBook } from "@/types";
// import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
// import toast from "react-hot-toast";
// import { useAuth } from "@/context/AuthContext";

// interface BookDetailsProps {
//     book: TBook;
//     likes: number;
// }

// const BookDetails: React.FC<BookDetailsProps> = ({ book, likes }) => {
//     const { isLoggedIn } = useAuth();
//     const [liked, setLiked] = useState<boolean | null>(null);

//     // Fetch whether the user has liked this book on mount
//     useEffect(() => {
//         const fetchLikeStatus = async () => {
//             try {
//                 const response = await fetch(
//                     `http://localhost:8000/api/getLikes?book_id=${book.book_id}`,
//                     {
//                         credentials: "include",
//                     }
//                 );
//                 const data = await response.json();
//                 setLiked(data.isLiked);
//             } catch (error) {
//                 console.error("Error fetching like status:", error);
//             }
//         };

//         fetchLikeStatus();
//     }, [book.book_id]);

//     const handleInteraction = async (like: boolean) => {
//         try {
//             const response = await fetch(
//                 "http://localhost:8000/api/interaction",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     credentials: "include",
//                     body: JSON.stringify({
//                         book_id: book.book_id,
//                         like: like,
//                     }),
//                 }
//             );

//             if (response.ok) {
//                 setLiked(like);
//             }
//         } catch (error) {
//             console.error("Error handling interaction:", error);
//         }
//     };

//     const handleLikeClick = () => {
//         handleInteraction(true);
//         if (isLoggedIn) {
//             toast("You've liked this book!", {
//                 icon: "👏",
//                 position: "top-right",
//             });
//         } else {
//             toast.error("You need to be logged in to like this book", {
//                 position: "top-right",
//             });
//         }
//     };

//     const handleDislikeClick = () => {
//         handleInteraction(false);
//         if (isLoggedIn) {
//             toast("You've disliked this book!", {
//                 icon: "😥",
//                 position: "top-right",
//             });
//         } else {
//             toast.error("You need to be logged in to dislike this book", {
//                 position: "top-right",
//             });
//         }
//     };

//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//             2,
//             "0"
//         )}-${String(date.getDate()).padStart(2, "0")}`;
//     };

//     return (
//         <div className="flex gap-10 p-14">
//             <div className="flex flex-col gap-4">
//                 <div className="w-96 h-full ">
//                     {book.cover_img ? (
//                         <img
//                             className="w-full h-full rounded-lg"
//                             src={book.cover_img}
//                             alt={book.title}
//                         />
//                     ) : (
//                         <img
//                             className="w-full h-full rounded-lg"
//                             src="https://via.placeholder.com/150"
//                             alt="Placeholder"
//                         />
//                     )}
//                 </div>
//                 <div className="flex justify-around">
//                     <AiOutlineDislike
//                         className={`w-10 h-10 cursor-pointer ${
//                             liked === false ? "text-red-500" : ""
//                         }`}
//                         onClick={handleDislikeClick}
//                     />
//                     <AiOutlineLike
//                         className={`w-10 h-10 cursor-pointer ${
//                             liked === true ? "text-green-500" : ""
//                         }`}
//                         onClick={handleLikeClick}
//                     />
//                 </div>
//             </div>
//             <div className="space-y-4">
//                 <h1 className="text-3xl font-bold pb-6">{book.title}</h1>
//                 <p className="pb-10">{book.description_text}</p>
//                 <p>Price: ${book.price}</p>
//                 <p>Publish Date: {formatDate(book.publish_date)}</p>
//                 <p>Publisher: {book.publisher}</p>

//                 <div className="text-xl">{likes} people liked this book</div>
//             </div>
//         </div>
//     );
// };

// export default BookDetails;

// // import Link from "next/link";
// // import React from "react";
// // import { useAuth } from "@/context/AuthContext";

// // const NavBar = () => {
// //     const { isLoggedIn, logout } = useAuth();
// //     return (
// //         <div>
// //             <div className="navbar p-10 bg-slate-300 rounded-xl">
// //                 <div className="flex-1">
// //                     <Link
// //                         href="/"
// //                         className="btn btn-ghost font-extrabold text-5xl"
// //                     >
// //                         Open Library
// //                     </Link>
// //                     {/* <div className="btn btn-ghost font-normal text-base ml-5">
// //                         My books
// //                     </div> */}
// //                 </div>
// //                 <div className="flex-none gap-2">
// //                     <div className="form-control w-80">
// //                         <div className="relative">
// //                             <input
// //                                 type="text"
// //                                 placeholder="Search"
// //                                 className="input input-bordered w-full pr-16"
// //                             />
// //                             <button className="btn btn-ghost absolute top-0 right-0 rounded-l-none">
// //                                 <svg
// //                                     xmlns="http://www.w3.org/2000/svg"
// //                                     className="h-6 w-6"
// //                                     fill="none"
// //                                     viewBox="0 0 24 24"
// //                                     stroke="currentColor"
// //                                 >
// //                                     <path
// //                                         strokeLinecap="round"
// //                                         strokeLinejoin="round"
// //                                         strokeWidth={2}
// //                                         d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
// //                                     />
// //                                 </svg>
// //                             </button>
// //                         </div>
// //                     </div>
// //                     <Link href="/registration">
// //                         <div className="bg-blue-500"></div>
// //                         Sign Up
// //                     </Link>
// //                     <Link href="/login">
// //                         <div className=""></div>
// //                         Login
// //                     </Link>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default NavBar;

// "use client";
// import Link from "next/link";
// import React from "react";
// import { useAuth } from "@/context/AuthContext"; // Import the auth context
// import LogoutButton from "@/components/LogoutButton"; // Import the LogoutButton component

// const NavBar = () => {
//     const { isLoggedIn } = useAuth(); // Get auth state to check if the user is logged in

//     return (
//         <div>
//             <div className="navbar p-10 bg-slate-300 rounded-b-lg">
//                 <div className="flex-1">
//                     <Link
//                         href="/"
//                         className="btn btn-ghost font-extrabold text-5xl"
//                     >
//                         Open Library
//                     </Link>
//                 </div>
//                 {isLoggedIn && (
//                     <div className="flex-1 underline">
//                         <Link
//                             href="/dashboard"
//                             className="btn btn-ghost font-normal text-base ml-5"
//                         >
//                             My Dashboard
//                         </Link>
//                     </div>
//                 )}
//                 <div className="flex-none gap-2">
//                     <div className="form-control w-80">
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search"
//                                 className="input input-bordered w-full pr-16"
//                             />
//                             <button className="btn btn-ghost absolute top-0 right-0 rounded-l-none">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-6 w-6"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
//                                     />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Conditionally render buttons based on login state */}
//                     {isLoggedIn ? (
//                         <>
//                             <LogoutButton />{" "}
//                             {/* Render LogoutButton if the user is logged in */}
//                         </>
//                     ) : (
//                         <>
//                             <Link
//                                 href="/registration"
//                                 className="btn bg-blue-500 text-white"
//                             >
//                                 Sign Up
//                             </Link>
//                             <Link
//                                 href="/login"
//                                 className="btn bg-green-500 text-white"
//                             >
//                                 Login
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NavBar;

// "use client";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { TBook } from "@/types";
// import toast from "react-hot-toast";

// const AddBooks = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<TBook>();
//     const router = useRouter();
//     const { isLoggedIn } = useAuth(); // Access the token from useAuth

//     // Redirect to login page if not logged in
//     useEffect(() => {
//         if (!isLoggedIn) {
//             router.push("/login");
//         }
//     }, [isLoggedIn, router]);

//     // Handle form submission
//     const onSubmit = async (data: TBook) => {
//         try {
//             const response = await fetch("http://localhost:8000/api/create", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 credentials: "include", // Include cookies if needed
//                 body: JSON.stringify(data),
//             });

//             if (response.ok) {
//                 toast.success("Book added successfully", {
//                     position: "top-right",
//                 });
//                 router.push("/");
//             } else {
//                 console.error("Failed to add book.");
//                 toast.error("Failed to add Books added successfully", {
//                     position: "top-right",
//                 });
//             }
//         } catch (error) {
//             console.error("Error while adding book:", error);
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto p-10 bg-white rounded-xl shadow-md">
//             <h1 className="text-2xl font-bold mb-6 text-center">
//                 Add a New Book
//             </h1>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 <div>
//                     <label
//                         htmlFor="title"
//                         className="block text-sm font-medium"
//                     >
//                         Title
//                     </label>
//                     <input
//                         {...register("title", { required: true })}
//                         id="title"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.title && (
//                         <p className="text-red-500 text-sm">
//                             Title is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="language"
//                         className="block text-sm font-medium"
//                     >
//                         Language
//                     </label>
//                     <input
//                         {...register("language", { required: true })}
//                         id="language"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.language && (
//                         <p className="text-red-500 text-sm">
//                             Language is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="pages"
//                         className="block text-sm font-medium"
//                     >
//                         Pages
//                     </label>
//                     <input
//                         type="number"
//                         {...register("pages", { required: true })}
//                         id="pages"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.pages && (
//                         <p className="text-red-500 text-sm">
//                             Pages is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="publish_date"
//                         className="block text-sm font-medium"
//                     >
//                         Publish Date
//                     </label>
//                     <input
//                         type="date"
//                         {...register("publish_date", { required: true })}
//                         id="publish_date"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.publish_date && (
//                         <p className="text-red-500 text-sm">
//                             Publish date is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="cover_img"
//                         className="block text-sm font-medium"
//                     >
//                         Cover Image URL
//                     </label>
//                     <input
//                         {...register("cover_img", { required: true })}
//                         id="cover_img"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.cover_img && (
//                         <p className="text-red-500 text-sm">
//                             Cover image is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="price"
//                         className="block text-sm font-medium"
//                     >
//                         Price
//                     </label>
//                     <input
//                         type="number"
//                         {...register("price", { required: true })}
//                         id="price"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.price && (
//                         <p className="text-red-500 text-sm">
//                             Price is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="author"
//                         className="block text-sm font-medium"
//                     >
//                         Author
//                     </label>
//                     <input
//                         {...register("author", { required: true })}
//                         id="author"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.author && (
//                         <p className="text-red-500 text-sm">
//                             Author is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="description_text"
//                         className="block text-sm font-medium"
//                     >
//                         Description
//                     </label>
//                     <textarea
//                         {...register("description_text", { required: false })}
//                         id="description_text"
//                         className="textarea textarea-bordered w-full"
//                     />
//                     {errors.description_text && (
//                         <p className="text-red-500 text-sm">
//                             Description is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="publisher"
//                         className="block text-sm font-medium"
//                     >
//                         Publisher
//                     </label>
//                     <input
//                         {...register("publisher", { required: false })}
//                         id="publisher"
//                         className="input input-bordered w-full"
//                     />
//                     {errors.publisher && (
//                         <p className="text-red-500 text-sm">
//                             Publisher is required.
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <button type="submit" className="btn btn-primary w-full">
//                         Add Book
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddBooks;

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

// "use client";
// import Link from "next/link";
// import React, { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import LogoutButton from "@/components/LogoutButton";
// import axios from "axios"; // Import axios to handle HTTP requests

// const NavBar = () => {
//     const { isLoggedIn } = useAuth();
//     const [searchTerm, setSearchTerm] = useState("");
//     const [searchResults, setSearchResults] = useState<any[]>([]); // Store search results
//     const [showDropdown, setShowDropdown] = useState(false); // Control dropdown visibility
//     // Function to handle result click
//     const handleResultClick = () => {
//         setSearchTerm(""); // Clear the search input field
//         hideDropdown(); // Hide the dropdown
//     };
//     // Function to handle search input changes
//     const handleSearchChange = async (
//         e: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const searchQuery = e.target.value;
//         setSearchTerm(searchQuery);

//         if (searchQuery.trim() === "") {
//             setSearchResults([]); // Clear results if input is empty
//             setShowDropdown(false);
//             return;
//         }

//         try {
//             const response = await axios.get(
//                 `http://localhost:8000/api/books?search=${searchQuery}`
//             );
//             setSearchResults(response.data.books);
//             setShowDropdown(true); // Show dropdown if results are available
//         } catch (error) {
//             console.error("Error fetching search results:", error);
//             setSearchResults([]);
//             setShowDropdown(false);
//         }
//     };

//     // Function to hide the dropdown
//     const hideDropdown = () => setShowDropdown(false);

//     return (
//         <div>
//             <div className="navbar p-10 bg-slate-300 rounded-b-lg">
//                 <div className="flex-1">
//                     <Link
//                         href="/"
//                         className="btn btn-ghost font-extrabold text-5xl"
//                     >
//                         Open Library
//                     </Link>
//                 </div>
//                 {isLoggedIn && (
//                     <div className="flex-1 underline">
//                         <Link
//                             href="/dashboard"
//                             className="btn btn-ghost font-normal text-base ml-5"
//                         >
//                             My Dashboard
//                         </Link>
//                     </div>
//                 )}
//                 <div className="flex-none gap-2 relative">
//                     <div className="form-control w-80">
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 value={searchTerm}
//                                 onChange={handleSearchChange} // Trigger search on input change
//                                 placeholder="Search"
//                                 className="input input-bordered w-full pr-16"
//                             />
//                             <button className="btn btn-ghost absolute top-0 right-0 rounded-l-none">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-6 w-6"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
//                                     />
//                                 </svg>
//                             </button>

//                             {/* Search results dropdown */}
//                             {showDropdown && searchResults.length > 0 && (
//                                 <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
//                                     {searchResults.map((book) => (
//                                         <Link
//                                             href={`/details/${book.book_id}`}
//                                             key={book.book_id}
//                                             onClick={handleResultClick} // Hide dropdown when a result is clicked
//                                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
//                                         >
//                                             {book.title}
//                                         </Link>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {isLoggedIn ? (
//                         <LogoutButton />
//                     ) : (
//                         <>
//                             <Link
//                                 href="/registration"
//                                 className="btn bg-blue-500 text-white"
//                             >
//                                 Sign Up
//                             </Link>
//                             <Link
//                                 href="/login"
//                                 className="btn bg-green-500 text-white"
//                             >
//                                 Login
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NavBar;

// "use client";
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { fetchGenres } from "@/utils/requests";
// import MostRecentBooks from "@/components/MostRecent";
// import MostLikedBooks from "@/components/MostLiked";
// import BookContainer from "@/components/BookContainer";
// import type { TGenre } from "@/types";
// import LoadingSpinner from "@/components/LoadingSpinner";
// import { useRefetch } from "@/context/useRefetch"; // Import the custom hook

// const Page = () => {
//     const [genres, setGenres] = useState<TGenre[]>([]);
//     const [genrePage, setGenrePage] = useState(1);
//     const [hasMoreGenres, setHasMoreGenres] = useState(true);
//     const [loadingGenres, setLoadingGenres] = useState(false);
//     const initialLoadDone = useRef(false);
//     const { refetchTrigger, triggerRefetch } = useRefetch(); // Use the custom hook

//     const loadGenres = useCallback(
//         async (isInitialLoad: boolean = false) => {
//             if (loadingGenres || (!hasMoreGenres && !isInitialLoad)) return;

//             setLoadingGenres(true);
//             const limit = 5;
//             const offset = isInitialLoad ? 0 : genres.length;

//             try {
//                 const { genres: newGenres, hasMoreGenres: moreGenres } =
//                     await fetchGenres(limit, offset);
//                 setGenres((prevGenres) => [...prevGenres, ...newGenres]);
//                 setHasMoreGenres(moreGenres);
//                 if (!isInitialLoad) {
//                     setGenrePage((prevPage) => prevPage + 1);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch genres:", error);
//             } finally {
//                 setLoadingGenres(false);
//             }
//         },
//         [genres.length, hasMoreGenres, loadingGenres]
//     );

//     useEffect(() => {
//         if (!initialLoadDone.current) {
//             loadGenres(true);
//             initialLoadDone.current = true;
//         }
//     }, [loadGenres]);

//     // Add this effect to refetch data when refetchTrigger changes
//     useEffect(() => {
//         if (initialLoadDone.current) {
//             setGenres([]);
//             setGenrePage(1);
//             setHasMoreGenres(true);
//             loadGenres(true);
//         }
//     }, [refetchTrigger, loadGenres]);

//     return (
//         <div>
//             <MostRecentBooks refetchTrigger={refetchTrigger} />
//             <MostLikedBooks refetchTrigger={refetchTrigger} />
//             {genres.map((genre) => (
//                 <BookContainer
//                     key={genre.genre_id}
//                     genre_id={genre.genre_id}
//                     genre={genre.genre_name}
//                     refetchTrigger={refetchTrigger}
//                 />
//             ))}

//             {hasMoreGenres && (
//                 <div style={{ textAlign: "center", marginTop: "20px" }}>
//                     <button
//                         className="btn text-center mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                         onClick={() => loadGenres()}
//                         disabled={loadingGenres}
//                     >
//                         {loadingGenres ? (
//                             <LoadingSpinner />
//                         ) : (
//                             "Load More Genres"
//                         )}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Page;

// "use client";
// import React, { useEffect, useState } from "react";
// import Book from "@/components/Book";
// import RightIcon from "@/components/RightIcon";
// import LeftIcon from "@/components/LeftIcon";
// import type { TBook } from "@/types";
// import { fetchBooks } from "@/utils/requests";
// import LoadingSpinner from "@/components/LoadingSpinner";

// interface HomePageProps {
//     genre_id: number;
//     genre: string;
// }

// const BookContainer: React.FC<HomePageProps> = ({ genre, genre_id }) => {
//     const [books, setBooks] = useState<TBook[]>([]);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [moreBooksAvailable, setMoreBooksAvailable] = useState(true);
//     const [visibleBooks, setVisibleBooks] = useState<TBook[]>([]);

//     const fetchNextBooks = async () => {
//         setLoading(true);

//         try {
//             const { books: newBooks, hasMoreBooks: moreBooks } =
//                 await fetchBooks(page, genre_id);

//             if (newBooks.length > 0) {
//                 setBooks((prevBooks) => [...prevBooks, ...newBooks]);
//                 setPage((prevPage) => prevPage + 1);
//                 setMoreBooksAvailable(moreBooks);
//             } else {
//                 setMoreBooksAvailable(false);
//             }
//         } catch (error) {
//             console.error(
//                 `Failed to fetch books for genre ${genre_id}:`,
//                 error
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchNextBooks();
//     }, []); // fetch books when the component mounts

//     useEffect(() => {
//         setVisibleBooks(
//             () => books.slice(currentIndex, currentIndex + 5) || []
//         );
//     }, [currentIndex, books]);

//     const handleNext = async () => {
//         if (currentIndex + 5 >= books.length && moreBooksAvailable) {
//             await fetchNextBooks();
//         }
//         setCurrentIndex((prevIndex) => prevIndex + 5);
//     };

//     const handlePrev = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex((prevIndex) => prevIndex - 5);
//         }
//     };

//     return (
//         <div>
//             <div className="m-4">
//                 <h1 className="text-3xl my-20 ml-4 font-bold">{genre}</h1>
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
//                             disabled={loading || !moreBooksAvailable}
//                         >
//                             <RightIcon className="w-10 h-10" />
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BookContainer;
