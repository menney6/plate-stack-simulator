/**
 * ============================================================================
 * PLATE DISPENSER STACK DATA STRUCTURE (LIFO Simulation)
 * ============================================================================
 */
class PlateStack {
  constructor(capacity = 7) {
    this.capacity = capacity;
    this.items = []; // Internal array storing plates
  }

  // PUSH: Wash & add clean plate to top
  push(plate) {
    if (this.isFull()) {
      return false; // Stack Overflow
    }
    this.items.push(plate);
    return true;
  }

  // POP: Customer takes plate from top
  pop() {
    if (this.isEmpty()) {
      return null; // Stack Underflow
    }
    return this.items.pop();
  }

  // PEEK: Inspect the top plate
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isFull() {
    return this.items.length >= this.capacity;
  }

  size() {
    return this.items.length;
  }

  getTopIndex() {
    return this.items.length - 1;
  }

  getItems() {
    return this.items;
  }

  clear() {
    this.items = [];
  }
}

// ============================================================================
// APP CONTROLLER & UI BINDINGS
// ============================================================================

const CAPACITY = 7;
const dispenser = new PlateStack(CAPACITY);

// Plate ID generator & color palette
let nextPlateId = 101;
const PLATE_COLORS = [
  { bg: "#fed7aa", border: "#f97316", name: "Peach Ceramic" },
  { bg: "#bbf7d0", border: "#22c55e", name: "Mint Ceramic" },
  { bg: "#bfdbfe", border: "#3b82f6", name: "Azure Ceramic" },
  { bg: "#fef08a", border: "#eab308", name: "Butter Ceramic" },
  { bg: "#ddd6fe", border: "#8b5cf6", name: "Lavender Ceramic" },
  { bg: "#fecdd3", border: "#f43f5e", name: "Rose Ceramic" },
  { bg: "#cffafe", border: "#06b6d4", name: "Teal Ceramic" }
];

// DOM Elements
const platesStack = document.getElementById("platesStack");
const springPlatform = document.getElementById("springPlatform");
const springSvg = document.getElementById("springSvg");
const statusAlert = document.getElementById("statusAlert");
const capacityBadge = document.getElementById("capacityBadge");
const topPointerBadge = document.getElementById("topPointerBadge");
const statSize = document.getElementById("statSize");
const statTop = document.getElementById("statTop");
const statEmpty = document.getElementById("statEmpty");
const arraySlots = document.getElementById("arraySlots");
const consoleLog = document.getElementById("consoleLog");
const dispenserTube = document.querySelector(".dispenser-tube");

// Buttons
const pushBtn = document.getElementById("pushBtn");
const popBtn = document.getElementById("popBtn");
const peekBtn = document.getElementById("peekBtn");
const illegalBtn = document.getElementById("illegalBtn");
const rushHourBtn = document.getElementById("rushHourBtn");
const fillFullBtn = document.getElementById("fillFullBtn");
const resetBtn = document.getElementById("resetBtn");

/**
 * Handle PUSH Operation
 */
function handlePush() {
  clearAlert();

  if (dispenser.isFull()) {
    showAlert("⚠️ STACK OVERFLOW! The dispenser is full. Adding another plate will cause plates to spill over!", "danger");
    logOperation("ERROR: Stack Overflow! (Capacity reached: 7)", "error");
    shakeDispenser();
    return;
  }

  const colorConfig = PLATE_COLORS[(nextPlateId - 101) % PLATE_COLORS.length];
  const newPlate = {
    id: nextPlateId++,
    name: colorConfig.name,
    bg: colorConfig.bg,
    border: colorConfig.border,
    timestamp: new Date().toLocaleTimeString()
  };

  dispenser.push(newPlate);
  logOperation(`PUSH: Clean Plate #${newPlate.id} (${newPlate.name}) added to TOP`, "push");
  
  updateUI(true); // true = animate drop
}

/**
 * Handle POP Operation
 */
