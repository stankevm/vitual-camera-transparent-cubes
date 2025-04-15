class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize(canvas.width, canvas.height);
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
    }

    clear() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    renderScene(camera, objects) {
        this.clear();
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();

        for (const object of objects) {
            this.renderObject(object, viewMatrix, projectionMatrix);
        }
    }

    renderObject(object, viewMatrix, projectionMatrix) {
        const transformedVertices = object.getTransformedVertices(viewMatrix, projectionMatrix);
        
        const screenVertices = transformedVertices.map(v => ({
            x: v.x * this.halfWidth + this.halfWidth,
            y: -v.y * this.halfHeight + this.halfHeight,
            z: v.z
        }));

        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front
            [4, 5], [5, 6], [6, 7], [7, 4], // Back
            [0, 4], [1, 5], [2, 6], [3, 7]  // Connections
        ];

        this.ctx.strokeStyle = object.color;
        this.ctx.lineWidth = 2;

        for (const [i, j] of edges) {
            const v1 = screenVertices[i];
            const v2 = screenVertices[j];
            
            if (v1.z > -1 && v2.z > -1) {
                this.ctx.beginPath();
                this.ctx.moveTo(v1.x, v1.y);
                this.ctx.lineTo(v2.x, v2.y);
                this.ctx.stroke();
            }
        }
    }
}