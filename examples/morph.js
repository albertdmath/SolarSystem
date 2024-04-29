/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Morph: an example of morph target animation
 *
 * Some caveats:
 * - don't forget to enable morphing (for positions and normals) in the material!
 * - set up morph targets using Geometry (simple data structure) and then convert
 *      to "BufferGeometry"
 * - morph normals seem to have a different form than the documentation suggests
 *      I just let "computeMorphNormals" take care of it
 * - the base mesh is always added to the morph targets - it is unclear what it's
 *      weight/influence is (I think its 1-sum(influences)). so in the example,
 *      the influence of the target is 1, the base is 0
 * 
 * Warning: this was written long ago using "old fashioned geometry" and hasn't 
 * really been converted to the new era of "buffer geometry only"
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let mtTexture = null;

export class MorphTest extends GrObject {
  /**
   *
   * The old version of this did something weird.
   * The new version of this is based on https://threejs.org/examples/webgl_morphtargets.html
   * That morphs a Box into a sphere - I'll try a sphere into a plane
   * 
   * @param {Object} params
   */
  constructor(params = {}) {
    let radius = params.r || 1.0;

    if (!mtTexture) {
      let loader = new T.TextureLoader();
      mtTexture = loader.load("../examples/4x4.png");
    }
    // getting the UV is hard since they are in faces!
    let material = new T.MeshStandardMaterial({
      map: mtTexture
    });

    // the initial shape is a box - with lots of segments
    let geometry = new T.SphereGeometry(radius,10,10);

    // set up morph targets
    // set up a morph target - the first morph target is flat
    // we let the x,y position be the u,v coordinate (so the sphere "unwraps")
    // getting the UV has to come from the buffer
    geometry.morphAttributes.position = [];
    let morphVerts = [];
    const uvAttrib = geometry.attributes.uv;
    for (let i=0; i< uvAttrib.count; i++) {
        morphVerts.push(uvAttrib.getX(i) * radius * 2);
        morphVerts.push(uvAttrib.getY(i) * radius * 2);
        morphVerts.push(0);
    }
    geometry.morphAttributes.position[0] = new T.Float32BufferAttribute(morphVerts,3);

    let mesh = new T.Mesh(geometry, material);

    super("MorphTest", mesh);
    mesh.position.x = params.x || 0;
    mesh.position.y = params.y || 0;
    mesh.position.z = params.z || 0;
    this.mesh = mesh;

    // set up the controls vector
    this.mesh.updateMorphTargets();

    this.time = 0;
  }
  stepWorld(delta, timeOfDay) {
    this.time += delta / 1000;
    // we do cos^2 since it causes things to dwell at the ends (looks better than abs)
    this.mesh.morphTargetInfluences[0] =
      Math.cos(this.time) * Math.cos(this.time);
  }
}
