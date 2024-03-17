import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as THREE from "three";

export class FirstPersonCamera {
	constructor(camera, domElement, scene) {
		this.camera = camera;
		this.camera.position.y = 25;
		this.domElement = domElement;
		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();
		this.scene = scene;
		this.controls = new PointerLockControls(camera, domElement);

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = false;
		this.setup(this.controls);
	}

	setup(controls) {
		const blocker = document.getElementById("blocker");
		const instructions = document.getElementById("instructions");

		instructions.addEventListener("click", function () {
			console.log(this.controls);
			controls.lock();
		});

		controls.addEventListener("lock", function () {
			instructions.style.display = "none";
			blocker.style.display = "none";
		});

		controls.addEventListener("unlock", function () {
			blocker.style.display = "block";
			instructions.style.display = "";
		});

		document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
		document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
	}

	onKeyDown(event) {
		switch (event.code) {
			case "ArrowUp":
			case "KeyW":
				this.moveForward = true;
				break;

			case "ArrowLeft":
			case "KeyA":
				this.moveLeft = true;
				break;

			case "ArrowDown":
			case "KeyS":
				this.moveBackward = true;
				break;

			case "ArrowRight":
			case "KeyD":
				this.moveRight = true;
				break;

			case "Space":
				if (this.canJump === true) this.velocity.y += 350;
				this.canJump = false;
				break;
		}
	}

	onKeyUp(event) {
		switch (event.code) {
			case "ArrowUp":
			case "KeyW":
				this.moveForward = false;
				break;

			case "ArrowLeft":
			case "KeyA":
				this.moveLeft = false;
				break;

			case "ArrowDown":
			case "KeyS":
				this.moveBackward = false;
				break;

			case "ArrowRight":
			case "KeyD":
				this.moveRight = false;
				break;
		}
	}

	update(deltaTime, scene) {
		// console.log(this.moveBackward);
		this.velocity.x -= this.velocity.x * 10.0 * deltaTime;
		this.velocity.z -= this.velocity.z * 10.0 * deltaTime;

		// this.velocity.y -= 9.8 * 100.0 * deltaTime;

		this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
		this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
		this.direction.normalize();

		if (this.moveForward || this.moveBackward)
			this.velocity.z -= this.direction.z * 400.0 * deltaTime;
		if (this.moveLeft || this.moveRight)
			this.velocity.x -= this.direction.x * 400.0 * deltaTime;

		// console.log(this.moveForward);
		this.controls.moveRight(-this.velocity.x * deltaTime);
		this.controls.moveForward(-this.velocity.z * deltaTime);
		// console.log(this.velocity.x);

		this.controls.getObject(scene).position.y += this.velocity.y * deltaTime;

		// if (this.controls.getObject().position.y < 10) {
		// 	this.velocity.y = 0;
		// 	this.canJump = true;
		// }
	}

	getObject(scene) {
		scene.add(this.controls.getObject());
	}
}
