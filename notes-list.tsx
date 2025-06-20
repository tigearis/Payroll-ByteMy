// components/notes-list.tsx
interface NotesListProps {
    notes: string[];
  }
  
  export default function NotesList({ notes }: NotesListProps) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-2">Notes</h3>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <p key={index} className="text-sm text-gray-700 mb-2">
              - {note}
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-500">No notes available.</p>
        )}
      </div>
    );
  }
  