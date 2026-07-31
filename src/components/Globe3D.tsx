import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GestureType, HotspotNode } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Globe, RefreshCw, ZoomIn, ZoomOut, Play, Pause, Navigation2 } from 'lucide-react';

interface Globe3DProps {
  gesture: GestureType;
  themeColor?: string;
  onSelectNode?: (node: HotspotNode) => void;
}

const NODES: HotspotNode[] = [
  { id: '1', name: 'Silicon Valley Node', lat: 37.38, lng: -122.08, status: 'OPTIMAL', pingMs: 12, trafficGbps: 450 },
  { id: '2', name: 'Tokyo Quantum Core', lat: 35.67, lng: 139.65, status: 'ONLINE', pingMs: 18, trafficGbps: 820 },
  { id: '3', name: 'London Central Hub', lat: 51.50, lng: -0.12, status: 'OPTIMAL', pingMs: 14, trafficGbps: 610 },
  { id: '4', name: 'Sydney Mesh Array', lat: -33.86, lng: 151.20, status: 'ONLINE', pingMs: 24, trafficGbps: 340 },
  { id: '5', name: 'Dubai Cyber Gateway', lat: 25.20, lng: 55.27, status: 'HEAVY_LOAD', pingMs: 32, trafficGbps: 910 },
  { id: '6', name: 'Sao Paulo Relay', lat: -23.55, lng: -46.63, status: 'ONLINE', pingMs: 28, trafficGbps: 290 },
];

