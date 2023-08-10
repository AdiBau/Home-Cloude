import react from "react";

interface Props {
	removeFile: () => Promise<void>;
	position: {
		x: number | string;
		y: number;
	};
	item: string;
}
export const RemoveButton = (props: Props) => {
	return (
		<>
			<button className="RemoveButton" onClick={props.removeFile} style={{ top: props.position.y, left: props.position.x }}>
				Remove file {props.item}
			</button>
		</>
	);
};
