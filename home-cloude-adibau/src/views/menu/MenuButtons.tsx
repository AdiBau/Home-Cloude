import React, { useContext, useRef, useState } from "react";

import { homeOrSerwer } from "../../helpFunction/homeOrSerwer";
import { ContextHome } from "../../contextHomeCloude/contextHome";
import { adresPath } from "../../helpFunction/helpFunction";
import { toast } from "react-toastify";
import { FormsNewFolder } from "./FormsNewFolder/FormsNewFolder";

export const MenuButtons = () => {
	const [newFolder, setNewFolder] = useState<boolean>(false);

	const openInput = useRef<HTMLInputElement>(null);

	let url = homeOrSerwer ? "http://192.168.1.123:8000/ftp/" : "https://biuro.adibau.pl/ftp/";

	const context = useContext(ContextHome);

	if (!context) return null;
	const { connect, setLoading, setReload, reload } = context;

	const openInputSelectedFileHandler = async () => {
		if (!connect || adresPath.path === "cloude://") {
			return;
		}

		const formData = new FormData();
		setLoading(true);
		if (!openInput.current) {
			return;
		}
		if (!openInput.current.files) {
			return;
		}
		const file = await openInput.current.files[0];

		const fileName = file.name;
		const fileType = file.type;

		console.log(file);
		console.log(fileName, fileType, fileName);

		formData.append("file", file, fileName);

		try {
			const data = await fetch(`${url}plik`, {
				method: "post",
				body: formData,
			});
			if (data.status === 201) {
				setReload(!reload);
				toast.success(`Plik :  ${fileName} Pomyślnie zapisany`);
			} else {
				toast.error(`Plik :  ${fileName} NIE ZOSTAŁ ZAPISANY`);
			}
			toast.error(`Plik :  ${fileName} NIE ZOSTAŁ ZAPISANY`);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};
	const goBack = async () => {
		try {
			setLoading(true);
			await fetch(`${url}listGoBack`);
			setReload(!reload);
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={"buttonsNavigation"}>
			<input type="file" className="openInput" ref={openInput} onChange={openInputSelectedFileHandler}></input>
			<button className="button menuButton" onClick={() => openInput.current?.click()}>
				Zapisz plik
			</button>
			<button className="button menuButton" onClick={goBack}>
				WSTECZ{" "}
			</button>
			<button className="button menuButton" onClick={() => setNewFolder(true)}>
				Nowy Folder
			</button>
			{newFolder && <FormsNewFolder setNewFolder={setNewFolder} />}
		</div>
	);
};
