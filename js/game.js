
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* =========================
   FISHINGWORLD - OYUN MOTORU
========================= */

const canvas = document.getElementById("scene");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x79c9ed);
scene.fog = new THREE.Fog(0x79c9ed, 70, 230);

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/* IŞIKLAR */

scene.add(new THREE.HemisphereLight(0xffffff, 0x47718a, 2));

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(30, 60, 20);
sun.castShadow = true;
scene.add(sun);

/* DENİZ */

const seaGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const seaMaterial = new THREE.MeshStandardMaterial({
    color: 0x087eae,
    roughness: 0.35,
    metalness: 0.15
});

const sea = new THREE.Mesh(seaGeometry, seaMaterial);
sea.rotation.x = -Math.PI / 2;
sea.position.y = -0.5;
sea.receiveShadow = true;
scene.add(sea);

/* GÖKYÜZÜ VE BULUTLAR */

const clouds = [];

function createCloud(x, y, z) {
    const cloud = new THREE.Group();

    for (let i = 0; i < 5; i++) {
        const part = new THREE.Mesh(
            new THREE.SphereGeometry(1.5 + Math.random(), 12, 12),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );

        part.position.set(
            (Math.random() - 0.5) * 4,
            Math.random() * 1.2,
            (Math.random() - 0.5) * 2
        );

        cloud.add(part);
    }

    cloud.position.set(x, y, z);
    scene.add(cloud);
    clouds.push(cloud);
}

for (let i = 0; i < 18; i++) {
    createCloud(
        (Math.random() - 0.5) * 180,
        20 + Math.random() * 20,
        (Math.random() - 0.5) * 180
    );
}

/* ADALAR */

const islands = [];

function createIsland(x, z, size) {
    const island = new THREE.Group();

    const ground = new THREE.Mesh(
        new THREE.CylinderGeometry(size, size * 1.3, 4, 32),
        new THREE.MeshStandardMaterial({ color: 0xbda56b })
    );

    ground.position.y = 0;
    ground.receiveShadow = true;
    island.add(ground);

    const grass = new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.9, size, 1.2, 32),
        new THREE.MeshStandardMaterial({ color: 0x278b40 })
    );

    grass.position.y = 2;
    island.add(grass);

    const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(size * 0.55, size * 1.7, 6),
        new THREE.MeshStandardMaterial({ color: 0x536b55 })
    );

    mountain.position.y = size * 0.9 + 2;
    mountain.castShadow = true;
    island.add(mountain);

    island.position.set(x, -2, z);
    scene.add(island);
    islands.push(island);
}

createIsland(0, -45, 17);
createIsland(65, -105, 22);
createIsland(-75, -160, 25);
createIsland(100, 35, 20);

/* AĞAÇLAR */

function createTree(x, z, scale = 1) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.5, 3, 8),
        new THREE.MeshStandardMaterial({ color: 0x654321 })
    );

    trunk.position.y = 1.5;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(2, 5, 8),
        new THREE.MeshStandardMaterial({ color: 0x126b32 })
    );

    leaves.position.y = 4.5;
    tree.add(leaves);

    tree.position.set(x, 0, z);
    tree.scale.setScalar(scale);
    scene.add(tree);
}

for (let i = 0; i < 24; i++) {
    createTree(
        (Math.random() - 0.5) * 25,
        -45 + (Math.random() - 0.5) * 25,
        0.7 + Math.random() * 0.7
    );
}

/* ERKEK KARAKTER */

const character = new THREE.Group();

const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xe0a477 });
const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x174d9b });
const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x202a3a });

const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.5, 0.6),
    shirtMaterial
);
body.position.y = 1.9;
character.add(body);

const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 16),
    skinMaterial
);
head.position.y = 2.95;
character.add(head);

const legs = [];

for (let side of [-1, 1]) {
    const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 1, 0.45),
        pantsMaterial
    );

    leg.position.set(side * 0.28, 0.65, 0);
    character.add(leg);
    legs.push(leg);

    const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.1, 0.3),
        skinMaterial
    );

    arm.position.set(side * 0.72, 2, 0);
    character.add(arm);
}

scene.add(character);

/* TEKNE */

const boat = new THREE.Group();

const boatBody = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.8, 7),
    new THREE.MeshStandardMaterial({ color: 0x143f66 })
);

boatBody.position.y = 0;
boat.add(boatBody);

const deck = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.25, 5.5),
    new THREE.MeshStandardMaterial({ color: 0x8b5b32 })
);

deck.position.y = 0.48;
boat.add(deck);

const seat = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xdddddd })
);

