import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NoteContent from './NoteContent';
import { Container, Segment, Button, Form, Message } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import { MdEdit } from 'react-icons/md';
import 'react-quill/dist/quill.snow.css';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SharedNote = () => {
    const { id } = useParams();
    const query = useQuery();
    const urlAccess = query.get('access') || 'view';

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [requestState, setRequestState] = useState('initial'); // 'initial', 'checking', 'can_request', 'pending', 'approved', 'rejected'
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const { data, error } = await supabase
                    .from('notes')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    throw error;
                }

                if (data) {
                    setNote(data);
                    setEditText(data.text);
                }
            } catch (err) {
                console.error('Error fetching shared note:', err);
                setError('Could not load the note. It may have been deleted or the link is invalid.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNote();
        }
    }, [id]);


    const checkAccess = async () => {
        if (!email.trim() || !email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        setRequestState('checking');
        try {
            const { data, error } = await supabase
                .from('edit_requests')
                .select('*')
                .eq('note_id', id)
                .eq('requester_email', email.trim())
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (data && data.length > 0) {
                setRequestState(data[0].status);
            } else {
                setRequestState('can_request');
            }
        } catch (error) {
            console.error('Error checking access:', error);
            setRequestState('initial');
        }
    };

    const requestAccess = async () => {
        setRequestState('checking');
        try {
            const { error } = await supabase
                .from('edit_requests')
                .insert([
                    { note_id: id, requester_email: email.trim(), status: 'pending' }
                ]);

            if (error) throw error;
            setRequestState('pending');
        } catch (error) {
            console.error('Error requesting access:', error);
            setRequestState('can_request');
        }
    };

    const handleSaveNote = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('notes')
                .update({ text: editText })
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setNote({ ...note, text: editText });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'code-block',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];


    if (loading) {
        return (
            <Container style={{ marginTop: '5rem', textAlign: 'center' }}>
                <h2 style={{ color: 'white' }}>Loading Note...</h2>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ marginTop: '5rem', textAlign: 'center' }}>
                <Segment padded>
                    <h2 style={{ color: 'black' }}>Error</h2>
                    <p style={{ color: 'black' }}>{error}</p>
                    <Button primary onClick={() => window.location.href = '/'}>Go to Home</Button>
                </Segment>
            </Container>
        );
    }

    if (!note) {
        return (
            <Container style={{ marginTop: '5rem', textAlign: 'center' }}>
                <Segment padded>
                    <h2 style={{ color: 'black' }}>Note Not Found</h2>
                    <p style={{ color: 'black', marginBottom: '1.5rem' }}>Could not find this note. It may have been deleted, or you might need to adjust your Supabase privacy settings (Row Level Security) to allow public access.</p>
                    <Button primary onClick={() => window.location.href = '/'}>Go to Home</Button>
                </Segment>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <Segment style={{ padding: '2rem', color: 'black' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <div className="note-title-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h1 style={{ margin: 0, color: 'black' }}>{note.title || 'Untitled Note'}</h1>
                        {urlAccess === 'edit' && !isEditing && (
                            <MdEdit
                                className="title-edit-icon"
                                onClick={() => {
                                    setEditText(note.text);
                                    setIsEditing(true);
                                }}
                                style={{ cursor: 'pointer', opacity: 0.5 }}
                                title="Edit Note"
                            />
                        )}
                    </div>
                    <div>
                        <span style={{ color: '#666', marginRight: '1rem' }}>{note.date}</span>
                        <Button basic size="small" onClick={() => window.location.href = '/'}>App Home</Button>
                    </div>
                </div>

                {urlAccess === 'edit' && !isEditing && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                        <h4 style={{ color: 'black', marginTop: 0 }}>Edit Access</h4>

                        {requestState === 'initial' && (
                            <Form onSubmit={(e) => { e.preventDefault(); checkAccess(); }}>
                                <Form.Group inline>
                                    <Form.Input
                                        placeholder="Enter your email to edit"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ minWidth: '250px' }}
                                    />
                                    <Button primary type="submit">Verify / Request</Button>
                                </Form.Group>
                            </Form>
                        )}

                        {requestState === 'checking' && (
                            <p style={{ color: 'black' }}>Checking status...</p>
                        )}

                        {requestState === 'can_request' && (
                            <div>
                                <Message info>
                                    <Message.Header>Request Access</Message.Header>
                                    <p>You don't have access yet. Would you like to request edit access using the email <strong>{email}</strong>?</p>
                                </Message>
                                <Button primary onClick={requestAccess}>Request Access</Button>
                                <Button onClick={() => setRequestState('initial')}>Cancel</Button>
                            </div>
                        )}

                        {requestState === 'pending' && (
                            <Message warning>
                                <Message.Header>Request Pending</Message.Header>
                                <p>Your edit request for <strong>{email}</strong> is waiting for the author's approval.</p>
                                <Button size="small" onClick={() => setRequestState('initial')}>Use another email</Button>
                            </Message>
                        )}

                        {requestState === 'rejected' && (
                            <Message negative>
                                <Message.Header>Request Denied</Message.Header>
                                <p>Your edit request for <strong>{email}</strong> was rejected by the author.</p>
                                <Button size="small" onClick={() => setRequestState('initial')}>Use another email</Button>
                            </Message>
                        )}

                        {requestState === 'approved' && (
                            <Message positive>
                                <Message.Header>Access Granted</Message.Header>
                                <p>Your request is approved! You can now edit this note.</p>
                                <Button primary onClick={() => setIsEditing(true)}>Edit Note</Button>
                            </Message>
                        )}
                    </div>
                )}

                {isEditing ? (
                    <div>
                        <ReactQuill
                            theme="snow"
                            value={editText}
                            onChange={setEditText}
                            modules={modules}
                            formats={formats}
                            style={{
                                height: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginBottom: '20px'
                            }}
                        />
                        <div style={{ marginTop: '50px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setEditText(note.text);
                                setIsEditing(false);
                            }}>Cancel</Button>
                            <Button primary loading={saving} onClick={handleSaveNote}>Save Changes</Button>
                        </div>
                    </div>
                ) : (
                    <NoteContent
                        html={note.text}
                        style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            minHeight: '200px',
                            color: 'black'
                        }}
                    />
                )}
            </Segment>
        </Container>
    );
};

export default SharedNote;
