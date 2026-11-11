
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// FISHINGWORLD - OYUN MOTORU

const $ = id => document.getElementById(id);

let gold = 1000;
let soundOn = true;
let started = false;
let inBoat = true;
let cameraMode = 3;
let speed = 0;
let steering = 0;
let walkX = 0;
let walkZ = 0;
let boatPosition = new THREE.Vector3(0, 0, 5);
let boatRotation = 0;
let characterPosition = new THREE.Vector3(0, 0, 5);
let chestOpened = false;

let engineLevel = 1;
let rodLevel = 1;
let armorLevel = 1;

let boatLevel = 0;
let ownedBoats = [true, false, false, false];

const stories = [
    {
        icon: "🌅",
        title: "Yeni Bir Hayat",
        text: "Genç balıkçı, büyük bir deniz macerasına başlamak istiyordu."
    },
    {
        icon: "👨‍🦱",
        title: "Balıkçı",
        text: "Küçük yaşlardan beri denizi ve balıkları çok seviyordu."
    },
    {
        icon: "🎣",
        title: "İlk Olta",
        text: "Yıllar boyunca balık tutmayı öğrendi ve kendi oltasını hazırladı."
    },
    {
        icon: "🚤",
        title: "Yeni Tekne",
        text: "Sonunda kendi teknesini aldı ve uzak adaları keşfetmeye karar verdi."
    },
    {
        icon: "🏝️",
        title: "Büyük Macera",
        text: "Şimdi sıra sende! Teknenin yanına git ve maceraya başla."
    }
];

let storyIndex = 0;

// THREE.JS DÜNYASI

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x75c9ed);
scene.fog = new THREE.Fog(0x75c9ed, 70, 190);

const camera = new THREE.PerspectiveCamera(
    65,
    innerWidth / innerHeight,
    0.1,
    500
);

const renderer = new THREE.WebGLRenderer({
    canvas: $("scene"),
    antialias: true
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

scene.add(new THREE.HemisphereLight(0xbceaff, 0x31543a, 2));

const sunlight = new THREE.DirectionalLight(0xffffff, 2.2);
sunlight.position.set(30, 50, 20);
sunlight.castShadow = true;
scene.add(sunlight);

// DENİZ

const waterGeometry = new THREE.PlaneGeometry(500, 500, 50, 50);
const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x087db3,
    roughness: 0.35,
    metalness: 0.15
});

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.3;
water.receiveShadow = true;
scene.add(water);

// ADALAR

function createIsland(x, z, size = 12) {
    const island = new THREE.Group();

    const sand = new THREE.Mesh(
        new THREE.CylinderGeometry(size, size + 2, 2, 32),
        new THREE.MeshStandardMaterial({color: 0xd5c18b})
    );
    sand.position.y = 0.3;
    island.add(sand);

    const grass = new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.83, size, 3, 32),
        new THREE.MeshStandardMaterial({color: 0x348a42})
    );
    grass.position.y = 1.4;
    island.add(grass);

    const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(size * 0.55, size * 1.3, 6),
        new THREE.MeshStandardMaterial({color: 0x466c46})
    );
    mountain.position.y = size * 0.7;
    island.add(mountain);

    island.position.set(x, 0, z);
    scene.add(island);

    return island;
}

createIsland(0, -45, 16);
createIsland(45, -90, 20);
createIsland(-55, -115, 22);

// BULUTLAR

const clouds = [];

function createCloud(x, y, z) {
    const group = new THREE.Group();

    for (let i = 0; i < 5; i++) {
        const puff = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 12, 12),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 1
            })
        );

        puff.position.set(i * 2.5, Math.random() * 1.2, 0);
        group.add(puff);
    }

    group.position.set(x, y, z);
    scene.add(group);
    clouds.push(group);
}

for (let i = 0; i < 12; i++) {
    createCloud(
        Math.random() * 100 - 50,
        18 + Math.random() * 10,
        -Math.random() * 130
    );
}

// TEKNE

const boat = new THREE.Group();

function boatPart(geometry, color, x, y, z) {
    const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({color, roughness: 0.65})
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    boat.add(mesh);
    return mesh;
}

