var container
var windowHalfX = window.innerWidth / 2;
var targetRotation = 0
var camera



container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
camera.position.set( 0, 400, 700 );
cameraTarget = new THREE.Vector3( 0, 150, 0 );

scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
// LIGHTS
var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
dirLight.position.set( 0, 0, 1 ).normalize();
scene.add( dirLight );
var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
pointLight.position.set( 100, 100, 90 );
scene.add( pointLight );

var plane = getPlane(1000);
plane.rotation.x = Math.PI/2;
scene.add(plane)

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );



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
	mesh.position.y = 10
	mesh.position.z = 0;
    scene.add( mesh );

} );

camera.lookAt( cameraTarget )
renderer.clear()

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

	return mesh;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp() {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseOut() {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function animate () {
    requestAnimationFrame( animate );
    mesh.rotation.y += targetRotation * 0.005;
	//mesh.rotation.y += 3.16 * 2
    renderer.render( scene, camera );
};


document.addEventListener( 'mousedown', onDocumentMouseDown, false );
window.addEventListener('resize', onWindowResize, false)


animate()
