/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Houses: taken from the WB8 example solution (in 2023)
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

/** @type {number} */ let simpleHouse1Count = 0;
/** @type {T.BoxGeometry} */ const boxGeometry = new T.BoxGeometry();
/** @type {T.Shape} */ const triangle = new T.Shape();
triangle.moveTo(0, 1);
triangle.lineTo(-0.5, 0);
triangle.lineTo(0.5, 0);
triangle.lineTo(0, 1);
/** @type {T.ExtrudeGeometry} */ const triangleGeometry = new T.ExtrudeGeometry(triangle, { depth: 1, bevelEnabled: false });
/** @type {String[]} */ const houseColors = ["rgb(240, 240, 240)", "rgb(180, 175, 100)", "rgb(200, 100, 100)", "rgb(147, 144, 244)", "rgb(250, 249, 157)", "rgb(199, 144, 186)"];
/** @type {T.TextureLoader} */ const textureLoader = new T.TextureLoader();
/** @type {T.Texture} */ const simpleHouse1Texture = textureLoader.load("../examples/simpleHouse1-front.png");
/** @type {T.MeshPhongMaterial[]} */ const simpleHouseMaterials = houseColors.map(c => new T.MeshPhongMaterial({ color: c }));
/** @type {T.MeshPhongMaterial[]} */ const simpleHouse1TextureMaterials = houseColors.map(c => new T.MeshPhongMaterial({ color: c, map: simpleHouse1Texture }));
export class SimpleHouse extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const houseGroup = new T.Group();
    super(`SimpleHouse-${++simpleHouse1Count}`, houseGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const length = params.length || 1; // The length
    /** @type {number} */ const width = params.width || 1; // The width
    /** @type {number} */ const height = params.height || 1; // The height
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {number} */ const color = params.index || 0; // Color
    /** @type {T.MeshPhongMaterial} */ const door = simpleHouse1TextureMaterials[color];
    /** @type {T.MeshPhongMaterial} */ const wall = simpleHouseMaterials[color];
    /** @type {T.Mesh} */ const base = new T.Mesh(boxGeometry, [wall, wall, wall, wall, door, door]);
    /** @type {T.Mesh} */ const roof = new T.Mesh(triangleGeometry, wall);
    // Set the transformations for the base
    base.scale.set(length, height, width);
    base.translateY(height * 0.5); // CS559 Sample Code
    // Set the transformations for the roof
    roof.scale.set(length, height * 0.5, width);
    roof.position.set(0, height, -width * 0.5); // CS559 Sample Code
    // Put everything into the group and transform the group
    houseGroup.add(base, roof);
    houseGroup.position.set(x, y, z); // CS559 Sample Code
    houseGroup.scale.set(scale, scale, scale);
  }
}

/* OLD SIMPLE HOUSE

// Global (module) variables for simple Houses 
let simpleHouseCount = 0;
let simpleHouseGeometry; // one geometry for all
let simpleHouseTexture;
let simpleHouseMaterial;
export class SimpleHouse extends GrObject {
  constructor(params = {}) {
    if (!simpleHouseGeometry) {
      let w = 2;
      let h = 2;
      let d = 3;
      let r = 1;
      simpleHouseGeometry = new Geom.Geometry();
      // front vertices
      simpleHouseGeometry.vertices.push(new T.Vector3(0, 0, 0));
      simpleHouseGeometry.vertices.push(new T.Vector3(w, 0, 0));
      simpleHouseGeometry.vertices.push(new T.Vector3(w, h, 0));
      simpleHouseGeometry.vertices.push(new T.Vector3(0, h, 0));
      simpleHouseGeometry.vertices.push(new T.Vector3(w / 2, h + r, 0));
      // back vertices
      simpleHouseGeometry.vertices.push(new T.Vector3(0, 0, d));
      simpleHouseGeometry.vertices.push(new T.Vector3(w, 0, d));
      simpleHouseGeometry.vertices.push(new T.Vector3(w, h, d));
      simpleHouseGeometry.vertices.push(new T.Vector3(0, h, d));
      simpleHouseGeometry.vertices.push(new T.Vector3(w / 2, h + r, d));
      // front surface
      simpleHouseGeometry.faces.push(new Geom.Face3(0, 1, 2));
      simpleHouseGeometry.faces.push(new Geom.Face3(0, 2, 3));
      simpleHouseGeometry.faces.push(new Geom.Face3(3, 2, 4));
      // back surface
      simpleHouseGeometry.faces.push(new Geom.Face3(6, 5, 7));
      simpleHouseGeometry.faces.push(new Geom.Face3(5, 8, 7));
      simpleHouseGeometry.faces.push(new Geom.Face3(8, 9, 7));
      // right side
      simpleHouseGeometry.faces.push(new Geom.Face3(1, 6, 2));
      simpleHouseGeometry.faces.push(new Geom.Face3(6, 7, 2));
      // left side
      simpleHouseGeometry.faces.push(new Geom.Face3(5, 0, 3));
      simpleHouseGeometry.faces.push(new Geom.Face3(5, 3, 8));
      // roof
      simpleHouseGeometry.faces.push(new Geom.Face3(2, 7, 4));
      simpleHouseGeometry.faces.push(new Geom.Face3(7, 9, 4));
      simpleHouseGeometry.faces.push(new Geom.Face3(3, 4, 8));
      simpleHouseGeometry.faces.push(new Geom.Face3(8, 4, 9));
      // texture coords
      let tfaces = [];
      const q = 0.25;
      const f = 0.5;
      tfaces.push(uvTri(0, 0, q, 0, q, q)); // front
      tfaces.push(uvTri(0, 0, q, q, 0, q));
      tfaces.push(uvTri(0, q, q, q, 0, f));

      tfaces.push(uvTri(q, 0, 0, 0, q, q)); // back
      tfaces.push(uvTri(0, 0, 0, q, q, q));
      tfaces.push(uvTri(0, q, q, q, 0, f));

      tfaces.push(uvTri(q, 0, f, 0, q, q));
      tfaces.push(uvTri(f, 0, f, q, q, q));

      tfaces.push(uvTri(f, 0, q, 0, q, q));
      tfaces.push(uvTri(f, 0, q, q, f, q));

      tfaces.push(uvTri(0, f, 1, f, 0, 1));
      tfaces.push(uvTri(1, f, 1, 1, 0, 1));

      tfaces.push(uvTri(0, f, 0, 1, 1, f));
      tfaces.push(uvTri(1, f, 0, 1, 1, 1));
      // now make the normals
      simpleHouseGeometry.computeFaceNormals();
      simpleHouseGeometry.faceVertexUvs = [tfaces];
    }
    if (!simpleHouseTexture) {
      simpleHouseTexture = new T.TextureLoader().load("../examples/house.png");
    }
    if (!simpleHouseMaterial) {
      simpleHouseMaterial = new T.MeshStandardMaterial({
        color: "white",
        map: simpleHouseTexture,
        roughness: 1.0,
        side: T.DoubleSide,
      });
    }
    let simpleHouseGeometry = simpleHouseGeometry.toGeometry();
    let mesh = new T.Mesh(simpleHouseGeometry, simpleHouseMaterial);
    mesh.translateX(params.x || 0);
    mesh.translateY(params.y || 0);
    mesh.translateZ(params.z || 0);
    super(`SimpleHouse-${++simpleHouseCount}`, mesh);
  }
}

*/