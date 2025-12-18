declare module "three" {
  export class Scene {
    add(...object: any[]): void;
  }

  export class PerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number);
    position: { x: number; y: number; z: number };
    aspect: number;
    updateProjectionMatrix(): void;
  }

  export class WebGLRenderer {
    constructor(params?: { alpha?: boolean; antialias?: boolean });
    domElement: HTMLCanvasElement;
    setSize(width: number, height: number): void;
    setPixelRatio(ratio: number): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    dispose(): void;
  }

  export class BufferAttribute {
    constructor(array: ArrayLike<number>, itemSize: number);
  }

  export class BufferGeometry {
    setAttribute(name: string, attribute: BufferAttribute): void;
    dispose(): void;
  }

  export class PointsMaterial {
    constructor(params?: { color?: string | number; size?: number });
    dispose(): void;
  }

  export class Points {
    constructor(geometry: BufferGeometry, material: PointsMaterial);
    rotation: { x: number; y: number; z: number };
  }

  export class PointLight {
    constructor(color?: string | number, intensity?: number, distance?: number);
    position: { x: number; y: number; z: number; set(x: number, y: number, z: number): void };
  }

  export class OrthographicCamera {
    constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
    position: { x: number; y: number; z: number };
    left: number;
    right: number;
    top: number;
    bottom: number;
    updateProjectionMatrix(): void;
  }

  export class PlaneGeometry {
    constructor(width?: number, height?: number);
    dispose(): void;
  }

  export class ShaderMaterial {
    constructor(params?: {
      transparent?: boolean;
      uniforms?: Record<string, { value: unknown }>;
      vertexShader?: string;
      fragmentShader?: string;
    });
    uniforms: Record<string, { value: any }>;
    dispose(): void;
  }

  export class Color {
    constructor(color?: string | number);
  }

  export class Mesh {
    constructor(geometry?: any, material?: any);
  }
}
