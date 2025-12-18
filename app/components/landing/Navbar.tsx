"use client"

import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { LanguageToggle } from "./LanguageToggle"

const links = [
  { label: "Home", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Blog", href: "#" },
]

type Props = {
  locale?: "EN" | "ID"
  onLocaleChange?: (locale: "EN" | "ID") => void
}

export function Navbar({ locale = "EN", onLocaleChange }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const gradientId = useMemo(() => `grad-${Math.random().toString(36).slice(2)}`, [])

  useEffect(() => {
    if (!mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = 120

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(width, height)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_color1: { value: new THREE.Color(0x22d3ee) },
        u_color2: { value: new THREE.Color(0x6366f1) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        varying vec2 vUv;
        void main() {
          float wave = sin((vUv.x + u_time * 0.2) * 6.2831) * 0.08;
          float mixVal = smoothstep(0.0, 1.0, vUv.y + wave);
          vec3 color = mix(u_color1, u_color2, mixVal);
          gl_FragColor = vec4(color, 0.8);
        }
      `,
    })

    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      ;(material.uniforms.u_time.value as number) += 0.01
      renderer.render(scene as any, camera as any)
    }
    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      const w = mountRef.current.clientWidth
      camera.left = -w / 2
      camera.right = w / 2
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
      material.dispose()
      geometry.dispose()
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [gradientId])

  return (
    <header className="relative z-20">
      <div ref={mountRef} className="pointer-events-none absolute inset-x-0 top-0 h-[120px] w-full" aria-hidden />
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-lg font-bold">
            ✦
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Portfolio</p>
            <p className="text-sm font-semibold">Creative Lab</p>
          </div>
        </div>
        <div className="hidden items-center gap-4 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white md:flex">
          {links.map((link) => (
            <button
              key={link.label}
              className="rounded-full px-3 py-1 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              type="button"
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle locale={locale} onChange={onLocaleChange} />
          <button
            type="button"
            className="rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/50 hover:bg-white/20"
          >
            Contact
          </button>
          <button className="md:hidden rounded-lg border border-white/30 bg-white/10 px-2 py-2 text-sm" type="button">
            ☰
          </button>
        </div>
      </nav>
    </header>
  )
}