seat.position.set(0, 0.85, -0.5);
boat.add(seat);

const motor = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
);

motor.position.set(0, 0.4, 3.4);
boat.add(motor);

boat.position.set(0, 0, 5);
scene.add(boat);

/* HAZİNE SANDIĞI */

const chest = new THREE.Group();

const chestBase = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1.3, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x8b4b15 })
);

chestBase.position.y = 0.65;
chest.add(chestBase);

const chestTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 0.35, 1.55),
    new THREE.MeshStandardMaterial({ color: 0xe6ad29 })
);

chestTop.position.y = 1.45;
chest.add(chestTop);

chest.position.set(0, 2.8, -45);
scene.add(chest);

/* OYUN DEĞİŞKENLERİ */

let gold = 1000;
let started = false;
let inBoat = false;
let chestOpened = false;
let cameraMode = 0;
let soundEnabled = true;

let boatSpeed = 0;
let boatRotation = 0;

const characterPosition = new THREE.Vector3(0, 0, 13);

let joystickX = 0;
let joystickY = 0;

let turnLeft = false;
let turnRight = false;

let storyIndex = 0;
let lastTime = 0;

/* HTML ELEMANLARI */

const $ = id => document.getElementById(id);

const screens = [
    "menu",
    "story",
    "settings",
    "shop"
];

function showScreen(name) {
    screens.forEach(id => {
        $(id).classList.toggle("hidden", id !== name);
    });
}

function updateGold() {
    $("gold").textContent = "🪙 " + gold + " ALTIN";
    $("shopGold").textContent = gold + " ALTIN";
}

function showMessage(message) {
    const element = $("message");
    element.textContent = message;
    element.style.display = "block";

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(() => {
        element.style.display = "none";
    }, 2500);
}

/* HİKÂYE */

const story = [
    {
        picture: "🌅",
        title: "Yeni Bir Başlangıç",
        text: "Uzun zamandır balıkçı olmayı hayal ediyordun. Artık kendi maceran başlıyor."
    },
    {
        picture: "🌊",
        title: "Büyük Deniz",
        text: "Önünde keşfedilmeyi bekleyen kocaman bir deniz var."
    },
    {
        picture: "🚤",
        title: "İlk Teknen",
        text: "Kendi teknenle denizlere açılmaya hazırlan."
    },
    {
        picture: "🎣",
        title: "Büyük Av",
        text: "Nadir balıkları yakala, altın kazan ve ekipmanlarını geliştir."
    },
    {
        picture: "🏝️",
        title: "Keşif Zamanı",
        text: "Adaları keşfet, hazineleri bul ve en iyi balıkçı ol!"
    }
];

function updateStory() {
    const current = story[storyIndex];

    $("storyPicture").textContent = current.picture;
    $("storyTitle").textContent = current.title;
    $("storyText").textContent = current.text;

    $("nextStory").textContent =
        storyIndex === story.length - 1 ? "OYUNA BAŞLA" : "İLERİ";
}

function startStory() {
    storyIndex = 0;
    updateStory();
    showScreen("story");
}

$("nextStory").addEventListener("click", () => {
    storyIndex++;

    if (storyIndex >= story.length) {
        startGame();
    } else {
        updateStory();
    }
});

/* OYUNU BAŞLAT */

function startGame() {
    started = true;
    inBoat = false;

    characterPosition.set(0, 0, 13);
    character.position.copy(characterPosition);

    boat.position.set(0, 0, 5);
    boatRotation = 0;
    boatSpeed = 0;

    $("gameUI").classList.remove("hidden");
    $("walkControls").classList.remove("hidden");
    $("enterBoat").classList.remove("hidden");
    $("leaveBoat").classList.add("hidden");

    showScreen(null);
    updateGold();
    updateCamera();

    showMessage("Teknene ulaşmak için joystick kullan!");
}

/* MENÜ */

$("startButton").addEventListener("click", startStory);

$("multiButton").addEventListener("click", () => {
    showMessage("YAKINDA SİZLERLE!!");
});

$("settingsButton").addEventListener("click", () => {
    showScreen("settings");
});

$("backSettings").addEventListener("click", () => {
    showScreen("menu");
});

$("soundButton").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    $("soundButton").textContent = soundEnabled
        ? "🔊 SES AÇIK"
        : "🔇 SES KAPALI";
});

/* JOYSTICK */

const joystick = $("joystick");
const stick = $("stick");

let joystickPointer = null;

function resetJoystick() {
    joystickX = 0;
    joystickY = 0;
    stick.style.left = "50%";
    stick.style.top = "50%";
}

