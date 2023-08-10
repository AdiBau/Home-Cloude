import { useCallback, useRef, useState } from "react";

const useLongPress = (onLongPress, onGuzik, onClick, { shouldPreventDefault = true, delay = 300 } = {}) => {
	const [longPressTriggered, setLongPressTriggered] = useState(false);
	const timeout = useRef();
	const target = useRef();

	const start = useCallback(
		(event) => {
			if (shouldPreventDefault && event.target) {
				event.target.addEventListener("touchend", preventDefault, {
					passive: false,
				});
				target.current = event.target;
				onGuzik(event);
			}
			timeout.current = setTimeout(() => {
				onLongPress(event);
				setLongPressTriggered(true);
			}, delay);
		},
		[onLongPress, delay, shouldPreventDefault, onGuzik]
	);

	const clear = useCallback(
		(event, shouldTriggerClick = true) => {
			timeout.current && clearTimeout(timeout.current);
			shouldTriggerClick && !longPressTriggered && onClick(event);
			setLongPressTriggered(false);
			if (shouldPreventDefault && target.current) {
				target.current.removeEventListener("touchend", preventDefault);
			}
		},
		[shouldPreventDefault, onClick, longPressTriggered]
	);

	return {
		onMouseDown: (e, aaa) => start(e, aaa),
		onTouchStart: (e, aaa) => start(e, aaa),
		onMouseUp: (e, aaa) => clear(e),
		onMouseLeave: (e) => clear(e, false),
		onTouchEnd: (e, aaa) => clear(e, aaa),
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