boatPart(
    new THREE.BoxGeometry(3.8, 0.8, 7),
    0x202e3c, 0, 0, 0
);

boatPart(
    new THREE.BoxGeometry(2.8, 1.2, 2),
    0xffffff, 0, 0.8, -0.5
);

boatPart(
    new THREE.BoxGeometry(2, 0.15, 1.4),
    0x1688ba, 0, 1.5, -0.5
);

boat.position.copy(boatPosition);
scene.add(boat);

// ERKEK KARAKTER

const character = new THREE.Group();

const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.45, 1, 4, 8),
    new THREE.MeshStandardMaterial({color: 0x1768ae})
);
body.position.y = 1.2;
character.add(body);

const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 16, 16),
    new THREE.MeshStandardMaterial({color: 0xe5b28a})
);
head.position.y = 2.2;
character.add(head);

const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({color: 0x30231d})
);
hair.position.y = 2.35;
character.add(hair);

character.position.copy(characterPosition);
scene.add(character);

// SANDIK

const chest = new THREE.Group();

const chestBody = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1.2, 1.4),
    new THREE.MeshStandardMaterial({color: 0x9b531b})
);
chestBody.position.y = 0.8;
chest.add(chestBody);

const chestTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.3, 1.5),
    new THREE.MeshStandardMaterial({color: 0xe1a52d})
);
chestTop.position.y = 1.5;
chest.add(chestTop);

chest.position.set(0, 2.8, -45);
scene.add(chest);

// KAMERA

function updateCamera() {
    if (cameraMode === 1 && inBoat) {
        camera.position.set(
            boat.position.x,
            boat.position.y + 3,
            boat.position.z - 1
        );

        camera.rotation.set(0, boat.rotation.y, 0);
    } else {
        const target = inBoat ? boat.position : character.position;

        const offset = inBoat
            ? new THREE.Vector3(0, 8, 15)
            : new THREE.Vector3(7, 7, 10);

        offset.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            inBoat ? boat.rotation.y : character.rotation.y
        );

        camera.position.copy(target).add(offset);
        camera.lookAt(target.x, target.y + 1, target.z);
    }
}

// EKRAN YÖNETİMİ

function showScreen(name) {
    ["menu", "story", "settings", "shop"].forEach(id => {
        $(id).classList.add("hidden");
    });

    if (name) $(name).classList.remove("hidden");
}

function showMessage(text) {
    const box = $("message");
    box.textContent = text;
    box.style.display = "block";

    clearTimeout(box.timer);
    box.timer = setTimeout(() => {
        box.style.display = "none";
    }, 2800);
}

function updateGold() {
    $("gold").textContent = "🪙 " + gold + " ALTIN";
    $("shopGold").textContent = gold + " ALTIN";
}

// HİKÂYE

function displayStory() {
    const story = stories[storyIndex];

    $("storyPicture").textContent = story.icon;
    $("storyTitle").textContent = story.title;
    $("storyText").textContent = story.text;

    $("nextStory").textContent =
        storyIndex === stories.length - 1 ? "OYUNA BAŞLA" : "İLERİ";
}

$("startButton").onclick = () => {
    storyIndex = 0;
    showScreen("story");
    displayStory();
};

$("nextStory").onclick = () => {
    storyIndex++;

    if (storyIndex >= stories.length) {
        showScreen(null);
        $("gameUI").classList.remove("hidden");
        startGame();
        return;
    }

    displayStory();
};

$("multiButton").onclick = () => {
    showMessage("MULTIPLAYER YAKINDA SİZLERLE!!");
};

$("settingsButton").onclick = () => showScreen("settings");

$("backSettings").onclick = () => showScreen("menu");

$("soundButton").onclick = () => {
    soundOn = !soundOn;
    $("soundButton").textContent =
        soundOn ? "🔊 SES AÇIK" : "🔇 SES KAPALI";
};

function startGame() {
    started = true;
    inBoat = false;

    characterPosition.set(0, 0, 13);
    character.position.copy(characterPosition);

    $("walkControls").classList.remove("hidden");
    $("controls").classList.add("hidden");

    $("enterBoat").classList.remove("hidden");
    $("leaveBoat").classList.add("hidden");

    showMessage("Teknenin yanına ilerle!");
}

