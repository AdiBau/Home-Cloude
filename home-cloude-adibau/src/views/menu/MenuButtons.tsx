import React, {useContext, useRef} from "react";

import { homeOrSerwer } from "../../helpFunction/homeOrSerwer";
import {ContextHome, ContextOptionsFTP} from "../../contextHomeCloude/contextHome";
import {adresPath} from "../../helpFunction/helpFunction";
import {toast} from "react-toastify";

 export const MenuButtons = () => {
	 const openInput = useRef<HTMLInputElement>(null)
	 
 	let url = homeOrSerwer ? "http://192.168.1.123:8000/ftp/" : "https://biuro.adibau.pl/ftp/";
	 const contextFTP= useContext(ContextOptionsFTP);
	 const context= useContext(ContextHome);
	
	
	 if (!contextFTP) return null;
	 const {options} = contextFTP;
	
	 if (!context) return null;
	 const {connect, setConnect, setLoading,setReload,reload} = context;
	
	 const openInputSelectedFileHandler = async () => {
		 if (!connect || adresPath.path === 'cloude://') {
			 return ;
		 }
		
		 const formData = new FormData();
		 setLoading(true);
		 if(!openInput.current) {
			 return
		 }
		 if(!openInput.current.files) {
		 return
		 }
			 const file = await openInput.current.files[0];
		 
		 const fileName = file.name;
		 const fileType = file.type;
		
		 console.log(file);
		 console.log(fileName, fileType, fileName);
		
		 formData.append('file', file, fileName);
		
		 try {
			 const data = await fetch(`${url}plik`, {
				 method: 'post',
				 body: formData,
			 });
			 if (data.status === 201) {
				 setReload(!reload);
				 toast.success(`Plik :  ${fileName} Pomyślnie zapisany`);
			 } else {
				 toast.error(`Plik :  ${fileName} NIE ZOSTAŁ ZAPISANY`);
			 }
			 toast.error(`Plik :  ${fileName} NIE ZOSTAŁ ZAPISANY`);
		 } catch (error) {}
		finally {
			 setLoading(false);
			 
		 }
	 };
	 const goBack = async () => {
 		try {
			 setLoading(true)
 			await fetch(`${url}listGoBack`);
 			setReload(!reload);
		} catch (error) {}
		finally {
			setLoading(false)
		}
 	};
	
	 const CreateNewFolder = async (e: HTMLFormElement) => {
		 // e.preventDefault();
		 // if (!inputNewFolderValue) {
			//  return setButtonNewFolderClick(false);
		 // }
		 //
		 // if (inputNewFolderValue.includes('.')) {
			//  return toast.error('Wprowadź nazwe bez kropki');
		 // }
		 // try {
			//  await fetch(`${url}newfolder/${inputNewFolderValue}`, { method: 'put' });
			//  toast.success(`Folder o nazwie ${inputNewFolderValue} stworzony`);
			//  await listAll();
		 // } catch (error) {
			//  console.log(error);
		 // }
		 // setButtonNewFolderClick(false);
		 // setInputNewFolderValue('');
	 };
	 
	return (
		<>
			<input type="file" className="openInput" ref={openInput} onChange={openInputSelectedFileHandler}></input>
			<button className="button menuButton" onClick={() => openInput.current?.click()}>
				Zapisz
			</button>
			<button className="button menuButton" onClick={goBack}>
			WSTECZ{" "}
			</button>
			<button className="button menuButton" onClick={() => CreateNewFolder}>
			Nowy Folder
			</button>
	</>
 	);
 };
