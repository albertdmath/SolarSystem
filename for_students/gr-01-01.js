/*jshint esversion: 6 */
// tscheckers

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
//import {main} from "../examples/main.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// Make the world:
let world = new GrWorld({
    width: 1920, // CHANGE THESE IF WINDOW IS TOO BIG!!!
    height: 1080, // CHANGE THESE IF WINDOW IS TOO BIG!!!
    far: 1000000,
    groundplane: false,
});

// Handle keyboard input:
let moveForward = false;
let moveBackward = false;
let turnLeft = false;
let turnRight = false;
let rollLeft = false;
let rollRight = false;
let turnUp = false;
let turnDown = false;
let speedUp = false;
let speedDown = false;
// Initial speed of spaceship:
let speed = 10;

// Alien Class
export class Alien extends Loaders.ObjGrObject {
    // Constructor
    constructor(params={}) {
        super({
            obj:"./textures/alien.obj",
            norm:0.1,
            name: "Alien",
            // Make the alien green.
            callback: (self) => {
                self.objects[0].traverse(obj => {
                    if (obj instanceof T.Mesh) {
                        obj.material = new T.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
                    }
                });
            }
        });
    }
}

// Astronaut Class
export class Astronaut extends Loaders.ObjGrObject {
    // Constructor
    constructor(params={}) {
        super({
            obj:"./textures/astronaut.obj",
            norm:0.1,
            name: "Astronaut",
            // Make the Astronaut gray:
            callback: (self) => {
                self.objects[0].traverse(obj => {
                    if (obj instanceof T.Mesh) {
                        obj.material = new T.MeshStandardMaterial({ color: 0x808080 }); // Gray color
                    }
                });
            }
        });
    }
}

// Create the sphere:
export class Mirror_Sphere extends GrObject { 
    constructor(params = {}) {
    let geometry = new T.SphereGeometry(1,500,500);
    let mesh = new T.Mesh(geometry, material);
    mesh.position.set(0, 1, 0);
    mesh.scale.set(100,100,100);
    super("Sphere1", mesh);
    this.mesh = mesh;
    this.time = 0;
    }
    // Animate the sphere: (circular motion)
    stepWorld(delta) {
    this.time += delta;
    this.mesh.visible = false; // So cube camera can take a picture
    // Cube camera and sphere move together as a unit:
    cube_camera.position.set(500*Math.sin(this.time / 1000), 1, 500*Math.cos(this.time / 1000));
    cube_camera.update(world.renderer, world.scene);
    this.mesh.visible = true;
    this.mesh.position.set(500*Math.sin(this.time / 1000), 1, 500*Math.cos(this.time / 1000));
    }
}

// Satellite Class
let solarpanel_texture = new T.TextureLoader().load("./textures/solarpanel.jpg");
export class Satellite extends GrObject {
    constructor(params={}) {
        let group = new T.Group();
        let geometry = new T.CylinderGeometry(1,1,5,100,100,false,0,2*Math.PI);
        let material = new T.MeshStandardMaterial({color:0x808080});
        let mesh = new T.Mesh(geometry, material);
        let geometry1 = new T.CylinderGeometry(0.1,0.1,3,100,100,false,0,2*Math.PI);
        let material1 = new T.MeshStandardMaterial({color:0x808080});
        let mesh1 = new T.Mesh(geometry1, material1);

        const positions = new Float32Array( [
            // top
            0,0,0, 
            .01,0,.05,
            .01,0,0,

            0,0,0,
            0,0,.05,
            .01,0,.05,
            // bottom
            0,0,0, 
            .01,0,0,
            .01,0,.05,

            0,0,0,
            .01,0,.05,
            0,0,.05
        ]);

        const uvs = new Float32Array([
            // top
            64/1860,489/4032,
            1796/1860, 1729/4032,
            1796/1860, 522/4032,

            64/1860,489/4032,
            64/1860, 1716/4032,
            1796/1860, 1729/4032,

            // bottom
            64/1860, 1716/4032,
            1796/1860, 1729/4032,
            1796/1860, 2842/4032,

            64/1860, 1716/4032,
            1796/1860, 2842/4032,
            64/1860, 2842/4032
        ]);

        let geometry2 = new T.BufferGeometry();
        geometry2.setAttribute("position",new T.BufferAttribute(positions,3));
        geometry2.setAttribute("uv",new T.BufferAttribute(uvs,2));
        let material2 = new T.MeshStandardMaterial({color:"white", map:solarpanel_texture});
        let mesh2 = new T.Mesh(geometry2,material2);
        mesh2.position.set(0,0,0);
        mesh2.translateZ(0);

        let geometry3 = new T.BufferGeometry();
        geometry3.setAttribute("position",new T.BufferAttribute(positions,3));
        geometry3.setAttribute("uv",new T.BufferAttribute(uvs,2));
        let material3 = new T.MeshStandardMaterial({color:"white", map:solarpanel_texture});
        let mesh3 = new T.Mesh(geometry3,material3);
        mesh3.position.set(0,0,0);
        mesh3.translateZ(-0.05);

        mesh1.rotateX(Math.PI/2);
        mesh.position.set(0,0,0);
        mesh1.position.set(0,0,0);
        mesh.scale.set(.01,.01,.01);
        mesh1.scale.set(.01,.01,.01);
        group.add(mesh,mesh1,mesh2,mesh3);
        group.translateX(1.2);
        super("Cylinder", group);
        this.mesh=mesh;
    }
}

