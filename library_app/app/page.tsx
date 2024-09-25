"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { fetchGenres } from "@/utils/requests";
import MostRecentBooks from "@/components/MostRecent";
import MostLikedBooks from "@/components/MostLiked";
import BookContainer from "@/components/BookContainer";
import type { TGenre } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

const Page = () => {
    const [genres, setGenres] = useState<TGenre[]>([]);
    const [genrePage, setGenrePage] = useState(1);
    const [hasMoreGenres, setHasMoreGenres] = useState(true);
    const [loadingGenres, setLoadingGenres] = useState(false);
    const initialLoadDone = useRef(false);

    const loadGenres = useCallback(
        async (isInitialLoad: boolean = false) => {
            if (loadingGenres || (!hasMoreGenres && !isInitialLoad)) return;

            setLoadingGenres(true);
            const limit = 5;
            const offset = isInitialLoad ? 0 : genres.length;

            try {
                const { genres: newGenres, hasMoreGenres: moreGenres } =
                    await fetchGenres(limit, offset);
                setGenres((prevGenres) => [...prevGenres, ...newGenres]);
                setHasMoreGenres(moreGenres);
                if (!isInitialLoad) {
                    setGenrePage((prevPage) => prevPage + 1);
                }
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            } finally {
                setLoadingGenres(false);
            }
        },
        [genres.length, hasMoreGenres, loadingGenres]
    );

    useEffect(() => {
        if (!initialLoadDone.current) {
            loadGenres(true);
            initialLoadDone.current = true;
        }
    }, [loadGenres]);

    return (
        <div>
            <MostRecentBooks />
            <MostLikedBooks />
            {genres.map((genre) => (
                <BookContainer
                    key={genre.genre_id}
                    genre_id={genre.genre_id}
                    genre={genre.genre_name}
                />
            ))}

            {hasMoreGenres && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                        className="btn text-center mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => loadGenres()}
                        disabled={loadingGenres}
                    >
                        {loadingGenres ? (
                            <LoadingSpinner />
                        ) : (
                            "Load More Genres"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Page;
