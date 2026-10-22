class McRecipe extends HTMLElement {
  connectedCallback() {
    const gridAttr = this.getAttribute('grid') || '';
    const gridItemsRaw = gridAttr.split(',').map(s => s.trim());
    const outputItem = this.getAttribute('output') || '';
    const basePath = this.getAttribute('base-path') || '/assets/icons/';

    const formatName = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    let gridHTML = '';
    for (let i = 0; i < 9; i++) {
      const rawVal = gridItemsRaw[i] || '';
      gridHTML += `<mc-item item="${rawVal}" base-path="${basePath}"></mc-item>`;
    }

    const outputHTML = outputItem 
      ? `<div class="mc-output" data-title="${formatName(outputItem)}"><img src="${basePath}${outputItem}.png" alt="${outputItem}"></div>`
      : `<div class="mc-output"></div>`;

    this.innerHTML = `
      <div class="mc-recipe">
        <div class="mc-recipe-main">
          <div class="mc-grid">${gridHTML}</div>
          <div class="mc-arrow"></div>
          ${outputHTML}
        </div>
      </div>
    `;
  }
}

customElements.define('mc-recipe', McRecipe);