joystick.addEventListener("pointerdown", event => {
    joystickPointer = event.pointerId;
    joystick.setPointerCapture(event.pointerId);
    moveJoystick(event);
});

joystick.addEventListener("pointermove", event => {
    if (joystickPointer === event.pointerId) {
        moveJoystick(event);
    }
});

function moveJoystick(event) {
    const rect = joystick.getBoundingClientRect();

    let x = event.clientX - (rect.left + rect.width / 2);
    let y = event.clientY - (rect.top + rect.height / 2);

    const max = rect.width * 0.32;
    const length = Math.sqrt(x * x + y * y);

    if (length > max) {
        x = x / length * max;
        y = y / length * max;
    }

    joystickX = x / max;
    joystickY = y / max;

    stick.style.left = `calc(50% + ${x}px)`;
    stick.style.top = `calc(50% + ${y}px)`;
}

joystick.addEventListener("pointerup", event => {
    if (joystickPointer === event.pointerId) {
        joystickPointer = null;
        resetJoystick();
    }
});

joystick.addEventListener("pointercancel", () => {
    joystickPointer = null;
    resetJoystick();
});

/* TEKNE DÜMENİ */

function holdButton(id, setter) {
    const button = $(id);

    button.addEventListener("pointerdown", event => {
        event.preventDefault();
        setter(true);
    });

    button.addEventListener("pointerup", () => setter(false));
    button.addEventListener("pointerleave", () => setter(false));
    button.addEventListener("pointercancel", () => setter(false));
}

holdButton("left", value => turnLeft = value);
holdButton("right", value => turnRight = value);

/* TEKNEYE BİN VE İN */

$("enterBoat").addEventListener("click", () => {
    const distance = characterPosition.distanceTo(boat.position);

    if (distance < 7) {
        inBoat = true;

        $("walkControls").classList.add("hidden");
        $("enterBoat").classList.add("hidden");
        $("leaveBoat").classList.remove("hidden");

        showMessage("Tekneye bindin!");
    } else {
        showMessage("Önce teknenin yanına yaklaş!");
    }
});

$("leaveBoat").addEventListener("click", () => {
    inBoat = false;

    characterPosition.set(
        boat.position.x + 4,
        0,
        boat.position.z
    );

    character.position.copy(characterPosition);

    $("walkControls").classList.remove("hidden");
    $("enterBoat").classList.remove("hidden");
    $("leaveBoat").classList.add("hidden");

    showMessage("Tekneden indin!");
});

/* GAZ VE FREN */

$("gas").addEventListener("input", event => {
    if (!inBoat) return;
    boatSpeed = Number(event.target.value) / 100 * 12;
});

/* KAMERA */

$("camera").addEventListener("click", () => {
    cameraMode = cameraMode === 0 ? 1 : 0;
    updateCamera();

    showMessage(cameraMode === 0
        ? "Üçüncü şahıs kamera"
        : "Birinci şahıs kamera"
    );
});

function updateCamera() {
    if (!started) return;

    if (inBoat) {
        if (cameraMode === 0) {
            camera.position.set(
                boat.position.x,
                boat.position.y + 8,
                boat.position.z + 13
            );
            camera.lookAt(boat.position);
        } else {
            camera.position.set(
                boat.position.x,
                boat.position.y + 2.5,
                boat.position.z - 1
            );

            camera.rotation.set(0, boat.rotation.y + Math.PI, 0);
        }
    } else {
        if (cameraMode === 0) {
            camera.position.set(
                character.position.x + 7,
                7,
                character.position.z + 10
            );
            camera.lookAt(character.position);
        } else {
            camera.position.set(
                character.position.x,
                character.position.y + 3,
                character.position.z - 0.5
            );
            camera.rotation.set(0, character.rotation.y, 0);
        }
    }
}

/* BALIK TUTMA */

$("fishing").addEventListener("click", () => {
    if (!inBoat) {
        showMessage("Balık tutmak için tekneye bin!");
        return;
    }

    if (Math.abs(boatSpeed) > 0.5) {
        showMessage("Balık tutmak için tekneyi durdur!");
        return;
    }

    showMessage("🎣 Oltanı denize attın...");

    setTimeout(() => {
        if (!started || !inBoat) return;

        const reward = Math.floor(Math.random() * 5) + 1;
        const fishGold = reward * 100;

        gold += fishGold;
        updateGold();

        showMessage("🐟 Balık yakaladın! +" + fishGold + " altın");
    }, 3000);
});

/* HAZİNE */

