import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Segment, Button, Table } from 'semantic-ui-react';

const PendingRequests = ({ session }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        try {
            // Fetch requests where the associated note belongs to the current user and status is pending
            const { data, error } = await supabase
                .from('edit_requests')
                .select(`
                    id, 
                    requester_email, 
                    status, 
                    created_at,
                    notes!inner ( id, title, user_id )
                `)
                .eq('status', 'pending')
                .eq('notes.user_id', session.user.id);

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching edit requests:', error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            fetchRequests();
        }
    }, [session, fetchRequests]);
    const handleAction = async (requestId, action) => {
        try {
            const { error } = await supabase
                .from('edit_requests')
                .update({ status: action })
                .eq('id', requestId);

            if (error) throw error;
            // Remove the request from the list after acting on it
            setRequests(requests.filter(req => req.id !== requestId));
        } catch (error) {
            console.error(`Error updating request to ${action}:`, error);
        }
    };

    if (loading || requests.length === 0) {
        return null; // Don't render anything if no pending requests
    }

    return (
        <Segment style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'black' }}>Pending Edit Requests</h3>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Note Title</Table.HeaderCell>
                        <Table.HeaderCell>Requester</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {requests.map(req => (
                        <Table.Row key={req.id}>
                            <Table.Cell>{req.notes.title || 'Untitled Note'}</Table.Cell>
                            <Table.Cell>{req.requester_email}</Table.Cell>
                            <Table.Cell>{new Date(req.created_at).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>
                                <Button color='green' size='small' onClick={() => handleAction(req.id, 'approved')}>Approve</Button>
                                <Button color='red' size='small' onClick={() => handleAction(req.id, 'rejected')}>Reject</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Segment>
    );
};

export default PendingRequests;
