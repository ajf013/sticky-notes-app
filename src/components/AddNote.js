import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddNote = ({ handleAddNote }) => {
	const [noteText, setNoteText] = useState('');
	const [noteTitle, setNoteTitle] = useState('');

	const handleChange = (value) => {
		setNoteText(value);
	};

	const handleTitleChange = (event) => {
		setNoteTitle(event.target.value);
	};

	const handleSaveClick = () => {
		if (noteText.trim().length > 0) {
			handleAddNote(noteTitle, noteText);
			setNoteText('');
			setNoteTitle('');
		}
	};

	const modules = {
		toolbar: [
			[{ 'header': [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
			['link', 'image'],
			['clean']
		],
	};

	const formats = [
		'header',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image'
	];

	return (
		<div className='note new'>
			<input
				type='text'
				placeholder='Title (optional)...'
				value={noteTitle}
				onChange={handleTitleChange}
				style={{
					backgroundColor: 'transparent',
					border: 'none',
					borderBottom: '1px solid rgba(0,0,0,0.1)',
					width: '100%',
					marginBottom: '10px',
					padding: '5px',
					fontSize: '1.1em',
					fontWeight: 'bold',
					outline: 'none'
				}}
			/>
			<ReactQuill
				theme="snow"
				value={noteText}
				onChange={handleChange}
				modules={modules}
				formats={formats}
				placeholder='Type to add a note...'
				style={{
					height: '200px',
					display: 'flex',
					flexDirection: 'column',
					marginBottom: '10px'
				}}
			/>
			<div className='note-footer' style={{ marginTop: 'auto', paddingTop: '10px', touchAction: 'manipulation' }}>
				<button
					className='save'
					onClick={handleSaveClick}
					onMouseDown={(e) => { e.preventDefault(); handleSaveClick(); }}
					onTouchStart={(e) => { e.preventDefault(); handleSaveClick(); }}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default AddNote;
