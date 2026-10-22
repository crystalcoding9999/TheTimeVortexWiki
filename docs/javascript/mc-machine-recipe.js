class McMachineRecipe extends HTMLElement {
  connectedCallback() {
    const gridAttr = this.getAttribute('grid') || '';
    const gridItemsRaw = gridAttr.split(',').map(s => s.trim());
    const outputItem = this.getAttribute('output') || '';
    const energyCost = this.getAttribute('energy') || '0';
    const timeSec = this.getAttribute('time') || '1.0';
    const basePath = this.getAttribute('base-path') || '/assets/icons/';

    const formatName = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    let gridHTML = '';
    for (let i = 0; i < 4; i++) {
      const rawVal = gridItemsRaw[i] || '';
      gridHTML += `<mc-item item="${rawVal}" base-path="${basePath}"></mc-item>`;
    }

    const outputHTML = outputItem 
      ? `<div class="mc-output" data-title="${formatName(outputItem)}"><img src="${basePath}${outputItem}.png" alt="${outputItem}"></div>`
      : `<div class="mc-output"></div>`;

    const formattedEnergy = !isNaN(energyCost) ? Number(energyCost).toLocaleString() : energyCost;
    const formattedTime = parseFloat(timeSec).toFixed(1);

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

    const arrowBox = this.querySelector('.mc-machine-arrow');
    if (arrowBox) {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `#${arrowBox.id || (arrowBox.id = 'arrow-' + Math.random().toString(36).substring(2,7))}::after { animation-duration: ${formattedTime}s; }`;
      this.appendChild(styleTag);
    }
  }
}

customElements.define('mc-machine-recipe', McMachineRecipe);