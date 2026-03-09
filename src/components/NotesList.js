import Note from './Note';
import AddNote from './AddNote';

const NotesList = ({
	notes,
	handleAddNote,
	handleDeleteNote,
	handleEditNote,
	handleReadNote,
	handlePinNote,
}) => {
	return (
		<div className='notes-list'>
			<AddNote handleAddNote={handleAddNote} />
			{notes.map((note) => (
				<Note
					key={note.id}
					id={note.id}
					title={note.title}
					text={note.text}
					date={note.date}
					isPinned={note.is_pinned}
					handleDeleteNote={handleDeleteNote}
					handleEditNote={handleEditNote}
					handleReadNote={handleReadNote}
					handlePinNote={handlePinNote}
				/>
			))}
		</div>
	);
};

export default NotesList;