// JOYSTICK

let joystickActive = false;
let joystickPointer = null;
let joystickX = 0;
let joystickY = 0;

const joystick = $("joystick");
const stick = $("stick");

function moveJoystick(event) {
    const rect = joystick.getBoundingClientRect();

    let x = event.clientX - (rect.left + rect.width / 2);
    let y = event.clientY - (rect.top + rect.height / 2);

    const max = 35;
    const length = Math.hypot(x, y);

    if (length > max) {
        x = x / length * max;
        y = y / length * max;
    }

    joystickX = x / max;
    joystickY = y / max;

    stick.style.transform = `translate(${x}px, ${y}px)`;
}

joystick.addEventListener("pointerdown", e => {
    joystickActive = true;
    joystickPointer = e.pointerId;
    joystick.setPointerCapture(e.pointerId);
    moveJoystick(e);
});

joystick.addEventListener("pointermove", e => {
    if (joystickActive && e.pointerId === joystickPointer) {
        moveJoystick(e);
    }
});

function resetJoystick() {
    joystickActive = false;
    joystickX = 0;
    joystickY = 0;
    stick.style.transform = "translate(0px, 0px)";
}

joystick.addEventListener("pointerup", resetJoystick);
joystick.addEventListener("pointercancel", resetJoystick);

// GEMİYE BİNME / İNME

$("enterBoat").onclick = () => {
    if (character.position.distanceTo(boat.position) < 7) {
        inBoat = true;

        $("walkControls").classList.add("hidden");
        $("controls").classList.remove("hidden");

        $("enterBoat").classList.add("hidden");
        $("leaveBoat").classList.remove("hidden");

        showMessage("Tekneye bindin! İyi yolculuklar!");
    } else {
        showMessage("Önce teknenin yanına yaklaş!");
    }
};

$("leaveBoat").onclick = () => {
    inBoat = false;

    character.position.set(
        boat.position.x + 4,
        0,
        boat.position.z
    );

    $("walkControls").classList.remove("hidden");
    $("controls").classList.add("hidden");

    $("leaveBoat").classList.add("hidden");
    $("enterBoat").classList.remove("hidden");

    showMessage("Tekneden indin!");
};

// DİREKSİYON

function holdButton(id, value) {
    const button = $(id);

    button.addEventListener("pointerdown", e => {
        e.preventDefault();
        steering = value;
        button.setPointerCapture(e.pointerId);
    });

    const stop = () => steering = 0;

    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("lostpointercapture", stop);
}

holdButton("left", -1);
holdButton("right", 1);

// GAZ / FREN

$("gas").addEventListener("input", () => {
    speed = speed;
});

// KAMERA

$("camera").onclick = () => {
    cameraMode = cameraMode === 3 ? 1 : 3;

    showMessage(
        cameraMode === 1
            ? "1. ŞAHIS KAMERA"
            : "3. ŞAHIS KAMERA"
    );
};

// OLTA

let fishing = false;

$("fishing").onclick = () => {
    if (!inBoat) {
        showMessage("Balık tutmak için tekneye bin!");
        return;
    }

    if (Math.abs(speed) > 0.5) {
        showMessage("Balık tutmak için tekneyi durdur!");
        return;
    }

    if (fishing) return;

    fishing = true;
    showMessage("🎣 Oltanı denize attın...");

    setTimeout(() => {
        const reward = Math.floor(100 * rodLevel);
        gold += reward;
        updateGold();
        showMessage("🐟 Balık yakaladın! +" + reward + " altın");
        fishing = false;
    }, 3000);
};

// SANDIK

$("openChest").onclick = () => {
    if (chestOpened) {
        showMessage("Bu sandık zaten açıldı!");
        return;
    }

    chestOpened = true;
    chest.rotation.y = 0.5;

    const reward = Math.random() < 0.5 ? 1000 : 12000;
    gold += reward;

    updateGold();
    $("openChest").classList.add("hidden");

    showMessage("🎉 " + reward + " ALTIN KAZANDIN!");
};

