"use client";
import BookDetails from "@/components/BookDetails";

export default function BookPage({ params }: { params: { id: number } }) {
    return (
        <div>
            <BookDetails bookId={params.id} />
        </div>
    );
}
