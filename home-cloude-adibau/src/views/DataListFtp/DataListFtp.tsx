import React, {useContext, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DataListFtp.css';
// import { useLongPress } from 'use-long-press';
import { homeOrSerwer } from '../../helpFunction/homeOrSerwer';
import { readList, sortData, pathPwd } from '../../helpFunction/helpFunction';
import {ContextHome} from "../../contextHomeCloude/contextHome";

export const DataListFtp = () => {
	let url = homeOrSerwer ? 'http://192.168.1.123:8000/ftp/' : 'https://biuro.adibau.pl/ftp/';


	const context= useContext(ContextHome);
	const linkA = useRef<HTMLAnchorElement>(null);
	
	
	
	if (!context) return null;
	const {connect,data, setData, setLoading} = context;
	console.log(data)
	//
	// const bind = useLongPress(() => {
	// 	console.log('Long pressed!');
	// });
	
	const goInFile = async (name:string) => {
		setLoading(true);
		if (name.indexOf('.') === -1) {
			try {
				url += 'list/GoIn/' + name;
				const goIn = await fetch(url);
				if (goIn.status === 200) {
					setData(await sortData(await readList()));
					await pathPwd();
				}
			} catch (error) {}
		} else {
			await getFile(name);
		}
		setLoading(false);
	};
	
	const getFile = async (name: string) => {
		setLoading(true);
		if (name.indexOf('.') !== -1) {
			if(!linkA.current) return
			linkA.current.setAttribute('href', `${url}listGetOne/${name}`);
			linkA.current.click();
		}
		setLoading(false);
	};
	
	return (
		<>
			<a href='https://getMy.pl' ref={linkA} style={{ display: 'none' }}>
				DISPLAYNONE
			</a>
			{console.log(data.length)}
			<div className='list'>
				
				
				{data.length === 1 && connect &&(
					<div className='list-item'>
						<p></p>
						<p>. . . Brak plików do wyświetlenia . . .</p>
					</div>
				)}
				
				{data.map((e, i) => {
					if (i === data.length - 1) {
						return null;
					}
					
					let icon;
					const index = e.name.indexOf('.');
					let fileType = '';
					if (index !== -1 && index !== 0) {
						fileType = e.name.slice(index + 1, e.name.length).toLowerCase();
					} else {
						fileType = 'folder';
					}
					try {
						icon = (`../../assets/${fileType}.png`);
					} catch (error) {
						icon = (`../../assets/unknow.png`);
					}
					
					return (
						<div className='list-item' key={i}>
							<div className='img'>
								<img src={icon} alt={`icon Logo ${icon}`} onClick={() => goInFile(e.name)} />
							</div>
							<p onClick={() => goInFile(e.name)}>
								{e.name}
							</p>
							{e.size > 0 && <FontAwesomeIcon icon='cloud-arrow-down' size='1x' onClick={() => getFile(e.name)} />}
							<p className='size'>{e.size > 0 && (e.size / 1000000).toFixed(2) + ' Mb'}</p>
						</div>
					);
				})}
			</div>
		</>
	);
};
