document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const renderer = new Renderer(canvas);
    const camera = new Camera();
    
    camera.position.z = 5;
    camera.aspectRatio = canvas.width / canvas.height;

    //4 sześciany

    const cubes = [
        new Cube(-1.5, 0, 0, 1, 'red'),
        new Cube(1.5, 0, 0, 1, 'blue'),
        new Cube(0, -1.5, 0, 1, 'green'),
        new Cube(0, 1.5, 0, 1, 'black') 
    ];

    function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.resize(width, height);
        camera.aspectRatio = width / height;
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 1;
        camera.fov += e.deltaY * 0.01 * zoomSpeed;
        camera.fov = Math.max(10, Math.min(120, camera.fov)); 
    });

    function animate() {
        renderer.renderScene(camera, cubes);
        requestAnimationFrame(animate);
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        const step = 0.3;
        const rotationStep = 2;

        switch (e.key) {
            case 'w': camera.translateLocal(0, 0, -step); break;
            case 's': camera.translateLocal(0, 0, step); break;
            case 'a': camera.translateLocal(-step, 0, 0); break;
            case 'd': camera.translateLocal(step, 0, 0); break;
            case 'q': camera.translateLocal(0, step, 0); break;
            case 'e': camera.translateLocal(0, -step, 0); break;
            case 'ArrowUp': camera.rotation.x -= rotationStep; break;
            case 'ArrowDown': camera.rotation.x += rotationStep; break;
            case 'ArrowLeft': camera.rotation.y -= rotationStep; break;
            case 'ArrowRight': camera.rotation.y += rotationStep; break;
            case 'z': camera.rotation.z -= rotationStep; break;
            case 'x': camera.rotation.z += rotationStep; break;
        }
    });

    animate();
});