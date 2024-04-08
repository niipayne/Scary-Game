import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as THREE from "three";

export class FirstPersonCamera {
	constructor(camera, domElement, scene, gameMap) {
		this.camera = camera;
		this.camera.position.y = 7;
		this.domElement = domElement;
		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();
		this.spotLight = new THREE.SpotLight(0xffffff, 4, 100, Math.PI/5, 0, 1);
		this.scene = scene;
		this.controls = new PointerLockControls(camera, domElement);
		this.gameMap = gameMap;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = false;
		this.setup(this.controls);
		this.flashlight = true;
	}

	setup(controls) {
		const blocker = document.getElementById("blocker");
		const instructions = document.getElementById("instructions");

		this.camera.add(this.spotLight);
		// this.spotLight.target.position.z = -3;
		this.camera.add(this.spotLight.target);
		this.spotLight.position.set(0, 0, 1);
		this.spotLight.target = this.camera

		instructions.addEventListener("click", function () {
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
		document.addEventListener("mousedown", (e) => this.flashOn(e), false);
	}

	flashOn(event) {
		if (this.flashlight) {
			this.flashlight = false;
			this.spotLight.intensity = 0;
		} else {
			this.flashlight = true;
			this.spotLight.intensity = 1;
		}
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
		this.velocity.x -= this.velocity.x * 25.0 * deltaTime;
		this.velocity.z -= this.velocity.z * 25.0 * deltaTime;

		this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
		this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
		this.direction.normalize();

		if (this.moveForward || this.moveBackward)
			this.velocity.z -= this.direction.z * 400.0 * deltaTime;
		if (this.moveLeft || this.moveRight)
			this.velocity.x -= this.direction.x * 400.0 * deltaTime;

		this.controls.moveRight(-this.velocity.x * deltaTime);
		this.controls.moveForward(-this.velocity.z * deltaTime);

		this.controls.getObject(scene).position.y += this.velocity.y * deltaTime;
	}

	getObject(scene) {
		scene.add(this.controls.getObject());
	}
}
