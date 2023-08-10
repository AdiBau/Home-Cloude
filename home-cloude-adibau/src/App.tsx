import React, { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ContextHome } from "./contextHomeCloude/contextHome";
import { Spiner } from "../src/spinerListki/spiner";
import { sortData, readList, pathPwd, DataResponse } from "./helpFunction/helpFunction";
import { Menu } from "./views/menu/Menu";
import { DataListFtp } from "./views/DataListFtp/DataListFtp";
import { Stopka } from "./views/Stopka/Stopka";
import { ClickForConnect } from "./views/ClickForConnect/ClickForConnect";
import "./App.css";
library.add(fas);
function App() {
	const [loading, setLoading] = useState<boolean>(false);
	const [reload, setReload] = useState<boolean>(false);
	const [connect, setConnect] = useState(false);

	const [data, setData] = useState<DataResponse[] | []>([]);

	const listAll = async () => {
		setLoading(true);
		setData(await sortData(await readList()));
		await pathPwd();
		setLoading(false);
	};
	useEffect(() => {
		if (connect) {
			listAll();
		}
		return () => {};
	}, [reload]);

	return (
		<>
			<ContextHome.Provider
				value={{
					setLoading,
					setReload,
					connect,
					setConnect,
					listAll,
					setData,
					data,
					reload,
				}}
			>
				{loading && <Spiner />}

				<div className="container">
					<Menu />
					{!connect && <ClickForConnect />}
					{connect && <DataListFtp />}
				</div>
				<Stopka />
			</ContextHome.Provider>

			<ToastContainer
				position="top-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				closeButton
			/>
			{/* <Header /> */}
		</>
	);
}

export default App;

