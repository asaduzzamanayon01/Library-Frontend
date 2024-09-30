// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { TBook } from "@/types";
// import toast from "react-hot-toast";

// interface EditBooksProps {
//     bookId: number;
// }

// const EditBooks: React.FC<EditBooksProps> = ({ bookId }) => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue, // Use to set form values
//     } = useForm<TBook>();

//     const [book, setBook] = useState<TBook | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const router = useRouter();
//     const { isLoggedIn } = useAuth();

//     // Redirect to login page if not logged in
//     useEffect(() => {
//         if (!isLoggedIn) {
//             router.push("/login");
//         }
//     }, [isLoggedIn, router]);

//     // Fetch book details and likes on component mount
//     useEffect(() => {
//         const fetchBookDetails = async () => {
//             try {
//                 const res = await fetch(
//                     `http://localhost:8000/api/details/${bookId}`,
//                     {
//                         cache: "no-cache",
//                     }
//                 );
//                 if (!res.ok) {
//                     throw new Error("Failed to fetch book details");
//                 }
//                 const data = await res.json();
//                 //general
//                 // const bookData = data.books[0];

//                 //for elasticsearch
//                 const bookData = data.book;
//                 const likesData = data.likes;
//                 const dislikesData = data.dislikes;

//                 if (!bookData) {
//                     setLoading(false);
//                     throw new Error("Book not found");
//                 }
//                 setBook(bookData);
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookDetails();
//     }, [bookId]);

//     // Set form values with the book data
//     useEffect(() => {
//         if (book) {
//             setValue("title", book.title);
//             setValue("language", book.language);
//             setValue("pages", book.pages);
//             setValue("publish_date", book.publish_date);
//             setValue("price", book.price);
//             setValue("author", book.author);
//             setValue("description_text", book.description_text || "");
//             setValue("publisher", book.publisher || "");
//         }
//     }, [book, setValue]);

//     const onSubmit = async (data: TBook) => {
//         const formData = new FormData();

//         // Append form fields
//         formData.append("title", data.title);
//         formData.append("language", data.language);
//         formData.append("pages", data.pages.toString());
//         formData.append("publish_date", data.publish_date);
//         formData.append("price", data.price.toString());
//         formData.append("author", data.author);
//         formData.append("description_text", data.description_text || "");
//         formData.append("publisher", data.publisher || "");

//         try {
//             const response = await fetch(
//                 `http://localhost:8000/update?book_id=${bookId}`,
//                 {
//                     method: "PUT",
//                     credentials: "include",
//                     body: formData,
//                 }
//             );

//             if (response.ok) {
//                 toast.success("Book updated successfully", {
//                     position: "top-right",
//                 });
//                 router.push("/");
//             } else {
//                 toast.error("Failed to update book", {
//                     position: "top-right",
//                 });
//             }
//         } catch (error) {
//             console.error("Error while updating book:", error);
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto p-10 bg-white rounded-xl shadow-md">
//             <h1 className="text-2xl font-bold mb-6 text-center">Edit Book</h1>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Book fields */}
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
//                         {...register("description_text")}
//                         id="description_text"
//                         className="textarea textarea-bordered w-full"
//                     />
//                 </div>

//                 <div>
//                     <label
//                         htmlFor="publisher"
//                         className="block text-sm font-medium"
//                     >
//                         Publisher
//                     </label>
//                     <input
//                         {...register("publisher")}
//                         id="publisher"
//                         className="input input-bordered w-full"
//                     />
//                 </div>

//                 <div>
//                     <button type="submit" className="btn btn-primary w-full">
//                         Update Book
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditBooks;

"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TBook } from "@/types";
import toast from "react-hot-toast";

interface EditBooksProps {
    bookId: number; // Expect bookId as a number
}

const EditBooks: React.FC<EditBooksProps> = ({ bookId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<TBook>();

    const [book, setBook] = useState<TBook | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    // Redirect to login page if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, router]);

    // Fetch book details based on bookId
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
                const bookData = data.book;

                if (!bookData) {
                    throw new Error("Book not found");
                }

                setBook(bookData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    // Set form values with the fetched book data
    useEffect(() => {
        if (book) {
            setValue("title", book.title);
            setValue("language", book.language);
            setValue("pages", book.pages);
            setValue("publish_date", book.publish_date);
            setValue("price", book.price);
            setValue("author", book.author);
            setValue("description_text", book.description_text || "");
            setValue("publisher", book.publisher || "");
        }
    }, [book, setValue]);

    const onSubmit = async (data: TBook) => {
        const formData = new FormData();

        // Append form fields
        formData.append("title", data.title);
        formData.append("language", data.language);
        formData.append("pages", data.pages.toString());
        formData.append("publish_date", data.publish_date);
        formData.append("price", data.price.toString());
        formData.append("author", data.author);
        formData.append("description_text", data.description_text || "");
        formData.append("publisher", data.publisher || "");

        try {
            const response = await fetch(
                `http://localhost:8000/api/update?book_id=${bookId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    body: formData,
                }
            );

            if (response.ok) {
                toast.success("Book updated successfully", {
                    position: "top-right",
                });
                router.push("/dashboard"); // Redirect to home or book list page
            } else {
                toast.error("Failed to update book", {
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error while updating book:", error);
        }
    };

    if (loading) return <p>Loading book details...</p>;

    return (
        <div className="max-w-lg mx-auto p-10 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Book</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Book fields with error handling */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium"
                    >
                        Title
                    </label>
                    <input
                        {...register("title", { required: true })}
                        id="title"
                        className="input input-bordered w-full"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">
                            Title is required.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="language"
                        className="block text-sm font-medium"
                    >
                        Language
                    </label>
                    <input
                        {...register("language", { required: true })}
                        id="language"
                        className="input input-bordered w-full"
                    />
                    {errors.language && (
                        <p className="text-red-500 text-sm">
                            Language is required.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="pages"
                        className="block text-sm font-medium"
                    >
                        Pages
                    </label>
                    <input
                        type="number"
                        {...register("pages", { required: true })}
                        id="pages"
                        className="input input-bordered w-full"
                    />
                    {errors.pages && (
                        <p className="text-red-500 text-sm">
                            Pages is required.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="publish_date"
                        className="block text-sm font-medium"
                    >
                        Publish Date
                    </label>
                    <input
                        type="date"
                        {...register("publish_date", { required: true })}
                        id="publish_date"
                        className="input input-bordered w-full"
                    />
                    {errors.publish_date && (
                        <p className="text-red-500 text-sm">
                            Publish date is required.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium"
                    >
                        Price
                    </label>
                    <input
                        type="number"
                        {...register("price", { required: true })}
                        id="price"
                        className="input input-bordered w-full"
                    />
                    {errors.price && (
                        <p className="text-red-500 text-sm">
                            Price is required.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="author"
                        className="block text-sm font-medium"
                    >
                        Author
                    </label>
                    <input
                        {...register("author", { required: true })}
                        id="author"
                        className="input input-bordered w-full"
                    />
                    {errors.author && (
                        <p className="text-red-500 text-sm">
                            Author is required.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="description_text"
                        className="block text-sm font-medium"
                    >
                        Description
                    </label>
                    <textarea
                        {...register("description_text")}
                        id="description_text"
                        className="textarea textarea-bordered w-full"
                    />
                </div>

                <div>
                    <label
                        htmlFor="publisher"
                        className="block text-sm font-medium"
                    >
                        Publisher
                    </label>
                    <input
                        {...register("publisher")}
                        id="publisher"
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary w-full">
                        Update Book
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBooks;
