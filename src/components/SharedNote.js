import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import DOMPurify from 'dompurify';
import { Container, Segment, Button } from 'semantic-ui-react';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SharedNote = () => {
    const { id } = useParams();
    const query = useQuery();
    const access = query.get('access') || 'view';

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html, {
                ADD_CLASSES: {
                    '*': ['ql-syntax', 'ql-clipboard']
                },
                ADD_ATTR: ['spellcheck', 'data-language', 'class']
            })
        }
    }

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
                    <h1 style={{ margin: 0, color: 'black' }}>{note.title || 'Untitled Note'}</h1>
                    <div>
                        <span style={{ color: '#666', marginRight: '1rem' }}>{note.date}</span>
                        <Button basic size="small" onClick={() => window.location.href = '/'}>App Home</Button>
                    </div>
                </div>

                {access === 'edit' && (
                    <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', border: '1px solid #ffeeba' }}>
                        <strong>Note:</strong> You have been granted edit access. (Feature coming soon - currently view only)
                    </div>
                )}

                <div
                    dangerouslySetInnerHTML={createMarkup(note.text)}
                    style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        minHeight: '200px',
                        color: 'black'
                    }}
                />
            </Segment>
        </Container>
    );
};

export default SharedNote;
