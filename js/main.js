import * as THREE from "three";
import { GameMap } from "./Game/World/GameMap.js";
import { NPC } from "./Game/Behaviour/NPC.js";
import { Player } from "./Game/Behaviour/Player.js";
import { Controller } from "./Game/Behaviour/Controller.js";
import { TileNode } from "./Game/World/TileNode.js";
import { FirstPersonCamera } from "./Game/World/firstPersonView.js";
import Stats from "three/examples/jsm/libs/stats.module";
import { CameraState } from "./Game/Behaviour/CameraState.js";

import { EnemyState } from "./Game/Behaviour/EnemyState.js";
import { Scary } from "./Game/Behaviour/Scary.js";
import { Timer } from 'three/addons/misc/Timer.js';
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

let cameraBattery = 20;
let haveBattery = true;
let batteryStr = '||||||||||||||||||||';

let dangerBar = 20;
let dangerStr = '||||||||||||||||||||';

// Create GameMap
const gameMap = new GameMap();
const clock = new THREE.Clock();
const controller = new Controller(document);
const player = new Player(new THREE.Color(0xff0000));
// let npc = new NPC(new THREE.Color(0x000000));

let scary = new EnemyState(scene, gameMap, camera);
scary.name = 'spooky_scary';

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
	scene.background = new THREE.Color(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// initialize our gameMap
	gameMap.init(scene);
	scene.add(gameMap.gameObject);

	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
	// let directionalLight = new THREE.DirectionalLight(0xffffff, 0.01);
	// let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(0, 5, 5);
	scene.add(directionalLight);

	// Add the characters to the scene
	// scene.add(npc.gameObject);
	scene.add(player.gameObject);

	// Get a random starting places
	// let startNPC = gameMap.graph.getNode(10, 10);
	let startPlayer = gameMap.graph.getNode(0, 0);

	
	// this is where we start the player
	player.location = gameMap.localize(startPlayer);
	// this is where we start the NPC
	// npc.location = gameMap.localize(startNPC);

	// npc.path = gameMap.astar(startNPC, startPlayer);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);

	const gridHelper = new THREE.GridHelper(100, 100); 
	scene.add(gridHelper);

	window.addEventListener("resize", onWindowResize, false);

	camera.position.x = -32;
	camera.position.z = -32;
	
	camera.lookAt(0,0,0)
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
	
	// let steer = npc.followPlayer(gameMap, player);
	// npc.applyForce(steer);

	let follow = scary.followPlayer(gameMap, camera);
	scary.applyForce(follow);

	if (cameraBattery < timer.getElapsed()) {
		haveBattery = false
	}

	// npc.update(deltaTime, gameMap);
	player.update(deltaTime, gameMap, controller, camera);
	fpCamera.update(deltaTime, scene, haveBattery, camera);
	
	let node = gameMap.quantize(player.location);
	let scary_node = gameMap.quantize(scary.location);
	if (node.type == TileNode.Type.Battery) {
		gameMap.graph.getNode(node.x, node.z).type = TileNode.Type.Ground;
		// let r = Math.floor(Math.random() * 10);
		let r = 6;
		batteryStr += '|'.repeat(r);
		cameraBattery += r;
		haveBattery = true;
		let dir = gameMap.astar(gameMap.graph.getNode(node.x, node.z), gameMap.graph.getNode(13, 13))
		gameMap.arrow(new THREE.Vector3(node.x, 0, node.z), new THREE.Vector3(dir[1].x - node.x, 0, dir[1].z - node.z))
	}

	let danger;
	if (fpCamera.flashlight && haveBattery) {
		// danger = gameMap.astar(gameMap.graph.getNode(node.x, node.z), gameMap.graph.getNode(scary_node.x, scary_node.z)).length
		timer.update();
		// console.log(scary)
	} else {
		timer.reset();
	}
	// console.log(gameMap.astar(gameMap.graph.getNode(node.x, node.z), gameMap.graph.getNode(scary_node.x, scary_node.z)).length)
	timerGUI.innerHTML = `<p>Flashlight Battery</p><h2>${batteryStr.slice(Math.floor(timer.getElapsed()), cameraBattery)}</h2>`

	// let dm = Math.floor()
	// console.log(danger)
	// timerGUI.innerHTML += `<p>Danger Detector</p><h2>${dangerStr.slice(Math.floor(timer.getElapsed()), cameraBattery)}</h2>`
	scary.update(deltaTime, gameMap);
}

setup();
