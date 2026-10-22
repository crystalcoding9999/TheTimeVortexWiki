class McMachineRecipe extends HTMLElement {
  connectedCallback() {
    const gridAttr = this.getAttribute('grid') || '';
    const gridItemsRaw = gridAttr.split(',').map(s => s.trim());
    const outputItem = this.getAttribute('output') || '';
    const energyCost = this.getAttribute('energy') || '0';
    const timeSec = this.getAttribute('time') || '1.0';
    const basePath = this.getAttribute('base-path') || '/assets/icons/';

    const formatName = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const resolveItems = (rawVal) => {
      if (!rawVal) return [];
      if (rawVal.startsWith('#')) {
        const tagName = rawVal.substring(1);
        return window.MINECRAFT_TAGS[tagName] || [tagName];
      }
      return [rawVal];
    };

    let gridHTML = '';
    const animatedSlots = [];

    for (let i = 0; i < 4; i++) {
      const rawVal = gridItemsRaw[i] || '';
      const items = resolveItems(rawVal);

      if (items.length === 0) {
        gridHTML += `<div class="mc-slot empty"></div>`;
      } else if (items.length === 1) {
        const item = items[0];
        gridHTML += `<div class="mc-slot" data-title="${formatName(item)}"><img src="${basePath}${item}.png" alt="${item}"></div>`;
      } else {
        const firstItem = items[0];
        const slotId = 'mc-machine-slot-' + Math.random().toString(36).substring(2, 9);
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

    const formattedEnergy = !isNaN(energyCost) ? Number(energyCost).toLocaleString() : energyCost;
    const formattedTime = parseFloat(timeSec).toFixed(1);

    // Single box layout structure
    this.innerHTML = `
      <div class="mc-recipe">
        <div class="mc-recipe-main">
          <div class="mc-grid-2x2">${gridHTML}</div>
          <div class="mc-machine-arrow"></div>
          ${outputHTML}
        </div>
        <div class="mc-machine-info">
          ${formattedEnergy} AU over ${formattedTime}s
        </div>
      </div>
    `;

    // Inject animation duration for the white progress fill arrow
    const arrowBox = this.querySelector('.mc-machine-arrow');
    if (arrowBox) {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `#${arrowBox.id || (arrowBox.id = 'arrow-' + Math.random().toString(36).substring(2,7))}::after { animation-duration: ${formattedTime}s; }`;
      this.appendChild(styleTag);
    }

    // Cycle through tag slots if present
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
      }, 1500);
    });
  }
}

customElements.define('mc-machine-recipe', McMachineRecipe);

/*
<mc-machine-recipe 
  grid="iron_ingot, #minecraft:planks, , copper_ingot" 
  output="enriched_alloy" 
  energy="1250" 
  time="2.5">
</mc-machine-recipe>
*/