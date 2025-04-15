class Cube {
    constructor(x, y, z, size, color) {
        this.position = { x, y, z };
        this.size = size;
        this.color = color;
        this.vertices = this.generateVertices();
    }

    generateVertices() {
        const s = this.size / 2;
        return [
            { x: -s, y: -s, z: -s }, // 0
            { x: s, y: -s, z: -s },  // 1
            { x: s, y: s, z: -s },   // 2
            { x: -s, y: s, z: -s },  // 3
            { x: -s, y: -s, z: s },  // 4
            { x: s, y: -s, z: s },   // 5
            { x: s, y: s, z: s },    // 6
            { x: -s, y: s, z: s }   // 7
        ];
    }

    getTransformedVertices(viewMatrix, projectionMatrix) {
        return this.vertices.map(vertex => {
            // Apply model transformation (just translation for simplicity)
            const modelX = vertex.x + this.position.x;
            const modelY = vertex.y + this.position.y;
            const modelZ = vertex.z + this.position.z;

            // Apply view transformation
            const viewX = viewMatrix[0][0] * modelX + viewMatrix[0][1] * modelY + viewMatrix[0][2] * modelZ + viewMatrix[0][3];
            const viewY = viewMatrix[1][0] * modelX + viewMatrix[1][1] * modelY + viewMatrix[1][2] * modelZ + viewMatrix[1][3];
            const viewZ = viewMatrix[2][0] * modelX + viewMatrix[2][1] * modelY + viewMatrix[2][2] * modelZ + viewMatrix[2][3];
            const viewW = viewMatrix[3][0] * modelX + viewMatrix[3][1] * modelY + viewMatrix[3][2] * modelZ + viewMatrix[3][3];

            // Apply projection transformation
            const projX = projectionMatrix[0][0] * viewX + projectionMatrix[0][1] * viewY + projectionMatrix[0][2] * viewZ + projectionMatrix[0][3] * viewW;
            const projY = projectionMatrix[1][0] * viewX + projectionMatrix[1][1] * viewY + projectionMatrix[1][2] * viewZ + projectionMatrix[1][3] * viewW;
            const projZ = projectionMatrix[2][0] * viewX + projectionMatrix[2][1] * viewY + projectionMatrix[2][2] * viewZ + projectionMatrix[2][3] * viewW;
            const projW = projectionMatrix[3][0] * viewX + projectionMatrix[3][1] * viewY + projectionMatrix[3][2] * viewZ + projectionMatrix[3][3] * viewW;

            // Perspective division
            const normalizedX = projX / projW;
            const normalizedY = projY / projW;
            const normalizedZ = projZ / projW;

            return { x: normalizedX, y: normalizedY, z: normalizedZ };
        });
    }
}