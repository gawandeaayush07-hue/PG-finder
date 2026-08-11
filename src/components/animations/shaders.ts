export const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Calculate distance from mouse
  float dist = distance(vUv, uMouse);
  
  // Create a ripple effect based on mouse distance and time
  float ripple = sin(dist * 20.0 - uTime * 5.0) * 0.05 * exp(-dist * 5.0);
  
  pos.z += ripple;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

// Simplex noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Create organic liquid distortion using noise
  float noise1 = snoise(uv * 3.0 + uTime * 0.2);
  float noise2 = snoise(uv * 5.0 - uTime * 0.3);
  
  // Combine noise for complex distortion
  vec2 distortedUv = uv + vec2(noise1, noise2) * 0.1;
  
  // PGFinder theme colors: Grass Green (#7CFC00) and White (#FFFFFF)
  vec3 color1 = vec3(0.486, 0.988, 0.0); // #7CFC00 (Grass Green)
  vec3 color2 = vec3(1.0, 1.0, 1.0);     // #FFFFFF (White)
  vec3 color3 = vec3(0.196, 0.804, 0.196); // #32CD32 (Lime Green for depth)
  
  // Mix colors based on distortion
  float mix1 = snoise(distortedUv * 2.0 + uTime * 0.1) * 0.5 + 0.5;
  float mix2 = snoise(distortedUv * 4.0 - uTime * 0.2) * 0.5 + 0.5;
  
  vec3 finalColor = mix(color1, color2, mix1);
  finalColor = mix(finalColor, color3, mix2 * 0.3);
  
  // Add subtle vignette (lighter for this theme)
  float vignette = smoothstep(1.8, 0.2, length(vUv - 0.5));
  finalColor = mix(finalColor, vec3(1.0), (1.0 - vignette) * 0.2);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;