function handlePop() {
  clearAlert();

  if (dispenser.isEmpty()) {
    showAlert("⚠️ STACK UNDERFLOW! The dispenser is empty. No plates available for diners!", "warning");
    logOperation("ERROR: Stack Underflow! (Dispenser is empty)", "error");
    shakeDispenser();
    return;
  }

  // Get the top plate DOM element to animate its exit
  const plateElements = platesStack.querySelectorAll(".plate");
  const topPlateEl = plateElements[plateElements.length - 1];

  if (topPlateEl) {
    topPlateEl.classList.add("plate-pop");
    setTimeout(() => {
      const popped = dispenser.pop();
      logOperation(`POP: Customer served Plate #${popped.id} from TOP (LIFO)`, "pop");
      updateUI(false);
    }, 280);
  } else {
    const popped = dispenser.pop();
    logOperation(`POP: Customer served Plate #${popped.id} from TOP (LIFO)`, "pop");
    updateUI(false);
  }
}

/**
 * Handle PEEK Operation
 */
function handlePeek() {
  clearAlert();

  if (dispenser.isEmpty()) {
    showAlert("👀 PEEK: The dispenser is currently empty (TOP = -1).", "info");
    logOperation("PEEK: Dispenser is empty", "warn");
    return;
  }

  const topPlate = dispenser.peek();
  showAlert(`👀 PEEK: Top Plate is #${topPlate.id} (${topPlate.name}), washed at ${topPlate.timestamp}. Ready for next diner!`, "info");
  logOperation(`PEEK: Inspected Plate #${topPlate.id} at TOP without removing it`, "warn");
}

/**
 * Demonstrate Illegal Bottom Access (Testing LIFO principle)
 */
function handleIllegalAccess() {
  shakeDispenser();
  showAlert("🚫 LIFO VIOLATION: You cannot pull out a plate from the bottom! The enclosed cylinder only allows access from the TOP.", "danger");
  logOperation("ILLEGAL ACCESS: Attempted random access / bottom pull. Blocked by LIFO physical barrier!", "error");
}

/**
 * Spring-Loaded Physics Simulation:
 * In a cafeteria dispenser, the spring compresses downward as more plates are added,
 * keeping the top plate near the counter lip!
 */
function updateSpringPhysics() {
  const count = dispenser.size();
  
  // As count increases from 0 to 7:
  // Spring height decreases from 80px to 25px
  const baseHeight = 85;
  const compressedHeight = Math.max(25, baseHeight - (count * 8.5));
  springSvg.style.height = `${compressedHeight}px`;

  // Scale the path thickness slightly to simulate compression tension
  const springPath = document.getElementById("springPath");
  if (springPath) {
    springPath.setAttribute("stroke-width", count > 4 ? "7" : "5");
  }
}

/**
 * Render Dispenser & Memory Inspector
 */
function updateUI(animateLastPlate = false) {
  const items = dispenser.getItems();
  const count = dispenser.size();
  const topIndex = dispenser.getTopIndex();

  // 1. Update Badges & Counters
  capacityBadge.textContent = `Plates: ${count} / ${CAPACITY}`;
  statSize.textContent = count;
  statEmpty.textContent = dispenser.isEmpty() ? "true" : "false";

  if (dispenser.isEmpty()) {
    topPointerBadge.textContent = "TOP = -1 (Empty)";
    statTop.textContent = "None";
  } else {
    topPointerBadge.textContent = `TOP = index ${topIndex}`;
    statTop.textContent = `#${dispenser.peek().id}`;
  }

  // 2. Render Physical Plates in Tube
  platesStack.innerHTML = "";
  items.forEach((plate, index) => {
    const isTop = (index === topIndex);
    const plateEl = document.createElement("div");
    plateEl.className = `plate ${isTop ? "is-top" : ""}`;
    plateEl.style.backgroundColor = plate.bg;
    plateEl.style.borderColor = plate.border;

    // Apply drop animation only to the newest pushed plate
    if (animateLastPlate && isTop) {
      plateEl.classList.add("plate-drop");
    }

    plateEl.innerHTML = `
      <span>🍽️ Plate #${plate.id}</span>
      ${isTop ? '<span class="top-badge">TOP (LIFO)</span>' : `<span style="font-size:0.7rem; color:#64748b;">Slot ${index}</span>`}
    `;

    // Clicking an individual plate
    plateEl.addEventListener("click", () => {
      if (isTop) {
        handlePop();
      } else {
        handleIllegalAccess();
      }
    });

    platesStack.appendChild(plateEl);
  });

  // 3. Render Memory Array Slots
  renderArraySlots();

  // 4. Update Spring Physics
  updateSpringPhysics();
}

