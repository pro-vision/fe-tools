interface NavItem {
  name: string;
  element: HTMLLIElement;
}

interface NavCategory {
  name: string;
  element: HTMLDivElement;
  items: NavItem[];
}

class DsNav extends HTMLElement {
  private _navCategories?: NavCategory[];
  private _searchInput?: HTMLInputElement;

  private get navCategories(): NavCategory[] {
    if (this._navCategories === undefined) {
      this._navCategories = this.initNavCategories();
    }
    return this._navCategories;
  }

  private get searchInput(): HTMLInputElement | null {
    if (this._searchInput !== undefined) return this._searchInput;

    const searchInput = this.querySelector('.dds-nav__search-input') as HTMLInputElement | null;
    if (searchInput === null) return null;
    this._searchInput = searchInput;
    return searchInput;
  }

  private get currentSearchTerm(): string {
    return this.searchInput?.value || "";
  }

  protected connectedCallback() {
    this.init();
  }
  
  private init() {
    if (this.searchInput === null) return;

    const navToggle = this.querySelector('.dds-nav__nav-toggle');
    navToggle?.addEventListener('click', () => {
      document.body.classList.toggle('dds-state--nav-open');
    });

    this._navCategories = this.initNavCategories();

    this.searchInput.addEventListener('input', () => this.handleSearchInput());
    document.body.addEventListener('keydown', (event) => this.handleBodyKeyDown(event));
  }

  private initNavCategories(): NavCategory[] {
    const categoryElements = this.querySelectorAll('.dds-nav__category');
    const navCategories = Array.from(categoryElements).map((categoryElement) => this.initNavCategory(categoryElement as HTMLDivElement));

    // @ts-ignore
    return navCategories.filter((category: NavCategory | null) => category !== null);
  }

  private initNavCategory(categoryElement: HTMLDivElement): NavCategory | null {
    const navItemElements = categoryElement.querySelectorAll('.dds-nav__category-item');
    if (navItemElements.length === 0) return null;
    const categoryNameElement = categoryElement.querySelector(".dds-nav__category-name");
    if (categoryNameElement === null) return null;

    const categoryName = categoryNameElement.textContent || "";
    const items = Array.from(navItemElements).map((itemElement) => this.initNavItem(itemElement as HTMLLIElement));
    return {
      name: categoryName,
      element: categoryElement,
      items
    };
  }

  private initNavItem(itemElement: HTMLLIElement): NavItem {
    const name = itemElement.textContent || "";
    itemElement.addEventListener('click', () => {
      document.body.classList.remove('dds-state--nav-open');
    });
    return {
      name,
      element: itemElement
    };
  }

  private handleSearchInput() {
    this.filterNavCategories();
  }

  private handleBodyKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.searchInput?.blur();
    }

    if (event.key === "f" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.searchInput?.focus();
    }
  }

  private filterNavCategories() {
    const activeItemsByCategory = this.navCategories.map((category) => {
      const activeItems = category.items.filter((item) => {
        const itemActive = this.currentSearchTerm === "" || item.name.toLowerCase().includes(this.currentSearchTerm.toLowerCase());
        item.element.classList.toggle('dds-state--hidden', !itemActive);
        return itemActive;
      });
      return {
        ...category,
        items: activeItems
      };
    });

    activeItemsByCategory.forEach((category) => {
      category.element.classList.toggle('dds-state--hidden', category.items.length === 0);
    });
  }
}

customElements.define('dds-nav', DsNav);