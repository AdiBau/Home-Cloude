import React, { useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DataListFtp.css";
import { useLongPress } from "use-long-press";
import { homeOrSerwer } from "../../helpFunction/homeOrSerwer";
import { readList, sortData, pathPwd } from "../../helpFunction/helpFunction";
import { ContextHome } from "../../contextHomeCloude/contextHome";

export const DataListFtp = () => {
	let url = homeOrSerwer ? "http://192.168.1.123:8000/ftp/" : "https://biuro.adibau.pl/ftp/";
	const selectedDIV = useRef<HTMLDivElement>(null);

	const bind = useLongPress(() => {
		selectedDIV.current?.classList.add("selected");
	});

	const context = useContext(ContextHome);
	const linkA = useRef<HTMLAnchorElement>(null);

	if (!context) return null;
	const { connect, data, setData, setLoading } = context;

	const goInFile = async (name: string) => {
		setLoading(true);
		if (name.indexOf(".") === -1) {
			try {
				url += "list/GoIn/" + name;
				const goIn = await fetch(url);
				if (goIn.status === 200) {
					await pathPwd();
					setData(await sortData(await readList()));
					setLoading(false);
				}
			} catch (error) {
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
			linkA.current.setAttribute("href", `${url}listGetOne/${name}`);
			linkA.current.click();
		}
		setLoading(false);
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
						<div className="list-item" key={i} ref={selectedDIV} onClick={() => goInFile(e.name)} {...bind()}>
							<div className="img">
								<img src={icon} alt={`icon Logo ${icon}`} />
							</div>
							<p onClick={() => goInFile(e.name)}>{e.name}</p>
							{e.size > 0 && <FontAwesomeIcon icon="cloud-arrow-down" size="1x" />}
							<p className="size">{e.size > 0 && (e.size / 1024 < 1 ? (e.size / 1024).toFixed(2) + "KB" : (e.size / 1024 / 1024).toFixed(2) + " MB")}</p>
						</div>
					);
				})}
			</div>
		</>
	);
};
