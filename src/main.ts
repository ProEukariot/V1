import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Mode = "dark" | "light";

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let mode: Mode = isDark ? "dark" : "light";

const cursor = document.getElementById("cursor")!;
const focusables = document.getElementsByClassName("focusable");
const toRights = document.getElementsByClassName("to-right");
const fadeIns = document.getElementsByClassName("overlay-wrapper");
const jumpers = document.getElementsByClassName("jumper");
const tilts = document.getElementsByClassName("tilt");
const theme = document.getElementById("theme")!;
const switchModeBtn = document.getElementById("switch-mode")!;

const getWindowDiag = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const screenDiagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);

  return screenDiagonal;
};

gsap.registerPlugin(ScrollTrigger);

window.onload = () => {
  setTheme(mode);

  registerCursorFocusables(focusables);

  animateFadeIn(fadeIns);

  animateDrawToRight(toRights);

  animateJump(jumpers);

  animateTilt(tilts);
};

document.addEventListener("mousemove", (e) => {
  animateCursor(e);
});

switchModeBtn.addEventListener("click", () => {
  switch (mode) {
    case "dark":
      mode = "light";
      break;
    case "light":
      mode = "dark";
      break;
  }

  setTheme(mode);
});

window.addEventListener("resize", () => {
  theme.style.width = `${getWindowDiag() * 2}px`;
});

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

if (isMobileDevice()) {
  if (cursor) cursor.classList.add("hidden");
}

const rotateElement = (e: MouseEvent, element: Element) => {
  const MAX_ANGLE_X = 30;
  const MAX_ANGLE_Y = 30;

  const box = element.getBoundingClientRect();

  const x = e.clientX - box.left;
  const y = e.clientY - box.top;

  const offsetX = (x - box.width / 2) / box.width;
  const offsetY = (y - box.height / 2) / box.height;

  const angX = +(offsetX * MAX_ANGLE_X).toFixed(1);
  const angY = +(offsetY * MAX_ANGLE_Y).toFixed(1);

  gsap.to(element, {
    rotationX: angY,
    rotationY: angX * -1,
    duration: 0.15,
    ease: "none",
  });
};

const resetRotation = (element: Element) => {
  gsap.to(element, {
    rotationX: 0,
    rotationY: 0,
    duration: 0.15,
    ease: "none",
  });
};

const setTheme = (mode: Mode) => {
  let rad = getWindowDiag() * 2;

  switch (mode) {
    case "dark":
      gsap.to(theme, {
        width: rad,
        backgroundColor: "#fff",
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(switchModeBtn.children, {
        rotationX: 90,
        duration: 0.2,
        ease: "none",
      });

      document.body.classList.add("dark");
      break;
    case "light":
      gsap.to(theme, {
        width: 0,
        backgroundColor: "#000",
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(switchModeBtn.children, {
        rotationX: 0,
        duration: 0.2,
        ease: "none",
      });

      document.body.classList.remove("dark");
      break;
  }

  switchModeBtn.setAttribute("aria-pressed", String(mode == "dark"));
};

const animateJump = (elements: HTMLCollectionOf<Element>) => {
  Array.from(elements).forEach((element) => {
    element.addEventListener("mouseenter", () => {
      gsap.to(element.children, {
        y: -25,
        duration: 0.15,
        ease: "expo.in",
      });
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(element.children, {
        y: 0,
        duration: 0.15,
        ease: "expo.in",
      });
    });
  });
};

const animateFadeIn = (elements: HTMLCollectionOf<Element>) => {
  Array.from(elements).forEach((element) => {
    gsap.from(element, {
      x: 80,
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
      },
    });
  });
};

const animateDrawToRight = (elements: HTMLCollectionOf<Element>) => {
  gsap.from(elements, {
    width: 0,
    duration: 1,
    ease: "none",
    delay: 0.5,
  });
};

const animateTilt = (elements: HTMLCollectionOf<Element>) => {
  Array.from(elements).forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      rotateElement(e as MouseEvent, element);
    });

    element.addEventListener("mouseleave", () => {
      resetRotation(element);
    });
  });
};

const animateCursor = (e: MouseEvent) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
};

const registerCursorFocusables = (elements: HTMLCollectionOf<Element>) => {
  const tl = gsap.timeline({ paused: true });
  tl.to(cursor, { scale: 2, duration: 0.15, ease: "power2.out" });

  Array.from(elements).forEach((element) => {
    element.addEventListener("mouseenter", () => {
      tl.play();
      cursor.classList.add("focus");
    });

    element.addEventListener("mouseleave", () => {
      tl.reverse();
      cursor.classList.remove("focus");
    });
  });
};
