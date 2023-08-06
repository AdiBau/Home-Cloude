import React, { useContext, useRef, useState } from "react";

import "./DataListFtp.css";

import { Adress } from "../../helpFunction/homeOrSerwer";
import { readList, sortData, pathPwd, adresPath } from "../../helpFunction/helpFunction";
import { ContextHome } from "../../contextHomeCloude/contextHome";

export const DataListFtp = () => {
	const [longPressed, setLongPressed] = useState<boolean>(false);

	const context = useContext(ContextHome);
	const linkA = useRef<HTMLAnchorElement>(null);

	if (!context) return null;
	const { connect, data, setData, setLoading } = context;

	const goInFile = async (name: string) => {
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

	//longPress
	let tab = {
		jeden: 0,
		dwa: 0,
	};
	const moje = (a: HTMLDivElement) => {
		tab.jeden = Number(new Date().getTime());
	};
	const moje2 = (a: HTMLDivElement, name: string) => {
		tab.dwa = Number(new Date().getTime());

		const wynik = tab.dwa - tab.jeden;
		if (wynik < 250) {
			(async () => await goInFile(name))();
		} else {
			a.classList.toggle("selected");

			setLongPressed((prev) => !prev);
		}
	};
	//longPress End
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
						<div
							className="list-item"
							key={i}
							onMouseDown={(a) => moje(a.currentTarget)}
							onMouseUp={(a) => moje2(a.currentTarget, e.name)}
							//onTouchStart={(a) => moje(a.currentTarget)}
							//onTouchEnd={(a) => moje2(a.currentTarget, e.name)}
						>
							<div className="img">
								<img src={icon} alt={`icon Logo ${icon}`} />
							</div>
							<p
							// onMouseDown={(a) => moje(a.currentTarget)}
							// onMouseUp={(a) => moje2(a.currentTarget, e.name)}
							// onTouchStart={(a) => moje(a.currentTarget)}
							// onTouchEnd={(a) => moje2(a.currentTarget, e.name)}
							>
								{e.name}
							</p>
							<p className="size">{e.size > 0 && (e.size / 1024 < 1 ? (e.size / 1024).toFixed(2) + "KB" : (e.size / 1024 / 1024).toFixed(2) + " MB")}</p>
						</div>
					);
				})}
			</div>
		</>
	);
};
