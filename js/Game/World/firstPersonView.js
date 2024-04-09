import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as THREE from "three";

export class FirstPersonCamera {
	constructor(camera, domElement, scene, gameMap, scary) {
		this.camera = camera;
		this.scary = scary;

		this.camera.position.y = 7;
		this.domElement = domElement;
		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();
		this.spotLight = new THREE.SpotLight(0xffffff, 4, 100, Math.PI / 5, 0, 1);
		this.scene = scene;
		this.controls = new PointerLockControls(camera, domElement);
		this.gameMap = gameMap;

		// this.raycaster = new THREE.Raycaster();

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = false;
		this.setup(this.controls);
		this.flashlight = false;
		this.size = 1.5;
		this.haveBatterys;
	}

	setup(controls) {
		const blocker = document.getElementById("blocker");
		const instructions = document.getElementById("instructions");
		const gameOver = document.getElementById("gameOver");
		const displaye = document.getElementById("displaye");

		this.camera.add(this.spotLight);
		this.camera.add(this.spotLight.target);
		this.spotLight.position.set(0, 0, 1);
		this.spotLight.target = this.camera;

		// this.raycaster.setFromCamera(new THREE.Vector2(this.camera.quaternion.x, this.camera.quaternion.z), this.camera)
		// const intersecs = this.raycaster.intersectObjects(this.scene.children, true)

		instructions.addEventListener("click", function () {
			controls.lock();
		});

		controls.addEventListener("lock", function () {
			instructions.style.display = "none";
			blocker.style.display = "none";
		});

		controls.addEventListener("unlock", function () {
			gameOver.style.display = "block";
			displaye.style.display = "block";
		});

		document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
		document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
		document.addEventListener("mousedown", (e) => this.flashOn(e), false);
		document.addEventListener("mouseup", (e) => this.flashOff(e), false);
	}

	// check edges
	checkEdges(gameMap) {
		let location = this.camera.position;
		let node = gameMap.quantize(location);
		let nodeLocation = gameMap.localize(node);

		if (!node.hasEdgeTo(node.x - 1, node.z)) {
			let nodeEdge = nodeLocation.x - gameMap.tileSize / 2;
			let characterEdge = location.x - this.size / 2;
			if (characterEdge < nodeEdge) {
				location.x = nodeEdge + this.size / 2;
			}
		}

		if (!node.hasEdgeTo(node.x + 1, node.z)) {
			let nodeEdge = nodeLocation.x + gameMap.tileSize / 2;
			let characterEdge = location.x + this.size / 2;
			if (characterEdge > nodeEdge) {
				location.x = nodeEdge - this.size / 2;
			}
		}
		if (!node.hasEdgeTo(node.x, node.z - 1)) {
			let nodeEdge = nodeLocation.z - gameMap.tileSize / 2;
			let characterEdge = location.z - this.size / 2;
			if (characterEdge < nodeEdge) {
				location.z = nodeEdge + this.size / 2;
			}
		}

		if (!node.hasEdgeTo(node.x, node.z + 1)) {
			let nodeEdge = nodeLocation.z + gameMap.tileSize / 2;
			let characterEdge = location.z + this.size / 2;
			if (characterEdge > nodeEdge) {
				location.z = nodeEdge - this.size / 2;
			}
		}
	}

	caught() {
		this.controls.unlock();
	}

	flashOn(event) {
		if (this.haveBatterys) {
			this.flashlight = true;
			this.spotLight.intensity = 1;
			// const intersecs = this.raycaster.intersectObjects(this.scene.children, true)
			// console.log(intersecs[0])
		}
	}

	flashOff(event) {
		this.flashlight = false;
		this.spotLight.intensity = 0;
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
				this.moveRight = true;
				break;
			case "KeyD":
				this.moveRight = true;
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

	moveMent(deltaTime) {
		this.velocity.x -= this.velocity.x * 70.0 * deltaTime;
		this.velocity.z -= this.velocity.z * 70.0 * deltaTime;

		this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
		this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
		this.direction.normalize();

		if (this.moveForward || this.moveBackward)
			this.velocity.z -= this.direction.z * 400.0 * deltaTime;
		if (this.moveLeft || this.moveRight)
			this.velocity.x -= this.direction.x * 400.0 * deltaTime;

		this.controls.moveRight(-this.velocity.x * deltaTime);
		this.controls.moveForward(-this.velocity.z * deltaTime);
	}

	moving() {
		if (
			this.moveLeft ||
			this.moveRight ||
			this.moveForward ||
			this.moveBackward
		)
			return true;
		return false;
	}

	update(deltaTime, haveBattery, camera) {
		this.checkEdges(this.gameMap);
		this.moveMent(deltaTime);
		this.camera = camera;
		this.haveBatterys = haveBattery;
		if (!haveBattery) {
			this.flashOff()  
		} else {
			
		}
	}

	getObject(scene) {
		scene.add(this.controls.getObject());
	}
}
