import React, { useEffect, useState } from "react";
import AddNoteModal from "./AddNote";
import NotesCard from "./NotesCard";
import type { findandfileter, Notes, Pagination } from "../types";
import { useDeleteNotesMutation, useFindandFilterNotesQuery } from "../redux/crm";
import { toast } from "react-toastify";
import PaginationBtn from "./PaginationBtn";


const NotesComponent = ({client_id}:{client_id:string}) => {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [editNote, setEditNote] = useState<Notes | null>(null);
  const [notes, setNotes] = useState<Notes[] >([]);
  const [deleteNote, setdeleteNote] = useState<Notes | null>(null)

  const [paginationdata, setpaginationdata] = useState<Pagination>({
      page: 1,
      limit: 4,
      totalPages: 0,
      totalResults: 0,
    });
    const [filters, setfilters] = useState<findandfileter>({
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: "",
      match_values: {client_id},
    });
  
    const [deleteNoteData] = useDeleteNotesMutation();
    const { data, refetch } = useFindandFilterNotesQuery(filters);
    const [search, setSearch] = useState<string>("");
  
    useEffect(() => {
      if (data) {
        setNotes(data?.data.results || []);
         setpaginationdata({
          page: data.data.page || 0,
          limit: data.data.limit || 10,
          totalPages: data.data.totalPages || 0,
          totalResults: data.data.totalResults || 0,
        });
      }
    }, [data]);
  
     const nextPage = (page: number) => {
      setfilters((prev) => ({ ...prev, page }));
      refetch();
    };
    const filterandSearchProjects = (payload: findandfileter) => {
      setfilters(payload);
      refetch();
    };
  
    const handleDelete = () => {
      if (deleteNote) {
        deleteNoteData(deleteNote?._id as unknown as string)
          .then((resp) => {
            let status = resp.data?.status;
            if (status && status === 200) {
              toast.success("note deleted");
              setTimeout(() => {
                setdeleteNote(null);
              }, 1500);
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error("Try again..");
          });
      }
    };




  return (
    <div className="  flex items-center justify-center z-40">
      <div className=" w-full   ">
        {/* Notes Section */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800"></h3>
          <button
            onClick={() => setIsAddNoteOpen(true)}
            className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700"
          >
            + Add Note
          </button>
        </div>

        <div className=" flex gap-3   flex-wrap p-1">
          {notes.length === 0 ? (
            <p className="text-sm text-gray-500">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <NotesCard
                key={note._id}
                title={note.title}
                content={note.content}
                date={note.createdAt.split("T")[0] }
                onEdit={() => {
                  setEditNote(note);
                  setIsAddNoteOpen(true)
                }}
                id={note._id}
              />
            ))
          )}
        </div>
        <PaginationBtn paginationdata={paginationdata} setpaginationdata={setpaginationdata} refetch={nextPage} />

        {/* Nested Modal */}
        <AddNoteModal
          isOpen={isAddNoteOpen}
          onClose={() => {setIsAddNoteOpen(false)
            setEditNote(null)
          }}
          client_id={client_id}
          initialData={editNote}
        />
      </div>
    </div>
  );
};

export default NotesComponent;