// Spaceship Class
export class Spaceship extends Loaders.ObjGrObject {
    // Constructor
    constructor(params={}) {
        super({
            obj:"./textures/spaceship.obj",
            norm:2,
            name: "Spaceship",
            // Make the spaceship red.
            callback: (self) => {
                self.objects[0].traverse(obj => {
                    if (obj instanceof T.Mesh) {
                        obj.material = new T.MeshStandardMaterial({ color: 0xff0000 }); // Red color
                    }
                });
            }
        });

        // Do the fancy rideable stuff to get a third person camera:
        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.5);
        this.ridePoint.translateZ(-3);
        this.objects[0].add(this.ridePoint);
        this.rideable = this.ridePoint;
        this.objects[0].position.set(0,0,1000);
        this.objects[0].scale.set(0.01,0.01,0.01);
        this.mesh=this.objects[0];
        this.time=0;

        // Event handlers to control the spaceship:
        document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 87: // W key
                moveForward = true;
                break;
            case 83: // S key
                moveBackward = true;
                break;
            case 65: // A key
                turnLeft = true;
                break;
            case 68: // D key
                turnRight = true;
                break;
            case 81: // Q key
                rollLeft = true;
                break;
            case 69: // E key
                rollRight = true;
                break;
            case 104: // 8 numberpad key
                turnUp = true;
                break;
            case 101: // 5 numberpad key
                turnDown = true;
                break;
            case 102: // 6 numberpad key
                speedUp = true;
                break;
            case 100: // 4 numberpad key
                speedDown = true;
                break;
            }
        });

        // Event handlers to control the spaceship:
        document.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 87: // W key
                moveForward = false;
                break;
            case 83: // S key
                moveBackward = false;
                break;
            case 65: // A key
                turnLeft = false;
                break;
            case 68: // D key
                turnRight = false;
                break;
            case 81: // Q key
                rollLeft = false;
                break;
            case 69: // E key
                rollRight = false;
                break;
            case 104: // 8 numberpad key
                turnUp = false;
                break;
            case 101: // 5 numberpad key
                turnDown = false;
                break;
            case 102: // 6 numberpad key
                speedUp = false;
                break;
            case 100: // 4 numberpad key
                speedDown = false;
                break;
            }
        });
    }

    // Animation stuff:
    stepWorld(delta) {
        this.time+=delta;
        // Help from chat gpt to get local axis:
        let direction = new T.Vector3(0, 0, speed);
        direction.applyQuaternion(this.mesh.quaternion); // Apply the box's rotation        
        if (moveForward) {
           this.mesh.position.add(direction.clone().multiplyScalar(0.1)); // Move forward along local z-axis
        }
        if (moveBackward) {
            this.mesh.position.add(direction.clone().multiplyScalar(-0.1)); // Move backward along local z-axis
        }
        if (turnLeft) {
            this.mesh.rotateY(delta/2500);
        }
        if (turnRight) {
            this.mesh.rotateY(-delta/2500);
        }
        // This stuff seems to complicate things a lot use at your own risk:
        if(rollLeft) {
            this.mesh.rotateZ(-delta/2500);
        }
        if(rollRight) {
            this.mesh.rotateZ(delta/2500);
        }
        if(turnUp) {
            this.mesh.rotateX(-delta/2500);
        }
        if(turnDown) {
            this.mesh.rotateX(delta/2500);
        }
        if(speedUp) {
            speed += 0.05;
        }
        if(speedDown) {
            speed -= 0.05;
        }
    }
}

