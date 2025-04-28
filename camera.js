class Camera {
    constructor() {
        this.position = { x: 0, y: 0, z: 5 }; // in world space
        this.rotation = { x: 0, y: 0, z: 0 }; // Euler angles in degrees
        this.fov = 60; // Field of view in degrees
        this.near = 0.1;
        this.far = 100;
        this.aspectRatio = 1;  // szerokość/wysokość
    }

    getViewMatrix() { // macierz przekształca współrzędne ze świata 3D do przestrzeni kamery
        
        const translationMatrix = [          //przesuwa świat tak, aby kamera była w środku układu współrzędnych.
            [1, 0, 0, -this.position.x], 
            [0, 1, 0, -this.position.y],
            [0, 0, 1, -this.position.z],
            [0, 0, 0, 1]
        ];

        // convertujemy do radianów
        const rx = this.rotation.x * Math.PI / 180;
        const ry = this.rotation.y * Math.PI / 180;
        const rz = this.rotation.z * Math.PI / 180;

        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

        // Rotacja wokół X (pitch)
        const rotationX = [
            [1, 0, 0, 0],
            [0, cosX, -sinX, 0],
            [0, sinX, cosX, 0],
            [0, 0, 0, 1]
        ];

        // Rotacja wokół  Y (yaw)
        const rotationY = [
            [cosY, 0, sinY, 0],
            [0, 1, 0, 0],
            [-sinY, 0, cosY, 0],
            [0, 0, 0, 1]
        ];

        // Rotacja wokół Z (roll)
        const rotationZ = [
            [cosZ, -sinZ, 0, 0],
            [sinZ, cosZ, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        // w porządku Z, Y, X
        let rotationMatrix = this.matrixMultiply(rotationZ, rotationY);
        rotationMatrix = this.matrixMultiply(rotationMatrix, rotationX);


        return this.matrixMultiply(rotationMatrix, translationMatrix);
    }

    getProjectionMatrix() { // macierz projekcji perspektywicznej przekształca scenę 3D w obraz 2D
        const f = 1.0 / Math.tan(this.fov * Math.PI / 360); //współczynnik skalowania
        const rangeInv = 1.0 / (this.near - this.far);

        return [
            [f / this.aspectRatio, 0, 0, 0], // Skaluje współrzędne x uwzględniając proporcje ekranu
            [0, f, 0, 0], //transformacja y
            [0, 0, (this.near + this.far) * rangeInv, 2 * this.near * this.far * rangeInv], // //transformacja głębi, (this.near + this.far) * rangeInv - mapuje z ∈ [near, far] na [-1, 1]
            [0, 0, -1, 0]
        ];
    }

    matrixMultiply(a, b) {
        const result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }

    translateLocal(x, y, z) { //przekształca lokalny ruch kamery na ruch w globalnej przestrzeni. 
    // Pozwala na poruszanie kamerą względem jej własnego obrotu
        // stopni --> radiany
        const rx = this.rotation.x * Math.PI / 180;
        const ry = this.rotation.y * Math.PI / 180;
        const rz = this.rotation.z * Math.PI / 180;

        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

        const R00 = cosZ * cosY;
        const R01 = cosZ * sinY * sinX - sinZ * cosX;
        const R02 = cosZ * sinY * cosX + sinZ * sinX;
        const R10 = sinZ * cosY;
        const R11 = sinZ * sinY * sinX + cosZ * cosX;
        const R12 = sinZ * sinY * cosX - cosZ * sinX;
        const R20 = -sinY;
        const R21 = cosY * sinX;
        const R22 = cosY * cosX;

        // R^T transforms camera local coordinates to world coordinates
        const world_dx = R00 * x + R10 * y + R20 * z;
        const world_dy = R01 * x + R11 * y + R21 * z;
        const world_dz = R02 * x + R12 * y + R22 * z;

        this.position.x += world_dx;
        this.position.y += world_dy;
        this.position.z += world_dz;
    }
}