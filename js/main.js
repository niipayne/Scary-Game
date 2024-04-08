import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GameMap } from "./Game/World/GameMap.js";
import { Character } from "./Game/Behaviour/Character.js";
import { NPC } from "./Game/Behaviour/NPC.js";
import { Player } from "./Game/Behaviour/Player.js";
import { Controller } from "./Game/Behaviour/Controller.js";
import { TileNode } from "./Game/World/TileNode.js";
import { FirstPersonCamera } from "./Game/World/firstPersonView.js";
import Stats from "three/examples/jsm/libs/stats.module";

import { Scary } from "./Game/Behaviour/Scary.js";

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer();

const orbitControls = new OrbitControls(camera, renderer.domElement);

// Create GameMap
const gameMap = new GameMap();

// Create clock
const clock = new THREE.Clock();

// Controller for player
const controller = new Controller(document);

// Create player
const player = new Player(new THREE.Color(0xff0000));

// Create NPC
let npc = new NPC(new THREE.Color(0x000000));

let scary = new Scary(scene);

let fpCamera = new FirstPersonCamera(
	camera,
	renderer.domElement,
	scene,
	gameMap
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

	// let directionalLight = new THREE.DirectionalLight(0xffffff, 0.01);
	let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(0, 5, 5);
	scene.add(directionalLight);

	// Add the characters to the scene
	scene.add(npc.gameObject);
	scene.add(player.gameObject);

	// Get a random starting place for the enemy
	// let startNPC = gameMap.graph.getRandomEmptyTile();
	let startNPC = gameMap.graph.getNode(9, 0);

	// let startPlayer = gameMap.graph.getRandomEmptyTile();
	let startPlayer = gameMap.graph.getNode(0, 0);

	// this is where we start the NPC
	npc.location = gameMap.localize(startNPC); 

	// this is where we start the player
	player.location = gameMap.localize(startPlayer);

	npc.path = gameMap.astar(startNPC, startPlayer);

	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);

	const gridHelper = new THREE.GridHelper(100, 100);
	scene.add(gridHelper);

	window.addEventListener("resize", onWindowResize, false);

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

	let follow = scary.followPlayer(gameMap, camera);
	scary.applyForce(follow);

	npc.update(deltaTime, gameMap);
	player.update(deltaTime, gameMap, controller);

	fpCamera.update(deltaTime, scene);
	scary.update(deltaTime, gameMap);
}

setup();
