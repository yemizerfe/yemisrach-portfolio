"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

/**
 * `@react-three/fiber` 9.x constructs a `THREE.Clock` internally, which three
 * deprecated in r183 in favour of `THREE.Timer`; the migration is scheduled for
 * R3F 10 and no stable release carries it yet. The resulting notice is about the
 * library, not this scene, and it would otherwise be the only thing the page
 * prints to a visitor's console — so it is dropped here. The match is narrow
 * (one known prefix) and fails open: every other warning still reaches the
 * console untouched. Delete this block once R3F ships the Timer migration.
 */
if (typeof window !== "undefined") {
  const FLAG = "__r3fClockNoticeFiltered";
  const host = window as typeof window & Record<string, unknown>;

  if (host[FLAG] !== true) {
    host[FLAG] = true;
    const warn = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].startsWith("THREE.Clock:")) {
        return;
      }
      warn(...args);
    };
  }
}
import { Environment, Lightformer } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

/**
 * CinematicScene — the site's spatial layer, told in the language of the
 * work it belongs to: backend systems.
 *
 * A fixed, full-viewport React Three Fiber scene behind the content that
 * turns the flat page into a machine room with real depth:
 *
 *   Foreground — dark shard silhouettes near the lens, framing the edges;
 *                they answer the pointer most strongly.
 *   Midground — the focal subject: a stacked database drum in obsidian
 *               glass, banded by emissive read-heads, crowned by a
 *               pulsing query sphere, encircled by two orbital lanes on
 *               which request packets continuously travel. The drum sits
 *               deep enough that the orbital lanes sweep visibly around
 *               the portrait frame — the portrait reads as mounted inside
 *               the system, not on top of it.
 *   Streams — three luminous data streams curve in from the edges of the
 *             frame and drain into the store: requests being ingested,
 *             always moving, the clearest "backend at work" image in the
 *             scene.
 *   Background — a faint service-topology lattice (nodes + links) far
 *                behind, sparse depth dust, all dissolving into
 *                exponential fog.
 *
 * Lighting is a three-point rig in the brand's own lights (violet key,
 * cyan rim, champagne fill) plus a tiny local environment built from
 * Lightformers, so the physical materials get real reflections without
 * fetching any remote asset.
 *
 * Motion systems, in one place — every continuous motion is a pure
 * function of elapsed time or a delta-damped value, never a per-frame
 * increment, so the result is identical at 30, 60 or 144 Hz:
 *   * GSAP timeline — the entrance: camera dollies in from the dark while
 *     the key light ramps up and the drum turns to face the lens.
 *   * Pointer — delta-damped parallax, strongest on the foreground shards.
 *   * Autonomous — the camera drifts on a slow clock of its own and the
 *     key light walks the palette with it, so the room is never still and
 *     never reacts to the page: scrolling changes nothing in the scene.
 *   * Continuous — packets circulate their lanes, streams flow into the
 *     store, the query sphere breathes, nodes pulse: the system is
 *     always running.
 *
 * House rules: aria-hidden, pointer-events-none; reduced motion gets a
 * single composed frame with no camera travel; WebGL failure renders
 * nothing and leaves the painted CSS layers in charge; DPR is capped at
 * 1.5 and every listener and tween is cleaned up.
 */

/** Palette of the four lights, mirrored from globals.css tokens. */
const HUES = {
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  champagne: "#e0b978",
  ice: "#8fa6d4",
  navy: "#05070f",
  emerald: "#10b981",
};

/** The focal subject's home in world space. Every other system aims at
 *  it: the streams drain into it, the nodes orbit it, the camera stops
 *  are composed around it. */
const CORE: [number, number, number] = [2.35, 0.1, -1.4];

/** Camera keyframes composed around the subject. The scene no longer
 *  travels them with the page: they are the stops the camera breathes
 *  between on its own, so the room has depth without ever reacting to a
 *  scroll. */
