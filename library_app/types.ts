export type TBook =   {
    book_id: number;
    userId: number;
    title: string;
    rating: number;
    language: string;
    pages: number;
    publish_date: string;
    num_ratings: number;
    cover_img: string;
    price: number;
    author: string;
    description_text: string;
    publisher: string;
    like_count: number;
};

export type Genre = {
    id: number;
    genre_name: string;
}
export type BooksResponse = {
    books: TBook[];
    hasMoreBooks: boolean;
};

export type TypeResponse = {
    id: string;
    books: TBook[];
    hasMoreBooks: boolean;
    totalBooks : number
};


export interface BookInfo {
    user_id: number;
    book_id: number;
    title: string;
    cover_img: string | null;
    language: string;
}

export interface FetchedData {
    success: boolean;
    added_books: BookInfo[];
    username: string;
    liked_books: BookInfo[];
}

export interface TGenre {
    genre_id: number;
    genre_name: string;
}

export interface GenreResponse {
    genres: TGenre[];
    hasMoreGenres: boolean;
}