// texture loaders:
let sun_texture = new T.TextureLoader().load("./textures/sun.jpg");
let mercury_texture = new T.TextureLoader().load("./textures/mercury.jpg");
let venus_texture = new T.TextureLoader().load("./textures/venus.jpg");
let earth_texture = new T.TextureLoader().load("./textures/earth.jpg");
let moon_texture = new T.TextureLoader().load("./textures/moon.jpg");
let mars_texture = new T.TextureLoader().load("./textures/mars.jpg");
let jupiter_texture = new T.TextureLoader().load("./textures/jupiter.jpg");
let saturn_texture = new T.TextureLoader().load("./textures/saturn.jpg");
let uranus_texture = new T.TextureLoader().load("./textures/uranus.jpg");
let neptune_texture = new T.TextureLoader().load("./textures/neptune.jpg");
let pluto_texture = new T.TextureLoader().load("./textures/pluto.jpg");
//let star_texture = new T.TextureLoader().load("./textures/stars.jpg");

// Geometries/materials/meshes:
let sphere_geometry = new T.SphereGeometry(1,500,500);
// Rings for saturn:
let ring_geometry = new T.RingGeometry(1.2,2,100,100,0,2*Math.PI);
let ring_material = new T.MeshStandardMaterial({color:"#ffe1ab",side:T.DoubleSide});
let ring_mesh = new T.Mesh(ring_geometry,ring_material);
ring_mesh.rotateX(Math.PI/2);
ring_mesh.rotateY(Math.PI/32);
// Cube camera to get nice lit sun texture on outside:
let target = new T.WebGLCubeRenderTarget(256);
let cube_camera = new T.CubeCamera(0.1,10000,target);
let material = new T.MeshStandardMaterial({ envMap: target.texture, metalness:0.9,roughness:0.1});

// Materials/meshes:
let sun_material = new T.MeshStandardMaterial({color:"white", map:sun_texture, envMap:target.texture, metalness:0.5, roughness:0.2, bumpMap:sun_texture, bumpScale:10, side:T.DoubleSide});
let sun_mesh = new T.Mesh(sphere_geometry,sun_material);
let mercury_material = new T.MeshStandardMaterial({color:"white", map:mercury_texture, bumpMap:mercury_texture, bumpScale:10, side:T.DoubleSide});
let mercury_mesh = new T.Mesh(sphere_geometry,mercury_material);
let venus_material = new T.MeshStandardMaterial({color:"white", map:venus_texture, bumpMap:venus_texture, bumpScale:10, side:T.DoubleSide});
let venus_mesh = new T.Mesh(sphere_geometry,venus_material);
let earth_material = new T.MeshStandardMaterial({color:"white", map:earth_texture, bumpMap:earth_texture, bumpScale:10, side:T.DoubleSide});
let earth_mesh = new T.Mesh(sphere_geometry,earth_material);
let moon_material = new T.MeshStandardMaterial({color:"white", map:moon_texture, bumpMap:moon_texture, bumpScale:10, side:T.DoubleSide});
let moon_mesh = new T.Mesh(sphere_geometry,moon_material);
let mars_material = new T.MeshStandardMaterial({color:"white", map:mars_texture, bumpMap:mars_texture, bumpScale:10, side:T.DoubleSide});
let mars_mesh = new T.Mesh(sphere_geometry,mars_material);
let jupiter_material = new T.MeshStandardMaterial({color:"white", map:jupiter_texture, bumpMap:jupiter_texture, bumpScale:10, side:T.DoubleSide});
let jupiter_mesh = new T.Mesh(sphere_geometry,jupiter_material);
let saturn_material = new T.MeshStandardMaterial({color:"white", map:saturn_texture, bumpMap:saturn_texture, bumpScale:10, side:T.DoubleSide});
let saturn_mesh = new T.Mesh(sphere_geometry,saturn_material);
let uranus_material = new T.MeshStandardMaterial({color:"white", map:uranus_texture, bumpMap:uranus_texture, bumpScale:10, side:T.DoubleSide});
let uranus_mesh = new T.Mesh(sphere_geometry,uranus_material);
let neptune_material = new T.MeshStandardMaterial({color:"white", map:neptune_texture, bumpMap:neptune_texture, bumpScale:10, side:T.DoubleSide});
let neptune_mesh = new T.Mesh(sphere_geometry,neptune_material);
let pluto_material = new T.MeshStandardMaterial({color:"white", map:pluto_texture, bumpMap:pluto_texture, bumpScale:10, side:T.DoubleSide});
let pluto_mesh = new T.Mesh(sphere_geometry,pluto_material);

