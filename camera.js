class Camera {
    constructor() {
        this.position = { x: 0, y: 0, z: 5 };
        this.rotation = { x: 0, y: 0, z: 0 }; // Euler angles in degrees
        this.fov = 60; // Field of view in degrees
        this.near = 0.1;
        this.far = 100;
        this.aspectRatio = 1;
    }

    getProjectionMatrix() {
        const fovRad = this.fov * Math.PI / 180;
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad);
        const rangeInv = 1.0 / (this.near - this.far);

        return [
            [f / this.aspectRatio, 0, 0, 0],
            [0, f, 0, 0],
            [0, 0, (this.near + this.far) * rangeInv, -1],
            [0, 0, this.near * this.far * rangeInv * 2, 0]
        ];
    }

    getViewMatrix() {
        // Create translation matrix
        const translationMatrix = [
            [1, 0, 0, -this.position.x],
            [0, 1, 0, -this.position.y],
            [0, 0, 1, -this.position.z],
            [0, 0, 0, 1]
        ];

        // Convert angles to radians
        const rx = this.rotation.x * Math.PI / 180;
        const ry = this.rotation.y * Math.PI / 180;
        const rz = this.rotation.z * Math.PI / 180;

        // Create rotation matrices
        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

        // Rotation around X axis (pitch)
        const rotationX = [
            [1, 0, 0, 0],
            [0, cosX, -sinX, 0],
            [0, sinX, cosX, 0],
            [0, 0, 0, 1]
        ];

        // Rotation around Y axis (yaw)
        const rotationY = [
            [cosY, 0, sinY, 0],
            [0, 1, 0, 0],
            [-sinY, 0, cosY, 0],
            [0, 0, 0, 1]
        ];

        // Rotation around Z axis (roll)
        const rotationZ = [
            [cosZ, -sinZ, 0, 0],
            [sinZ, cosZ, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        // Combine rotations (order matters: Z, Y, X)
        let rotationMatrix = this.matrixMultiply(rotationZ, rotationY);
        rotationMatrix = this.matrixMultiply(rotationMatrix, rotationX);

        // Combine translation and rotation
        return this.matrixMultiply(rotationMatrix, translationMatrix);
    }

    getProjectionMatrix() {
        const f = 1.0 / Math.tan(this.fov * Math.PI / 360);
        const rangeInv = 1.0 / (this.near - this.far);

        return [
            [f / this.aspectRatio, 0, 0, 0],
            [0, f, 0, 0],
            [0, 0, (this.near + this.far) * rangeInv, 2 * this.near * this.far * rangeInv],
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

    translateLocal(x, y, z) {
        // Convert rotation to radians
        const rx = this.rotation.x * Math.PI / 180;
        const ry = this.rotation.y * Math.PI / 180;
        const rz = this.rotation.z * Math.PI / 180;

        // Create rotation matrices
        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

        // Calculate local translation in world space
        // Order of rotations: Yaw (Y), then Pitch (X), then Roll (Z)
        const tx = x * cosY * cosZ + y * (sinX * sinY * cosZ - cosX * sinZ) + z * (cosX * sinY * cosZ + sinX * sinZ);
        const ty = x * cosY * sinZ + y * (sinX * sinY * sinZ + cosX * cosZ) + z * (cosX * sinY * sinZ - sinX * cosZ);
        const tz = -x * sinY + y * sinX * cosY + z * cosX * cosY;

        this.position.x += tx;
        this.position.y += ty;
        this.position.z += tz;
    }
}