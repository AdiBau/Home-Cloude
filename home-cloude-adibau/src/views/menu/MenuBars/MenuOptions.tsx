import { useState } from "react";
import { OptionsFTP } from "./OptionsFTP";

export const MenuOptions = () => {
	const [ustawieniaFTP, setUstawieniaFTP] = useState(false);

	const handlerUstawieniaFTP = () => {
		setUstawieniaFTP(true);
	};

	return (
		<>
			<div className="MenuOptions">
				<button onClick={handlerUstawieniaFTP}>Ustawienia FTP</button>
			</div>
			{ustawieniaFTP && <OptionsFTP setUstawieniaFTP={setUstawieniaFTP} />}
		</>
	);
};
