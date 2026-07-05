import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'

/*
 * 3D hero centerpiece. One particle field, two identities:
 * left of the frontier the particles drift as an organic neural cloud (AI),
 * right of it they snap into a precise engineered lattice (full stack).
 * The frontier is driven by the same spring that drove the old screen wipe,
 * so mouse-left still means "AI takes over".
 */

// #4a6080 (chaos / AI) → #1a2e4a (order / full stack)
const CHAOS_RGB = [74 / 255, 96 / 255, 128 / 255]
const ORDER_RGB = [26 / 255, 46 / 255, 74 / 255]
const BAND = 0.07 // half-width of the blend zone around the frontier, in station units

type FieldConfig = { cols: number; rows: number; layers: number; width: number; dy: number; dz: number }

const DESKTOP: FieldConfig = { cols: 40, rows: 13, layers: 5, width: 5.6, dy: 0.17, dz: 0.24 }
const COMPACT: FieldConfig = { cols: 18, rows: 16, layers: 3, width: 2.4, dy: 0.15, dz: 0.3 }

function buildField(cfg: FieldConfig) {
  const count = cfg.cols * cfg.rows * cfg.layers
  const order = new Float32Array(count * 3)
  const chaos = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const station = new Float32Array(count)
  const phase = new Float32Array(count)
  const amp = new Float32Array(count)
  const speed = new Float32Array(count)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)

  const perCol = cfg.rows * cfg.layers
  const halfW = cfg.width / 2
  // sum of three randoms ≈ gaussian, keeps the cloud dense in the middle
  const gauss = () => Math.random() + Math.random() + Math.random() - 1.5

  for (let i = 0; i < count; i++) {
    const c = Math.floor(i / perCol)
    const rem = i % perCol
    const r = Math.floor(rem / cfg.layers)
    const l = rem % cfg.layers
    const u = c / (cfg.cols - 1)
    station[i] = u

    const ox = -halfW + u * cfg.width
    order[i * 3] = ox
    order[i * 3 + 1] = (r - (cfg.rows - 1) / 2) * cfg.dy
    order[i * 3 + 2] = (l - (cfg.layers - 1) / 2) * cfg.dz

    chaos[i * 3] = ox + gauss() * 0.55
    chaos[i * 3 + 1] = gauss() * 1.15
    chaos[i * 3 + 2] = gauss() * 0.8

    // entrance: particles fly in from a loose sphere around the scene
    const th = Math.random() * Math.PI * 2
    const ph = Math.acos(2 * Math.random() - 1)
    const rad = 3.5 + Math.random() * 2
    scatter[i * 3] = rad * Math.sin(ph) * Math.cos(th)
    scatter[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th) * 0.7
    scatter[i * 3 + 2] = rad * Math.cos(ph) * 0.6

    phase[i] = Math.random() * Math.PI * 2
    amp[i] = 0.04 + Math.random() * 0.13
    speed[i] = 0.5 + Math.random() * 0.9

    pos[i * 3] = scatter[i * 3]
    pos[i * 3 + 1] = scatter[i * 3 + 1]
    pos[i * 3 + 2] = scatter[i * 3 + 2]
    col[i * 3] = CHAOS_RGB[0]
    col[i * 3 + 1] = CHAOS_RGB[1]
    col[i * 3 + 2] = CHAOS_RGB[2]
  }
  return { count, order, chaos, scatter, station, phase, amp, speed, pos, col }
}

// anti-aliased disc sprite so points render round, not square
function makeDiscSprite() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.8, 'rgba(255,255,255,1)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

type FieldProps = {
  splitX: MotionValue<number> // 0..100, springed mouse X (100 = right)
  tiltY: MotionValue<number> // 0..100, springed mouse Y
  compact: boolean
  reduced: boolean
  introDelay: number // seconds to hold the scatter while the boot overlay plays
}

