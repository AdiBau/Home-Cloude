import { useCallback, useRef, useState } from "react";

const useLongPress = (onLongPress, onClick, { shouldPreventDefault = true, delay = 300 } = {}) => {
	const [longPressTriggered, setLongPressTriggered] = useState(false);
	const [moved, setMoved] = useState(false);
	const timeout = useRef();
	const target = useRef();

	const start = useCallback(
		(event) => {
			console.log("start");
			if (shouldPreventDefault && event.target) {
				event.target.addEventListener("touchend", preventDefault, {
					passive: false,
				});
				target.current = event.target;
			}
			timeout.current = setTimeout(() => {
				onLongPress(event);
				setLongPressTriggered(true);
			}, delay);
		},
		[onLongPress, delay, shouldPreventDefault]
	);
	const move = useCallback(
		(event) => {
			console.log("move");
			setMoved(true);
			timeout.current && clearTimeout(timeout.current);
			setLongPressTriggered(false);
			if (shouldPreventDefault && target.current) {
				target.current.removeEventListener("touchend", preventDefault);
			}
		},
		[shouldPreventDefault]
	);
	const clear = useCallback(
		(event, shouldTriggerClick = true) => {
			console.log("clear");
			timeout.current && clearTimeout(timeout.current);
			shouldTriggerClick && !longPressTriggered && !moved && onClick(event);
			setLongPressTriggered(false);
			if (shouldPreventDefault && target.current) {
				target.current.removeEventListener("touchend", preventDefault);
			}
			setMoved(false);
		},
		[shouldPreventDefault, onClick, longPressTriggered, moved]
	);

	return {
		onMouseDown: (e) => start(e),
		onTouchStart: (e) => {
			start(e);
			console.log("touch start");
		},
		onMouseUp: (e) => clear(e, false),
		onTouchEnd: (e) => clear(e),

		onMouseLeave: (e) => move(e),

		onTouchMove: (e) => {
			move(e);
			console.log("touch move");
		},
	};
};

const isTouchEvent = (event) => {
	return "touches" in event;
};

const preventDefault = (event) => {
	if (!isTouchEvent(event)) return;

	if (event.touches.length < 2 && event.preventDefault) {
		event.preventDefault();
	}
};

export default useLongPress;
