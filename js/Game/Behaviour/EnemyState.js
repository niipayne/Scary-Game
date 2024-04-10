import { State } from "./State";
import { Scary } from "./Scary.js";
import * as THREE from "three";

export class EnemyState extends Scary {
	constructor(scene, gameMap, camera) {
		super(scene, gameMap, camera);
		this.camera = camera;

		this.state = new ApproachingState();

		this.state.enterState(this, gameMap);
		this.runAway;
		this.runAwayNode;
	}

	switchState(state, gameMap) {
		this.state = state;
		this.state.enterState(this, gameMap);
	}

	update(deltaTime, gameMap) {
		this.state.updateState(this, gameMap);
		super.update(deltaTime, gameMap);
	}
}

export class ApproachingState extends State {
	enterState(enemy) {
		enemy.topSpeed = 1.5;
		console.log("I KNOW WHERE YOU ARE");
	}

	updateState(enemy, gameMap) {
		if (enemy.seen === true) {
			enemy.switchState(new SeenState(), gameMap);
		} else {
			enemy.applyForce(enemy.followPlayer(enemy.gameMap, enemy.camera));
			if (
				Math.floor(enemy.object.position.distanceTo(enemy.camera.position)) < 15
			) {
				enemy.switchState(new SprintState(), gameMap);
			}
		}
	}
}

export class SprintState extends State {
	enterState(enemy) {
		console.log("HEHEHHEHEHEHE");
		enemy.topSpeed = 10;
	}

	updateState(enemy, gameMap) {
		enemy.applyForce(enemy.followPlayer(enemy.gameMap, enemy.camera));

		if (enemy.seen === true) {
			enemy.topSpeed = 0;
			enemy.switchState(new SeenState(), gameMap);
		} else if (Math.floor(enemy.object.position.distanceTo(enemy.camera.position)) > 15) {
				enemy.switchState(new ApproachingState(), gameMap);
			}

		
	}
}

export class SeenState extends State {
	enterState(enemy) {
		// enemy.topSpeed = 1.50;
		enemy.topSpeed = 0;
		// let enemyNode = gameMap.quantize(enemy.location)
		// console.log(enemyNode)
		// let node = gameMap.graph.getRandomEmptyTile();
		// // console.log(gameMap.graph.getNode(node.x, node.z), gameMap.graph.getNode(13, 13))
		// let dir = gameMap.astar(gameMap.graph.getNode(enemyNode.x, enemyNode.z), gameMap.graph.getNode(13, 13))
		console.log("Interesting");
		// let force = enemy.pathFollow(dir, 2, gameMap);
		// enemy.applyForce(force);
		// this.runAway = gameMap.graph.getRandomEmptyTile();
		// this.runAwayNode = new THREE.Vector3(32, 7, -32);
		// console.log(force)
	}

	updateState(enemy, gameMap) {
		// console.log(enemy.object.position)
		// console.log(this.runAwayNode, 'run')
		// console.log(gameMap.quantize(new THREE.Vector3(node.x, 7, node.z)), 'wuantized')
		// if (enemy.seen === false) {
		// 	enemy.switchState(new SeenState(), gameMap);
		// } else {
		// }
		// enemy.applyForce(enemy.followAway(enemy.gameMap, this.runAwayNode));
		// if (
		// 	Math.floor(enemy.object.position.distanceTo(this.runAwayNode)) < 5
		// ) {
		// 	enemy.switchState(new ApproachingState(), gameMap);
		// }
		// let enemyNode = gameMap.quantize(enemy.location)
		// console.log(enemyNode)
		// let node = gameMap.graph.getRandomEmptyTile();
		// // console.log(gameMap.graph.getNode(node.x, node.z), gameMap.graph.getNode(13, 13))
		// let dir = gameMap.astar(gameMap.graph.getNode(enemyNode.x, enemyNode.z), gameMap.graph.getNode(13, 13))
		// console.log("Interesting", dir);
		// let force = enemy.pathFollow(dir, 2, gameMap);
		// enemy.applyForce(force);
		// // let force = enemy.seek(gameMap.graph.getNode(13, 13).location)
		// console.log(force)
		// enemy.applyForce(enemy.flee(gameMap, enemy.camera));


		// HERE HERE HERE BELOWWWWWWWWWWW

		// uncomment this and change line enemy.topSpeed = 0 in this function to return regular functionality
		if (enemy.seen === false) {
			enemy.switchState(new ApproachingState());
		}
	}
}
