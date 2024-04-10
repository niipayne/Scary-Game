import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { VectorUtil } from "../../Util/VectorUtil.js";

export class Scary {
	constructor(scene, gameMap, camera) {
		this.mixer = [];
		this.load(scene, gameMap);
		this.object;
		this.gameMap = gameMap;
		this.camera = camera;
		this.enemyMesh = [];
		this.s = [];

		const geometry = new THREE.SphereGeometry(2.5, 32, 16);
		const material = new THREE.MeshBasicMaterial({
			color: 0xffff00,
			transparent: true,
			opacity: 0.0,
		});
		const sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0, 7, 0);
		sphere.castShadow = true;
		sphere.receiveShadow = true;

		scene.add(sphere);
		this.s.push(sphere);

		this.location = new THREE.Vector3();
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);

		this.topSpeed = 1.5;
		this.mass = 1;
		this.seen = false;
		this.segment = 0;
		this.path = [];
	}

	// check edges
	checkEdges(gameMap) {
		this.location = this.object.position;
		let node = gameMap.quantize(this.location);
		let nodeLocation = gameMap.localize(node);

		if (!node.hasEdgeTo(node.x - 1, node.z)) {
			let nodeEdge = nodeLocation.x - gameMap.tileSize / 2;
			let characterEdge = this.location.x - this.size / 2;
			if (characterEdge < nodeEdge) {
				this.location.x = nodeEdge + this.size / 2;
			}
		}

		if (!node.hasEdgeTo(node.x + 1, node.z)) {
			let nodeEdge = nodeLocation.x + gameMap.tileSize / 2;
			let characterEdge = this.location.x + this.size / 2;
			if (characterEdge > nodeEdge) {
				this.location.x = nodeEdge - this.size / 2;
			}
		}
		if (!node.hasEdgeTo(node.x, node.z - 1)) {
			let nodeEdge = nodeLocation.z - gameMap.tileSize / 2;
			let characterEdge = this.location.z - this.size / 2;
			if (characterEdge < nodeEdge) {
				this.location.z = nodeEdge + this.size / 2;
			}
		}

		if (!node.hasEdgeTo(node.x, node.z + 1)) {
			let nodeEdge = nodeLocation.z + gameMap.tileSize / 2;
			let characterEdge = this.location.z + this.size / 2;
			if (characterEdge > nodeEdge) {
				this.location.z = nodeEdge - this.size / 2;
			}
		}
	}

	seek(target) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.object.position);
		desired.setLength(this.topSpeed);

		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

		return steer;
	}

	applyForce(force) {
		// here, we are saying force = force/mass
		force.divideScalar(this.mass);
		// this is acceleration + force/mass
		this.acceleration.add(force);
	}

	load(scene) {
		const loader = new FBXLoader();
		loader.setPath("js/Resources/Scary Zombie Pack/");
		loader.load(
			"Ch30_nonPBR.fbx",
			(fbx) => {
				fbx.scale.setScalar(0.025);
				fbx.traverse((c) => {
					if (c.isMesh) {
						c.castShadow = true;
						c.receiveShadow = true;
						this.enemyMesh.push(c);
					}
				});

				const anim = new FBXLoader();
				anim.setPath("js/Resources/Scary Zombie Pack/");
				anim.load("zombie walk.fbx", (anim) => {
					const thing = new THREE.AnimationMixer(fbx);
					this.mixer.push(thing);
					const idle = thing.clipAction(anim.animations[0]);
					idle.play();
				});
				scene.add(fbx);
				this.object = fbx;
				this.object.position.set(32, 5, 32);
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			}
		);
		return this.object;
	}

	arrive(target, radius) {
		let desired = VectorUtil.sub(target, this.object.position);

		let distance = desired.length();

		if (distance < radius) {
			let speed = (distance / radius) * this.topSpeed;
			desired.setLength(speed);
		} else {
			desired.setLength(this.topSpeed);
		}

		let steer = VectorUtil.sub(desired, this.velocity);

		return steer;
	}

	followAway(gameMap) {
		if (Math.random() < 0.002) {
			let runLocation = Math.floor(Math.random() * 3);
			console.log(runLocation);
			if (runLocation == 0) {
				this.location.set(32, 7, -32);
			} else if (runLocation == 1) {
				this.location.set(-32, 7, -32);
			} else {
				this.location.set(-32, 7, 32);
			}
		}
	}

	simpleFollow(gameMap) {
		let steer = new THREE.Vector3();

		let goTo = gameMap.localize(this.path[this.segment]);

		let distance = goTo.distanceTo(this.object.position);

		if (distance < gameMap.tileSize / 2) {
			if (this.segment == this.path.length - 1) {
				steer = this.arrive(goTo, gameMap.tileSize / 2);
			} else {
				this.segment++;
			}
		} else {
			steer = this.seek(goTo);
		}

		return steer;
	}

	followPlayer(gameMap, player) {
		let playerNode = gameMap.quantize(player.position);
		// console.log(playerNode, 'player node')

		let npcNode = gameMap.quantize(this.object.position);
		// console.log(npcNode, 'npc')
		if (npcNode == playerNode) {
			return this.arrive(player.position, gameMap.tileSize / 2);
		} else if (playerNode != this.path[this.path.length - 1]) {
			this.path = gameMap.astar(npcNode, playerNode);
			this.segment = 1;
		}
		return this.simpleFollow(gameMap);
	}

	movement(deltaTime) {
		this.velocity.addScaledVector(this.acceleration, deltaTime);

		if (this.velocity.length() > 0) {
			if (this.velocity.length() > this.topSpeed) {
				this.velocity.setLength(this.topSpeed);
			}
			if (this.velocity.x != 0 || this.velocity.z != 0) {
				let angle = Math.atan2(this.velocity.x, this.velocity.z);
				this.object.rotation.y = angle;
			}

			this.object.position.addScaledVector(this.velocity, deltaTime);
		}
		this.acceleration.multiplyScalar(0);
		if (this.object.position.y != 5) {
			this.object.position.y = 5;
		}
	}

	flee(gameMap, player) {
		// let playerNode = gameMap.quantize(player.position);
		// let npcNode = gameMap.quantize(this.object.position);
		// if (npcNode == playerNode) {
		// 	return this.arrive(player.position, gameMap.tileSize / 2);
		// } else if (playerNode != this.path[this.path.length - 1]) {
		// 	this.path = gameMap.astar(npcNode, playerNode);
		// 	this.segment = 1;
		// }
		// return this.fleeFollow(gameMap);
	}

	fleeFollow(gameMap) {
		// let steer = new THREE.Vector3();
		// let goTo = gameMap.localize(this.path[this.segment]);
		// let distance = goTo.distanceTo(this.object.position);
		// if (distance < gameMap.tileSize / 2) {
		// 	if (this.segment == this.path.length - 1) {
		// 		steer = this.arrive(goTo, gameMap.tileSize / 2);
		// 	} else {
		// 		this.segment++;
		// 	}
		// } else {
		// 	steer = this.seek(goTo).multiplyScalar(-1);
		// }
		// return steer;
	}

	update(deltaTime, gameMap) {
		let new_loc = this.location.clone();
		this.s[0].position.set(new_loc.x, 7, new_loc.z);
		this.movement(deltaTime);
		this.checkEdges(gameMap);
	}
}
