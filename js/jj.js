			import * as THREE from './threejs/three.module.js';

			let camera, scene;
			let plane;
			let pointer, raycaster, isShiftDown = false;

			let rollOverMesh, rollOverMaterial;
			let cubeGeo, cubeMaterial;
            let color = "#066CFE";
            let mat;

			const objects = [];
			const canvas = document.querySelector('#c');
			const renderer = new THREE.WebGLRenderer({ canvas });
 			const fov = 55;
  			const aspect = canvas.clientWidth / canvas.clientHeight;  // the canvas default

			init();
			render();

			function init() {
                        

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.set( 400, 900, 900 );
				camera.lookAt( 0, 0, 0 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xf0f0f0 );

				// roll-over helpers

				const rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
				rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
				rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
				scene.add( rollOverMesh );

				// cubes

				cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
				//cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( 'square-outline-textured.png' ) } );

				// grid

				const gridHelper = new THREE.GridHelper( 1000, 20 );
				scene.add( gridHelper );

				//

				raycaster = new THREE.Raycaster();
				pointer = new THREE.Vector2();

				const geometry = new THREE.PlaneGeometry( 1000, 1000 );
				geometry.rotateX( - Math.PI / 2 );

				plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
				scene.add( plane );

				objects.push( plane );

				// lights

				const ambientLight = new THREE.AmbientLight( 0x606060 );
				scene.add( ambientLight );

				const directionalLight = new THREE.DirectionalLight( 0xffffff );
				directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
				scene.add( directionalLight );

				//renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				document.addEventListener( 'pointermove', onPointerMove );
				document.addEventListener( 'pointerdown', onPointerDown );
				document.addEventListener( 'keydown', onDocumentKeyDown );
				document.addEventListener( 'keyup', onDocumentKeyUp );

				//

				window.addEventListener( 'resize', onWindowResize );
                mat = new THREE.MeshStandardMaterial({
                    color: color,
                    opacity: 0.8,
                    transparent: true
                })



                const voxel = new THREE.Mesh( cubeGeo, mat );
						voxel.position.set(75, 25,275);
						voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
						scene.add( voxel );
                        console.log(voxel)

						objects.push( voxel );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function onPointerMove( event ) {

				pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

				raycaster.setFromCamera( pointer, camera );

				const intersects = raycaster.intersectObjects( objects, false );

				if ( intersects.length > 0 ) {

					const intersect = intersects[ 0 ];

					rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
					rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

				}

				render();

			}

			function onPointerDown( event ) {

				pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

				raycaster.setFromCamera( pointer, camera );

				const intersects = raycaster.intersectObjects( objects, false );

				if ( intersects.length > 0 ) {

					const intersect = intersects[ 0 ];

					// delete cube

					if ( isShiftDown ) {

						if ( intersect.object !== plane ) {

							scene.remove( intersect.object );

							objects.splice( objects.indexOf( intersect.object ), 1 );

						}

						// create cube

					} else {

						const voxel = new THREE.Mesh( cubeGeo, mat );
						voxel.position.copy( intersect.point ).add( intersect.face.normal );
                        console.log(voxel.position)
						voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
						scene.add( voxel );
                        console.log(voxel)

						objects.push( voxel );
                        //scene.add(voxel);
                        //voxel.position.set(100, 200, 100);
                        

					}

					render();

				}

			}

			function onDocumentKeyDown( event ) {

				switch ( event.keyCode ) {

					case 16: isShiftDown = true; break;

				}

			}

			function onDocumentKeyUp( event ) {

				switch ( event.keyCode ) {

					case 16: isShiftDown = false; break;

				}

			}

			function render() {

				renderer.render( scene, camera );

			}
