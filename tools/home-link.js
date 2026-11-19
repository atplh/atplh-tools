/*
 * Shared "back to home" link for every tool page.
 *
 * - Normal (scrolling) pages get a slim bar at the top of the page that takes
 *   up its own space, so it never covers the page title.
 * - Full-screen pages that cannot scroll (html/body overflow hidden) get a
 *   small floating logo button instead, so their layout is not cut off.
 */
(() => {
  const scriptUrl = document.currentScript && document.currentScript.src;

  const addHomeLink = () => {
    if (document.getElementById("atplh-home-link")) return;

    if (!scriptUrl) {
      console.error("ATPL(H) home link could not determine its script URL.");
      return;
    }

    const locked = [document.documentElement, document.body].some((el) =>
      ["hidden", "clip"].includes(getComputedStyle(el).overflowY)
    );

    const style = document.createElement("style");
    style.textContent = `
      #atplh-home-bar {
        position: relative;
        z-index: 100000;
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 max(12px, env(safe-area-inset-left));
        background: #0a131e;
        border-bottom: 1px solid #1f3145;
        box-sizing: border-box;
      }

      #atplh-home-bar.atplh-pinned {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }

      #atplh-home-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 4px 10px 4px 4px;
        border-radius: 8px;
        color: #e8eef5;
        font: 600 13px/1 system-ui, "Segoe UI", Arial, sans-serif;
        letter-spacing: 0;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s;
      }

      #atplh-home-link:hover { background: #142335; }

      #atplh-home-link:focus-visible {
        outline: 2px solid #efc36a;
        outline-offset: 2px;
      }

      #atplh-home-link .atplh-chevron {
        width: 14px;
        height: 14px;
        color: #8fa1b4;
        transition: transform 0.15s, color 0.15s;
      }

      #atplh-home-link:hover .atplh-chevron {
        color: #efc36a;
        transform: translateX(-2px);
      }

      #atplh-home-link img {
        width: 22px;
        height: 22px;
        border-radius: 6px;
        display: block;
      }

      /* Floating variant for full-screen pages: logo only, bottom-left */
      #atplh-home-link.atplh-floating {
        position: fixed;
        left: max(12px, env(safe-area-inset-left));
        bottom: max(12px, env(safe-area-inset-bottom));
        z-index: 100000;
        padding: 5px;
        border: 1px solid #2c4258;
        border-radius: 10px;
        background: rgba(15, 27, 41, 0.92);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0.75;
        transition: opacity 0.15s, border-color 0.15s;
      }

      #atplh-home-link.atplh-floating:hover,
      #atplh-home-link.atplh-floating:focus-visible {
        opacity: 1;
        border-color: rgba(239, 195, 106, 0.6);
      }

      #atplh-home-link.atplh-floating .atplh-chevron,
      #atplh-home-link.atplh-floating span { display: none; }

      #atplh-home-link.atplh-floating:hover span,
      #atplh-home-link.atplh-floating:focus-visible span { display: inline; padding-right: 6px; }

      @media print {
        #atplh-home-bar, #atplh-home-link { display: none; }
      }
    `;
    document.head.appendChild(style);

    const link = document.createElement("a");
    link.id = "atplh-home-link";
    link.href = new URL("../index.html", scriptUrl).href;
    link.setAttribute("aria-label", "Back to ATPL(H) Tools home");
    link.title = "Back to ATPL(H) Tools home";
    link.innerHTML = `
      <svg class="atplh-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>
      <img src="${new URL("../atplh-tools-rotor.svg", scriptUrl).href}" alt="" />
      <span>ATPL(H) Tools</span>
    `;

    if (locked) {
      link.classList.add("atplh-floating");
      document.body.appendChild(link);
    } else {
      const bar = document.createElement("nav");
      bar.id = "atplh-home-bar";
      bar.setAttribute("aria-label", "Site");
      bar.appendChild(link);

      // Stretch the bar edge to edge even when the page gives <body> its own
      // margin or padding, and keep the page's original top spacing below it.
      const cs = getComputedStyle(document.body);
      const px = (prop) => parseFloat(cs[prop]) || 0;

      if (/flex|grid/.test(cs.display)) {
        // A flex/grid <body> would lay the bar out as one more item (e.g. beside
        // the content). Pin it to the top and push the body down instead.
        bar.classList.add("atplh-pinned");
        document.body.style.paddingTop = `${px("paddingTop") + 40}px`;
      } else {
        const top = px("marginTop") + px("paddingTop");
        const left = px("marginLeft") + px("paddingLeft");
        const right = px("marginRight") + px("paddingRight");
        bar.style.margin = `${-top}px ${-right}px ${top}px ${-left}px`;
      }

      document.body.prepend(bar);
    }
  };

  if (document.body) {
    addHomeLink();
  } else {
    document.addEventListener("DOMContentLoaded", addHomeLink, { once: true });
  }
})();
