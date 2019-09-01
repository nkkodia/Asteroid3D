var renderer, scene, camera, pointLight, spotLight,
 bgScene, bgCamera;
var canvasWidth = window.innerWidth,
 canvasHeight = window.innerHeight;

var ship,
 shield,
 bullets = [];
var asteroids = [];
var gif;
var bulletVelocity = 1;
var shipRotationVelocity = .1;
var START_ASTEROID_VELOCITY = .1;
var asteroidVelocity = START_ASTEROID_VELOCITY;
var FINISH_ASTEROID_VELOCITY = .25;

var NUM_BULLETS = 15;
var originPosition = new THREE.Vector3(0,0,0);
var nb_asteroid = 25;
var score = 0;
var level= 1;
var inPlay = false;
var isPaused = false;
var soundOn = true;
var isLoaded = false;
var lives = 3;
var invincible = false;
var gameSize = 512;

var clock = new THREE.Clock();
var gameOverSound;
var shipFiringSound;
var shipMaterial =
new THREE.MeshLambertMaterial(
{
	color: 0xD43001
});

var shieldMaterial = 
new THREE.MeshBasicMaterial(
{
	color: 0xADD8E6,
	transparent: true,
	opacity: 0.7
});

var spaceMaterial = 
new THREE.MeshBasicMaterial(
{
	color: 0xFFFFFF,
});

var bulletMaterial = 
new THREE.MeshLambertMaterial(
{
	color: 0xD43381,
	transparent: true,
	opacity: 0.0
});

var asteroidMaterial1 =
new THREE.MeshLambertMaterial(
{
	color: 0xFFFFFF
});

var asteroidMaterial2 =
new THREE.MeshLambertMaterial(
{
	color: 0xFFFFFF
});

var asteroidMaterial3 =
new THREE.MeshLambertMaterial(
{
	color: 0xFFFFFF
});

var fireMaterial =
new THREE.MeshLambertMaterial(
{
	color: 0xFFFFFF
});

var explosionMaterial = 
new THREE.MeshLambertMaterial(
{
	color: 0xFFFFFF
});

var textureVie3 =
new THREE.MeshBasicMaterial(
{
	color: 0xFFFFFF,
});

var textureVie2 = 
new THREE.MeshBasicMaterial(
{
	color: 0xFFFFFF,
});

var textureVie1 = 
new THREE.MeshBasicMaterial(
{
	color: 0xFFFFFF,
});

function vie() {


		pyramidGeometry3 = new THREE.CylinderGeometry(4, 1.5, 1.5, 4, false);
		pyramidGeometry2 = new THREE.CylinderGeometry(4, 1.5, 1.5, 4, false);
		pyramidGeometry1 = new THREE.CylinderGeometry(4, 1.5, 1.5, 4, false);


		pyramidMaterial3 = new THREE.MeshPhongMaterial({map: textureVie3});
		pyramidMaterial2 = new THREE.MeshPhongMaterial({map: textureVie2});
		pyramidMaterial1 = new THREE.MeshPhongMaterial({map: textureVie1});


		 pyramidVie3 = new THREE.Mesh(pyramidGeometry3, pyramidMaterial3); 
		 pyramidVie3.position.set(65, 0.0, -53);
		 pyramidVie2 = new THREE.Mesh(pyramidGeometry2, pyramidMaterial2); 
		 pyramidVie2.position.set(75, 0.0, -53);
		 pyramidVie1 = new THREE.Mesh(pyramidGeometry1, pyramidMaterial1); 
		 pyramidVie1.position.set(85, 0.0, -53);

         scene.add(pyramidVie3);
         scene.add(pyramidVie2);
         scene.add(pyramidVie1);

         return {
            pyramidVie3 : pyramidVie3,
            pyramidVie2 : pyramidVie2,
            pyramidVie1 : pyramidVie1
         };
         
}
function startGame() {

	
	removeExplosion();
	var gameCanvas = document.getElementById('gameCanvas');
	gameCanvas.style.display = 'block';
	var explosionCanvas = document.getElementById('explosionCanvas');
	explosionCanvas.style.display = "none";

	inPlay = true;
	score = 0;
	level = 0;
	updateScore();
	asteroidVelocity = 0.1;

	for (var i = 0; i < nb_asteroid; i++) {
		resetAsteroid(asteroids[i]);
	}
	for (var i = 0; i < NUM_BULLETS; i++) {
		resetBullet(bullets[i]);
	}
}

