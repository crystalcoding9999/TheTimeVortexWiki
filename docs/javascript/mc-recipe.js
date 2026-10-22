class McRecipe extends HTMLElement {
  connectedCallback() {
    const gridAttr = this.getAttribute('grid') || '';
    const gridItemsRaw = gridAttr.split(',').map(s => s.trim());
    const outputItem = this.getAttribute('output') || '';
    const basePath = this.getAttribute('base-path') || '/assets/icons/';

    const formatName = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Helper to resolve slot items (if it starts with #, look it up in tags)
    const resolveItems = (rawVal) => {
      if (!rawVal) return [];
      if (rawVal.startsWith('#')) {
        const tagName = rawVal.substring(1);
        return window.MINECRAFT_TAGS[tagName] || [tagName]; // Fallback if tag is missing
      }
      return [rawVal];
    };

    let gridHTML = '';
    const animatedSlots = [];

    for (let i = 0; i < 9; i++) {
      const rawVal = gridItemsRaw[i] || '';
      const items = resolveItems(rawVal);

      if (items.length === 0) {
        gridHTML += `<div class="mc-slot empty"></div>`;
      } else if (items.length === 1) {
        const item = items[0];
        gridHTML += `<div class="mc-slot" data-title="${formatName(item)}"><img src="${basePath}${item}.png" alt="${item}"></div>`;
      } else {
        // Multiple items from a tag -> Prepare for animation
        const firstItem = items[0];
        const slotId = 'mc-slot-' + Math.random().toString(36).substring(2, 9);
        
        gridHTML += `
          <div class="mc-slot tag-slot" id="${slotId}" data-title="${formatName(firstItem)}">
            <img src="${basePath}${firstItem}.png" alt="${firstItem}">
          </div>
        `;
        
        animatedSlots.push({ id: slotId, items, basePath });
      }
    }

    const outputHTML = outputItem 
      ? `<div class="mc-output" data-title="${formatName(outputItem)}"><img src="${basePath}${outputItem}.png" alt="${outputItem}"></div>`
      : `<div class="mc-output"></div>`;

    this.innerHTML = `
      <div class="mc-recipe">
        <div class="mc-grid">${gridHTML}</div>
        <div class="mc-arrow"></div>
        ${outputHTML}
      </div>
    `;

    // Start the cycling animation for tag slots
    animatedSlots.forEach(slotInfo => {
      const el = this.querySelector(`#${slotInfo.id}`);
      if (!el) return;
      let currentIndex = 0;

      setInterval(() => {
        currentIndex = (currentIndex + 1) % slotInfo.items.length;
        const nextItem = slotInfo.items[currentIndex];
        const img = el.querySelector('img');
        if (img) {
          img.src = `${slotInfo.basePath}${nextItem}.png`;
          img.alt = nextItem;
          el.setAttribute('data-title', `${formatName(nextItem)}`);
        }
      }, 1500); // Cycles every 1.5 seconds
    });
  }
}

customElements.define('mc-recipe', McRecipe);

/*
<mc-recipe 
  grid="#minecraft:planks, iron_ingot, iron_ingot, , stick, , , stick, " 
  output="iron_pickaxe">
</mc-recipe>
*/