const CAMERA_STOPS: Array<{
  pos: [number, number, number];
  look: [number, number, number];
  fog: number;
}> = [
  { pos: [0, 0, 9.5], look: [0.6, 0, 0], fog: 0.03 },
  { pos: [-1.6, 0.7, 7.2], look: [-0.2, 0.3, -1], fog: 0.036 },
  { pos: [1.4, -0.5, 5.6], look: [0.4, -0.2, -2], fog: 0.042 },
  { pos: [-0.8, 0.5, 4.4], look: [0, 0.2, -2.5], fog: 0.048 },
  { pos: [0, 0, 3.2], look: [0, 0, -3], fog: 0.055 },
];

/** Key-light colour walks the palette on its own clock: violet at the
 *  open, cool cyan through the middle, champagne at the far end. */
const KEY_STOPS = [HUES.violet, HUES.violet, HUES.cyan, HUES.cyan, HUES.champagne];

/** Reusable output for the camera path sampler — the render loop never
 *  allocates. */
const pathOut = {
  pos: new THREE.Vector3(),
  look: new THREE.Vector3(),
  fog: 0.03,
};

/** Sample the camera path at `progress` into `out`, with smoothstep
 *  blending between neighbouring stops. Allocation-free. */
function sampleCameraPath(progress: number, out: typeof pathOut) {
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);
  const scaled = clamped * (CAMERA_STOPS.length - 1);
  const index = Math.min(Math.floor(scaled), CAMERA_STOPS.length - 2);
  const t = THREE.MathUtils.smoothstep(scaled - index, 0, 1);
  const a = CAMERA_STOPS[index];
  const b = CAMERA_STOPS[index + 1];
  out.pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  );
  out.look.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], t),
    THREE.MathUtils.lerp(a.look[1], b.look[1], t),
    THREE.MathUtils.lerp(a.look[2], b.look[2], t),
  );
  out.fog = THREE.MathUtils.lerp(a.fog, b.fog, t);
}

interface RigState {
  /** Entrance progress 0–1, driven by the GSAP timeline. */
  entrance: { current: number };
  /** Smoothed pointer, -1–1. Damped inside the frame loop with delta. */
  pointer: { current: THREE.Vector2; target: THREE.Vector2 };
  reduceMotion: boolean;
}

/**
 * The focal subject — the database core.
 *
 * Three obsidian discs stacked into a drum (the canonical data store,
 * modelled rather than illustrated), each banded by an emissive read-head
 * ring in cyan; a violet query sphere breathes above the stack; two
 * hairline orbital lanes encircle it carrying request packets that never
 * stop circulating. The drum turns on its own clock, independent of the
 * page.
 *
 * Every rotation here is a function of elapsed time, not a per-frame
 * increment — the motion is identical on a 30 Hz laptop and a 144 Hz
 * display, which is what "smooth" actually means.
 */