// Note: Planet diameters are scaled down by 1,000, but they are all to scale.
// For example, the sun is 865,000 miles in diameter, so I put a sphere of size 865.
// The Earth is 7938 miles in diameter, so I put a sphere of size 7.938.
// Note: Planet distances from sun are scaled down by 500,000.
// So, Earth is 93 million miles away, so I put 186 as the radius.
// Time is scaled as such: a year on Earth is 365.26 days, so we scale it as 36,526 in javascript.
// As another example, a year on Venus is 224.70 days, so we scale it as 22,470 in javascript.
// Time is scaled as such: a day on earth is 23.93 hours, so we scale it as 2,393 in javascript.

// Sun_Sphere Class
export class Sun_Sphere extends GrObject {
    constructor(params={}) {
        sun_mesh.position.set(0,0,0);
        sun_mesh.scale.set(865,865,865);
        super("Sun_Sphere",sun_mesh);
        this.mesh=sun_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/64800);
        //this.mesh.position.set(10*Math.sin(this.time / 1000), 0, 10*Math.cos(this.time / 1000));
    }
}

// Mercury_Sphere Class
export class Mercury_Sphere extends GrObject {
    constructor(params={}) {
        mercury_mesh.position.set(0,0,0);
        mercury_mesh.scale.set(3,3,3);
        super("Mercury_Sphere",mercury_mesh);
        this.mesh=mercury_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/140760);
        this.mesh.position.set((865+70)*Math.sin(this.time / 8797), 0, (865+70)*Math.cos(this.time / 8797));
    }
}

// Venus_Sphere Class
export class Venus_Sphere extends GrObject {
    constructor(params={}) {
        venus_mesh.position.set(0,0,0);
        venus_mesh.scale.set(7.5,7.5,7.5);
        super("Venus_Sphere",venus_mesh);
        this.mesh=venus_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/583200);
        this.mesh.position.set((865+134)*Math.sin(this.time / 22470), 0, (865+134)*Math.cos(this.time / 22470));
    }
}

// Earth_Sphere Class
export class Earth_Sphere extends GrObject {
    constructor(params={}) {
        earth_mesh.position.set(0,0,0);
        earth_mesh.scale.set(7.938,7.938,7.938);
        super("Earth_Sphere",earth_mesh);
        this.mesh=earth_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/2393);
        this.mesh.position.set((865+186)*Math.sin(this.time / 36526), 0, (865+186)*Math.cos(this.time / 36526));
    }
}

// Moon_Sphere Class
export class Moon_Sphere extends GrObject {
    constructor(params={}) {
        moon_mesh.position.set(0,0,0);
        moon_mesh.scale.set(0.272,0.272,0.272);
        super("Moon_Sphere",moon_mesh);
        this.mesh=moon_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/65520);
        //this.mesh.position.set((1000)*Math.sin(this.time / 50000), 0, (1000)*Math.cos(this.time / 50000));
    }
}

// Mars_Sphere Class
export class Mars_Sphere extends GrObject {
    constructor(params={}) {
        mars_mesh.position.set(0,0,0);
        mars_mesh.scale.set(4.2,4.2,4.2);
        super("Mars_Sphere",mars_mesh);
        this.mesh=mars_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/2462);
        this.mesh.position.set((865+284)*Math.sin(this.time / 68698), 0, (865+284)*Math.cos(this.time / 68698));
    }
}

// Jupiter_Sphere Class
export class Jupiter_Sphere extends GrObject {
    constructor(params={}) {
        jupiter_mesh.position.set(0,0,0);
        jupiter_mesh.scale.set(89,89,89);
        super("Jupiter_Sphere",jupiter_mesh);
        this.mesh=jupiter_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/984);
        this.mesh.position.set((865+968)*Math.sin(this.time / 432890), 0, (865+968)*Math.cos(this.time / 432890));
    }
}

// Saturn_Sphere Class
export class Saturn_Sphere extends GrObject {
    constructor(params={}) {
        saturn_mesh.position.set(0,0,0);
        saturn_mesh.scale.set(74.9,74.9,74.9);
        super("Saturn_Sphere",saturn_mesh);
        this.mesh=saturn_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/1023);
        this.mesh.position.set((865+1778)*Math.sin(this.time / 1075290), 0, (865+1778)*Math.cos(this.time / 1075290));
    }
}

// Uranus_Sphere Class
export class Uranus_Sphere extends GrObject {
    constructor(params={}) {
        uranus_mesh.position.set(0,0,0);
        uranus_mesh.scale.set(32,32,32);
        super("Uranus_Sphere",uranus_mesh);
        this.mesh=uranus_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/2800);
        this.mesh.position.set((865+3580)*Math.sin(this.time / 3066365), 0, (865+3580)*Math.cos(this.time / 3066365));
    }
}

