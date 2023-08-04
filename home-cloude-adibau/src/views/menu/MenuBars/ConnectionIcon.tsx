import React, {useContext, useRef} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {ContextHome, ContextOptionsFTP} from "../../../contextHomeCloude/contextHome";
import {homeOrSerwer} from "../../../helpFunction/homeOrSerwer";
import {toast} from "react-toastify";

export const MenuConectionIcon = () => {
	const contextFTP= useContext(ContextOptionsFTP);
	const context= useContext(ContextHome);
	
	
	if (!contextFTP) return null;
	const {options} = contextFTP;
	
	if (!context) return null;
	const {connect, setConnect, setLoading,setReload,reload} = context;
	
	let url = homeOrSerwer ? 'http://192.168.1.123:8000/ftp/' : 'https://biuro.adibau.pl/ftp/';
	const connectFtp = async () => {
		
		url = url + (connect ? 'disconnect' : 'connect');
		const dataOptions = JSON.stringify(options);
		try {
			setLoading(true);
			const conn = await fetch(url, { headers: { ftpOptions: dataOptions } });
			if (conn.status === 200) {
				toast.success(`Poprawnie ${connect ? 'Wylogowano' : 'Zalogowano' }`)
				
				setConnect(!connect)
				setReload(!reload)

				} else {
					setConnect(false);
				toast.error('Brak połączenia z serwerem. Wprowadź parametry');
				}
		} catch (error) {
	toast.error('Brak połączenia z serwerem. Try again later');
	
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<div className='MenuConnect' onClick={connectFtp}>
				{connect ? <FontAwesomeIcon icon='plug' beat size='xl' /> : <FontAwesomeIcon icon='plug-circle-xmark' color='white' size='xl' />}
		</div>
	);
};