function MorphField({ splitX, tiltY, compact, reduced, introDelay }: FieldProps) {
  const cfg = compact ? COMPACT : DESKTOP
  const data = useMemo(() => buildField(cfg), [cfg])
  const sprite = useMemo(makeDiscSprite, [])
  const groupRef = useRef<THREE.Group>(null)
  const posAttrRef = useRef<THREE.BufferAttribute>(null)
  const colAttrRef = useRef<THREE.BufferAttribute>(null)
  const dividerRef = useRef<THREE.Mesh>(null)
  const startRef = useRef(-1)

  useFrame((state) => {
    const posAttr = posAttrRef.current
    const colAttr = colAttrRef.current
    const group = groupRef.current
    if (!posAttr || !colAttr || !group) return

    const t = state.clock.elapsedTime
    if (startRef.current < 0) startRef.current = t + introDelay
    const introRaw = reduced ? 1 : Math.min(1, Math.max(0, (t - startRef.current) / 1.9))
    const intro = 1 - Math.pow(1 - introRaw, 3)

    const mx = Math.max(0, Math.min(100, splitX.get()))
    // frontier: mouse fully left → b=1 → whole field is chaos (AI covers)
    const b = reduced ? 0.5 : 1 - mx / 100

    const { count, order, chaos, scatter, station, phase, amp, speed, pos, col } = data
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const u = station[i]
      let tt = (u - (b - BAND)) / (BAND * 2)
      tt = tt < 0 ? 0 : tt > 1 ? 1 : tt
      tt = tt * tt * (3 - 2 * tt) // smoothstep: 0 = chaos, 1 = order

      const drift = reduced ? 0 : amp[i] * (1 - tt * 0.92)
      const wob1 = Math.sin(t * speed[i] + phase[i])
      const wob2 = Math.cos(t * speed[i] * 0.8 + phase[i] * 1.7)

      let fx = chaos[i3] + (order[i3] - chaos[i3]) * tt + wob1 * drift
      let fy = chaos[i3 + 1] + (order[i3 + 1] - chaos[i3 + 1]) * tt + wob2 * drift
      const fz = chaos[i3 + 2] + (order[i3 + 2] - chaos[i3 + 2]) * tt + wob1 * wob2 * drift * 0.5

      // particles caught on the frontier sizzle a little
      if (!reduced) {
        const edge = 1 - Math.min(1, Math.abs(u - b) / BAND)
        if (edge > 0) {
          fy += Math.sin(t * 6 + phase[i] * 9) * 0.05 * edge
          fx += Math.cos(t * 5 + phase[i] * 7) * 0.03 * edge
        }
      }

      pos[i3] = scatter[i3] * (1 - intro) + fx * intro
      pos[i3 + 1] = scatter[i3 + 1] * (1 - intro) + fy * intro
      pos[i3 + 2] = scatter[i3 + 2] * (1 - intro) + fz * intro

      col[i3] = CHAOS_RGB[0] + (ORDER_RGB[0] - CHAOS_RGB[0]) * tt
      col[i3 + 1] = CHAOS_RGB[1] + (ORDER_RGB[1] - CHAOS_RGB[1]) * tt
      col[i3 + 2] = CHAOS_RGB[2] + (ORDER_RGB[2] - CHAOS_RGB[2]) * tt
    }
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true

    // subtle parallax tilt from the same springs, plus a slow breathing sway
    const my = Math.max(0, Math.min(100, tiltY.get()))
    group.rotation.y = (mx / 100 - 0.5) * 0.14 + (reduced ? 0 : Math.sin(t * 0.12) * 0.03)
    group.rotation.x = (0.5 - my / 100) * 0.1

    const divider = dividerRef.current
    if (divider) {
      divider.position.x = (b - 0.5) * cfg.width
      const mat = divider.material as THREE.MeshBasicMaterial
      mat.opacity = (b < 0.03 || b > 0.97 ? 0 : 0.3) * intro
    }
  })

  return (
    <group ref={groupRef}>
      <points key={cfg.cols}>
        <bufferGeometry>
          <bufferAttribute ref={posAttrRef} attach="attributes-position" args={[data.pos, 3]} />
          <bufferAttribute ref={colAttrRef} attach="attributes-color" args={[data.col, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={sprite}
          vertexColors
          transparent
          opacity={0.9}
          size={0.045}
          sizeAttenuation
          depthWrite={false}
          alphaTest={0.05}
        />
      </points>
      {/* hairline frontier, the 3D descendant of the old 1px divider */}
      <mesh ref={dividerRef}>
        <planeGeometry args={[0.008, 3.2]} />
        <meshBasicMaterial color="#8fa0b8" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function HeroField(props: FieldProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={props.reduced ? 'demand' : 'always'}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
    >
      <MorphField {...props} />
    </Canvas>
  )
}
