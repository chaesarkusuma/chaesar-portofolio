import { memo, useEffect, useRef } from 'react'

const VERTEX_SHADER = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`

// Optimized analytical-gradient FBM shader: computes terrain height + surface
// gradient (dhdx, dhdy) in a single pass (~60% fewer noise octaves per pixel).
const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 v_uv;

  uniform vec2 u_res;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_hover;
  uniform vec2 u_parallax;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
  }

  // Returns vec3(height, dHeight/dx, dHeight/dy) via C2 quintic interpolation
  vec3 noiseGrad(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 f2 = f * f;
    vec2 u = f2 * f * (f * (f * 6.0 - 15.0) + 10.0);
    vec2 du = 30.0 * f2 * (f * (f - 2.0) + 1.0);

    vec2 ga = hash2(i + vec2(0.0, 0.0)) - 0.5;
    vec2 gb = hash2(i + vec2(1.0, 0.0)) - 0.5;
    vec2 gc = hash2(i + vec2(0.0, 1.0)) - 0.5;
    vec2 gd = hash2(i + vec2(1.0, 1.0)) - 0.5;

    float va = dot(ga, f - vec2(0.0, 0.0));
    float vb = dot(gb, f - vec2(1.0, 0.0));
    float vc = dot(gc, f - vec2(0.0, 1.0));
    float vd = dot(gd, f - vec2(1.0, 1.0));

    float k0 = va;
    float k1 = vb - va;
    float k2 = vc - va;
    float k4 = va - vb - vc + vd;

    float val = (k0 + k1 * u.x + k2 * u.y + k4 * u.x * u.y) * 1.45 + 0.5;

    vec2 g = mix(ga, gb, u.x) + (mix(gc, gd, u.x) - mix(ga, gb, u.x)) * u.y;
    vec2 grad = (g + du * vec2(k1 + k4 * u.y, k2 + k4 * u.x)) * 1.45;
    return vec3(val, grad);
  }

  float fbm2(vec2 p) {
    float val = 0.0;
    float amp = 0.55;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 2; i++) {
      val += amp * noiseGrad(p).x;
      p = rot * p * 2.03;
      amp *= 0.5;
    }
    return val;
  }

  vec3 fbmGrad3(vec2 p) {
    float val = 0.0;
    vec2 grad = vec2(0.0);
    float amp = 0.52;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    mat2 rotT = mat2(0.8, -0.6, 0.6, 0.8);
    mat2 accRot = mat2(1.0, 0.0, 0.0, 1.0);
    float freq = 1.0;

    for (int i = 0; i < 3; i++) {
      vec3 n = noiseGrad(p);
      val += amp * n.x;
      grad += (accRot * n.yz) * (amp * freq);
      p = rot * p * 2.02;
      accRot = accRot * rotT;
      freq *= 2.02;
      amp *= 0.5;
    }
    return vec3(val, grad);
  }

  void main() {
    float aspect = u_res.x / max(u_res.y, 1.0);
    vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0) * 1.75;
    p += u_parallax * 0.065;

    vec2 mPos = (u_mouse - 0.5) * vec2(aspect, 1.0) * 1.75;

    vec2 warp = vec2(
      fbm2(p + u_time * 0.065),
      fbm2(p + vec2(5.2, 1.3) - u_time * 0.05)
    );

    vec3 terrain = fbmGrad3(p + 1.35 * warp + vec2(1.7, 9.2) - u_time * 0.045);
    float hC = terrain.x;
    vec2 grad = terrain.yz;

    // Analytical interactive swell + ripple around pointer position
    vec2 delta = p - mPos;
    float d2 = dot(delta, delta);
    float d = sqrt(d2 + 1e-5);
    float expSwell = exp(-d2 * 3.8);
    float expRipple = exp(-d2 * 2.3);
    float phase = d * 13.5 - u_time * 15.0;

    float hOffset = (expSwell * 0.11 + expRipple * sin(phase) * 0.028) * u_hover;
    float dRadial = (-7.6 * d * expSwell * 0.11 +
      expRipple * (13.5 * cos(phase) - 4.6 * d * sin(phase)) * 0.028) * u_hover;

    hC += hOffset;
    grad += (delta / d) * dRadial;

    vec3 N = normalize(vec3(-grad.x * 1.5, -grad.y * 1.5, 1.0));
    vec3 lightDir = normalize(mix(
      vec3(-0.46, 0.62, 0.63),
      vec3((u_mouse.x - 0.5) * 1.15, (u_mouse.y - 0.5) * 1.15, 0.72),
      0.32 * u_hover
    ));
    vec3 halfVec = normalize(lightDir + vec3(0.0, 0.0, 1.0));

    float diff = max(dot(N, lightDir), 0.0);
    float spec = pow(max(dot(N, halfVec), 0.0), 22.0);

    vec3 baseColor = vec3(0.024, 0.024, 0.027)
      + vec3(0.04, 0.042, 0.047) * diff
      + vec3(0.045, 0.048, 0.055) * spec;

    // Anti-aliased 1px topographic isolines
    float levels = 20.0;
    float v = hC * levels;
    float f = fract(v);
    float pixelWorld = 1.75 / max(u_res.y, 1.0);
    float df = max(length(grad) * levels * pixelWorld, 0.0012);
    float dist = min(f, 1.0 - f) / df;
    float contour = 1.0 - smoothstep(0.6, 1.65, dist);

    float cursorGleam = exp(-d2 * 4.2) * 0.2 * u_hover;
    float lineLum = 0.08 + 0.17 * diff + 0.36 * spec + cursorGleam;

    vec3 lineColor = vec3(lineLum * 0.96, lineLum * 0.98, lineLum * 1.03);
    vec3 color = mix(baseColor, lineColor, contour * 0.88);

    vec2 centered = v_uv - 0.5;
    float vig = 1.0 - dot(centered * vec2(1.05, 0.95), centered * vec2(1.05, 0.95)) * 0.78;
    color *= clamp(vig, 0.3, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

const IDLE_FRAME_MS = 1000 / 32
const ACTIVE_FRAME_MS = 1000 / 60

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/**
 * Single shared interactive 3D monochrome topographic contour background.
 * Optimized with analytical-gradient FBM, DPR=1 cap, cached bounds, tab-hidden
 * pause, offscreen IntersectionObserver pause, and idle frame-rate pacing.
 */
function TopographicBackground({ containerRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = containerRef?.current || canvas?.parentElement
    if (!canvas || !host) return undefined

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let isVisibleInViewport = false
    let isTabVisible = document.visibilityState !== 'hidden'
    let rafId = null
    let startTime = performance.now()
    let lastTick = startTime
    let lastDraw = 0

    let cachedRect = null
    let lastRectSync = 0

    const targetMouse = { x: 0.5, y: 0.5 }
    const smoothMouse = { x: 0.5, y: 0.5 }
    let targetHover = 0
    let smoothHover = 0

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    })

    let glCleanup = null
    let renderFrame = null

    if (gl) {
      const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
      const program = vs && fs ? gl.createProgram() : null

      if (program) {
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program)

          const buffer = gl.createBuffer()
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          )

          const aPos = gl.getAttribLocation(program, 'a_pos')
          gl.enableVertexAttribArray(aPos)
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

          const uRes = gl.getUniformLocation(program, 'u_res')
          const uTime = gl.getUniformLocation(program, 'u_time')
          const uMouse = gl.getUniformLocation(program, 'u_mouse')
          const uHover = gl.getUniformLocation(program, 'u_hover')
          const uParallax = gl.getUniformLocation(program, 'u_parallax')

          renderFrame = (elapsedSec) => {
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.uniform2f(uRes, canvas.width, canvas.height)
            gl.uniform1f(uTime, elapsedSec)
            gl.uniform2f(uMouse, smoothMouse.x, 1.0 - smoothMouse.y)
            gl.uniform1f(uHover, smoothHover)
            gl.uniform2f(
              uParallax,
              (smoothMouse.x - 0.5) * smoothHover,
              (0.5 - smoothMouse.y) * smoothHover
            )
            gl.drawArrays(gl.TRIANGLES, 0, 6)
          }

          glCleanup = () => {
            gl.deleteBuffer(buffer)
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
          }
        }
      }
    }

    if (!renderFrame) {
      const ctx = canvas.getContext('2d')
      renderFrame = (elapsedSec) => {
        if (!ctx) return
        const w = canvas.width
        const h = canvas.height
        ctx.fillStyle = '#080808'
        ctx.fillRect(0, 0, w, h)
        ctx.lineWidth = 1
        const lines = 20
        for (let i = 0; i < lines; i++) {
          const baseY = (i / (lines - 1)) * h
          ctx.strokeStyle = `rgba(225, 230, 240, ${0.06 + (i % 4) * 0.035})`
          ctx.beginPath()
          for (let x = 0; x <= w; x += 28) {
            const nx = x / w
            const dx = nx - smoothMouse.x
            const dy = baseY / h - smoothMouse.y
            const dist = Math.hypot(dx, dy)
            const ripple =
              Math.exp(-dist * dist * 8) *
              Math.sin(dist * 18 - elapsedSec * 12) *
              18 *
              smoothHover
            const wave =
              Math.sin(nx * 5 + elapsedSec * 1.4 + i * 0.45) * 16 +
              Math.cos(nx * 3 - elapsedSec * 0.9 + i * 0.3) * 10
            const y = baseY + wave + ripple
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }
    }

    let currentElapsed = 0

    const resize = () => {
      const targetEl = canvas.parentElement || host
      const rect = targetEl.getBoundingClientRect()
      cachedRect = rect
      lastRectSync = performance.now()
      // Cap DPR at 1.0 so subtle full-screen ambient contours render cleanly at ~2x lower pixel fill
      const nextW = Math.max(1, Math.floor(rect.width))
      const nextH = Math.max(1, Math.floor(rect.height))
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW
        canvas.height = nextH
      }
      renderFrame(reducedMotionQuery.matches ? 0 : currentElapsed)
    }

    const canAnimate = () =>
      isVisibleInViewport && isTabVisible && !reducedMotionQuery.matches

    const tick = (now) => {
      if (!canAnimate()) {
        rafId = null
        return
      }

      const isPointerActive = targetHover > 0 || smoothHover > 0.015
      const minInterval = isPointerActive ? ACTIVE_FRAME_MS : IDLE_FRAME_MS
      if (now - lastDraw < minInterval) {
        rafId = requestAnimationFrame(tick)
        return
      }

      const dt = Math.min((now - lastTick) / 1000, 0.05)
      lastTick = now
      lastDraw = now

      const ease = 1 - Math.exp(-8 * dt)
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * ease
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * ease
      smoothHover += (targetHover - smoothHover) * ease

      currentElapsed = (now - startTime) * 0.00015
      renderFrame(currentElapsed)

      rafId = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (reducedMotionQuery.matches) {
        renderFrame(0)
        return
      }
      if (rafId === null && canAnimate()) {
        lastTick = performance.now()
        rafId = requestAnimationFrame(tick)
      }
    }

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') return
      const now = performance.now()
      if (!cachedRect || now - lastRectSync > 250) {
        cachedRect = canvas.getBoundingClientRect()
        lastRectSync = now
      }
      if (!cachedRect.width || !cachedRect.height) return
      targetMouse.x = Math.min(Math.max((event.clientX - cachedRect.left) / cachedRect.width, 0), 1)
      targetMouse.y = Math.min(Math.max((event.clientY - cachedRect.top) / cachedRect.height, 0), 1)
      targetHover = 1
    }

    const handlePointerLeave = () => {
      targetHover = 0
    }

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState !== 'hidden'
      if (isTabVisible) {
        startLoop()
      } else {
        stopLoop()
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas.parentElement || host)
    resize()

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisibleInViewport = Boolean(entries[0]?.isIntersecting)
        if (isVisibleInViewport) {
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0.01 }
    )
    intersectionObserver.observe(host)

    host.addEventListener('pointermove', handlePointerMove, { passive: true })
    host.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const handleMotionChange = () => {
      if (reducedMotionQuery.matches) {
        stopLoop()
        targetHover = 0
        smoothHover = 0
        renderFrame(0)
      } else {
        startLoop()
      }
    }
    reducedMotionQuery.addEventListener('change', handleMotionChange)

    return () => {
      stopLoop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      host.removeEventListener('pointermove', handlePointerMove)
      host.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener('change', handleMotionChange)
      glCleanup?.()
    }
  }, [containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-hidden="true"
    />
  )
}

export default memo(TopographicBackground)
