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

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = false;
		this.flashlight = false;
		this.size = 1.5;
		this.haveBatterys;
		this.ray = new THREE.Raycaster(
			new THREE.Vector3(),
			new THREE.Vector3(),
			0,
			25
		);
		this.target = new THREE.Vector3();
		this.intersects = [];
		this.setup(this.controls);
	}

	setup(controls) {
		const blocker = document.getElementById("blocker");
		const instructions = document.getElementById("instructions");

		const penScare = document.getElementById("penguin_jumpscare");

		this.camera.add(this.spotLight);
		this.camera.add(this.spotLight.target);
		this.spotLight.position.set(0, 0, 1);
		this.spotLight.target = this.camera;

		instructions.addEventListener("click", function () {
			controls.lock();
		});

		controls.addEventListener("lock", function () {
			instructions.style.display = "none";
			blocker.style.display = "none";
		});

		controls.addEventListener("unlock", function () {
			console.log("FIN");
		});

		document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
		document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
		document.addEventListener("mousedown", (e) => this.flashOn(e), false);
		document.addEventListener("mouseup", (e) => this.flashOff(e), false);
	}

	casting() {
		this.camera.getWorldDirection(this.target);
		this.ray.set(this.camera.position, this.target.normalize());
		this.intersects = this.ray.intersectObjects(this.scary.s, false);
		if (this.intersects.length > 0) {
			console.log("seen");
			this.scary.seen = true;
		} else {
			this.scary.seen = false;
		}
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
		const gameOver = document.getElementById("gameOver");
		const displaye = document.getElementById("displaye");
		const penScare = document.getElementById("penguin_jumpscare");
		const generic = document.getElementById("generic");
		const lobster = document.getElementById("lobster");
		const money = document.getElementById("money");
		const mask = document.getElementById("mask");
		const taxes = document.getElementById("taxes");
		let scareArray = [];
		let imageArray = [];
		scareArray.push(penScare, generic, lobster);
		imageArray.push(money, mask, taxes);
		let randomInteger = Math.floor(Math.random() * 3);
		scareArray[randomInteger].play();
		imageArray[randomInteger].style.display = "block";
		gameOver.style.display = "block";
		displaye.style.display = "block";
		this.controls.unlock();
	}

	win() {
		const win = document.getElementById("winner");
		const winDiv = document.getElementById("winnerDiv");
		const winSound = document.getElementById("victory_sound");
		win.style.display = "block";
		winDiv.style.display = "block";
		winSound.play();
		this.controls.unlock();
	}

	flashOn(event) {
		if (this.haveBatterys) {
			this.flashlight = true;
			this.spotLight.intensity = 1;
		}
	}

	flashOff(event) {
		this.flashlight = false;
		this.scary.seen = false;
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
			this.flashOff();
		}
		if (this.flashlight) {
			this.casting();
		}
	}

	getObject(scene) {
		scene.add(this.controls.getObject());
	}
}
