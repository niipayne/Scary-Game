import * as THREE from "three";
import { GameMap } from "./Game/World/GameMap.js";
// import { NPC } from "./Game/Behaviour/NPC.js";
import { Player } from "./Game/Behaviour/Player.js";
import { Controller } from "./Game/Behaviour/Controller.js";
import { TileNode } from "./Game/World/TileNode.js";
import { FirstPersonCamera } from "./Game/World/firstPersonView.js";
import Stats from "three/examples/jsm/libs/stats.module";
import { CameraState } from "./Game/Behaviour/CameraState.js";

import { EnemyState } from "./Game/Behaviour/EnemyState.js";
import { Scary } from "./Game/Behaviour/Scary.js";
import { Timer } from "three/addons/misc/Timer.js";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { VectorUtil } from "./Util/VectorUtil.js";

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer();
const textureLoader = new THREE.TextureLoader();

console.log(scene);

let cameraBattery = 15;
let haveBattery = true;
let batteryStr = "|||||||||||||||";

// let dangerBar = 20;
let dangerStr = "";

// Create GameMap
const gameMap = new GameMap();
const clock = new THREE.Clock();
const controller = new Controller(document);
const player = new Player(new THREE.Color(0xff0000));

let scary = new EnemyState(scene, gameMap, camera);
scary.name = "spooky_scary";

const timer = new Timer();
const timerGUI = document.getElementById("flashlight_battery");

let fpCamera = new CameraState(
	camera,
	renderer.domElement,
	scene,
	gameMap,
	scary,
	haveBattery
);

const stats = new Stats();
document.body.appendChild(stats.dom);

fpCamera.getObject(scene);

// Setup our scene
function setup() {
	// scene.background = new THREE.Color(0xffffff);
	scene.background = textureLoader.load(
		"js/Resources/Background/3d-render-tree-landscape-against-night-sky.jpg"
	);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// initialize our gameMap
	gameMap.init(scene);
	scene.add(gameMap.gameObject);

	// let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.01);
	directionalLight.position.set(0, 5, 5);
	scene.add(directionalLight);

	// Add the characters to the scene
	scene.add(player.gameObject);

	// Get a random starting places
	let startPlayer = gameMap.graph.getNode(0, 0);

	// this is where we start the player
	player.location = gameMap.localize(startPlayer);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);

	const gridHelper = new THREE.GridHelper(100, 100);
	scene.add(gridHelper);

	window.addEventListener("resize", onWindowResize, false);

	camera.position.x = -32;
	camera.position.z = -32;

	camera.lookAt(0, 0, 0);
	// camera.position.y = 35;
	camera.position.y = 7;

	//First call to animate
	animate();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

// animate
function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);

	stats.update();

	let deltaTime = clock.getDelta();

	let follow = scary.followPlayer(gameMap, camera);
	scary.applyForce(follow);

	if (cameraBattery < timer.getElapsed()) {
		haveBattery = false;
	}

	player.update(deltaTime, gameMap, controller, camera);
	fpCamera.update(deltaTime, scene, haveBattery, camera);

	let node = gameMap.quantize(player.location);
	let scary_node = gameMap.quantize(scary.location);
	if (node.type == TileNode.Type.Battery) {
		gameMap.graph.getNode(node.x, node.z).type = TileNode.Type.Ground;
		let r = Math.floor(Math.random() * 6);
		// let r = 5;
		batteryStr += "|".repeat(r);
		cameraBattery += r;
		haveBattery = true;
		let dir = gameMap.astar(
			gameMap.graph.getNode(node.x, node.z),
			gameMap.graph.getNode(13, 13)
		);
		gameMap.arrow(
			new THREE.Vector3(node.x, 0, node.z),
			new THREE.Vector3(dir[1].x - node.x, 0, dir[1].z - node.z)
		);
	}

	if (fpCamera.flashlight && haveBattery) {
		timer.update();
	} else {
		timer.reset();
	}

	let danger;
	danger = gameMap.astar(
		gameMap.graph.getNode(node.x, node.z),
		gameMap.graph.getNode(scary_node.x, scary_node.z)
	).length;
	// console.log(danger)
	danger = Math.floor(danger / 25);
	// if (danger > 6) {
	// } else {
	// 	danger = 0
	// }
	timerGUI.innerHTML = `<p>Flashlight Battery</p><h2>${batteryStr.slice(
		Math.floor(timer.getElapsed()),
		cameraBattery
	)}</h2>`;

	if (danger == 0) {
		timerGUI.innerHTML += `<h2>NOT SAFE!!!!</h2>`;
	} else {
		dangerStr = "[####]".repeat(danger);
		timerGUI.innerHTML += `<p>Saftey Meter</p><h2>${dangerStr}</h2>`;
	}
	scary.update(deltaTime, gameMap);
}

setup();
