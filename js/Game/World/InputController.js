// Creating Input Controller
export class InputController {
	constructor() {
		this.initialize();
	}
	

	initialize() {
		this.mouse = {
			leftClick: false,
			rightClick: false,
			mouseX: 0,
			mouseY: 0,
			mouseXDelta: 0,
			mouseYDelta: 0,
		};
		this.previous = null;
		this.keys = {};
		this.previousKeys = {};

		document.addEventListener("mousedown", (e) => this.onMouseDown(e), false);
		document.addEventListener("mouseup", (e) => this.onMouseUp(e), false);
		document.addEventListener("mousemove", (e) => this.onMouseMove(e), false);
		document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
		document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
	}

	onMouseDown(e) {
		switch (e.button) {
			case 0: {
				this.mouse.leftClick = true;
				console.log(this.mouse.leftClick);
				break;
			}
			case 2: {
				this.mouse.rightClick = true;
				break;
			}
		}
	}
	onMouseUp(e) {
		switch (e.button) {
			case 0: {
				this.mouse.leftClick = false;
				break;
			}
			case 2: {
				this.mouse.rightClick = false;
				break;
			}
		}
	}
	onMouseMove(e) {
		this.mouse.mouseX = e.pageX - window.innerWidth / 2;
		this.mouse.mouseY = e.pageY - window.innerWidth / 2;

		if (this.previous == null) {
			this.previous = { ...this.mouse };
		}
		this.mouse.mouseXDelta = this.mouse.mouseX - this.previous.mouseX;
		this.mouse.mouseYDelta = this.mouse.mouseY - this.previous.mouseY;
	}

	onKeyDown(e) {
		this.keys[e.keyCode] = true;
	}

	onKeyUp(e) {
		this.keys[e.keyCode] = false;
	}

	key(keyCode) {
		return !!this.keys[keyCode];
	}

	update() {
		if (this.previous !== null) {
			this.mouse.mouseXDelta = this.mouse.mouseX - this.previous.mouseX;
			this.mouse.mouseYDelta = this.mouse.mouseY - this.previous.mouseY;

			this.previous = { ...this.mouse };
		}
	}
}