// DÜKKAN

const boats = [
    {name: "Başlangıç Teknesi", price: 0},
    {name: "Hızlı Tekne", price: 20000},
    {name: "Balıkçı Gemisi", price: 50000},
    {name: "Lüks Yat", price: 100000}
];

function renderShop() {
    const container = $("shopItems");
    container.innerHTML = "";

    boats.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "shop-item";

        const button = document.createElement("button");

        button.textContent = ownedBoats[index]
            ? (boatLevel === index ? "SEÇİLİ TEKNE" : "SATIN ALINDI / SEÇ")
            : "SATIN AL";

        div.innerHTML =
            `<b>🚤 ${item.name}</b><p>${item.price} ALTIN</p>`;

        div.appendChild(button);
        container.appendChild(div);

        button.onclick = () => {
            if (ownedBoats[index]) {
                boatLevel = index;
                showMessage(item.name + " seçildi!");
            } else if (gold >= item.price) {
                gold -= item.price;
                ownedBoats[index] = true;
                boatLevel = index;
                updateGold();
                showMessage("Yeni tekneni satın aldın!");
                renderShop();
            } else {
                showMessage("Yeterli altının yok!");
            }
        };
    });
}

$("openShop").onclick = () => {
    showScreen("shop");
    renderShop();
    updateGold();
};

$("closeShop").onclick = () => {
    showScreen(null);
};

function upgrade(type, price) {
    if (gold < price) {
        showMessage("Yeterli altının yok!");
        return;
    }

    gold -= price;

    if (type === "engine") engineLevel++;
    if (type === "rod") rodLevel++;
    if (type === "armor") armorLevel++;

    updateGold();
    showMessage("Geliştirme başarılı! Seviye yükseldi.");
}

$("engineUpgrade").onclick = () => upgrade("engine", 5000);
$("rodUpgrade").onclick = () => upgrade("rod", 3000);
$("armorUpgrade").onclick = () => upgrade("armor", 4000);

// YARDIMCI

function checkChest() {
    const distance = character.position.distanceTo(chest.position);

    if (!inBoat && distance < 6 && !chestOpened) {
        $("openChest").classList.remove("hidden");
    } else {
        $("openChest").classList.add("hidden");
    }
}

// OYUN DÖNGÜSÜ

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (started) {
        if (inBoat) {
            const throttle = Number($("gas").value) / 100;

            const acceleration = 5 * engineLevel;

            speed += throttle * acceleration * delta;
            speed *= Math.pow(0.985, delta * 60);

            speed = THREE.MathUtils.clamp(speed, -12, 25);

            boatRotation += steering * delta * 1.4 *
                Math.min(1, Math.abs(speed) / 3);

            boat.rotation.y = boatRotation;

            boatPosition.x += Math.sin(boatRotation) * speed * delta;
            boatPosition.z += Math.cos(boatRotation) * speed * delta;

            boat.position.copy(boatPosition);

            $("gasLabel").textContent =
                "HIZ: " + Math.round(Math.abs(speed));

            character.position.copy(boat.position);
        } else {
            character.position.x += joystickX * 8 * delta;
            character.position.z += joystickY * 8 * delta;

            if (Math.abs(joystickX) + Math.abs(joystickY) > 0.1) {
                character.rotation.y = Math.atan2(
                    joystickX,
                    joystickY
                );
            }
        }

        checkChest();
        updateCamera();
    }

    clouds.forEach(cloud => {
        cloud.position.x += delta * 0.6;

        if (cloud.position.x > 100) {
            cloud.position.x = -100;
        }
    });

    water.position.x = 0;

    renderer.render(scene, camera);
}

animate();

// EKRAN BOYUTU

window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(innerWidth, innerHeight);
});

// YATAY EKRAN İSTEĞİ

async function requestLandscape() {
    try {
        if (screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape");
        }
    } catch (error) {
        console.log("Yatay ekran kilidi desteklenmiyor.");
    }
}

document.addEventListener("pointerdown", () => {
    if (started) requestLandscape();
}, {once: true});

updateGold();
      
