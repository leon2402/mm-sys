function init() {
	var scene = new THREE.Scene();
	
	var plane = getPlane(1000);

	plane.name = 'plane-1';

    plane.rotation.x = Math.PI/2;

    var sphere = getSphere(5);
    var pointLight = getPointLight(1);
    pointLight.position.y = 20;
    pointLight.intensity = 2;
    pointLight.add(sphere);
    scene.add(pointLight);
    
    var sphere = getSphere(5);
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

	camera.position.set( 0, 400, 700 );

	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(120, 120, 120)');
	document.getElementById('main').appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
   
	update(renderer, scene, camera, controls);

	return scene;
}
function getLogo () {
    var loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {

        var textGeo = new THREE.TextGeometry( "HSH", {

            font: font,

            size: 20,
            height: 2,
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
        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.x = centerOffset;
        mesh.position.y = 10
        mesh.position.z = 0;
        console.log(mesh)
        return mesh

    });
}
function getPlane(size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
		side: THREE.DoubleSide
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
    //console.log(mesh)
	return mesh;
}
function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);

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

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	})
}


var scene = init();