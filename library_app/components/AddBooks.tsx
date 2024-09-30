"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TBook } from "@/types";
import toast from "react-hot-toast";

const AddBooks = () => {
    interface Genre {
        genre_id: number;
        genre_name: string;
    }
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]); // Store genres from backend
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]); // Track selected genre IDs

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TBook>();
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    // Redirect to login page if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        if (genres.length > 0 && selectedGenres.length === 0) {
            setSelectedGenres([genres[0].genre_id]);
        }
    }, [genres]);

    // Fetch genres from the backend
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/genres?limit=15&offset=0"
                );
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            }
        };

        fetchGenres();
    }, []);

    const handleGenreChange = (genreId: number) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId)
                ? prev.filter((id) => id !== genreId)
                : [...prev, genreId]
        );
    };

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

        // Append selected genres
        formData.append("genres", JSON.stringify(selectedGenres));

        // Append cover image
        const coverImgFile = (
            document.getElementById("cover_img") as HTMLInputElement
        )?.files?.[0];
        if (coverImgFile) {
            formData.append("cover_img", coverImgFile);
        }

        try {
            const response = await fetch("http://localhost:8000/api/create", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                toast.success("Book added successfully", {
                    position: "top-right",
                });

                router.push("/");
            } else {
                toast.error("Failed to add book", {
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error while adding book:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-10 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Add a New Book
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Book fields */}
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

                {/* <div>
                    <label
                        htmlFor="cover_img"
                        className="block text-sm font-medium"
                    >
                        Cover Image
                    </label>
                    <input
                        type="file"
                        {...register("cover_img", { required: true })}
                        id="cover_img"
                        className="input input-bordered w-full"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setPreviewImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    {errors.cover_img && (
                        <p className="text-red-500 text-sm">
                            Cover image is required.
                        </p>
                    )}
                </div>
                {previewImage && (
                    <div className="relative flex justify-end">
                        <img
                            src={previewImage}
                            alt="Cover Preview"
                            className="w-20 h-20 mb-10 rounded-l"
                        />
                        <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white p-1"
                            onClick={() => {
                                setPreviewImage(null);
                                (
                                    document.getElementById(
                                        "cover_img"
                                    ) as HTMLInputElement
                                ).value = "";
                            }}
                        >
                            &times;
                        </button>
                    </div>
                )} */}
                <div className="relative w-full">
                    <label
                        htmlFor="cover_img"
                        className="block text-sm font-medium"
                    >
                        Cover Image
                    </label>
                    <input
                        type="file"
                        {...register("cover_img", { required: true })}
                        id="cover_img"
                        className="input input-bordered w-full pr-20" // Add right padding for image space
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setPreviewImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    {errors.cover_img && (
                        <p className="text-red-500 text-sm">
                            Cover image is required.
                        </p>
                    )}

                    {previewImage && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 mt-5">
                            <div className="relative">
                                <img
                                    src={previewImage}
                                    alt="Cover Preview"
                                    className="w-10 h-10  object-cover"
                                />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        (
                                            document.getElementById(
                                                "cover_img"
                                            ) as HTMLInputElement
                                        ).value = "";
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* {previewImage && (
                    <div className="relative ">
                        <img
                            src={previewImage}
                            alt="Cover Preview"
                            className="!w-20 !h-20 mt-4 rounded-l flex justify-end" // Adjusted width and height
                        />
                        <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white p-1" // Adjusted padding for bigger button
                            onClick={() => {
                                setPreviewImage(null);
                                (
                                    document.getElementById(
                                        "cover_img"
                                    ) as HTMLInputElement
                                ).value = "";
                            }}
                        >
                            &times;
                        </button>
                    </div>
                )} */}
                {/* <div>
                    <label
                        htmlFor="cover_img"
                        className="block text-sm font-medium"
                    >
                        Cover Image
                    </label>
                    <input
                        type="file"
                        {...register("cover_img", { required: true })}
                        id="cover_img"
                        className="input input-bordered w-full"
                        accept="image/*"
                    />
                    {errors.cover_img && (
                        <p className="text-red-500 text-sm">
                            Cover image is required.
                        </p>
                    )}
                </div> */}

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

                {/* Genres checkboxes */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Genres</label>
                    {genres.length > 0 ? (
                        genres.map((genre, index) => (
                            <div
                                key={genre.genre_id}
                                className={`flex items-center space-x-2 ${
                                    index === 0 ||
                                    index === 1 ||
                                    index === 2 ||
                                    index === 4 ||
                                    index === 6
                                        ? "hidden"
                                        : ""
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    id={`genre_${genre.genre_id}`}
                                    value={genre.genre_id}
                                    checked={selectedGenres.includes(
                                        genre.genre_id
                                    )}
                                    onChange={() =>
                                        handleGenreChange(genre.genre_id)
                                    }
                                />
                                <label htmlFor={`genre_${genre.genre_id}`}>
                                    {genre.genre_name}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>Loading genres...</p>
                    )}
                </div>

                <div>
                    <button type="submit" className="btn btn-primary w-full">
                        Add Book
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBooks;
