# 🍽️ The Cafeteria Plate Dispenser - LIFO Stack Simulation

An interactive visual web simulator demonstrating the physical origin of the **Stack Data Structure (Last-In, First-Out - LIFO)** using a spring-loaded cafeteria plate dispenser.

---

## 📌 The Real-World Application

In a cafeteria, clean plates are placed into a spring-loaded cylindrical dispenser:
* **PUSH (`push`)**: The dishwasher stacks clean plates onto the top. The internal spring compresses down under the weight.
* **POP (`pop`)**: A diner takes the plate from the top. The spring expands upward, bringing the next plate to the counter level.
* **PEEK (`peek`)**: Inspecting the top plate without removing it.
* **LIFO Rule**: The **last** plate washed and placed on top is the **first** plate served to a customer.
* **Physical Constraint**: You cannot pull a plate from the middle or bottom without breaking the stack or causing a collapse.

---

## 🚀 How to Run Locally

Double-click [`index.html`](index.html) in your browser.

---

## 🎮 Features & Interactive Demos

1. **Spring-Loaded Physics**: Watch the SVG spring compress as plates are stacked and stretch as plates are removed.
2. **Illegal Access Warning**: Click "Try Grab Bottom Plate" or click a lower plate to see the LIFO violation error and dispenser vibration animation!
3. **Capacity & Overflow**: Fixed capacity of 7 plates with **Stack Overflow** alert when full.
4. **Stack Underflow**: Alert when attempting to pop from an empty dispenser.
5. **Memory Inspector**: Live array visualization `plates[7]` and `TOP` pointer tracking.
6. **Buffet Rush Hour Demo**: Simulates sequential pushes and pops automatically.