$("openChest").addEventListener("click", () => {
    if (chestOpened) {
        showMessage("Bu sandık zaten açıldı!");
        return;
    }

    const reward = Math.random() < 0.5 ? 1000 : 12000;

    gold += reward;
    chestOpened = true;
    chest.visible = false;

    updateGold();

    showMessage("🎉 Sandıktan " + reward + " altın çıktı!");
});

/* DÜKKAN */

const boatsForSale = [
    { name: "HIZLI TEKNE", price: 20000 },
    { name: "SPORT TEKNE", price: 45000 },
    { name: "LÜKS YAT", price: 70000 },
    { name: "PROFESYONEL TEKNE", price: 100000 }
];

function buildShop() {
    const container = $("shopItems");
    container.innerHTML = "";

    boatsForSale.forEach(item => {
        const div = document.createElement("div");
        div.className = "shop-item";

        const title = document.createElement("p");
        title.textContent = item.name + " - " + item.price + " ALTIN";

        const button = document.createElement("button");
        button.textContent = "SATIN AL";

        button.addEventListener("click", () => {
            if (gold < item.price) {
                showMessage("Yeterli altının yok!");
                return;
            }

            gold -= item.price;
            updateGold();
            showMessage(item.name + " satın alındı!");

            boatSpeed = Math.min(boatSpeed, 12);
        });

        div.append(title, button);
        container.appendChild(div);
    });
}

$("openShop").addEventListener("click", () => {
    buildShop();
    updateGold();
    showScreen("shop");
});

$("closeShop").addEventListener("click", () => {
    showScreen(null);
});

function buyUpgrade(price, name) {
    if (gold < price) {
        showMessage("Yeterli altının yok!");
        return;
    }

    gold -= price;
    updateGold();
    showMessage(name + " geliştirildi!");
}

$("engineUpgrade").addEventListener("click", () => {
    buyUpgrade(5000, "Motor");
});

$("rodUpgrade").addEventListener("click", () => {
    buyUpgrade(3000, "Olta");
});

$("armorUpgrade").addEventListener("click", () => {
    buyUpgrade(4000, "Zırh");
});

/* KARAKTER VE TEKNE HAREKETİ */

function updateMovement(delta) {
    if (!started) return;

    if (!inBoat) {
        const movementSpeed = 8 * delta;

        characterPosition.x += joystickX * movementSpeed;
        characterPosition.z += joystickY * movementSpeed;

        character.position.copy(characterPosition);

        if (Math.abs(joystickX) + Math.abs(joystickY) > 0.1) {
            character.rotation.y = Math.atan2(joystickX, joystickY);
        }

        const walking = Math.abs(joystickX) + Math.abs(joystickY) > 0.1;

        legs.forEach((leg, index) => {
            leg.rotation.x = walking
                ? Math.sin(performance.now() * 0.012 + index * Math.PI) * 0.5
                : 0;
        });

    } else {
        if (turnLeft) boatRotation += delta * 1.5;
        if (turnRight) boatRotation -= delta * 1.5;

        boat.rotation.y = boatRotation;

        const direction = new THREE.Vector3(
            -Math.sin(boatRotation),
            0,
            -Math.cos(boatRotation)
        );

        boat.position.addScaledVector(direction, boatSpeed * delta);

        boatSpeed *= Math.pow(0.985, delta * 60);

        $("gas").value = Math.round(boatSpeed / 12 * 100);
    }

    if (!inBoat) {
        const distanceToBoat = characterPosition.distanceTo(boat.position);

        $("enterBoat").classList.toggle("hidden", distanceToBoat >= 7);
    }

    if (!inBoat && !chestOpened) {
        const distanceToChest = characterPosition.distanceTo(chest.position);

        $("openChest").classList.toggle("hidden", distanceToChest > 5);
    } else {
        $("openChest").classList.add("hidden");
    }
}

/* KAMERA VE BULUT HAREKETİ */

function animateClouds(delta) {
    clouds.forEach(cloud => {
        cloud.position.x += delta * 0.7;

        if (cloud.position.x > 110) {
            cloud.position.x = -110;
        }
    });
}

/* OYUN DÖNGÜSÜ */

function animate(time) {
    requestAnimationFrame(animate);

    const delta = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;

    animateClouds(delta);

    if (started) {
        updateMovement(delta);
        updateCamera();
    }

    renderer.render(scene, camera);
}

requestAnimationFrame(animate);

/* EKRAN BOYUTU */

function resizeGame() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", resizeGame);

window.addEventListener("orientationchange", () => {
    setTimeout(resizeGame, 250);
});

resizeGame();

updateGold();

console.log("FISHINGWORLD başarıyla başlatıldı!");
        
