import React from "react";
import { useDeleteNotesMutation } from "../redux/crm";
import { toast, ToastContainer } from "react-toastify";

type NotesCardProps = {
  title: string;
  content: string;
  date: string;
  onEdit?: () => void;
  id:string
};

const NotesCard: React.FC<NotesCardProps> = ({
  title,
  content,
  date,
  onEdit,
  id
}) => {
const [deleteNotes, {isLoading}] = useDeleteNotesMutation()

const onDelete = ()=>{
    deleteNotes(id).then((resp)=>{
        const data = resp.data
        if(data && data.status === 200){
            toast.success("Deleted");

        }
    }).catch((err)=>{
        console.log(err)
        toast.error("Try again !!!")
    })
}

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 hover:shadow-md transition-all">
      <ToastContainer/>
      <div className="flex justify-between items-center gap-3 mb-2  ">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{content}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
        >
         { isLoading? "Loading..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default NotesCard;