function Subject({ rig }: { rig: RigState }) {
  const cluster = useRef<THREE.Group>(null);
  const query = useRef<THREE.Mesh>(null);
  const queryMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const rings = useRef<THREE.Group>(null);

  const shellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#182649",
        metalness: 0.62,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.28,
        envMapIntensity: 1.9,
      }),
    [],
  );
  const bandMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: new THREE.Color(HUES.cyan),
        emissiveIntensity: 1.6,
        metalness: 0.4,
        roughness: 0.4,
      }),
    [],
  );
  const laneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: new THREE.Color(HUES.champagne),
        emissiveIntensity: 1.1,
        metalness: 0.4,
        roughness: 0.4,
      }),
    [],
  );
  const packetMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: new THREE.Color(HUES.champagne),
        emissiveIntensity: 2.2,
        metalness: 0.2,
        roughness: 0.5,
      }),
    [],
  );

  useEffect(
    () => () => {
      shellMaterial.dispose();
      bandMaterial.dispose();
      laneMaterial.dispose();
      packetMaterial.dispose();
    },
    [shellMaterial, bandMaterial, laneMaterial, packetMaterial],
  );

  useFrame((state) => {
    const group = cluster.current;
    if (!group) return;
    const { entrance, reduceMotion } = rig;
    const t = state.clock.elapsedTime;

    // Entrance: the store settles in with a slow turn as it scales up.
    const e = entrance.current;
    const settle = 1 - Math.pow(1 - e, 3);
    group.scale.setScalar(0.95 + settle * 0.27);

    // The store turns on its own clock: the page scrolling is not part of the
    // animation, so the drum keeps working whether or not anyone scrolls.
    const idle = reduceMotion ? 0 : t * 0.1;
    group.rotation.y = idle + (1 - settle) * -0.9;
    group.position.y =
      CORE[1] + (reduceMotion ? 0 : Math.sin(t * 0.2) * 0.1);

    if (rings.current && !reduceMotion) {
      // Always a function of elapsed time — identical motion at any refresh
      // rate, with no jitter from frame drops or rAF skips.
      const ringAngle = t * 0.15;
      rings.current.rotation.z = ringAngle;
      rings.current.rotation.x = 1.18 + Math.sin(t * 0.16) * 0.08;
    }

    // The query sphere: a request hovering over the store, breathing as it
    // waits for its response.
    if (query.current && !reduceMotion) {
      query.current.position.y = 2.4 + Math.sin(t * 0.9) * 0.16;
      query.current.rotation.y = t * 0.4;
    }
    if (queryMaterial.current) {
      const breathe = reduceMotion ? 1 : 0.9 + Math.sin(t * 1.6) * 0.5;
      queryMaterial.current.emissiveIntensity =
        (0.4 + settle * 1.1) * breathe;
    }
  });

  /** Request packets circulating a lane: small emissive bars, each with its
   *  own phase, travelling the torus path (torus geometry lies in XY). */
  const packets = (count: number, radius: number, speed: number) =>
    Array.from({ length: count }, (_, i) => {
      const phase = (i / count) * Math.PI * 2;
      return { phase, radius, speed, key: `${radius}-${i}` };
    });

  const laneA = packets(5, 2.35, 0.5);
  const laneB = packets(4, 2.95, -0.38);

  const PacketLane = ({
    tilt,
    radius,
    material,
    list,
  }: {
    tilt: [number, number, number];
    radius: number;
    material: THREE.Material;
    list: Array<{ phase: number; radius: number; speed: number; key: string }>;
  }) => {
    const lane = useRef<THREE.Group>(null);
    useFrame((state) => {
      if (!lane.current || rig.reduceMotion) return;
      const t = state.clock.elapsedTime;
      lane.current.children.forEach((child, i) => {
        const packet = list[i];
        const a = packet.phase + t * packet.speed;
        child.position.set(
          Math.cos(a) * packet.radius,
          Math.sin(a) * packet.radius,
          0,
        );
        child.rotation.z = a + Math.PI / 2;
      });
    });
    return (
      <group rotation={tilt}>
        <mesh material={material}>
          <torusGeometry args={[radius, 0.012, 8, 160]} />
        </mesh>
        <group ref={lane}>
          {list.map((packet) => (
            <mesh key={packet.key} material={material}>
              <boxGeometry args={[0.24, 0.075, 0.075]} />
            </mesh>
          ))}
        </group>
      </group>
    );
  };

  return (
    <group ref={cluster} position={[CORE[0], CORE[1], CORE[2]]}>
      {/* The store: three obsidian discs, each with its read-head band. */}
      {[-0.95, 0, 0.95].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh material={shellMaterial}>
            <cylinderGeometry args={[1.4, 1.4, 0.6, 48]} />
          </mesh>
          <mesh material={bandMaterial} position={[0, 0.34, 0]}>
            <cylinderGeometry args={[1.42, 1.42, 0.05, 48]} />
          </mesh>
        </group>
      ))}
      {/* The query: light waiting for a response above the stack. */}
      <mesh ref={query} position={[0, 2.4, 0]} scale={0.34}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          ref={queryMaterial}
          color="#05070f"
          emissive={new THREE.Color(HUES.violet)}
          emissiveIntensity={1.1}
          roughness={0.5}
        />
      </mesh>
      {/* Orbital lanes carrying circulating request packets. */}
      <group ref={rings}>
        <PacketLane
          tilt={[1.2, 0.2, 0]}
          radius={2.35}
          material={laneMaterial}
          list={laneA}
        />
        <PacketLane
          tilt={[0.5, -0.6, 0.4]}
          radius={2.95}
          material={laneMaterial}
          list={laneB}
        />
      </group>
    </group>
  );
}

