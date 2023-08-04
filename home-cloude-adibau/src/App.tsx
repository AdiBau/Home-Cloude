import React, {useContext, useEffect, useState} from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import {ContextHome, optionsFTP} from "./contextHomeCloude/contextHome";
import { Spiner } from "../src/spinerListki/spiner";
import { sortData, readList, pathPwd, DataResponse } from "./helpFunction/helpFunction";
import { Menu } from "./views/menu/Menu";
import { ToastContainer, toast } from "react-toastify";



import "react-toastify/dist/ReactToastify.css";
import {DataListFtp} from "./views/DataListFtp/DataListFtp";
library.add(fas);
function App() {
	const [loading, setLoading] = useState<boolean>(false);
	const [reload, setReload] = useState<boolean>(false);
	const [connect, setConnect] = useState(false);
	const [options, setOptions]=useState<optionsFTP>(
		{
			urlFtp: '',
			passFtp: '',
			userFtp: '',
			portFtp: '',
		});
	
	const context = useContext(ContextHome);

	const [data, setData] = useState<DataResponse[] | [] >([]);

	
	const listAll = async ()  =>   {
		setLoading(true);
		setData(await sortData(await readList()));
		await pathPwd();
		setLoading(false);
	};
	useEffect(() => {
		if(connect){
			listAll()
		}
		return () => {
		
		};
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
				<div className="container">
					{loading && <Spiner />}
					<Menu />
					<DataListFtp/>
					 {/*<List connect={connect} data={data} setData={setData} setLoading={setLoading} setReload={setReload} /> */}
				
				</div>
			</ContextHome.Provider>
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
		</>
	);
}

export default App;

