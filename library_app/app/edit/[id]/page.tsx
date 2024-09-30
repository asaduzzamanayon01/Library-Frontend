import EditBooks from "@/components/EditBooks";

const page = ({ params }: { params: { id: number } }) => {
    return (
        <div>
            <EditBooks bookId={params.id} />
        </div>
    );
};

export default page;
