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

// make the world
//let camera = new T.PerspectiveCamera(45,1920/1080,0.1,200000);
let world = new GrWorld({
    //camera:camera,
    //lookat:new T.Vector3(0,0,10000),
    //lookfrom:new T.Vector3(0,0,900),
    width: 1920,
    height: 1080,
    far: 200000,
    groundplane: false,
});

// Handle keyboard input
let moveForward = false;
let moveBackward = false;
let turnLeft = false;
let turnRight = false;
// let box_geometry = new T.BoxGeometry(10,10,20);
// let box_material = new T.MeshStandardMaterial({color:"yellow"});
// let box_mesh = new T.Mesh(box_geometry,box_material);

// Spaceship Class
export class Spaceship extends Loaders.ObjGrObject {
    constructor(params={}) {
        super({
            obj:"./textures/spaceship.obj",
            norm:2,
            name: "Spaceship",
        })


        // let spaceship = new Loaders.ObjGrObject({
        //     obj:"./textures/spaceship.obj",
        // });

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.5);
        this.ridePoint.translateZ(-3);
        this.objects[0].add(this.ridePoint);
        this.rideable = this.ridePoint;


        this.objects[0].position.set(0,0,1000);
        this.objects[0].scale.set(0.1,0.1,0.1);
        //spaceship.rideable=true;
        //world.add(spaceship);
        //box_mesh.position.set(0, 0, 1000);
      
