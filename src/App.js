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
			if (data) setNotes(data);
		} catch (error) {
			console.error("Error fetching notes: ", error.message);
		}
	};

	const addNote = async (title, text) => {
		const date = new Date().toLocaleDateString();
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
								handleReadNote={setSelectedNote}
							/>
							<Modal
								open={!!selectedNote}
								onClose={() => setSelectedNote(null)}
								closeIcon
							>
								<Modal.Header>{selectedNote?.title || 'Note Details'}</Modal.Header>
								<Modal.Content scrolling>
									<Modal.Description>
										{selectedNote?.title && <h3 style={{ marginBottom: '1rem' }}>{selectedNote.title}</h3>}
										<div
											dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNote?.text) }}
											style={{ fontSize: '1.2rem', lineHeight: '1.5' }}
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