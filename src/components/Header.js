import React, { useState } from "react";
import { Button, Icon } from 'semantic-ui-react';
import { supabase } from '../supabaseClient';

const Header = ({ session, onRefresh }) => {
	const [isSyncing, setIsSyncing] = useState(false);

	const handleLogout = async () => {
		const isConfirmed = window.confirm("Are you sure you want to logout?");
		if (isConfirmed) {
			await supabase.auth.signOut();
		}
	}

	const handleManualRefresh = async () => {
		setIsSyncing(true);
		try {
			if (onRefresh) await onRefresh();
			// Check for SW updates if available
			if ('serviceWorker' in navigator) {
				const registration = await navigator.serviceWorker.getRegistration();
				if (registration) {
					await registration.update();
					console.log("Service Worker updated manually");
				}
			}
			// Briefly show sync state before reload or just finish
			setTimeout(() => {
				setIsSyncing(false);
				// A soft reload to ensure PWA assets are fresh
				// On iOS PWA, this is the only way to "refresh"
				window.location.reload();
			}, 500);
		} catch (error) {
			console.error("Refresh failed", error);
			setIsSyncing(false);
		}
	}

	return (
		<div className='header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
			<h1>Sticky Notes</h1>
			{session && (
				<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
					<span className="user-email" style={{ fontWeight: 'bold' }}>{session.user.email}</span>
					<Button 
						circular 
						icon 
						loading={isSyncing} 
						onClick={handleManualRefresh}
						title="Sync Data & Check for Updates"
						style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'inherit' }}
					>
						<Icon name='sync' />
					</Button>
					<Button color="red" onClick={handleLogout}>
						Logout
					</Button>
				</div>
			)}
		</div>
	);
};

export default Header;