function explosion() {

	var gameCanvas = document.getElementById('gameCanvas');
	gameCanvas.style.display = 'none';
	var explosion = document.getElementById('explosion');
	explosion.src = "src/medias/images/giphy.gif";
	var explosionCanvas = document.getElementById('explosionCanvas');
	explosionCanvas.style.display = "block";
	setTimeout(removeExplosion, 6000);
}

function removeExplosion () {
	if (!inPlay) {
		var explosion = document.getElementById('explosion');
		explosion.src = "src/medias/images/espace.jpg";
		var explosionCanvas = document.getElementById('explosionCanvas');
		explosionCanvas.style.display = "block";
	}
}

function endGame() {
	if (inPlay) {
		if (soundOn) {
			gameOverSound.play();
		}
	}
	inPlay = false;
	for (var i = 0; i < nb_asteroid; i++) {
		asteroids[i].direction = originPosition.clone();
	};
	explosion();
}

function loading(data, type){
	
		var c = document.getElementById("Bonjour ! ");
		c.textContent = "Pressez Entrer pour commencer !";
}


function updateScore() {
	var c = document.getElementById("currentScore");
	c.textContent = "SCORE: " + score.toString();
	if(score <= score*5){

		level = level + 1;

		var le = document.getElementById("currentLevel");
		le.textContent = "Level: " + level.toString();
	}

	
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomPointOnCircle(radius) {
	var angle = Math.random()*Math.PI*2;
	x = Math.cos(angle)*radius;
	z = Math.sin(angle)*radius;

	return new THREE.Vector3(x, 0, z);
}


function setup() {
	
	function startSetup() {
		loadMaterials();
	}


	function loadMaterials() {
		function loadAsteroid1Texture() {
			var texture = THREE.ImageUtils.loadTexture('src/medias/images/Texture_asteroid.jpg', THREE.SphericalReflectionMapping,
				function (material) { 
					asteroidMaterial1.map = material;
					loadAsteroid2Texture();
				}, function (data) { loading(data, "asteroid 1 texture")});
		}

		function loadAsteroid2Texture() {
			var texture = THREE.ImageUtils.loadTexture('src/medias/images/Texture_asteroid.jpg', THREE.SphericalReflectionMapping,
				function (material) { 
					asteroidMaterial2.map = material;
					loadAsteroid3Texture();
				}, function (data) { loading(data, "asteroid 2 texture")});
		}

		function loadAsteroid3Texture() {
			var texture = THREE.ImageUtils.loadTexture('src/medias/images/Texture_asteroid.jpg', THREE.SphericalReflectionMapping,
				function (material) { 
					asteroidMaterial3.map = material;
					loadFireTexture();
				}, function (data) { loading(data, "asteroid 3 texture")});
		}

		function loadFireTexture() {
			var texture = THREE.ImageUtils.loadTexture('src/medias/images/feu.jpg', THREE.SphericalReflectionMapping,
				function (material) { 
					fireMaterial.map = material;
					loadSpaceTexture();
				}, function (data) { loading(data, "fire texture")});
		}

		function loadSpaceTexture() {
			var texture = THREE.ImageUtils.loadTexture('src/medias/images/espace.jpg', THREE.SphericalReflectionMapping,
				function (material) { 
					spaceMaterial.map = material;
					loadShip();
				}, function (data) { loading(data, "space texture")});
		}
		function loadVie3(){

		  var texture = THREE.ImageUtils.loadTexture('src/medias/images/vie.jpg', THREE.SphericalReflectionMapping, 
		  	function(material) {
		  		textureVie3.map = material;
		  		loadVie2();
		  	}, function(data) { loading(data, "vie3 texture")});
		}

		function loadVie2(){

		  var texture = THREE.ImageUtils.loadTexture('src/medias/images/vie.jpg', THREE.SphericalReflectionMapping, 
		  	function(material) {
		  		textureVie2.map = material;
		  		loadVie1();
		  	}, function(data) { loading(data, "vie2 texture")});
		}

		function loadVie1(){

		  var texture = THREE.ImageUtils.loadTexture('src/medias/images/vie.jpg', THREE.SphericalReflectionMapping, 
		  	function(material) {
		  		textureVie1.map = material;
		  	}, function(data) { loading(data, "vie1 texture")});
		}

		loadAsteroid1Texture();
	}


	function loadShip() {
		var loader = new THREE.ObjectLoader();
		loader.load( 'src/medias/models/star-wars-vader-tie-fighter.json',  

    	    	function ( model ) {
    	    		ship = model;
    	    		finishSetup();
    	    	}, function(data) { loading(data, "ship model")});
	}

	function finishSetup() {
		createScene();
		draw();
		isLoaded = true;

	}

	startSetup();
}

function draw()
{

  	renderer.autoClear = false;
  	renderer.clear();
  	renderer.render(bgScene, bgCamera);
  	renderer.render(scene, camera);
  	requestAnimationFrame(draw);

	if (inPlay && !isPaused) {
		shipMovement();
		asteroidMovement();
		bulletMovement();
		checkCollisions();
	}
}

function createScene() 
{

	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;


	renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true	// to allow screenshot
        });

	renderer.setSize(canvasWidth, canvasHeight);

	var c = document.getElementById("gameCanvas");
	c.appendChild(renderer.domElement);

	var bg = new THREE.Mesh(
		new THREE.PlaneGeometry(2, 2, 0), spaceMaterial
		);

	bg.material.depthTest = false;
	bg.material.depthWrite = false;

	bgScene = new THREE.Scene();
	bgCamera = new THREE.Camera();
	bgScene.add(bgCamera);
	bgScene.add(bg);
	scene = new THREE.Scene();

	function createShip() {
		ship.scale.set(2,2,2);
		ship.position.x = 0;
		ship.position.y = 0;
		ship.position.z = 0;

		var direction = new THREE.Vector3(10,0,0);
		ship.lookAt(direction);
	    ship.direction = direction.clone().negate().normalize();
	    scene.add( ship );

	  }

	  function createShield() {
	  	var bbox = new THREE.BoundingBoxHelper( ship, 0xFFFFFF );
	  	bbox.update();
	  	shield = new THREE.Mesh(
	  		new THREE.SphereGeometry(bbox.box.getBoundingSphere().radius * .7,
	  			8,
	  			8),
	  		shieldMaterial);
}

