'use client'
import { BooksResponse } from "@/types";

export const fetchBooks = async (page: number, genre: number): Promise<BooksResponse> => {
    const limit = 10;
    const offset = (page - 1) * limit;

    const url = `http://localhost:8000/api/books?offset=${offset}&limit=${limit}&genre=${genre}`;

    const response = await fetch(url, {
        method: "GET",
        cache: "no-cache",
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const data: BooksResponse = await response.json();
    return data;
};


export const fetchGenres = async (limit: number, offset: number) => {
    const url = `http://localhost:8000/api/genres?limit=${limit}&offset=${offset}`;

    const response = await fetch(url, {
        method: "GET",
        cache: "no-cache",
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};
