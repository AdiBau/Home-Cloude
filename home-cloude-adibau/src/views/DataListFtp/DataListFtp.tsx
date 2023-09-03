import React, { useContext, useRef, useState } from "react";
import useLongPress from "../../helpFunction/longPress";

import { Adress } from "../../helpFunction/homeOrSerwer";
import { readList, sortData, pathPwd, adresPath } from "../../helpFunction/helpFunction";
import { ContextHome } from "../../contextHomeCloude/contextHome";

import { RemoveButton } from "./RemoveButton/RemoveButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";

import "./DataListFtp.css";
interface Position {
	x: number | string;
	y: number;
}

export const DataListFtp = () => {
	const [longPressed, setLongPressed] = useState<boolean>(false);
	const [position, setPosition] = useState<Position>({ x: "15%", y: 0 });
	const [removeItem, setRemoveItem] = useState<string>("");

	const context = useContext(ContextHome);
	const linkA = useRef<HTMLAnchorElement>(null);

	if (!context) return null;
	const { connect, data, setData, setLoading, setReload, reload } = context;

	const onLongPress = (e: any) => {
		// if()
		console.log(e.type);
		setLongPressed(true);
		document.querySelector(".selected")?.classList.remove("selected");
		if (e.target.innerText.indexOf(".") === -1) return;
		if (adresPath.path !== "cloude://") {
			if (removeItem === e.target.innerText) {
				setLongPressed(false);
				setRemoveItem("");
				return;
			}
			if (e.target.className === "list-item") {
				e.target?.classList.toggle("selected");

				setRemoveItem(e.target.innerText);
			} else {
				setRemoveItem(e.target.innerText);
				e.target.parentElement?.classList.toggle("selected");
			}
			console.log(e.target.offsetTop);
			setPosition((prev) => ({ ...prev, y: e.target.offsetTop }));
			setLongPressed(true);
		}
	};

	const onClick = (e: any) => {
		console.log("click");
		if (longPressed === false) {
			if (e.target?.innerText !== undefined) {
				goInFile(e.target.innerText);
			}
		}
	};
	const onGuzik = (e: any) => {};

	const defaultOptions = {
		shouldPreventDefault: true,
		delay: 500,
	};
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const longPressEvent = useLongPress(onLongPress, onGuzik, onClick, defaultOptions);

	const goInFile = async (name: string) => {
		if (longPressed) return;
		setLoading(true);
		if (name.indexOf(".") === -1) {
			try {
				const goIn = await fetch(`${Adress.readOne}/${name}`);
				if (goIn.status === 200) {
					await pathPwd();
					setData(await sortData(await readList()));
					setLoading(false);
				}
			} catch (error) {
			} finally {
				setLoading(false);
			}
		} else {
			await getFile(name);
		}
	};

	const getFile = async (name: string) => {
		setLoading(true);
		if (name.indexOf(".") !== -1) {
			if (!linkA.current) return;
			linkA.current.setAttribute("href", `${Adress.getOne}/${name}`);
			linkA.current.click();
		}
		setLoading(false);
	};
	const removeFile = async (): Promise<void> => {
		const data = await fetch(Adress.removeFile + removeItem, {
			method: "DELETE",
		});
		if (data.status === 200) {
			toast.success(`Pomyślnie usunięto plik ${removeItem}`);
		}
		toast.error(`Błąd przy usuwaniu pliku ${removeItem}`);
		setRemoveItem("");
		setLongPressed(false);
		setReload(!reload);
	};

	return (
		<>
			<a href="https://getMy.pl" ref={linkA} style={{ display: "none" }}>
				DISPLAYNONE
			</a>

			<div className="list">
				{data.length === 1 && connect && (
					<div className="list-item">
						<p></p>
						<p>. . . Brak plików do wyświetlenia . . .</p>
					</div>
				)}
				<div className="MenuPath">{adresPath.path}</div>

				{data.map((e, i) => {
					if (i === data.length - 1) {
						return null;
					}

					let icon;
					const index = e.name.indexOf(".");
					let fileType = "";
					if (index !== -1 && index !== 0) {
						fileType = e.name.slice(index + 1, e.name.length).toLowerCase();
					} else {
						fileType = "folder";
					}
					try {
						icon = require(`../../assets/${fileType}.png`);
					} catch (error) {
						icon = require(`../../assets/unknow.png`);
					}

					return (
						<div className="list-item" key={e.name} {...longPressEvent}>
							<div className="img">
								<img src={icon} alt={`icon Logo ${icon}`} />
							</div>
							<p className="list-item-data">{e.name}</p>
							{e.size > 0 ? <FontAwesomeIcon icon="cloud-arrow-down" size="lg" onClick={() => goInFile(e.name)} /> : null}

							<p className="size">
								{e.size > 0 &&
									(e.size / 1024 < 1
										? (e.size / 1024).toFixed(2) + "KB"
										: e.size / 1024 / 1024 > 1024
										? (e.size / 1024 / 1024 / 1024).toFixed(2) + "GB"
										: (e.size / 1024 / 1024).toFixed(2) + " MB")}
							</p>
						</div>
					);
				})}
			</div>
			{longPressed && <RemoveButton removeFile={removeFile} position={position} item={removeItem} />}
		</>
	);
};