function createBullets() {

			var radius = .5;
			var segments = 4;
			var rings = 4;
			var bullet = new THREE.Mesh(
				new THREE.SphereGeometry(radius,
					segments,
					rings),
				bulletMaterial.clone());
			bullet.direction = new THREE.Vector3(0,0,0);
			makeTransparent(bullet);
			scene.add(bullet);
			bullets.push(bullet);
	}

		function createAsteroids() {
		for (var i = 0; i < nb_asteroid; i++) {
			var rand = getRandomInt(1, 4);
			var radius = 2;
			var segments = 8;
			var rings = 8;
			var material;
			if (i < nb_asteroid) material = asteroidMaterial1.clone();
				var ast = new THREE.Mesh(
					new THREE.SphereGeometry(radius,
						segments,
						rings),
					material);
			
			ast.velocity = asteroidVelocity;
			ast.mass = 2;
			ast.isShot = false;
			resetAsteroid(ast)
			scene.add(ast);
			asteroids.push(ast);
		};
	}

	function createLights() {
		pointLight = new THREE.PointLight(0xF8D898);
		pointLight.position.x = 0;
		pointLight.position.y = 1000;
		pointLight.position.z = 0;
		pointLight.intensity = 2.9;
		pointLight.distance = 10000;
		scene.add(pointLight);
	}

	function createCamera() {

		var aspect = canvasWidth / canvasHeight;
		camera = new THREE.PerspectiveCamera(
			70,
			aspect,
			0.2,
			10000);

		scene.add(camera);
		camera.position.y = 50;

		camera.lookAt(originPosition);
	}

	function createSounds() {
 		gameOverSound = new Audio("src/medias/sounds/Blast-SoundBible.com-2068539061.wav");
 		shipFiringSound = new Audio("src/medias/sounds/science_fiction_laser_005.mp3");
 	}

 	createShip();
 	createShield();
 	createBullets();
 	createAsteroids();
 	createLights();
 	createCamera();
 	createSounds();

 }

 function makeOpaque(bullet) {
 	bullet.material.transparent = false;
 	bullet.material.opacity = 1.0;
 }

 function makeTransparent(bullet) {
 	bullet.material.transparent = true;
 	bullet.material.opacity = 0.0;
 }

