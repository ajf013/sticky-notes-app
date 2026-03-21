import Note from './Note';
import AddNote from './AddNote';
import { Loader } from 'semantic-ui-react';

const NotesList = ({
	notes,
	isLoading,
	handleAddNote,
	handleDeleteNote,
	handleEditNote,
	handleReadNote,
	handlePinNote,
}) => {
	return (
		<div className='notes-list'>
			<AddNote handleAddNote={handleAddNote} />
			{isLoading ? (
				<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
					<Loader active inline='centered' size='large'>Loading your notes...</Loader>
				</div>
			) : (
				notes.map((note) => (
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
				))
			)}
		</div>
	);
};

export default NotesList;
