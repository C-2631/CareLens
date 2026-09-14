import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export default function ThreeBackground() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear any previous canvas
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // 1. Interactive Particle Field (Medical Molecular Grid)
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = isDark ? new THREE.Color(0x06b6d4) : new THREE.Color(0x3b82f6); // Cyan / Blue
    const color2 = isDark ? new THREE.Color(0x3b82f6) : new THREE.Color(0x10b981); // Blue / Emerald

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const mixed = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with Soft Glow
    const particleMaterial = new THREE.PointsMaterial({
      size: isDark ? 1.8 : 1.4,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. DNA Double Helix Background Representation
    const dnaGroup = new THREE.Group();
    const helixPoints = 40;
    const helixRadius = 12;
    const helixHeight = 90;

    const sphereGeo = new THREE.SphereGeometry(0.6, 12, 12);
    const strand1Mat = new THREE.MeshBasicMaterial({ color: isDark ? 0x22d3ee : 0x2563eb, transparent: true, opacity: 0.6 });
    const strand2Mat = new THREE.MeshBasicMaterial({ color: isDark ? 0x38bdf8 : 0x10b981, transparent: true, opacity: 0.6 });
    const rungMat = new THREE.LineBasicMaterial({ color: isDark ? 0x0ea5e9 : 0x93c5fd, transparent: true, opacity: 0.25 });

    for (let i = 0; i < helixPoints; i++) {
      const t = (i / helixPoints) * Math.PI * 4;
      const y = (i / helixPoints - 0.5) * helixHeight;
      const x1 = Math.cos(t) * helixRadius;
      const z1 = Math.sin(t) * helixRadius;
      const x2 = Math.cos(t + Math.PI) * helixRadius;
      const z2 = Math.sin(t + Math.PI) * helixRadius;

      // Strand 1 node
      const node1 = new THREE.Mesh(sphereGeo, strand1Mat);
      node1.position.set(x1, y, z1);
      dnaGroup.add(node1);

      // Strand 2 node
      const node2 = new THREE.Mesh(sphereGeo, strand2Mat);
      node2.position.set(x2, y, z2);
      dnaGroup.add(node2);

      // Connecting rungs
      if (i % 2 === 0) {
        const rungGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x1, y, z1),
          new THREE.Vector3(x2, y, z2)
        ]);
        const rung = new THREE.Line(rungGeo, rungMat);
        dnaGroup.add(rung);
      }
    }

    dnaGroup.position.set(45, -5, -30);
    dnaGroup.rotation.z = Math.PI / 8;
    scene.add(dnaGroup);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.02;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.02;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 1.5;
      camera.position.y = -targetY * 1.5;
      camera.lookAt(scene.position);

      // Rotate DNA & particles
      dnaGroup.rotation.y = elapsedTime * 0.3;
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