function shipMovement()
{
	if (Key.isDown(Key.LEFT) || Key.isDown(Key.DOWN))		
	{
		ship.rotation.y += shipRotationVelocity;
		ship.direction = ship.direction.clone().applyAxisAngle(new THREE.Vector3(0,1,0), shipRotationVelocity);
	}	

	else if (Key.isDown(Key.RIGHT) || Key.isDown(Key.UP))
	{
		ship.rotation.y -= shipRotationVelocity;
		ship.direction = ship.direction.clone().applyAxisAngle(new THREE.Vector3(0,1,0), -shipRotationVelocity);
	}
	else
	{

	}
}

function resetBullet(bullet)
{
	bullet.position.set(0,0,0);
	bullet.direction.set(0,0,0);
	makeTransparent(bullet);
}

function resetBulletIfOutOfBounds(bullet) 
{

if (bullet.position.x < -30  || 
	bullet.position.x >  30  || 
	bullet.position.z < -30 || 
	bullet.position.z > 30)
{
	resetBullet(bullet);
	bullet.position.set(0,0,0);
	bullet.direction.set(0,0,0);
	makeTransparent(bullet);
}
}

var TIME_STEP = 100;

function fade1 (arg) {
	return function () {
		arg.material.transparent = true;
		arg.material.opacity = .8;
		setTimeout(fade2(arg), TIME_STEP);
	}
}
function fade2 (arg) {
	return function () {
		arg.material.opacity = .6;
		setTimeout(fade3(arg), TIME_STEP);
	}
}
function fade3 (arg) {
	return function () {
		arg.material.opacity = .4;
		setTimeout(fade4(arg), TIME_STEP);
	}
}
function fade4 (arg) {
	return function () {
		arg.material.opacity = .2;
		setTimeout(fade5(arg), TIME_STEP);
	}
}
function fade5 (arg) {
	return function () {
		arg.material.opacity = 0;
		setTimeout(resetAsteroid(arg), TIME_STEP);
	}
}

function resetAsteroid(ast)
{
	var hasCollision = true;
	while (hasCollision) {
		var hasCollision = false;

		ast.position.copy(getRandomPointOnCircle(50));
		ast.direction = getRandomPointOnCircle(50).sub(ast.position).normalize();
		var sphere1 = new THREE.Sphere(ast.position, ast.geometry.boundingSphere.radius);
		for (var i = 0; i < asteroids.length; i++) {
			if (ast == asteroids[i]) continue; // pointer comparison
			var sphere2 = new THREE.Sphere(asteroids[i].position, asteroids[i].geometry.boundingSphere.radius);
			if (sphere1.intersectsSphere(sphere2)) {
				hasCollision = true;
				break;
			}
		};
	} 

	var rand = getRandomInt(1, 4);
	var material;
	if (rand == 1) material = asteroidMaterial1.clone();
	else if (rand == 2) material = asteroidMaterial2.clone();
	else material = asteroidMaterial3.clone()

	ast.material = material;
	ast.isShot = false;
	ast.velocity = asteroidVelocity;
}

function resetAsteroidIfOutOfBounds(ast)
{
	if (ast.position.x < -50  || 
		ast.position.x >  50  || 
		ast.position.z < -50 || 
		ast.position.z > 50)
	{
		resetAsteroid(ast);
	}
}

function asteroidMovement()
{
	for (var i = 0; i < asteroids.length; i++) {
		resetAsteroidIfOutOfBounds(asteroids[i]);
	};

	for (var i = 0; i < asteroids.length; i++) {
		asteroids[i].position = asteroids[i].position.add(asteroids[i].direction.clone().multiplyScalar(asteroids[i].velocity));
	};
}



