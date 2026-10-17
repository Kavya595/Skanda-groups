/**
 * Creates 3D Procedural Coconut Palm Tree
 * Perfectly proportioned miniature avenue palms
 */
function createCoconutTree(scale = 1) {
  const tree = new THREE.Group();
  tree.userData.isTree = true;

  // Proportionate miniature height: total tree height ~4.2 to 4.8 units
  const trunkHeight = 4.2 * scale;
  const trunkBaseRadius = 0.22 * scale;
  const trunkTopRadius = 0.14 * scale;

  const trunkGeo = new THREE.CylinderGeometry(trunkTopRadius, trunkBaseRadius, trunkHeight, 8, 4);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5a3818,
    roughness: 0.9,
    metalness: 0.05
  });
  const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
  trunkMesh.position.y = trunkHeight / 2;
  trunkMesh.rotation.z = (Math.random() - 0.5) * 0.10;
  tree.add(trunkMesh);

  // Trunk rings
  const ringGeo = new THREE.TorusGeometry(0.20 * scale, 0.035 * scale, 4, 8);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x3d230e, roughness: 1.0 });
  for (let y = 1.0 * scale; y < trunkHeight - 0.4; y += 0.9 * scale) {
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    tree.add(ring);
  }

  // Coconuts at crown
  const cocoGeo = new THREE.SphereGeometry(0.22 * scale, 6, 6);
  const cocoMat = new THREE.MeshStandardMaterial({ color: 0x422006, roughness: 0.85 });
  [
    [0.15, trunkHeight - 0.1, 0.12],
    [-0.15, trunkHeight - 0.1, 0.12],
    [0.08, trunkHeight - 0.08, -0.15]
  ].forEach(([cx, cy, cz]) => {
    const coco = new THREE.Mesh(cocoGeo, cocoMat);
    coco.position.set(cx * scale, cy, cz * scale);
    tree.add(coco);
  });

  // Radiating Palm Fronds Canopy (Arching gracefully without obscuring plots)
  const frondCount = 9;
  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.6,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < frondCount; i++) {
    const angle = (i / frondCount) * Math.PI * 2;
    const frondGroup = new THREE.Group();
    frondGroup.position.set(0, trunkHeight, 0);
    frondGroup.rotation.y = angle;

    const leafGeo = new THREE.ConeGeometry(0.48 * scale, 2.5 * scale, 4);
    const leafMesh = new THREE.Mesh(leafGeo, frondMat);
    leafMesh.position.set(0, 0.55 * scale, 1.15 * scale);
    leafMesh.rotation.x = 1.25;
    leafMesh.scale.set(0.3, 1, 1);
    frondGroup.add(leafMesh);

    tree.add(frondGroup);
  }

  // Base ground root shadow
  const shadowGeo = new THREE.CircleGeometry(0.85 * scale, 12);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x1c1917,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.04;
  tree.add(shadowMesh);

  return tree;
}