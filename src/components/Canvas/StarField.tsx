import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import getCursorPosition from '../utils/getCursorPosition';
import { lerp } from 'three/src/math/MathUtils.js';
import starVertexShader from '../shaders/star/vertex.glsl';
import starFragmentShader from '../shaders/star/fragment.glsl'


interface StarFieldProps {
    count?: number;
}

const StarField: React.FC<StarFieldProps> = ({ count = 1000 }) => {
    const starGeometryRef = useRef<THREE.BufferGeometry>(null);
    const positions = useMemo(() => new Float32Array(count * 3), [count]);
    const cursorPosition = getCursorPosition();
    const mouse = new THREE.Vector2(0, 0);
    const cameraMovementFactor = 1.8;
    const { viewport, camera } = useThree();

    useEffect(() => {
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = Math.random() * 1000 - 500;  // x
            positions[i3 + 1] = Math.random() * 1000 - 500;  // y
            positions[i3 + 2] = Math.random() * 2000 - 1000;  // z
        }

        if (starGeometryRef.current) {
            starGeometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        }
    }, [positions, count]);

    useFrame(() => {
        if (starGeometryRef.current) {
            const positionArray = starGeometryRef.current.attributes.position.array as Float32Array;
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                positionArray[i3 + 2] += 2 * (i / count);

                if (positionArray[i3 + 2] > 1000) positionArray[i3 + 2] -= 2000;
            }
            starGeometryRef.current.attributes.position.needsUpdate = true;



            // Handle camera movement
            parallaxCamera();
        }
    });

    function parallaxCamera() {
        mouse.x =   ((cursorPosition.x / window.innerWidth) * 2 - 1) * cameraMovementFactor;
        mouse.y = -((cursorPosition.y / window.innerHeight) * 2 - 1) * cameraMovementFactor * 2;

        const targetX = viewport.width * mouse.x;
        const targetY = viewport.height * mouse.y;

        camera.position.x = lerp(camera.position.x, targetX, 0.05);
        camera.position.y = lerp(camera.position.y, targetY, 0.05);
    }

    return (
        <points>
            <bufferGeometry ref={starGeometryRef} />
            <shaderMaterial
                vertexShader={starVertexShader}
                fragmentShader={starFragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uniforms={{
                    uTime: {value: 0},
                    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                    uSize: { value: 3000 }
                }}
            />
        </points>
    );
};

export default StarField;