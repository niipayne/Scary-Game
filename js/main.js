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

// Create GameMap
const gameMap = new GameMap();
const clock = new THREE.Clock();
const controller = new Controller(document);
const player = new Player(new THREE.Color(0xff0000));
let npc = new NPC(new THREE.Color(0x000000));

let scary = new EnemyState(scene, gameMap, camera);

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
	scene.add(npc.gameObject);
	scene.add(player.gameObject);

	// Get a random starting places
	let startNPC = gameMap.graph.getNode(10, 10);
	let startPlayer = gameMap.graph.getNode(0, 0);

	
	// this is where we start the player
	player.location = gameMap.localize(startPlayer);
	// this is where we start the NPC
	npc.location = gameMap.localize(startNPC);

	npc.path = gameMap.astar(startNPC, startPlayer);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);

	const gridHelper = new THREE.GridHelper(100, 100); 
	scene.add(gridHelper);

	window.addEventListener("resize", onWindowResize, false);

	camera.position.x = -32;
	camera.position.z = -32;
	camera.position.y = 55;

	camera.lookAt(0,0,0)
	// camera.position.y = 7;

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
	
	let steer = npc.followPlayer(gameMap, player);
	npc.applyForce(steer);

	// let follow = scary.followPlayer(gameMap, camera);
	// scary.applyForce(follow);

	if (cameraBattery < timer.getElapsed()) {
		haveBattery = false
	}

	npc.update(deltaTime, gameMap);
	player.update(deltaTime, gameMap, controller, camera);
	fpCamera.update(deltaTime, scene, haveBattery, camera);
	
	let node = gameMap.quantize(player.location);
	if (node.type == TileNode.Type.Battery) {
		gameMap.graph.getNode(node.x, node.z).type = TileNode.Type.Ground;
		batteryStr += '||||||||||';
		cameraBattery += 10;
		haveBattery = true;
		console.log(node.x, node.z)
		// console.log(gameMap.graph.getNode(node.x, node.z))
		// gameMap.highlight(node, 0xffffff)
		// let manhatten = gameMap.manhattanDistance(node, new THREE.Vector3(13, 0, 13))
		// console.log(manhatten)
		gameMap.arrow(new THREE.Vector3(node.x, 0, node.z), new THREE.Vector3(13 - node.x, 0, 13 - node.z))
		// gameMap.backtrack()
	}

	if (fpCamera.flashlight && haveBattery) {
		timer.update();
		timerGUI.innerHTML = `<p>Flashlight Battery</p><h2>${batteryStr.slice(Math.floor(timer.getElapsed()), cameraBattery)}</h2>`
	} else {
		timer.reset()
	}
	const delta = timer.getDelta()
	// scary.update(deltaTime, gameMap);
}

setup();