/**
 * Data streams — requests flowing into the store.
 *
 * Three luminous curves sweep in from the edges of the frame and drain
 * into the drum; along each, small emissive packets travel at a steady
 * rate, swelling as they enter the frame and shrinking as they are
 * ingested. This is the scene's clearest statement of what the work is:
 * data always moving toward the database.
 *
 * Positions are a pure function of elapsed time, so the flow speed is
 * identical at any refresh rate.
 */
function DataStreams({ rig }: { rig: RigState }) {
  const streamMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: new THREE.Color(HUES.ice),
        emissiveIntensity: 1.5,
        metalness: 0.2,
        roughness: 0.5,
      }),
    [],
  );

  const { streams } = useMemo(() => {
    const [cx, cy, cz] = CORE;
    const make = (points: Array<[number, number, number]>) =>
      new THREE.CatmullRomCurve3(
        points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      );
    const list = [
      // In from the upper left, above the headline.
      make([
        [-9, 4.6, -3.5],
        [-4, 3.4, -2.2],
        [0.2, 2.4, -1.8],
        [cx - 0.9, cy + 0.7, cz + 0.2],
      ]),
      // In from the right edge, behind the portrait.
      make([
        [10.5, 4.2, -4.5],
        [7.2, 3.2, -3.2],
        [4.6, 2.0, -2.2],
        [cx + 0.7, cy + 0.9, cz + 0.1],
      ]),
      // Up from below the fold, gliding under the copy.
      make([
        [-7, -5.2, -1.2],
        [-2.4, -3.8, -1.6],
        [1.2, -2.2, -1.5],
        [cx - 0.4, cy - 0.8, cz + 0.3],
      ]),
    ];
    // Packets per stream with staggered phases; they loop end-to-start.
    const defs = list.map((curve, s) => ({
      curve,
      packets: Array.from({ length: 6 }, (_, i) => ({
        phase: i / 6 + s * 0.11,
        speed: 0.055 + s * 0.012,
      })),
    }));
    return { streams: defs };
  }, []);

  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);

  useEffect(
    () => () => {
      streamMaterial.dispose();
      // Curves hold no GPU resources — plain GC takes them.
    },
    [streamMaterial],
  );

  const at = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (rig.reduceMotion) return;
    const t = state.clock.elapsedTime;
    let n = 0;
    for (const stream of streams) {
      for (const packet of stream.packets) {
        const mesh = packetRefs.current[n++];
        if (!mesh) continue;
        const frac = (packet.phase + t * packet.speed) % 1;
        stream.curve.getPointAt(frac, at);
        stream.curve.getPointAt(Math.min(frac + 0.01, 1), ahead);
        mesh.position.copy(at);
        // Stretch along travel and swell mid-flight: the packet reads as
        // motion itself, thinning out as it is absorbed by the store.
        mesh.lookAt(ahead);
        const swell = Math.sin(frac * Math.PI);
        mesh.scale.set(1, 0.6 + swell * 0.7, 0.6 + swell * 0.7);
        mesh.visible = true;
      }
    }
  });

  let n = 0;
  return (
    <group>
      {streams.map((stream, s) => (
        <group key={s}>
          {stream.packets.map((_, i) => (
            <mesh
              key={i}
              ref={(mesh) => {
                packetRefs.current[n++] = mesh;
              }}
              material={streamMaterial}
            >
              <capsuleGeometry args={[0.035, 0.22, 4, 8]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Server-node satellites: slab-shaped servers with emissive status
 * stripes, orbiting the store as a slow satellite system. They mark the
 * subject's space and read its rotation.
 */
function ServerNodes({ rig }: { rig: RigState }) {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    let seed = 77123;
    const next = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    return Array.from({ length: 7 }, (_, i) => ({
      position: [
        CORE[0] + Math.cos((i / 7) * Math.PI * 2) * (3.2 + next() * 1.7),
        (next() - 0.5) * 3.4,
        CORE[2] + Math.sin((i / 7) * Math.PI * 2) * (2.5 + next() * 1.7),
      ] as [number, number, number],
      scale: 0.16 + next() * 0.3,
      speed: 0.05 + next() * 0.12,
      axis: next() > 0.5 ? 1 : -1,
      hue: next() > 0.6 ? HUES.emerald : HUES.cyan,
    }));
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g || rig.reduceMotion) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      child.rotation.x = t * nodes[i].speed * nodes[i].axis;
      child.rotation.y = t * nodes[i].speed * 0.7;
      child.position.y =
        nodes[i].position[1] + Math.sin(t * 0.4 + i * 1.7) * 0.22;
    });
    // Independent of the page: the stack orbits itself, slowly.
    g.rotation.y = t * 0.05;
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <group key={i} position={node.position} scale={node.scale}>
          {/* The chassis. */}
          <mesh>
            <boxGeometry args={[1.6, 0.5, 1]} />
            <meshStandardMaterial
              color="#101a3a"
              metalness={0.65}
              roughness={0.3}
              envMapIntensity={1.3}
            />
          </mesh>
          {/* The status stripe: the one lit face of a rack. */}
          <mesh position={[0, 0.05, 0.51]}>
            <boxGeometry args={[1.2, 0.07, 0.01]} />
            <meshStandardMaterial
              color="#000000"
              emissive={new THREE.Color(node.hue)}
              emissiveIntensity={1.5}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * The service topology: a faint lattice of nodes and links far behind the
 * subject — the architecture drawn in light, echoing the 2D backend graph
 * but living in real depth, drifting slowly with parallax.
 */
function TopologyLattice({ rig }: { rig: RigState }) {
  const group = useRef<THREE.Group>(null);
  const lineMaterial = useRef<THREE.LineBasicMaterial>(null);

  const { nodes, lineGeometry } = useMemo(() => {
    let seed = 90210;
    const next = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const pts: Array<[number, number, number]> = Array.from(
      { length: 8 },
      () => [
        (next() - 0.5) * 24,
        (next() - 0.5) * 13,
        -9 - next() * 7,
      ],
    );
    // Chain the nodes into a service graph plus two chords.
    const pairs: Array<[number, number]> = [];
    for (let i = 0; i < pts.length - 1; i++) pairs.push([i, i + 1]);
    pairs.push([0, 3], [2, 6]);
    const vertices = new Float32Array(pairs.flatMap(([a, b]) => [...pts[a], ...pts[b]]));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return { nodes: pts, lineGeometry: geo };
  }, []);

  useEffect(
    () => () => {
      lineGeometry.dispose();
    },
    [lineGeometry],
  );

  useFrame((state) => {
    if (group.current && !rig.reduceMotion) {
      const t = state.clock.elapsedTime;
      group.current.position.x = Math.sin(t * 0.05) * 0.5;
      group.current.position.y = Math.cos(t * 0.04) * 0.3;
    }
    if (lineMaterial.current) {
      lineMaterial.current.opacity = rig.reduceMotion
        ? 0.22
        : 0.16 + Math.sin(state.clock.elapsedTime * 0.7) * 0.07;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          ref={lineMaterial}
          color={new THREE.Color(HUES.cyan)}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>
      {nodes.map((position, i) => (
        <mesh key={i} position={position}>
          <boxGeometry args={[0.34, 0.34, 0.34]} />
          <meshStandardMaterial
            color="#0a1020"
            emissive={new THREE.Color(i % 3 === 0 ? HUES.violet : HUES.cyan)}
            emissiveIntensity={0.5}
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Foreground shard silhouettes near the lens. Dark, close, heavily
 *  parallaxed — they give the camera something to move past. */
function ForegroundShards({ rig }: { rig: RigState }) {
  const group = useRef<THREE.Group>(null);

  const shards = useMemo(
    () => [
      { position: [-5.6, 2.4, 5.2] as const, scale: 1.6, speed: 0.05 },
      { position: [5.4, -2.8, 5.6] as const, scale: 2.1, speed: 0.04 },
      { position: [-4.4, -3.4, 4.4] as const, scale: 1.2, speed: 0.07 },
    ],
    [],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { pointer, entrance, reduceMotion } = rig;
    const t = state.clock.elapsedTime;
    // Strongest pointer response in the scene: these are closest to the
    // lens. Position follows the already-damped pointer value.
    g.position.x = reduceMotion ? 0 : pointer.current.x * -0.9;
    g.position.y = reduceMotion ? 0 : pointer.current.y * 0.6;
    if (!reduceMotion) {
      g.rotation.z = Math.sin(t * 0.07) * 0.04;
      // They breathe in and out on their own — bounded, never a lunge.
      g.position.z = Math.sin(t * 0.09) * 0.55;
      g.children.forEach((child, i) => {
        child.rotation.y = t * shards[i].speed;
      });
    }
    g.visible = entrance.current > 0.05;
  });

  return (
    <group ref={group}>
      {shards.map((shard, i) => (
        <mesh key={i} position={shard.position} scale={shard.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#070c1a"
            metalness={0.5}
            roughness={0.55}
            envMapIntensity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Sparse depth dust: two cues only — how deep the room is, and which way
 *  the camera is moving. Deliberately few; this is not a particle effect. */
function DepthDust({ rig }: { rig: RigState }) {
  const points = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    let seed = 31415;
    const next = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const count = 130;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (next() - 0.5) * 26;
      positions[i * 3 + 1] = (next() - 0.5) * 16;
      positions[i * 3 + 2] = -2 - next() * 16;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(HUES.ice),
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    return { geometry: geo, material: mat };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    if (points.current && !rig.reduceMotion) {
      points.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

/** The lighting rig: violet key, cyan rim, champagne fill. The key ramps
 *  up during the entrance and its hue drifts through the palette on its own. */
function LightRig({ rig }: { rig: RigState }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const from = useMemo(() => new THREE.Color(), []);
  const to = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const e = rig.entrance.current;
    if (key.current) {
      key.current.intensity = 0.2 + e * 3.0;
      // Key hue walks the palette on a slow clock of its own.
      const clamped =
        ((Math.sin(state.clock.elapsedTime * 0.08) + 1) / 2) *
        (rig.reduceMotion ? 0 : 1);
      const scaled = clamped * (KEY_STOPS.length - 1);
      const index = Math.min(Math.floor(scaled), KEY_STOPS.length - 2);
      const mix = THREE.MathUtils.smoothstep(scaled - index, 0, 1);
      from.set(KEY_STOPS[index]);
      to.set(KEY_STOPS[index + 1]);
      key.current.color.copy(from).lerp(to, mix);
    }
    if (rim.current) rim.current.intensity = 0.12 + e * 2.0;
    if (fill.current) fill.current.intensity = 2.5 + e * 30;
  });

  return (
    <>
      <ambientLight color="#1b2a55" intensity={0.6} />
      <directionalLight
        ref={key}
        position={[-6, 5, 4]}
        color={HUES.violet}
        intensity={0.2}
      />
      <directionalLight
        ref={rim}
        position={[5, 2, -6]}
        color={HUES.cyan}
        intensity={0.12}
      />
      <pointLight
        ref={fill}
        position={[3.5, -3, 5]}
        color={HUES.champagne}
        intensity={2.5}
        distance={30}
        decay={2}
      />
    </>
  );
}

/** Scratch vectors for the camera rig — the render loop never allocates. */
const desired = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

/** Camera choreography: entrance dolly, a slow autonomous drift, pointer
 *  parallax. All smoothing is frame-delta based, so the feel is identical at
 *  any refresh rate and after any frame drop. */
function CameraRig({ rig }: { rig: RigState }) {
  const { camera, size } = useThree();

  useFrame((state, delta) => {
    const { entrance, pointer, reduceMotion } = rig;
    const t = state.clock.elapsedTime;

    // The pointer follows the cursor with the same damped easing — no
    // separate rAF loop, no frame-rate-dependent lerp constant.
    pointer.current.x = THREE.MathUtils.damp(
      pointer.current.x,
      reduceMotion ? 0 : pointer.target.x,
      3,
      delta,
    );
    pointer.current.y = THREE.MathUtils.damp(
      pointer.current.y,
      reduceMotion ? 0 : pointer.target.y,
      3,
      delta,
    );

    // A slow breath around the opening composition: the room moves by itself,
    // and scrolling the page changes nothing about where the camera sits.
    sampleCameraPath(
      reduceMotion ? 0 : 0.08 + Math.sin(t * 0.05) * 0.045,
      pathOut,
    );

    // Narrow viewports frame the subject higher and tighter so it reads on
    // tall mobile screens instead of drifting toward the bottom edge.
    const aspect = size.width / Math.max(size.height, 1);
    const offsetX = aspect > 1.05 ? 0 : -0.2;
    const offsetY = aspect > 1.05 ? 0 : -0.4;

    const settle = 1 - Math.pow(1 - entrance.current, 3);

    desired.set(
      pathOut.pos.x +
        offsetX +
        pointer.current.x * 0.55 +
        (reduceMotion ? 0 : Math.sin(t * 0.06) * 0.35),
      pathOut.pos.y +
        offsetY +
        pointer.current.y * -0.4 +
        (reduceMotion ? 0 : Math.cos(t * 0.045) * 0.2),
      pathOut.pos.z + (1 - settle) * 4.5, // entrance dolly: in from the dark
    );

    const follow = reduceMotion ? 1 : 1 - Math.exp(-delta * 3.2);
    camera.position.lerp(desired, follow);

    lookTarget.set(
      pathOut.look.x + offsetX,
      pathOut.look.y + offsetY,
      pathOut.look.z,
    );
    camera.lookAt(lookTarget);

    const scene = state.scene;
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = pathOut.fog;
    }
  });

  return null;
}

function SceneContents({ rig }: { rig: RigState }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(new THREE.Color(HUES.navy), 0.03);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  return (
    <>
      <CameraRig rig={rig} />
      <LightRig rig={rig} />
      {/* A tiny local environment of lightformers: real reflections on the
          obsidian shell with zero network assets. */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={2.2}
          color={HUES.violet}
          position={[-4, 3, 2]}
          scale={[6, 6, 1]}
        />
        <Lightformer
          intensity={1.6}
          color={HUES.cyan}
          position={[4, 1, -3]}
          scale={[5, 8, 1]}
        />
        <Lightformer
          intensity={1.1}
          color={HUES.champagne}
          position={[0, -4, 3]}
          scale={[8, 3, 1]}
        />
      </Environment>
      <Subject rig={rig} />
      <DataStreams rig={rig} />
      <ServerNodes rig={rig} />
      <TopologyLattice rig={rig} />
      <ForegroundShards rig={rig} />
      <DepthDust rig={rig} />
    </>
  );
}

/** True when this browser can actually create a WebGL context. */
function supportsWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    return !!(
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function CinematicScene() {
  const [webgl] = useState(() =>
    typeof window === "undefined" ? true : supportsWebGL(),
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  const rig = useMemo<RigState>(
    () => ({
      entrance: { current: 0 },
      pointer: { current: new THREE.Vector2(), target: new THREE.Vector2() },
      reduceMotion: false,
    }),
    [],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      rig.reduceMotion = query.matches;
      setReduceMotion(query.matches);
      if (query.matches) {
        rig.entrance.current = 1; // composed still, already "arrived"
      }
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [rig]);

  // Pointer feed + entrance timeline. All GSAP-owned, all cleaned up.
  // Nothing here listens to scroll: the scene animates on its own.
  useEffect(() => {
    if (!webgl) return;

    const onPointer = (event: PointerEvent) => {
      rig.pointer.target.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };

    let entranceTween: gsap.core.Tween | null = null;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      entranceTween?.kill();
      entranceTween = null;
      window.removeEventListener("pointermove", onPointer);
    };

    const start = () => {
      stop();
      if (motionQuery.matches) {
        rig.entrance.current = 1; // composed still, already "arrived"
        rig.pointer.target.set(0, 0);
        return;
      }

      entranceTween = gsap.to(rig.entrance, {
        current: 1,
        duration: 2.2,
        delay: 0.15,
        ease: "power2.inOut",
      });
      window.addEventListener("pointermove", onPointer, { passive: true });
    };

    start();
    motionQuery.addEventListener("change", start);

    return () => {
      motionQuery.removeEventListener("change", start);
      stop();
    };
  }, [rig, webgl]);

  // After the R3F Canvas mounts, the internal resizer can leave the
  // canvas at its default 300×150 size on some mobile browsers. This
  // effect watches for the R3F canvas to appear in the DOM (it is the
  // last canvas on the page, mounted after the decorative 2D
  // canvas-backdrop) and then forces it to fill the viewport, including
  // setting the drawing-buffer size so the WebGL context matches,
  // rechecking on resizes so mobile URL-bar changes never punch through.
  useEffect(() => {
    const targetLastCanvas = () => {
      const allCanvases = document.querySelectorAll("canvas");
      const canvas = allCanvases[allCanvases.length - 1];
      if (!canvas || !canvas.parentElement) return;

      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        if (w < 2 || h < 2) return;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas.parentElement);
      window.addEventListener("resize", resize);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", resize);
      };
    };

    // Try immediately in case the canvas is already mounted.
    const cleanup = targetLastCanvas();

    // Watch for the canvas being added to the DOM.
    const observer = new MutationObserver(() => {
      const c = document.querySelectorAll("canvas");
      if (c.length >= 2) {
        observer.disconnect();
        // Re-run the targeting; ignore its cleanup so the resize observer
        // it creates stays active.
        targetLastCanvas();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  if (!webgl) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        // The room lives on its own compositor layer, pinned to the viewport.
        // Scrolling the page then cannot force it to repaint, resample or
        // re-rasterise, whatever the content above it is doing.
        transform: "translateZ(0)",
        contain: "layout paint",
      }}
    >
      {/* The canvas is sized to cover the whole viewport on every device,
          never clipped by the mobile URL bar: it scales to the wider of
          viewport and device height so the background never punches through. */}
      <Canvas
        dpr={[1, 1.5]}
        // Measure the container on real layout changes only. The measure hook
        // otherwise re-reads bounds on every scroll event, which resizes the
        // drawing buffer and shows up as the scene snagging while you scroll;
        // with `scroll: false` the background has no scroll listener at all.
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 42, near: 0.1, far: 80, position: [0, 0, 14] }}
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
        frameloop={(() => {
          if (reduceMotion) return "demand";
          // The scene is a living system: packets, streams, dust, lattice
          // and the query sphere never stop moving, and the camera never
          // stops drifting on its own, so requesting a frame every
          // display refresh is what keeps that motion smooth.
          return "always";
        })()}
        onCreated={({ gl, scene, camera }) => {
          // Render one frame immediately so the scene is visible before
          // the first useFrame tick.
          gl.render(scene, camera);
        }}
      >
        <SceneContents rig={rig} />
      </Canvas>
    </div>
  );
}
