type YMapsReady = {
  ready: (cb: () => void) => void;
  Map: new (
    element: HTMLElement | string,
    state: {
      center: number[];
      zoom: number;
      controls?: string[];
    },
    options?: Record<string, unknown>
  ) => YMapInstance;
  Placemark: new (
    coords: number[],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>
  ) => YPlacemark;
};

type YMapInstance = {
  geoObjects: {
    add: (obj: YPlacemark) => void;
    removeAll: () => void;
    getBounds: () => number[][] | null;
  };
  setBounds: (
    bounds: number[][],
    options?: { checkZoomRange?: boolean; zoomMargin?: number | number[] }
  ) => void;
  destroy: () => void;
};

type YPlacemark = {
  events: {
    add: (event: string, handler: () => void) => void;
  };
};

declare global {
  interface Window {
    ymaps?: YMapsReady;
  }
}

let loadPromise: Promise<YMapsReady> | null = null;

export function loadYandexMaps(apiKey: string): Promise<YMapsReady> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Yandex Maps only works in the browser"));
  }

  if (window.ymaps) {
    return new Promise((resolve) => {
      window.ymaps!.ready(() => resolve(window.ymaps!));
    });
  }

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-yandex-maps]"
    );
    if (existing) {
      existing.addEventListener("load", () => {
        window.ymaps?.ready(() => resolve(window.ymaps!));
      });
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Yandex Maps"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.async = true;
    script.dataset.yandexMaps = "true";
    script.onload = () => {
      if (!window.ymaps) {
        reject(new Error("Yandex Maps failed to initialize"));
        return;
      }
      window.ymaps.ready(() => resolve(window.ymaps!));
    };
    script.onerror = () => reject(new Error("Failed to load Yandex Maps"));
    document.head.appendChild(script);
  });

  return loadPromise;
}
