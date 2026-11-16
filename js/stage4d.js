// Sân khấu 4D Xoay Tròn 360° bằng Three.js cho Website VinFast Hà Nội
// Cho phép xoay xem đủ các mặt (Đầu xe, Thân xe, Đuôi xe, Mái) và đổi màu sơn trực tiếp

(function () {
  const container = document.getElementById("stage-4d-container");
  if (!container || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    100
  );
  camera.position.set(4.4, 2.0, 5.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 8.5;
  controls.maxPolarAngle = Math.PI / 2 - 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.6;

  // Ánh sáng Studio 4D (Trắng + Xanh Cyan + Vàng Gold)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const rimCyan = new THREE.DirectionalLight(0x00d2ff, 1.1);
  rimCyan.position.set(-6, 4, -5);
  scene.add(rimCyan);

  const rimGold = new THREE.DirectionalLight(0xd4af37, 0.85);
  rimGold.position.set(4, 3, -6);
  scene.add(rimGold);

  // Đĩa xoay 4D dưới gầm xe
  const platformGroup = new THREE.Group();
  const discGeo = new THREE.CylinderGeometry(2.6, 2.75, 0.08, 64);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x0b1222,
    metalness: 0.8,
    roughness: 0.25
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.position.y = -0.04;
  platformGroup.add(disc);

  const ringGeo = new THREE.RingGeometry(2.58, 2.66, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00d2ff,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  platformGroup.add(ring);
  scene.add(platformGroup);

  // Vật liệu thân xe có thể đổi màu
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1464f4,
    metalness: 0.72,
    roughness: 0.22
  });
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b1324,
    metalness: 0.9,
    roughness: 0.1
  });
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.35,
    roughness: 0.65
  });
  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85
  });
  const alloyMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2
  });
  const frontLedMat = new THREE.MeshBasicMaterial({ color: 0x99f6ff });
  const rearLedMat = new THREE.MeshBasicMaterial({ color: 0xff2a3c });

  let carGroup = new THREE.Group();
  scene.add(carGroup);

  function createWheel(x, z) {
    const wheel = new THREE.Group();
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.24, 28),
      tireMaterial
    );
    tire.rotation.z = Math.PI / 2;
    wheel.add(tire);

    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.23, 0.25, 16),
      alloyMaterial
    );
    rim.rotation.z = Math.PI / 2;
    wheel.add(rim);

    wheel.position.set(x, 0.36, z);
    return wheel;
  }

  function addVLight(group, zPos, isFront) {
    const mat = isFront ? frontLedMat : rearLedMat;
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.045, 0.04), mat);
    leftWing.position.set(-0.42, 0.68, zPos);
    leftWing.rotation.z = -0.22;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.045, 0.04), mat);
    rightWing.position.set(0.42, 0.68, zPos);
    rightWing.rotation.z = 0.22;
    group.add(rightWing);

    // Đèn pha / đèn hậu hai bên
    const sideLampL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.05), mat);
    sideLampL.position.set(-0.72, 0.62, zPos);
    group.add(sideLampL);

    const sideLampR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.05), mat);
    sideLampR.position.set(0.72, 0.62, zPos);
    group.add(sideLampR);
  }

  function buildCarModel(carId) {
    scene.remove(carGroup);
    carGroup = new THREE.Group();

    const isPickup = carId === "vf-wild";
    const isMini = ["vf-3", "vf-2", "minio-green"].includes(carId);
    const isVan = carId === "ec-van";
    const isLong = ["vf-9", "vf-mpv-7", "limo-green"].includes(carId);

    const length = isMini ? 2.9 : isLong || isPickup ? 4.35 : 3.8;
    const width = isMini ? 1.58 : 1.82;
    const bodyHeight = isVan ? 0.86 : 0.64;

    // Thân dưới
    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(width, bodyHeight, length),
      bodyMaterial
    );
    lowerBody.position.y = 0.36 + bodyHeight / 2;
    carGroup.add(lowerBody);

    // Viền cản dưới đen thể thao
    const skirt = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.04, 0.14, length + 0.04),
      trimMaterial
    );
    skirt.position.y = 0.34;
    carGroup.add(skirt);

    // Cabin / Mái xe
    if (isPickup) {
      // Bán tải: cabin đôi phía trước + thùng hàng phía sau
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.14, 0.56, 1.9),
        glassMaterial
      );
      cabin.position.set(0, 0.36 + bodyHeight + 0.26, 0.45);
      carGroup.add(cabin);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.18, 0.08, 1.65),
        bodyMaterial
      );
      roof.position.set(0, 0.36 + bodyHeight + 0.55, 0.42);
      carGroup.add(roof);

      const bed = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.16, 0.12, 1.45),
        trimMaterial
      );
      bed.position.set(0, 0.36 + bodyHeight + 0.02, -1.35);
      carGroup.add(bed);
    } else if (isVan) {
      const vanTop = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.08, 0.65, length - 0.55),
        bodyMaterial
      );
      vanTop.position.set(0, 0.36 + bodyHeight + 0.3, -0.2);
      carGroup.add(vanTop);

      const windshield = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.16, 0.52, 0.12),
        glassMaterial
      );
      windshield.position.set(0, 0.36 + bodyHeight + 0.26, length / 2 - 0.38);
      windshield.rotation.x = -0.35;
      carGroup.add(windshield);
    } else {
      const cabinLen = isMini ? 1.75 : isLong ? 2.65 : 2.25;
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.16, 0.52, cabinLen),
        glassMaterial
      );
      cabin.position.set(0, 0.36 + bodyHeight + 0.24, -0.15);
      carGroup.add(cabin);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.22, 0.07, cabinLen - 0.35),
        bodyMaterial
      );
      roof.position.set(0, 0.36 + bodyHeight + 0.51, -0.18);
      carGroup.add(roof);
    }

    // Gương chiếu hậu 2 bên
    const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.14), bodyMaterial);
    mirrorL.position.set(-width / 2 - 0.08, 1.02, length * 0.16);
    carGroup.add(mirrorL);

    const mirrorR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.14), bodyMaterial);
    mirrorR.position.set(width / 2 + 0.08, 1.02, length * 0.16);
    carGroup.add(mirrorR);

    // 4 bánh xe
    const wheelZ = length * 0.32;
    const wheelX = width / 2 - 0.04;
    carGroup.add(createWheel(-wheelX, wheelZ));
    carGroup.add(createWheel(wheelX, wheelZ));
    carGroup.add(createWheel(-wheelX, -wheelZ));
    carGroup.add(createWheel(wheelX, -wheelZ));

    // Đèn LED chữ V đầu & đuôi xe
    addVLight(carGroup, length / 2 + 0.01, true);
    addVLight(carGroup, -length / 2 - 0.01, false);

    scene.add(carGroup);
  }

  buildCarModel("vf-7");

  // API giao tiếp với script.js
  window.VinFastStage4D = {
    setCar: (carId) => buildCarModel(carId),
    setColor: (hex) => {
      bodyMaterial.color.set(hex);
    },
    setAngle: (angle) => {
      if (angle === "iso") camera.position.set(4.4, 2.0, 5.2);
      if (angle === "front") camera.position.set(0, 1.45, 5.8);
      if (angle === "side") camera.position.set(6.0, 1.5, 0.2);
      if (angle === "rear") camera.position.set(0, 1.55, -5.8);
      controls.update();
    },
    toggleSpin: () => {
      controls.autoRotate = !controls.autoRotate;
      return controls.autoRotate;
    },
    resize: () => {
      if (!container.clientWidth || !container.clientHeight) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  };

  window.addEventListener("resize", () => window.VinFastStage4D.resize());

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();
