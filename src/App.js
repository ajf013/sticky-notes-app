import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import NoteContent from './components/NoteContent';
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
import SplashScreen from './components/SplashScreen';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SharedNote from './components/SharedNote';
import PendingRequests from './components/PendingRequests';

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
	const [isLoading, setIsLoading] = useState(false);

	const [theme, toggleTheme] = useDarkMode();
	const themeMode = theme === 'light' ? lightTheme : darkTheme;

	const fetchNotes = useCallback(async () => {
		if (!session?.user?.id) return;
		
		setIsLoading(true);
		try {
			const { data, error } = await supabase
				.from('notes')
				.select('*')
				.eq('user_id', session.user.id)
				.order('date', { ascending: false });

			if (error) throw error;
			if (data) {
				const mappedData = data.map(note => {
					const timestampStr = note.created_at || note.inserted_at || note.date;
					if (timestampStr && (timestampStr.includes('T') || timestampStr.includes('-'))) {
						const localDate = new Date(timestampStr);
						if (!isNaN(localDate)) {
							note.date = localDate.toLocaleString([], {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							});
						} else {
							note.date = note.date || timestampStr;
						}
					} else {
						note.date = note.date || timestampStr;
					}
					return note;
				});
				setNotes(mappedData);
			}
		} catch (error) {
			console.error("Error fetching notes: ", error.message);
		} finally {
			setIsLoading(false);
		}
	}, [session]);

	useEffect(() => {
		AOS.init({ duration: 2000 });

		const currentSession = supabase.auth.session();
		setSession(currentSession);

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
			}
		);

		// Real-time synchronization for notes (Supabase v1 syntax)
		let subscription;
		if (currentSession?.user?.id) {
			subscription = supabase
				.from('notes')
				.on('*', () => {
					fetchNotes();
				})
				.subscribe();
		}

		return () => {
			authListener.unsubscribe();
			if (subscription) {
				supabase.removeSubscription(subscription);
			}
		};
	}, [fetchNotes]);

	useEffect(() => {
		if (session) {
			fetchNotes();
		} else {
			setNotes([]);
			setIsLoading(false);
		}
	}, [session, fetchNotes]);

	const addNote = async (title, text) => {
		const date = new Date().toISOString();
		try {
			const { data, error } = await supabase
				.from('notes')
				.insert([
					{ title: title, text: text, date: date, user_id: session.user.id }
				])
				.select();

			if (error) throw error;
			if (data && data.length > 0) {
				const newNote = data[0];
				if (newNote.date) {
					newNote.date = new Date(newNote.date).toLocaleString([], {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					});
				}
				setNotes([newNote, ...notes]);
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

	const handlePinNote = async (id, isPinned) => {
		try {
			const { data, error } = await supabase
				.from('notes')
				.update({ is_pinned: isPinned })
				.eq('id', id)
				.select();

			if (error) throw error;
			if (data && data.length > 0) {
				setNotes(notes.map(note => note.id === id ? data[0] : note));
			}
		} catch (error) {
			console.error("Error pinning note: ", error.message);
		}
	};

	return (
		<ThemeProvider theme={themeMode}>
			<GlobalStyles />
			<Router>
				{showSplash ? (
					<SplashScreen onComplete={() => setShowSplash(false)} theme={theme} />
				) : (
					<div className='container'>
						<Switch>
							<Route exact path="/note/:id">
								<SharedNote />
							</Route>
							<Route path="/">
								{!session ? (
									<Auth />
								) : (
									<>
										<Header session={session} onRefresh={fetchNotes} />
										<Search handleSearchNote={setSearchText} />
										<PendingRequests session={session} />
										<NotesList
											notes={notes
												.filter((note) =>
													note.text.toLowerCase().includes(searchText) ||
													(note.title && note.title.toLowerCase().includes(searchText))
												)
												.sort((a, b) => {
													if (a.is_pinned && !b.is_pinned) return -1;
													if (!a.is_pinned && b.is_pinned) return 1;
													return 0;
												})
											}
											isLoading={isLoading}
											handleAddNote={addNote}
											handleDeleteNote={deleteNote}
											handleEditNote={editNote}
											handleReadNote={setSelectedNote}
											handlePinNote={handlePinNote}
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
												<NoteContent
													html={selectedNote?.text}
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
							</Route>
						</Switch>
						<Footer />
					</div>
				)}
			</Router>
		</ThemeProvider>
	);
};

export default App;