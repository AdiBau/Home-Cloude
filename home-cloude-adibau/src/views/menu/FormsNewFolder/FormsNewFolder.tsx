import React, { useState, useContext, SyntheticEvent } from "react";

import { toast } from "react-toastify";
import { homeOrSerwer } from "../../../helpFunction/homeOrSerwer";
import { ContextHome } from "../../../contextHomeCloude/contextHome";
import "./FormNewFolder.css";

interface Props {
	setNewFolder: (e: boolean) => void;
}

export const FormsNewFolder = (props: Props) => {
	const { setNewFolder } = props;
	const [inputNewFolderValue, setInputNewFolderValue] = useState<string>("");

	const context = useContext(ContextHome);
	if (!context) return null;

	const { setReload, reload } = context;

	let url = homeOrSerwer ? "http://192.168.1.123:8000/ftp/" : "https://biuro.adibau.pl/ftp/";

	const CreateNewFolder = async (e: SyntheticEvent) => {
		e.preventDefault();
		if (!inputNewFolderValue) {
			return setNewFolder(false);
		}

		if (inputNewFolderValue.includes(".")) {
			return toast.error("Wprowadź nazwe bez kropki");
		}
		try {
			await fetch(`${url}newfolder/${inputNewFolderValue}`, { method: "put" });
			toast.success(`Folder o nazwie ${inputNewFolderValue} stworzony`);
			setReload(!reload);
		} catch (error) {
			console.log(error);
		}
		setNewFolder(false);
		setInputNewFolderValue("");
	};

	return (
		<>
			<form className="formNewFolder" onSubmit={CreateNewFolder}>
				<label>Podaj nazwe folderu</label>
				<input type="text" value={inputNewFolderValue} onChange={(e) => setInputNewFolderValue(e.currentTarget.value)} autoFocus />
				<div className="buttonsNewFolder">
					<button type="submit" onClick={() => setNewFolder(false)}>
						- Anuluj -
					</button>
					<button type="submit" onClick={CreateNewFolder}>
						- OK -
					</button>
				</div>
			</form>
		</>
	);
};
