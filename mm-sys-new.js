function init() {
	var scene = new THREE.Scene();
	var plane = getPlane(1000);
    var gui = new dat.GUI();

	plane.name = 'plane-1';

    plane.rotation.x = Math.PI/2;
    scene.add(plane);

    var sphere_1 = getSphere(5);
    var pointLight_1 = getPointLight(1);
    pointLight_1.position.y = 30;
    pointLight_1.intensity = 2;
    pointLight_1.add(sphere_1);
    scene.add(pointLight_1);
    

    sphere_2 = getSphere(5);
    var pointLight_2 = getPointLight(1);
    pointLight_2.position.y = 300;
    pointLight_2.position.z = 50;
    pointLight_2.position.x = 0;
    pointLight_2.add(sphere_2);
    
    scene.add(pointLight_2);

    gui.add(pointLight_1, 'intensity', 0, 2);
    gui.add(pointLight_1.position, 'z', -100, 100);

    gui.add(pointLight_2, 'intensity', 0, 2);
    gui.add(pointLight_2.position, 'y', 0, 1000);
    gui.add(pointLight_2.position, 'z', -100, 100);
    gui.add(pointLight_2.position, 'x', -1000, 1000);

    var path = 'assets/cubemap/';
    var format = '.jpg';
    var fileNames = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

    var reflectionCube = new THREE.CubeTextureLoader().load(fileNames.map(function(fileName) {
        return path + fileName + format;
    }));
    scene.background = reflectionCube;
    
    var loader = new THREE.FontLoader();
    var mesh
    loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {

        var textGeo = new THREE.TextGeometry( "HSH", {

            font: font,

            size: 200,
            height: 20,
            curveSegments: 12,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true

        } );

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();
        //textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
        var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        var textMaterial = new THREE.MeshPhongMaterial( { color: '#ff8000' } );
        mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.x = centerOffset;
        mesh.position.y = 50
        mesh.position.z = 0;
        mesh.castShadow = true;
        scene.add( mesh );

    } );
    //var logo = getLogo()
    //console.log(logo)
    //scene.add(logo)

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		5000
	);

	var cameraZRotation = new THREE.Group();
	var cameraYPosition = new THREE.Group();
	var cameraZPosition = new THREE.Group();
	var cameraXRotation = new THREE.Group();
	var cameraYRotation = new THREE.Group();

	cameraZRotation.name = 'cameraZRotation';
	cameraYPosition.name = 'cameraYPosition';
	cameraZPosition.name = 'cameraZPosition';
	cameraXRotation.name = 'cameraXRotation';
	cameraYRotation.name = 'cameraYRotation';

	cameraZRotation.add(camera);
	cameraYPosition.add(cameraZRotation);
	cameraZPosition.add(cameraYPosition);
	cameraXRotation.add(cameraZPosition);
	cameraYRotation.add(cameraXRotation);
	scene.add(cameraYRotation);

	cameraXRotation.rotation.x = 0;
	cameraYPosition.position.y = 400;
	cameraZPosition.position.z = -700;

    new TWEEN.Tween({val: 0})
		.to({val: Math.PI*3}, 6000)
		//.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			cameraYRotation.rotation.y = this.val;
        })
        .onComplete(function() {
            console.log('test')
            camera.position.set( 10, 400, -700 );
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
        .start();
        


    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(120, 120, 120)');
	document.getElementById('main').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
   
    update(renderer, scene, camera, controls);
    
	return scene;
}
function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var loader = new THREE.TextureLoader();
	var material = new THREE.MeshPhongMaterial({
        map: loader.load('assets/textures/concrete.jpg'),
		//color: 'rgb(120, 120, 120)',
		side: THREE.DoubleSide
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
    //console.log(mesh)
    mesh.receiveShadow = true;
	return mesh;
}
function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
	return light;
}
function getSphere(size) {
	var geometry = new THREE.SphereGeometry(size, 24, 24);
	var material = new THREE.MeshBasicMaterial({
		color: 'rgb(255, 255, 255)'
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);

	return mesh;
}

function update(renderer, scene, camera, controls) {
	renderer.render(
		scene,
		camera
    );
    
    controls.update();
    TWEEN.update();


	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	})
}


var scene = init();