/**
 * Render Array Slots [0 .. 6]
 */
function renderArraySlots() {
  arraySlots.innerHTML = "";
  const items = dispenser.getItems();
  const topIndex = dispenser.getTopIndex();

  for (let i = 0; i < CAPACITY; i++) {
    const slot = document.createElement("div");
    const isFilled = i < items.length;
    const isTop = (i === topIndex);

    slot.className = `slot ${isFilled ? "is-filled" : ""} ${isTop ? "is-top-slot" : ""}`;

    const valueText = isFilled ? `#${items[i].id}` : "-";
    const topLabel = isTop ? " [TOP]" : "";

    slot.innerHTML = `
      <div class="slot-index">[${i}]${topLabel}</div>
      <div class="slot-value">${valueText}</div>
    `;

    arraySlots.appendChild(slot);
  }
}

/**
 * Shake animation helper
 */
function shakeDispenser() {
  dispenserTube.classList.remove("shake-tube");
  void dispenserTube.offsetWidth; // Trigger reflow
  dispenserTube.classList.add("shake-tube");
}

/**
 * Alert Box Helper
 */
function showAlert(message, type) {
  statusAlert.className = `status-alert alert-${type}`;
  statusAlert.textContent = message;
  statusAlert.classList.remove("hidden");
}

function clearAlert() {
  statusAlert.classList.add("hidden");
}

/**
 * Operations Console Log
 */
function logOperation(message, type) {
  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString();
  li.className = `log-item log-${type}`;
  li.textContent = `[${time}] ${message}`;

  consoleLog.prepend(li);
  if (consoleLog.children.length > 20) {
    consoleLog.removeChild(consoleLog.lastChild);
  }
}

// ============================================================================
// PRESET DEMOS
// ============================================================================

/**
 * Rush Hour Demo: Sequential push & pop simulation
 */
function runRushHourDemo() {
  resetDispenser();
  logOperation("Starting Buffet Rush Hour Demo...", "init");

  const timeline = [
    { action: "push", delay: 300 },
    { action: "push", delay: 900 },
    { action: "push", delay: 1500 },
    { action: "pop",  delay: 2400 },
    { action: "push", delay: 3100 },
    { action: "push", delay: 3700 },
    { action: "pop",  delay: 4500 },
    { action: "pop",  delay: 5200 },
    { action: "peek", delay: 6000 }
  ];

  timeline.forEach(({ action, delay }) => {
    setTimeout(() => {
      if (action === "push") handlePush();
      else if (action === "pop") handlePop();
      else if (action === "peek") handlePeek();
    }, delay);
  });
}

/**
 * Fill to Capacity Demo (Test Overflow)
 */
function fillToMax() {
  resetDispenser();
  logOperation("Rapid loading dispenser to capacity...", "init");
  for (let i = 0; i < CAPACITY; i++) {
    setTimeout(() => {
      handlePush();
    }, i * 250);
  }
}

/**
 * Reset Dispenser
 */
function resetDispenser() {
  dispenser.clear();
  clearAlert();
  logOperation("Dispenser emptied & reset.", "init");
  updateUI(false);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================
pushBtn.addEventListener("click", handlePush);
popBtn.addEventListener("click", handlePop);
peekBtn.addEventListener("click", handlePeek);
illegalBtn.addEventListener("click", handleIllegalAccess);
rushHourBtn.addEventListener("click", runRushHourDemo);
fillFullBtn.addEventListener("click", fillToMax);
resetBtn.addEventListener("click", resetDispenser);

// Initial Load: Pre-load 3 plates so the stage looks lively right away
setTimeout(() => {
  handlePush();
  setTimeout(() => handlePush(), 300);
  setTimeout(() => handlePush(), 600);
}, 200);
