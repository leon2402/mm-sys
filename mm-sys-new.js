function init() {
	var scene = new THREE.Scene();
    var clock = new THREE.Clock();
	var plane = getPlane(1000);

	plane.name = 'plane-1';

    plane.rotation.x = Math.PI/2;

    var sphere = getSphere(5);
    var pointLight = getPointLight(1);
    pointLight.position.y = 20;
    pointLight.intensity = 2;
    pointLight.add(sphere);
    scene.add(pointLight);
    
    sphere = getSphere(5);
    pointLight = getPointLight(1);
    pointLight.position.y = 300;
    pointLight.position.z = -50;
    pointLight.position.x = 50;
    pointLight.add(sphere);
    
    scene.add(pointLight);
   
    scene.add(plane);
    
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
		1000
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
	cameraZPosition.position.z = 700;

	/*new TWEEN.Tween({val: 700})
		.to({val: -50}, 12000)
		.onUpdate(function() {
			cameraZPosition.position.z = this.val;
		})
		.start();*/

	/*new TWEEN.Tween({val: -Math.PI/2})
		.to({val: 0}, 6000)
		.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			cameraXRotation.rotation.x = this.val;
		})
		.start();*/

    new TWEEN.Tween({val: 0})
		.to({val: Math.PI*3}, 6000)
		//.delay(1000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			cameraYRotation.rotation.y = this.val;
        })
        .onComplete(function() {
            console.log('test')
            cameraXRotation.rotation.x = 0;
	        cameraYPosition.position.y = 400;
	        cameraZPosition.position.z = 700;
        })
        .start();
        


    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(120, 120, 120)');
	document.getElementById('main').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
   
    update(renderer, scene, camera, controls, clock);
    
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
function getMaterial(type, color) {
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
    };

    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
        default: 
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
    }

    return selectedMaterial;
}

function update(renderer, scene, camera, controls, clock) {
	renderer.render(
		scene,
		camera
    );
    
    controls.update();
    TWEEN.update();

    var timeElapsed = clock.getElapsedTime();
    var cameraZRotation = scene.getObjectByName('cameraZRotation');
	cameraZRotation.rotation.z = noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02;
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock);
	})
}


var scene = init();