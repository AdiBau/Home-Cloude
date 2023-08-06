import { Adress } from "./homeOrSerwer";

export enum CookieOptions {
	urlFtp = "urlFtp",
	portFtp = "portFtp",
	passFtp = "passFtp",
	userFtp = "userFtp",
}

export interface DataResponse {
	type: number;
	path: string;
	name: string;
	size: number;
}

export interface ErrorFtp {
	error: {
		massage: string;
	};
}

export const adresPath = { path: "", home: "cloude:/" };

export const pathPwd = async () => {
	try {
		const { pwd } = await (await fetch(Adress.path)).json();
		adresPath.path = adresPath.home + pwd;
	} catch (error) {
		throw new Error("pathPwd error: " + (error as Error).message);
	}
};

export const sortData = async (data: DataResponse[]) => {
	if (data.length !== 0) {
		let folderList = data.filter((e) => e.type === 2);
		const fileList = data.filter((e) => e.type === 1);
		fileList.map((e) => folderList.push(e));
		folderList.push(data[data.length - 1]);
		return folderList;
	} else {
		return [];
	}
};

export const readList = async () => {
	try {
		const data = await fetch(Adress.readList);
		const result = await data.json();
		result.push(adresPath);
		return result as DataResponse[];
	} catch (error) {
		// throw new Error("pathPwd error: " + (error as Error).message);
		// document.querySelector(".connect").classList.remove("visible");
		// document.querySelector(".disconnect").classList.add("visible");

		return [];
	}
};