export const Globe3D: React.FC<Globe3DProps> = ({ gesture, onSelectNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeNode, setActiveNode] = useState<HotspotNode | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);

  // Inertia and Drag tracking
  const isMouseDownRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });

  // Generate Procedural High-Res Earth Texture Canvas
  const createEarthTexture = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Deep Ocean Background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#020b18');
    oceanGrad.addColorStop(0.5, '#081e3e');
    oceanGrad.addColorStop(1, '#020b18');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Procedural Lat/Lng Grid & Continents Shader Simulation
    ctx.fillStyle = '#0f3d6c';
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
    ctx.lineWidth = 1;

    // Draw Grid Lines
    for (let x = 0; x <= canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Stylized Continent Shapes (Holographic Cyber Landmasses)
    ctx.fillStyle = '#062d54';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;

    const drawLandmass = (points: [number, number][]) => {
      ctx.beginPath();
      points.forEach(([x, y], idx) => {
        const px = (x / 360 + 0.5) * canvas.width;
        const py = (0.5 - y / 180) * canvas.height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // North America
    drawLandmass([[-130, 60], [-100, 70], [-60, 65], [-75, 25], [-105, 20], [-125, 45]]);
    // South America
    drawLandmass([[-80, 10], [-40, -10], [-60, -50], [-75, -45], [-80, -5]]);
    // Europe
    drawLandmass([[-10, 60], [30, 70], [40, 40], [0, 40], [-10, 50]]);
    // Africa
    drawLandmass([[-15, 35], [50, 30], [40, -35], [15, -35], [0, 10]]);
    // Asia
    drawLandmass([[40, 70], [140, 70], [130, 20], [80, 10], [50, 40]]);
    // Australia
    drawLandmass([[115, -15], [150, -15], [145, -40], [115, -35]]);

    // Neon City Lights
    ctx.fillStyle = '#38bdf8';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(rx, ry, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  };

  // Generate Cloud Texture Canvas
  const createCloudTexture = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(186, 230, 253, 0.22)';
    for (let i = 0; i < 80; i++) {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height;
      const radius = 20 + Math.random() * 60;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  };

  // Lat / Lng to Vector3 Position
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene, Camera, Renderer Setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x00d8ff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(20, 10, 15);
    scene.add(dirLight);

    // 3. Earth Globe Mesh
    const earthCanvas = createEarthTexture();
    const earthTexture = new THREE.CanvasTexture(earthCanvas);

    const earthGeo = new THREE.SphereGeometry(5, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 25,
      specular: new THREE.Color(0x00f0ff),
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMeshRef.current = earthMesh;
    scene.add(earthMesh);

    // 4. Cloud Mesh
    const cloudCanvas = createCloudTexture();
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudGeo = new THREE.SphereGeometry(5.12, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMeshRef.current = cloudMesh;
    scene.add(cloudMesh);

    // 5. Atmosphere Glow Shell
    const atmoGeo = new THREE.SphereGeometry(5.4, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmosphereMeshRef.current = atmosphereMesh;
    scene.add(atmosphereMesh);

    // 6. Star Particles Background
    const starsGeo = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < 1200; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
    }
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.6, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 7. Hotspot Nodes Group
    const nodesGroup = new THREE.Group();
    nodesGroupRef.current = nodesGroup;
    earthMesh.add(nodesGroup);

    NODES.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, 5.08);

      // Node Marker Point
      const pinGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: node.status === 'OPTIMAL' ? 0x34d399 : 0x22d3ee });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);

      // Pulse Ring
      const ringGeo = new THREE.RingGeometry(0.18, 0.28, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(0, 0, 0);

      nodesGroup.add(pinMesh);
      nodesGroup.add(ringMesh);
    });

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Inertia rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.05;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.05;

      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.x = currentRotationRef.current.x;
        earthMeshRef.current.rotation.y = currentRotationRef.current.y;

        if (isRotating && !isMouseDownRef.current) {
          targetRotationRef.current.y += 0.003;
        }
      }

      if (cloudMeshRef.current) {
        cloudMeshRef.current.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, [isRotating]);

  // Handle Gesture Inputs
  useEffect(() => {
    if (!earthMeshRef.current || !cameraRef.current) return;

    switch (gesture) {
      case 'PALM_OPEN':
        setIsRotating(true);
        break;
      case 'FIST_CLOSED':
        setIsRotating(false);
        break;
      case 'SWIPE_LEFT':
        targetRotationRef.current.y += 0.5;
        break;
      case 'SWIPE_RIGHT':
        targetRotationRef.current.y -= 0.5;
        break;
      case 'ZOOM_IN':
        cameraRef.current.position.z = Math.max(9, cameraRef.current.position.z - 2);
        break;
      case 'ZOOM_OUT':
        cameraRef.current.position.z = Math.min(30, cameraRef.current.position.z + 2);
        break;
    }
  }, [gesture]);

  // Mouse Orbit Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const deltaX = e.clientX - mousePosRef.current.x;
    const deltaY = e.clientY - mousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x += deltaY * 0.008;

    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.min(30, Math.max(8, cameraRef.current.position.z + e.deltaY * 0.01));
  };

  const handleDoubleClick = () => {
    if (!cameraRef.current) return;
    targetRotationRef.current = { x: 0, y: 0 };
    cameraRef.current.position.z = 18;
    soundEngine.playClickSound();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none">
      {/* Three.js Canvas Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
      />

      {/* Top Floating Control Toolbar */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 border border-cyan-500/30 rounded-2xl px-4 py-2 backdrop-blur-md text-xs font-mono text-cyan-300 pointer-events-auto shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Globe className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="font-bold">EARTH CORE 3D</span>
          <span className="text-cyan-500/60">|</span>
          <span className="text-emerald-400 font-bold">{isRotating ? 'ROTATING' : 'PAUSED'}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-1.5 backdrop-blur-md pointer-events-auto">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              setIsRotating(!isRotating);
            }}
            title={isRotating ? "Pause Rotation" : "Resume Rotation"}
            className="p-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              soundEngine.playClickSound();
              if (cameraRef.current) cameraRef.current.position.z = Math.max(9, cameraRef.current.position.z - 2);
            }}
            title="Zoom In"
            className="p-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClickSound();
              if (cameraRef.current) cameraRef.current.position.z = Math.min(30, cameraRef.current.position.z + 2);
            }}
            title="Zoom Out"
            className="p-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleDoubleClick}
            title="Reset Camera View"
            className="p-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Global Nodes Selector Cards */}
      <div className="relative z-10 p-4 overflow-x-auto flex gap-3 pointer-events-auto no-scrollbar">
        {NODES.map((node) => (
          <button
            key={node.id}
            onClick={() => {
              soundEngine.playClickSound();
              setActiveNode(node);
              if (onSelectNode) onSelectNode(node);
            }}
            className={`p-3 rounded-xl border backdrop-blur-xl min-w-[180px] text-left transition-all cursor-pointer ${
              activeNode?.id === node.id
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                : 'bg-slate-950/70 border-cyan-900/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="truncate">{node.name}</span>
              <Navigation2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400/80">
              <span>{node.pingMs}ms</span>
              <span className="text-emerald-400 font-bold">{node.trafficGbps} Gbps</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
