import React, { useContext, useEffect, useState } from "react";

import {ContextHome, ContextOptionsFTP} from "../../contextHomeCloude/contextHome";

import {adresPath, CookieOptions} from "../../helpFunction/helpFunction";

import "./menu.css";
import {MenuBars} from "./MenuBars/MenuBars";
import {MenuConectionIcon} from "./MenuBars/ConnectionIcon";
import { toast } from "react-toastify";
import {MenuButtons} from "./MenuButtons";

export interface Options {
	urlFtp: string;
	passFtp: string;
	userFtp: string;
	portFtp: string;
}
export const Menu = () => {
	const [options, setOptions] = useState<Options>({ urlFtp: "", passFtp: "", userFtp: "", portFtp: "" });
	

	useEffect(() => {
		getOptions();
	}, []);

	const contextHome = useContext(ContextHome);
	if (!contextHome) return null;
	const { setLoading, connect } = contextHome;
	const setOption = (name:string, value:string) => {
		const d = new Date();
		d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
		let expires = `expires=${d.toUTCString()}`;
		
		document.cookie = `${name}=${value}; ${expires}; path=/`;
	};
	const saveOptions = () => {
		setLoading(true);
		setOption('urlFtp', options.urlFtp);
		setOption('portFtp', options.portFtp);
		setOption('userFtp', options.userFtp);
		setOption('passFtp', options.passFtp);
		setLoading(false);
	};
	const getOptions = () => {
		setLoading(true);
		const myCookie = {
			[CookieOptions.passFtp]: "",
			[CookieOptions.portFtp]: "",
			[CookieOptions.userFtp]: "",
			[CookieOptions.urlFtp]: "",
		};
		const cookie = decodeURIComponent(document.cookie);
		if (cookie.length === 0) {
			setLoading(false);
			return toast.error("Wprowadź dane do połączenia z serwerem FTP w menu");
		}
		const cookieTab = cookie.split(";");

		for (let i = 0; i < cookieTab.length; i++) {
			while (cookieTab[i].charAt(0) === " ") {
				cookieTab[i] = cookieTab[i].substring(1);
			}
			const newCookieTab: string[] = cookieTab[i].split("=");

			if (newCookieTab[1] !== "undefined") {
				if (
					newCookieTab[0] === CookieOptions.passFtp ||
					newCookieTab[0] === CookieOptions.portFtp ||
					newCookieTab[0] === CookieOptions.userFtp ||
					newCookieTab[0] === CookieOptions.urlFtp
				) {
					myCookie[newCookieTab[0]] = newCookieTab[1];
				}
			}
		}

		setOptions({
			urlFtp: myCookie.urlFtp,
			portFtp: myCookie.portFtp,
			userFtp: myCookie.userFtp,
			passFtp: myCookie.passFtp,
		});

		setLoading(false);
	};

	
	return (
		<>
		
			<div className="menu">
				<ContextOptionsFTP.Provider value={{
					getOptions,
					setOptions,
					saveOptions,
					options,
				}}>
				
				<MenuBars />
					<div className="center">
						<div className="MenuPath">{adresPath.path}</div>
						{connect && adresPath.path !== "cloude://" &&  <MenuButtons  />}

					</div>
					<MenuConectionIcon  />
				</ContextOptionsFTP.Provider>
				
				
			
			</div>
			{/* {buttonNewFolderClick && <FormsNewFolder setButtonNewFolderClick={setButtonNewFolderClick} listAll={listAll} />}  */}
		</>
	);
};
