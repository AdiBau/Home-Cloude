import { useState } from "react";
import { OptionsFTP } from "./OptionsFTP";

interface Props {
	setBars: (e: boolean) => void;
	setShowMenuOptions: (e: boolean) => void;
}
export const MenuOptions = (props: Props) => {
	const [ustawieniaFTP, setUstawieniaFTP] = useState(false);

	const handlerUstawieniaFTP = () => {
		setUstawieniaFTP(true);
	};

	return (
		<>
			<div className="MenuOptions">
				<button onClick={handlerUstawieniaFTP}>Ustawienia FTP</button>
			</div>
			{ustawieniaFTP && <OptionsFTP setUstawieniaFTP={setUstawieniaFTP} setBars={props.setBars} setShowMenuOptions={props.setShowMenuOptions} />}
		</>
	);
};
