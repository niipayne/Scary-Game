import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { TileNode } from "./TileNode.js";

export class MapRenderer {
	constructor(start, tileSize, cols) {
		this.start = start;
		this.tileSize = tileSize;
		this.cols = cols;

		this.wallGeometries = new THREE.BoxGeometry(0, 0, 0);
		this.groundGeometries = new THREE.BoxGeometry(0, 0, 0);
		this.batteryGeometries = new THREE.BoxGeometry(0, 0, 0);
		this.endGeometries = new THREE.BoxGeometry(0, 0, 0);
	}

	createRendering(graph) {
		for (let n of graph) {
			this.createTile(n);
		}

		let groundMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		let batteryMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
		let wallMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
		let endMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

		let gameObject = new THREE.Group();
		let ground = new THREE.Mesh(this.groundGeometries, groundMaterial);
		let battery = new THREE.Mesh(this.batteryGeometries, batteryMaterial);
		let walls = new THREE.Mesh(this.wallGeometries, wallMaterial);
		let end = new THREE.Mesh(this.endGeometries, endMaterial);

		gameObject.add(ground);
		gameObject.add(battery);
		gameObject.add(walls);
		gameObject.add(end);

		return gameObject;
	}

	createTile(node) {
		// createTile(i, j, type) {

		let i = node.x;
		let j = node.z;
		let type = node.type;

		let x = i * this.tileSize + this.start.x;
		let y = 0;
		let z = j * this.tileSize + this.start.z;

		let geometry = new THREE.BoxGeometry(
			this.tileSize,
			this.tileSize,
			this.tileSize
		);
		geometry.translate(
			x + 0.5 * this.tileSize,
			y + 0.5 * this.tileSize,
			z + 0.5 * this.tileSize
		);

		this.groundGeometries = BufferGeometryUtils.mergeGeometries([
			this.groundGeometries,
			geometry,
		]);

		this.buildWalls(node, x, y, z);



		if (type === TileNode.Type.End) {
			this.endGeometries = BufferGeometryUtils.mergeGeometries([
				this.endGeometries,
				geometry,
			]);
		}
		if (type === TileNode.Type.Battery) {
			this.batteryGeometries = BufferGeometryUtils.mergeGeometries([
				this.batteryGeometries,
				geometry,
			]);
		}
	}

	buildWalls(node, cx, cy, cz) {
		if (!node.hasEdgeTo(node.x - 1, node.z)) {
			this.buildWall(
				cx,
				1.5 * this.tileSize,
				cz + 0.5 * this.tileSize,
				0.5,
				this.tileSize
			);
		}

		if (!node.hasEdgeTo(node.x + 1, node.z)) {
			this.buildWall(
				cx + this.tileSize,
				1.5 * this.tileSize,
				cz + 0.5 * this.tileSize,
				0.5,
				this.tileSize
			);
		}

		if (!node.hasEdgeTo(node.x, node.z - 1)) {
			this.buildWall(
				cx + 0.5 * this.tileSize,
				1.5 * this.tileSize,
				cz,
				this.tileSize,
				0.5
			);
		}

		if (!node.hasEdgeTo(node.x, node.z + 1)) {
			this.buildWall(
				cx + 0.5 * this.tileSize,
				1.5 * this.tileSize,
				cz + this.tileSize,
				this.tileSize,
				0.5
			);
		}
	}

	buildWall(px, py, pz, sx, sz) {
		let wall = new THREE.BoxGeometry(sx, this.tileSize, sz);

		wall.translate(px, py, pz);

		this.wallGeometries = BufferGeometryUtils.mergeGeometries([
			this.wallGeometries,
			wall,
		]);
	}

	highlight(vec, color) {
		let geometry = new THREE.BoxGeometry(this.tileSize, 1, this.tileSize);
		let material = new THREE.MeshBasicMaterial({ color: color });

		geometry.translate(vec.x, vec.y + 0.5, vec.z);
		this.flowfieldGraphics.add(new THREE.Mesh(geometry, material));
	}
}
