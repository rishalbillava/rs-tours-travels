'use client';

import {useEffect, useRef} from 'react';
import {useMotion} from './MotionProvider';

/**
 * A small, dependency-free WebGL atmosphere. It does not load external shaders,
 * meshes, tracking code or images. Motion follows the site's existing control.
 * On reduced-motion / data-saving devices the CSS scene remains visible.
 */
export default function TheoryScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const {paused, light} = useMotion();

  useEffect(() => {
    const node = canvas.current;
    if (!node || paused || light) return;
    const gl = node.getContext('webgl', {
      alpha: true, antialias: false, depth: false,
      powerPreference: 'low-power', premultipliedAlpha: false
    });
    if (!gl) return;

    const vertexSource = [
      'attribute vec2 a_position;',
      'void main() { gl_Position = vec4(a_position, 0.0, 1.0); }'
    ].join('\n');

    const fragmentSource = [
      'precision mediump float;',
      'uniform vec2 u_resolution;',
      'uniform vec2 u_pointer;',
      'uniform float u_time;',
      'uniform float u_scroll;',
      'float hash(vec2 x) { return fract(sin(dot(x,vec2(127.1,311.7)))*43758.5453); }',
      'void main() {',
      '  vec2 p = (gl_FragCoord.xy - 0.5*u_resolution.xy) / max(u_resolution.y, 1.0);',
      '  vec2 cursor = (u_pointer - 0.5) * 2.0;',
      '  p.x += cursor.x * 0.027;',
      '  float t = u_time * 0.1;',
      '  vec3 col = vec3(0.010, 0.017, 0.029);',
      '  float navy = exp(-length((p-vec2(0.30,0.10))*vec2(0.82,1.34))*3.3);',
      '  float teal = exp(-length((p-vec2(-0.22,-0.07))*vec2(1.4,2.1))*4.2);',
      '  float gold = exp(-length((p-vec2(0.10,-0.19))*vec2(1.4,4.0))*4.8);',
      '  col += navy * vec3(0.014, 0.050, 0.083);',
      '  col += teal * vec3(0.005, 0.047, 0.066);',
      '  col += gold * vec3(0.105, 0.067, 0.029);',
      '  float horizon = exp(-abs(p.y+0.15)*16.0) * (0.6+0.4*sin(p.x*2.4+t));',
      '  col += horizon * vec3(0.060, 0.075, 0.078);',
      '  vec2 sg = (p+vec2(10.0))*vec2(93.0,68.0);',
      '  vec2 cell = floor(sg);',
      '  float seed = hash(cell);',
      '  vec2 sf = fract(sg)-0.5;',
      '  float twinkle = 0.65+0.35*sin(t*4.0+seed*26.0);',
      '  float star = (1.0-smoothstep(0.013,0.14,length(sf)))*step(0.985,seed)*twinkle;',
      '  col += star*vec3(0.30,0.55,0.59);',
      '  float depth = clamp((-p.y-0.10)*2.0,0.0,1.0);',
      '  float edge = depth*1.10;',
      '  float road = 1.0-smoothstep(edge-0.03,edge+0.07,abs(p.x));',
      '  col += road*depth*vec3(0.009,0.011,0.013);',
      '  float side = exp(-abs(abs(p.x)-edge)*93.0)*depth;',
      '  col += side*vec3(0.16,0.34,0.34);',
      '  float lane = exp(-abs(p.x)*90.0)*depth;',
      '  float stripes = step(0.59,fract(0.44/max(0.07,-p.y+0.20)-u_scroll*1.25+t));',
      '  col += lane*stripes*vec3(0.21,0.19,0.12);',
      '  vec2 orbP = (p-vec2(0.14,0.04)-cursor*0.018)*vec2(0.88,1.12);',
      '  float r = length(orbP);',
      '  float ring = exp(-abs(r-0.37)*120.0);',
      '  float inner = exp(-abs(r-0.275)*160.0);',
      '  float sweep = 0.50+0.50*sin(atan(orbP.y,orbP.x)*3.0-t*3.0);',
      '  col += ring*(0.05+0.25*sweep)*vec3(0.23,0.65,0.73);',
      '  col += inner*0.11*vec3(0.64,0.48,0.28);',
      '  col += (hash(gl_FragCoord.xy+u_time)-0.5)*0.012;',
      '  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);',
      '}'
    ].join('\n');

    const shader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = shader(gl.VERTEX_SHADER, vertexSource);
    const fs = shader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) { if (vs) gl.deleteShader(vs); if (fs) gl.deleteShader(fs); return; }
    const program = gl.createProgram();
    if (!program) { gl.deleteShader(vs); gl.deleteShader(fs); return; }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); return;
    }
    const buffer = gl.createBuffer();
    if (!buffer) { gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program,'u_resolution');
    const pointer = gl.getUniformLocation(program,'u_pointer');
    const time = gl.getUniformLocation(program,'u_time');
    const scroll = gl.getUniformLocation(program,'u_scroll');
    const target = {x: 0.5, y: 0.5, scroll: 0};
    const current = {x: 0.5, y: 0.5, scroll: 0};
    let raf = 0;
    let disposed = false;
    let start = performance.now();
    let last = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.4);
      node.width = Math.max(1, Math.round(node.clientWidth*ratio));
      node.height = Math.max(1, Math.round(node.clientHeight*ratio));
      gl.viewport(0, 0, node.width, node.height);
    };
    const move = (event: PointerEvent) => {
      target.x = event.clientX / Math.max(innerWidth,1);
      target.y = 1-event.clientY / Math.max(innerHeight,1);
    };
    const onScroll = () => { target.scroll = Math.min(2, scrollY / Math.max(innerHeight,1)); };
    const render = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(render);
      if (document.hidden || now-last<30) return; // approximately 30 FPS; restrained on laptops
      last = now;
      current.x += (target.x-current.x)*0.045;
      current.y += (target.y-current.y)*0.045;
      current.scroll += (target.scroll-current.scroll)*0.055;
      gl.uniform2f(resolution, node.width, node.height);
      gl.uniform2f(pointer, current.x, current.y);
      gl.uniform1f(time, (now-start)/1000);
      gl.uniform1f(scroll, current.scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(raf); };
    window.addEventListener('pointermove', move, {passive:true});
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', resize);
    node.addEventListener('webglcontextlost',lost);
    resize();
    onScroll();
    raf = requestAnimationFrame(render);
    return () => {
      disposed=true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove',move);
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',resize);
      node.removeEventListener('webglcontextlost',lost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [paused,light]);

  return <canvas ref={canvas} className="theory-scene-canvas" aria-hidden="true" />;
}