function checkCollisions()
{
	for (var i = 0; i < asteroids.length; i++) {
		var sphere1 = new THREE.Sphere(asteroids[i].position, asteroids[i].geometry.boundingSphere.radius);
		var sphere2;

 		// Vérification des collisions entre astéroid
 		for (var j = i + 1; j < asteroids.length; j++) {
 			sphere2 = new THREE.Sphere(asteroids[j].position, asteroids[j].geometry.boundingSphere.radius);
 			if (sphere1.intersectsSphere(sphere2) && !asteroids[i].isShot && !asteroids[j].isShot)
 			{
        		// https://nicoschertler.wordpress.com/2013/10/07/elastic-collision-of-circles-and-spheres/				
        		var iRadius = asteroids[i].geometry.boundingSphere.radius;
        		var jRadius = asteroids[j].geometry.boundingSphere.radius;
        		var iCenter = asteroids[i].position;
        		var jCenter = asteroids[j].position;
        		var iVel = asteroids[i].direction.clone();
        		var jVel = asteroids[j].direction.clone();

        		var iNormal = jCenter.clone().sub(iCenter);
        		var iInt = iNormal.clone().add(iCenter);

        		var jNormal = iCenter.clone().sub(jCenter);
        		var jInt = jNormal.clone().add(jCenter);

        		var collisionNormal = jNormal.clone().normalize();
        		var iDot = collisionNormal.clone().dot(iVel);
        		var iCol = collisionNormal.clone().multiplyScalar(iDot);
        		var iRem = iVel.clone().sub(iCol);

        		var jDot = collisionNormal.clone().dot(jVel);
        		var jCol = collisionNormal.clone().multiplyScalar(jDot);
        		var jRem = jVel.clone().sub(jCol);

        		var iLength = iCol.length() * Math.sign(iDot);
        		var jLength = jCol.length() * Math.sign(jDot);
        		var commonVel = 2 * (asteroids[i].mass * iLength + asteroids[j].mass * jLength) / (asteroids[i].mass + asteroids[j].mass);
        		var iLengthAfter = commonVel - iLength;
        		var jLengthAfter = commonVel - jLength;
        		iCol.multiplyScalar(iLengthAfter/iLength);
        		jCol.multiplyScalar(jLengthAfter/jLength);

        		asteroids[i].direction.copy(iCol);
        		asteroids[i].direction.add(iRem); 
        		asteroids[j].direction.copy(jCol);
        		asteroids[j].direction.add(jRem); 
        	}
        }
		// Collision entre asteroid et les balles
		for (var j = 0; j < bullets.length; j++) {
			sphere2 = new THREE.Sphere(bullets[j].position, bullets[j].geometry.boundingSphere.radius);
			if (sphere1.intersectsSphere(sphere2) && !asteroids[i].isShot)
			{
				score = score + 10;
				asteroids[i].material = fireMaterial.clone();
				asteroids[i].isShot = true;
				asteroids[i].velocity = 0;
				setTimeout(fade1(asteroids[i]), TIME_STEP);
				resetBullet(bullets[j])	
				
				updateScore();
			}
		}
		// Vérification des collisions entre le ship et nos astéroids
		sphere2 = shield.geometry.boundingSphere;

		if (sphere1.intersectsSphere(sphere2))
		{


					endGame();		

			
				
		}
	};
}



function makeHarder() {
	if (asteroidVelocity < FINISH_ASTEROID_VELOCITY) {
		asteroidVelocity += .01;
	}
	return;
}

function bulletMovement()
{
	for (var i = 0; i < bullets.length; i++) {
		resetBulletIfOutOfBounds(bullets[i]);
	};
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].position = bullets[i].position.add(bullets[i].direction.clone().multiplyScalar(bulletVelocity));
	};
}

function shipFiring()
{
	for (var i = 0; i < bullets.length; i++) {
		if (bullets[i].position.equals(originPosition)) {
			bullets[i].direction = ship.direction.clone();
			makeOpaque(bullets[i]);

			shipFiringSound.pause();
			shipFiringSound.currentTime = 0; 
			if (soundOn) {
				shipFiringSound.play();
			}
			break;
		} 
	};
}

function pause(){
	
    var pIsPressed = false;
    
}

function killAll(){

		for(var i =0 ; i < asteroids.length; i++){

		setTimeout(fade1(asteroids[i]), TIME_STEP);
}
		
		

}
