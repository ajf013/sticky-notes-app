import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import NotesList from './components/NotesList';
import Search from './components/Search';
import { Toggle } from './components/Toggle';
import { useDarkMode } from './styles/useDarkMode';
import { GlobalStyles, lightTheme, darkTheme } from './styles/globalStyles';
import styled, { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer/Footer';
import { Modal, Button } from 'semantic-ui-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import DOMPurify from 'dompurify';
import SplashScreen from './components/SplashScreen';

const Container = styled.div`
  max-width: 50%;
  margin: 8rem auto 0;
`;

const App = () => {
	const [showSplash, setShowSplash] = useState(true);
	const [session, setSession] = useState(null);
	const [notes, setNotes] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [selectedNote, setSelectedNote] = useState(null);

	const [theme, toggleTheme] = useDarkMode();
	const themeMode = theme === 'light' ? lightTheme : darkTheme;

	useEffect(() => {
		AOS.init({ duration: 2000 });

		const session = supabase.auth.session();
		setSession(session);

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
			}
		);

		return () => {
			authListener.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (session) {
			fetchNotes();
		} else {
			setNotes([]);
		}
	}, [session]);

	const fetchNotes = async () => {
		try {
			const { data, error } = await supabase
				.from('notes')
				.select('*')
				.order('date', { ascending: false });

			if (error) throw error;
			if (data) {
				const mappedData = data.map(note => {
					// Check for auto-generated Supabase creation timestamps
					const creationTime = note.created_at || note.inserted_at;

					// If the saved date string is just a date (no time), and the DB has the true creation time:
					if (creationTime && note.date && !note.date.includes(':')) {
						note.date = new Date(creationTime).toLocaleString([], {
							year: 'numeric', month: 'numeric', day: 'numeric',
							hour: '2-digit', minute: '2-digit'
						});
					}
					// Alternatively, if note.date IS a Postgres timestamp like "2026-03-08T12:00:00Z"
					else if (note.date && note.date.includes('T') && note.date.includes('Z')) {
						note.date = new Date(note.date).toLocaleString([], {
							year: 'numeric', month: 'numeric', day: 'numeric',
							hour: '2-digit', minute: '2-digit'
						});
					}
					return note;
				});
				setNotes(mappedData);
			}
		} catch (error) {
			console.error("Error fetching notes: ", error.message);
		}
	};

	const addNote = async (title, text) => {
		const date = new Date().toLocaleString([], {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
		try {
			const { data, error } = await supabase
				.from('notes')
				.insert([
					{ title: title, text: text, date: date, user_id: session.user.id }
				])
				.select();

			if (error) throw error;
			if (data && data.length > 0) {
				setNotes([data[0], ...notes]);
			}
		} catch (error) {
			console.error("Error adding note: ", error.message);
		}
	};

	const deleteNote = async (id) => {
		try {
			await supabase.from('notes').delete().eq('id', id);
			setNotes(notes.filter((note) => note.id !== id));
		} catch (error) {
			console.error("Error deleting note: ", error.message);
		}
	};

	const editNote = async (id, newTitle, newText) => {
		try {
			const { data, error } = await supabase
				.from('notes')
				.update({ title: newTitle, text: newText })
				.eq('id', id)
				.select();

			if (error) throw error;
			if (data && data.length > 0) {
				setNotes(notes.map(note => note.id === id ? data[0] : note));
			}
		} catch (error) {
			console.error("Error editing note: ", error.message);
		}
	};
	return (
		<ThemeProvider theme={themeMode}>
			<GlobalStyles />
			{showSplash ? (
				<SplashScreen onComplete={() => setShowSplash(false)} theme={theme} />
			) : (
				<div className='container'>
					{!session ? (
						<Auth />
					) : (
						<>
							<Header session={session} />
							<Search handleSearchNote={setSearchText} />
							<NotesList
								notes={notes.filter((note) =>
									note.text.toLowerCase().includes(searchText) ||
									(note.title && note.title.toLowerCase().includes(searchText))
								)}
								handleAddNote={addNote}
								handleDeleteNote={deleteNote}
								handleEditNote={editNote}
								handleReadNote={setSelectedNote}
							/>
							<Modal
								open={!!selectedNote}
								onClose={() => setSelectedNote(null)}
								closeIcon
								style={{ color: 'black' }}
							>
								<Modal.Header style={{ color: 'black' }}>{selectedNote?.title || 'Note Details'}</Modal.Header>
								<Modal.Content scrolling>
									<Modal.Description style={{ color: 'black' }}>
										{selectedNote?.title && <h3 style={{ marginBottom: '1rem', color: 'black' }}>{selectedNote.title}</h3>}
										<div
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(selectedNote?.text, {
													ADD_CLASSES: { '*': ['ql-syntax', 'ql-clipboard'] },
													ADD_ATTR: ['spellcheck', 'data-language', 'class']
												})
											}}
											style={{ fontSize: '1.2rem', lineHeight: '1.5', color: 'black' }}
										/>
										<p style={{ color: 'gray', marginTop: '1rem' }}>
											Date: {selectedNote?.date}
										</p>
									</Modal.Description>
								</Modal.Content>
								<Modal.Actions>
									<Button onClick={() => setSelectedNote(null)} primary>
										Close
									</Button>
								</Modal.Actions>
							</Modal>
							<Container>
								<Toggle theme={theme} toggleTheme={toggleTheme} />
							</Container>
						</>
					)}
					<Footer />
				</div>
			)}
		</ThemeProvider>
	);
};

export default App;