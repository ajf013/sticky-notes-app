import React from "react";
import { Button } from 'semantic-ui-react';
import { supabase } from '../supabaseClient';

const Header = ({ session }) => {
	const handleLogout = async () => {
		await supabase.auth.signOut();
	}

	return (
		<div className='header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			<h1>Sticky Notes</h1>
			{session && (
				<Button color="red" onClick={handleLogout}>
					Logout
				</Button>
			)}
		</div>
	);
};

export default Header;