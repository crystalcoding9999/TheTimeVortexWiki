window.MINECRAFT_TAGS = window.MINECRAFT_TAGS || {};

class McItem extends HTMLElement {
  connectedCallback() {
    const rawVal = this.getAttribute('item') || '';
    const basePath = this.getAttribute('base-path') || '/assets/icons/';
    
    if (!rawVal) {
      this.innerHTML = '';
      this.removeAttribute('data-title');
      return;
    }

    const formatName = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const resolveItems = (val) => {
      if (val.startsWith('#')) {
        const tagName = val.substring(1);
        return window.MINECRAFT_TAGS[tagName] || [tagName];
      }
      return [val];
    };

    const items = resolveItems(rawVal);

    if (items.length === 1) {
      const item = items[0];
      this.setAttribute('data-title', formatName(item));
      this.innerHTML = `<img src="${basePath}${item}.png" alt="${item}">`;
      return;
    }

    // Tag with multiple items -> cycle animation
    let currentIndex = 0;
    const firstItem = items[0];
    this.setAttribute('data-title', formatName(firstItem));
    this.innerHTML = `<img src="${basePath}${firstItem}.png" alt="${firstItem}">`;

    const imgEl = this.querySelector('img');

    this._interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % items.length;
      const nextItem = items[currentIndex];
      if (imgEl) {
        imgEl.src = `${basePath}${nextItem}.png`;
        imgEl.alt = nextItem;
        this.setAttribute('data-title', formatName(nextItem));
      }
    }, 1500); // Cycles every 1.5s
  }

  disconnectedCallback() {
    if (this._interval) clearInterval(this._interval);
  }
}

customElements.define('mc-item', McItem);