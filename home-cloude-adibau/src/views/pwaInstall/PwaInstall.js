import React from "react";
import { usePWAInstall } from "react-use-pwa-install";

export const Header = () => {
	const install = usePWAInstall();

	return (
		<>
			{install && (
				<>
					<h1>Home Cloude</h1>
					<button>Install</button>
				</>
			)}
		</>
	);
};
