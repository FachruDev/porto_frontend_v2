"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

type Props = {
  color?: string
}

export function HeroCanvas({ color = "#6ee7ff" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.BufferGeometry()
    const particleCount = 600
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({ color, size: 0.05 })
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    const light = new THREE.PointLight(color, 2, 50)
    light.position.set(2, 3, 4)
    scene.add(light)

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      particles.rotation.y += 0.0008
      particles.rotation.x += 0.0004
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight || 500
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [color])

  return <div ref={containerRef} className="absolute inset-0 -z-10 opacity-70" />
}
