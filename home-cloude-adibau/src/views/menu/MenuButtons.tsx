import React, { useContext, useRef, useState } from "react";

import { Adress } from "../../helpFunction/homeOrSerwer";
import { ContextHome } from "../../contextHomeCloude/contextHome";
import { adresPath } from "../../helpFunction/helpFunction";
import { toast } from "react-toastify";
import { FormsNewFolder } from "./FormsNewFolder/FormsNewFolder";

export const MenuButtons = () => {
	const [newFolder, setNewFolder] = useState<boolean>(false);

	const openInput = useRef<HTMLInputElement>(null);

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

		formData.append("file", file, fileName);

		try {
			const data = await fetch(Adress.send, {
				method: "post",
				body: formData,
			});
			if (data.status === 201) {
				toast.success(`Plik :  ${fileName} Pomyślnie zapisany`);
			} else {
				toast.error(`Plik :  ${fileName} NIE ZOSTAŁ ZAPISANY`);
			}
		} catch (error) {
			toast.error(`Plik :  ${fileName} NIE ZOSTAŁ ZAPISANY`);
		} finally {
			setLoading(false);
			setReload(!reload);
		}
	};
	const goBack = async () => {
		try {
			setLoading(true);
			await fetch(`${Adress.back}`);
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
				Save file
			</button>
			<button className="button menuButton" onClick={goBack}>
				Back
			</button>
			<button className="button menuButton" onClick={() => setNewFolder(true)}>
				New folder
			</button>
			{newFolder && <FormsNewFolder setNewFolder={setNewFolder} />}
		</div>
	);
};