// Neptune_Sphere Class
export class Neptune_Sphere extends GrObject {
    constructor(params={}) {
        neptune_mesh.position.set(0,0,0);
        neptune_mesh.scale.set(31,31,31);
        super("Neptune_Sphere",neptune_mesh);
        this.mesh=neptune_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/2000);
        this.mesh.position.set((865+5600)*Math.sin(this.time / 6014835), 0, (865+5600)*Math.cos(this.time / 6014835));
    }
}

// Pluto_Sphere Class
export class Pluto_Sphere extends GrObject {
    constructor(params={}) {
        pluto_mesh.position.set(0,0,0);
        pluto_mesh.scale.set(1.477,1.477,1.477);
        super("Pluto_Sphere",pluto_mesh);
        this.mesh=pluto_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/15336);
        this.mesh.position.set((865+7400)*Math.sin(this.time / 9049810), 0, (865+7400)*Math.cos(this.time / 9049810));
    }
}

// Star skybox:
const loader = new T.CubeTextureLoader();
const textureCube = loader.load(
    ['./textures/stars.jpg','./textures/stars.jpg','./textures/stars.jpg','./textures/stars.jpg','./textures/stars.jpg','./textures/stars.jpg']
);

// Create some better light:
const ambientLight = new T.AmbientLight("white",1);
world.scene.add(ambientLight);

// The sun should be emitting light:
const sunLight = new T.PointLight(0xffffff,10,100000,0.1);
sunLight.position.set(0,0,0);
world.scene.add(sunLight);

// Cool Stars:
world.scene.background = textureCube;

// Create planet classes:
let sun_sphere = new Sun_Sphere();
let mercury_sphere = new Mercury_Sphere();
let venus_sphere = new Venus_Sphere();
let earth_sphere = new Earth_Sphere();
let moon_sphere = new Moon_Sphere();
let mars_sphere = new Mars_Sphere();
let jupiter_sphere = new Jupiter_Sphere();
let saturn_sphere = new Saturn_Sphere();
let uranus_sphere = new Uranus_Sphere();
let neptune_sphere = new Neptune_Sphere();
let pluto_sphere = new Pluto_Sphere();
let spaceship = new Spaceship();
let alien1 = new Alien();
let astronaut1 = new Astronaut();
let mirrorsphere = new Mirror_Sphere();
let satellite = new Satellite();

// Add planets to the world (with scaling):
world.add(sun_sphere);
world.add(mercury_sphere);
world.add(venus_sphere);
world.add(earth_sphere);
//world.add(moon_sphere);
world.add(mars_sphere);
world.add(jupiter_sphere);
world.add(saturn_sphere);
world.add(uranus_sphere);
world.add(neptune_sphere);
world.add(pluto_sphere);
world.add(spaceship);
world.add(mirrorsphere);
//world.add(satellite);

saturn_sphere.objects[0].add(ring_mesh);
earth_sphere.objects[0].add(moon_sphere.objects[0]);
moon_sphere.objects[0].translateX(2);
alien1.objects[0].translateY(1.09);
alien1.objects[0].rotateX(3*Math.PI/4);
mars_sphere.objects[0].add(alien1.objects[0]);
astronaut1.objects[0].rotateX(Math.PI/4);
astronaut1.objects[0].translateZ(1.1);
earth_sphere.objects[0].add(astronaut1.objects[0]);
earth_sphere.objects[0].add(satellite.objects[0]);


function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}

highlight("Sun_Sphere");
highlight("Mercury_Sphere");
highlight("Venus_Sphere");
highlight("Earth_Sphere");
//highlight("Moon_Sphere");
highlight("Mars_Sphere");
highlight("Jupiter_Sphere");
highlight("Saturn_Sphere");
highlight("Uranus_Sphere");
highlight("Neptune_Sphere");
highlight("Pluto_Sphere");
highlight("Spaceship");

//world.renderer.render(world.scene,camera);
world.ui = new WorldUI(world);

// Let 'er rip baby:
world.go();

// Ignore stuff below here:
// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
//main(world);
// while making your objects, be sure to identify some of them as "highlighted"
///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here

// of course, the student should highlight their own objects, not these
// highlight("SimpleHouse-5");
// highlight("Helicopter-0");
// highlight("Track Car");
// highlight("MorphTest");
///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world

// now make it go!
//world.go();