        //super("Spaceship", spaceship);
        this.mesh=this.objects[0];
        this.time=0;
        //this.rideable=this.objects[0];

        
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
            }
        });

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
            }
        });
    }

    stepWorld(delta) {
        this.time+=delta;
        //this.mesh.rotateY(delta/5000);
        // Help from chat gpt to get local axis:
        let direction = new T.Vector3(0, 0, 100);
        direction.applyQuaternion(this.mesh.quaternion); // Apply the box's rotation        
        if (moveForward) {
           this.mesh.position.add(direction.clone().multiplyScalar(0.1)); // Move forward along local z-axis
        }
        if (moveBackward) {
            this.mesh.position.add(direction.clone().multiplyScalar(-0.1)); // Move backward along local z-axis
        }
        if (turnLeft) {
            this.mesh.rotateY(delta/5000);
        }
        if (turnRight) {
            this.mesh.rotateY(-delta/5000);
        }

        // camera.position.set(0,0,this.mesh.position.z-50);
        // camera.lookAt(this.mesh);
        // world.renderer.render(world.scene,camera);
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
let star_texture = new T.TextureLoader().load("./textures/stars.png");

// Geometries/materials/meshes:
let sphere_geometry = new T.SphereGeometry(1,500,500);

let sun_material = new T.MeshStandardMaterial({color:"white", map:sun_texture, bumpMap:sun_texture, bumpScale:10});
let sun_mesh = new T.Mesh(sphere_geometry,sun_material);
let mercury_material = new T.MeshStandardMaterial({color:"white", map:mercury_texture, bumpMap:mercury_texture, bumpScale:10});
let mercury_mesh = new T.Mesh(sphere_geometry,mercury_material);
let venus_material = new T.MeshStandardMaterial({color:"white", map:venus_texture, bumpMap:venus_texture, bumpScale:10});
let venus_mesh = new T.Mesh(sphere_geometry,venus_material);
let earth_material = new T.MeshStandardMaterial({color:"white", map:earth_texture, bumpMap:earth_texture, bumpScale:10});
let earth_mesh = new T.Mesh(sphere_geometry,earth_material);
let moon_material = new T.MeshStandardMaterial({color:"white", map:moon_texture, bumpMap:moon_texture, bumpScale:10});
let moon_mesh = new T.Mesh(sphere_geometry,moon_material);
let mars_material = new T.MeshStandardMaterial({color:"white", map:mars_texture, bumpMap:mars_texture, bumpScale:10});
let mars_mesh = new T.Mesh(sphere_geometry,mars_material);
let jupiter_material = new T.MeshStandardMaterial({color:"white", map:jupiter_texture, bumpMap:jupiter_texture, bumpScale:10});
let jupiter_mesh = new T.Mesh(sphere_geometry,jupiter_material);
let saturn_material = new T.MeshStandardMaterial({color:"white", map:saturn_texture, bumpMap:saturn_texture, bumpScale:10});
let saturn_mesh = new T.Mesh(sphere_geometry,saturn_material);
let uranus_material = new T.MeshStandardMaterial({color:"white", map:uranus_texture, bumpMap:uranus_texture, bumpScale:10});
let uranus_mesh = new T.Mesh(sphere_geometry,uranus_material);
let neptune_material = new T.MeshStandardMaterial({color:"white", map:neptune_texture, bumpMap:neptune_texture, bumpScale:10});
let neptune_mesh = new T.Mesh(sphere_geometry,neptune_material);
let pluto_material = new T.MeshStandardMaterial({color:"white", map:pluto_texture, bumpMap:pluto_texture, bumpScale:10});
let pluto_mesh = new T.Mesh(sphere_geometry,pluto_material);

// Note: Planet diameters scaled down by 1000.
// Note: Planet orbit radii scaled down by 40,000.
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
        this.mesh.rotateY(delta/50000);
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
        this.mesh.rotateY(delta/5000);
        this.mesh.position.set(920*Math.sin(this.time / 1000000), 0, 920*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        this.mesh.position.set(1680*Math.sin(this.time / 1000000), 0, 1680*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        this.mesh.position.set(2325*Math.sin(this.time / 1000000), 0, 2325*Math.cos(this.time / 1000000));
    }
}

// Moon_Sphere Class
export class Moon_Sphere extends GrObject {
    constructor(params={}) {
        moon_mesh.position.set(0,0,0);
        moon_mesh.scale.set(2.159,2.159,2.159);
        super("Moon_Sphere",moon_mesh);
        this.mesh=moon_mesh;
        this.time=0;
    }
    stepWorld(delta) {
        this.time += delta;
        this.mesh.rotateY(delta/5000);
        this.mesh.position.set(2400*Math.sin(this.time / 1000000), 0, 2400*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        this.mesh.position.set(3540*Math.sin(this.time / 1000000), 0, 3540*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        // Should be 12090
        this.mesh.position.set(8500*Math.sin(this.time / 1000000), 0, 8500*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        // Should be 22163
        this.mesh.position.set(13500*Math.sin(this.time / 1000000), 0, 13500*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        // Should be 44593
        this.mesh.position.set(18500*Math.sin(this.time / 1000000), 0, 18500*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        // Should be 69880
        this.mesh.position.set(23500*Math.sin(this.time / 1000000), 0, 23500*Math.cos(this.time / 1000000));
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
        this.mesh.rotateY(delta/5000);
        // Should be 91753
        this.mesh.position.set(28500*Math.sin(this.time / 1000000), 0, 28500*Math.cos(this.time / 1000000));
    }
}

// Star skybox:
const loader = new T.CubeTextureLoader();
const textureCube = loader.load(
    ['./textures/stars.png','./textures/stars.png','./textures/stars.png','./textures/stars.png','./textures/stars.png','./textures/stars.png']
);

// Create some better light:
const ambientLight = new T.AmbientLight("white",2);
world.scene.add(ambientLight);
//world.scene.background = textureCube;

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

// Add planets to the world (with scaling):
world.add(sun_sphere);
world.add(mercury_sphere);
world.add(venus_sphere);
world.add(earth_sphere);
world.add(moon_sphere);
world.add(mars_sphere);
world.add(jupiter_sphere);
world.add(saturn_sphere);
world.add(uranus_sphere);
world.add(neptune_sphere);
world.add(pluto_sphere);
world.add(spaceship);

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
highlight("Moon_Sphere");
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
