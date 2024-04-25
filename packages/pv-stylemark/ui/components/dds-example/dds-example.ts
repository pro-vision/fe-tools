import SyntaxHighlightService from "../../services/SyntaxHighlightService";

class DSExample extends HTMLElement {
  private viewportObserver?: IntersectionObserver;
  private _scrollActive = false;

  private exampleBox?: HTMLDivElement;
  private htmlBox?: HTMLDivElement;
  private exampleIFrame?: HTMLIFrameElement;
  private _htmlContentBoxInitPromise?: Promise<void>;

  private _htmlBoxIsOpen = false;

  private get path(): string {
    return this.getAttribute('path') || "";
  }

  private get markupUrl(): string {
    return this.getAttribute('markup-url') || "";
  }

  private get scrollActive(): boolean {
    return this._scrollActive;
  }

  private set scrollActive(newValue: boolean) {
    if (newValue === this.scrollActive) return;
    this._scrollActive = newValue;
    this.exampleIFrame?.setAttribute('scrolling', newValue ? 'yes' : 'no');
  }

  private get htmlBoxIsOpen(): boolean {
    return this._htmlBoxIsOpen;
  }

  private set htmlBoxIsOpen(newValue: boolean) {
    if (newValue === this.htmlBoxIsOpen) return;
    this._htmlBoxIsOpen = newValue;
    this.htmlBox?.classList.toggle('dds-state--open', newValue);
  }

  private get htmlContentBoxInitPromise(): Promise<void> {
    if (!this._htmlContentBoxInitPromise) {
      this._htmlContentBoxInitPromise = this.initHtmlBoxContent();
    }
    return this._htmlContentBoxInitPromise;
  }

  protected connectedCallback() {
    this.init();
  }

  private init() {
    this.renderComponent();
    window.addEventListener('click', () => this.handleWindowClick());
    this.viewportObserver = new IntersectionObserver(
      (entries) => this.handleViewportChange(entries),
      {
        threshold: 0
      }
    );
    this.viewportObserver.observe(this);
  }

  private renderComponent() {
    this.renderExampleLink();
    this.renderExampleBox();
    if (this.markupUrl) this.renderHtmlBox();
  }

  private renderExampleLink() {
    const exampleLink = document.createElement('a');
    exampleLink.classList.add('dds-example__example-link');
    exampleLink.innerHTML = 'Full Screen Mode';
    exampleLink.href = this.path;
    exampleLink.target = '_blank';
    this.appendChild(exampleLink);
  }

  private renderExampleBox() {
    const exampleBox = document.createElement('div');
    exampleBox.classList.add('dds-example__example-box');
    this.exampleBox = exampleBox;
    this.appendChild(exampleBox);
  }

  private renderHtmlBox() {
    const htmlBox = document.createElement('div');
    htmlBox.classList.add('dds-example__html-box');

    this.htmlBox = htmlBox;

    const htmlBoxToggle = document.createElement('button');
    htmlBoxToggle.classList.add('dds-example__html-box-toggle');
    htmlBoxToggle.innerHTML = 'HTML';
    htmlBoxToggle.addEventListener('click', () => this.handleHtmlBoxToggleClick());
    htmlBox.appendChild(htmlBoxToggle);

    this.appendChild(htmlBox);
  }

  private handleViewportChange(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.viewportObserver?.unobserve(this);
        this.initIFrame();
      }
    });
  }

  private initIFrame() {
    const iframe = document.createElement('iframe');
    iframe.classList.add('dds-example__iframe');
    iframe.setAttribute('scrolling', 'no');
    iframe.src = this.path;
    iframe.addEventListener("load", () => {
      iframe.contentDocument?.addEventListener("click", (e) => this.handleExampleClick(e));
    });
    this.exampleIFrame = iframe;
    this.exampleBox?.appendChild(iframe);
  }

  private async handleHtmlBoxToggleClick() {
    this.htmlBoxIsOpen = !this.htmlBoxIsOpen;
    if (this.htmlBoxIsOpen === true) {
      await this.htmlContentBoxInitPromise;
    }
  }

  private handleExampleClick(e: MouseEvent) {
    e.stopPropagation();
    this.scrollActive = true;
  }

  private handleWindowClick() {
    this.scrollActive = false;
  }

  private async initHtmlBoxContent() {
    const htmlBoxContent = document.createElement('div');
    htmlBoxContent.classList.add('dds-example__html-box-content');

    const markup = await this.getHtmlBoxContent();

    htmlBoxContent.innerHTML = `<pre><code>${markup}</code></pre>`;

    this.htmlBox?.appendChild(htmlBoxContent);
  }

  private async getHtmlBoxContent() {
    const markup = await fetch(this.markupUrl);
    const markupText = await markup.text();

    return SyntaxHighlightService.highlightMarkup(markupText, { language: 'html' });
  }
}

customElements.define('dds-example', DSExample);