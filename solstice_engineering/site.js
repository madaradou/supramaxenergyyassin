document.documentElement.classList.add("has-js");

const root = document.documentElement;
const body = document.body;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const formatMetricNumber = (value, decimals) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

const animateMetric = (metric) => {
  if (!(metric instanceof HTMLElement) || metric.dataset.counted === "true") {
    return;
  }

  const source = metric.textContent.trim();
  const numberMatch = source.match(/\d+(?:[.,]\d+)?/);

  if (!numberMatch) {
    metric.dataset.counted = "true";
    return;
  }

  const raw = numberMatch[0];
  const target = Number(raw.replace(",", "."));

  if (!Number.isFinite(target)) {
    metric.dataset.counted = "true";
    return;
  }

  const decimals = (raw.split(/[.,]/)[1] || "").length;
  const prefix = source.slice(0, numberMatch.index);
  const suffix = source.slice((numberMatch.index || 0) + raw.length);

  metric.dataset.counted = "true";

  if (prefersReducedMotion) {
    return;
  }

  const duration = 1400;
  const start = performance.now();

  metric.textContent = `${prefix}${formatMetricNumber(0, decimals)}${suffix}`;

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = target * eased;

    metric.textContent = `${prefix}${formatMetricNumber(currentValue, decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const animateMetricsIn = (scope) => {
  if (!(scope instanceof Element)) {
    return;
  }

  if (scope.classList.contains("metric")) {
    animateMetric(scope);
  }

  scope.querySelectorAll(".metric").forEach((metric) => animateMetric(metric));
};

const markPageLoaded = () => {
  requestAnimationFrame(() => {
    body.classList.add("is-loaded");
  });
};

if (document.readyState === "complete") {
  markPageLoaded();
} else {
  window.addEventListener("load", markPageLoaded, { once: true });
}

window.addEventListener("pageshow", () => {
  body.classList.remove("is-transitioning");
});

const updateHeaderState = () => {
  const y = window.scrollY || window.pageYOffset;
  body.classList.toggle("is-scrolled", y > 14);

  const scrollableHeight = Math.max(1, root.scrollHeight - window.innerHeight);
  const progress = Math.min(1, y / scrollableHeight);
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
};

let isScrollTicking = false;
const onScroll = () => {
  if (isScrollTicking) {
    return;
  }

  isScrollTicking = true;
  requestAnimationFrame(() => {
    updateHeaderState();
    isScrollTicking = false;
  });
};

updateHeaderState();
window.addEventListener("scroll", onScroll, { passive: true });

const toggleButton = document.querySelector("[data-nav-toggle]");
const mobilePanel = document.querySelector("[data-mobile-nav]");

if (toggleButton && mobilePanel) {
  const toggleIcon = toggleButton.querySelector(".material-symbols-outlined");
  const setMobileState = (isOpen) => {
    mobilePanel.classList.toggle("is-open", isOpen);
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    if (toggleIcon) {
      toggleIcon.textContent = isOpen ? "close" : "menu";
    }
  };

  toggleButton.addEventListener("click", () => {
    const nextState = !mobilePanel.classList.contains("is-open");
    setMobileState(nextState);
  });

  mobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileState(false);
    }
  });
}

const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

if (revealItems.length > 0) {
  revealItems.forEach((item, index) => {
    const stagger = (index % 4) * 0.06;
    item.style.setProperty("--reveal-delay", `${stagger}s`);
  });
}

if (!prefersReducedMotion && "IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          animateMetricsIn(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
    animateMetricsIn(item);
  });
}

if (revealItems.length === 0) {
  animateMetricsIn(document.body);
}

const pageWipe = document.createElement("div");
pageWipe.className = "page-wipe";
body.append(pageWipe);

const isNavigableInternalLink = (link) => {
  const rawHref = link.getAttribute("href");

  if (!rawHref || rawHref.startsWith("#") || link.hasAttribute("download")) {
    return false;
  }

  if (link.target && link.target !== "_self") {
    return false;
  }

  let destination;

  try {
    destination = new URL(link.href, window.location.href);
  } catch (_error) {
    return false;
  }

  if (["mailto:", "tel:", "javascript:"].includes(destination.protocol)) {
    return false;
  }

  const isExternalHttp =
    (destination.protocol === "http:" || destination.protocol === "https:") &&
    destination.origin !== window.location.origin;

  if (isExternalHttp) {
    return false;
  }

  const sameDocumentAnchor =
    destination.pathname === window.location.pathname &&
    destination.search === window.location.search &&
    destination.hash;

  return !sameDocumentAnchor;
};

if (!prefersReducedMotion) {
  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (!isNavigableInternalLink(link)) {
        return;
      }

      event.preventDefault();
      body.classList.add("is-transitioning");

      window.setTimeout(() => {
        window.location.assign(link.href);
      }, 320);
    });
  });
}

if (!prefersReducedMotion && hasFinePointer) {
  body.classList.add("motion-ready");

  const interactivePanels = document.querySelectorAll(
    ".hero-panel, .wide-panel, .story-panel, .cta-shell"
  );

  interactivePanels.forEach((panel) => {
    panel.addEventListener("pointermove", (event) => {
      const rect = panel.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      const tiltY = (normalizedX * 5).toFixed(2);
      const tiltX = (normalizedY * -4.4).toFixed(2);

      panel.style.setProperty("--tilt-y", `${tiltY}deg`);
      panel.style.setProperty("--tilt-x", `${tiltX}deg`);
    });

    panel.addEventListener("pointerleave", () => {
      panel.style.setProperty("--tilt-y", "0deg");
      panel.style.setProperty("--tilt-x", "0deg");
    });
  });
}
