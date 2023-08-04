import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {OptionsFTP} from "./OptionsFTP";
import {MenuOptions} from "./MenuOptions";


export const MenuBars =()=>{
	
	const [bars, setBars] = useState<boolean>(true)
	const [showMenuOptions, setShowMenuOptions] = useState<boolean>(false)
	const openMenu = () => {
		setBars(!bars);
		setShowMenuOptions(!showMenuOptions);
	};
	return(
		
			<div className={'MenuBars'}	>
			
			{bars && <FontAwesomeIcon icon="bars" size="xl" onClick={openMenu} />}
			{!bars && <FontAwesomeIcon icon="bars-staggered" size="xl" onClick={openMenu} />}
			{showMenuOptions && <MenuOptions />}
			</div>
			
	)
}