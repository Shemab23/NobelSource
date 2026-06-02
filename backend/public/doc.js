import { docs } from "./docs/index.js";

window.onload = () => {
  const tabsContainer = document.getElementById("tabs");
  const progressText = document.getElementById("progress");
  const docsContainer = document.getElementById("docs");
  const template = document.getElementById("card-template");

  // 1. Calculate and update global progress safely
  let total = 0, done = 0;
  Object.values(docs.groups).forEach(g => {
    if (Array.isArray(g)) {
      g.forEach(item => {
        total++;
        if (item.done) done++;
      });
    }
  });
  progressText.textContent = `Progress: ${done}/${total} endpoints completed (${total ? Math.round((done / total) * 100) : 0}%)`;

  // Helper to cleanly convert specifications objects to readable text strings
  const formatJSON = (data) => !data ? "{}" : (typeof data === "string" ? data : JSON.stringify(data, null, 2));

  // 2. Build Category Group Tabs Dynamically
  Object.keys(docs.groups).forEach((groupName, index) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = groupName;

    btn.onclick = () => {
      Array.from(tabsContainer.children).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      docsContainer.innerHTML = "";

      const currentGroup = docs.groups[groupName];

      // Safety guard check: prevent crash if group export is not an array format
      if (!Array.isArray(currentGroup)) {
        const errorMsg = document.createElement("p");
        errorMsg.className = "description";
        errorMsg.textContent = `Error: The group "${groupName}" is not formatted as an Array.`;
        docsContainer.appendChild(errorMsg);
        return;
      }

      // 3. Clone and populate HTML template cards for each active route array element
      currentGroup.forEach(endpoint => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector(".endpoint-card");

        // Target template layout tags safely using class matching
        card.classList.add(endpoint.done ? "done" : "pending");
        clone.querySelector(".endpoint-title").textContent = endpoint.name || "";
        clone.querySelector(".status-badge").textContent = endpoint.done ? "✓ Done" : "⏳ Pending";
        clone.querySelector(".description").textContent = endpoint.description || "";

        // Populating the technical spec blocks
        clone.querySelector(".headers-data").textContent = formatJSON(endpoint.request?.headers);
        clone.querySelector(".params-data").textContent = formatJSON(endpoint.request?.params);
        clone.querySelector(".query-data").textContent = formatJSON(endpoint.request?.query);
        clone.querySelector(".body-data").textContent = formatJSON(endpoint.request?.body);
        clone.querySelector(".response-data").textContent = formatJSON(endpoint.response);

        // Bind layout toggle interactivity directly to the card scope
        const toggleBtn = clone.querySelector(".toggle-details-btn");
        const details = clone.querySelector(".details-content");
        toggleBtn.onclick = () => {
          const isCollapsed = details.classList.toggle("collapsed");
          toggleBtn.textContent = isCollapsed ? "Show Specs" : "Hide Specs";
        };

        docsContainer.appendChild(clone);
      });
    };

    tabsContainer.appendChild(btn);
    if (index === 0) btn.click(); // Auto-load first category group view layer
  });
};
