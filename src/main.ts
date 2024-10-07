import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Mode = "dark" | "light";

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let mode: Mode = isDark ? "dark" : "light";

const cursor = document.getElementById("cursor")!;
const focusables = document.querySelectorAll(".focusable");
const toRights = document.querySelectorAll(".to-right");
const fadeIns = document.querySelectorAll(".overlay-wrapper");
const jumpers = document.querySelectorAll(".jumper");
const tilts = document.querySelectorAll(".tilt");
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

  animateCursor();

  animateResize();

  registerCursorFocusables(focusables);

  animateFadeIn(fadeIns);

  animateDrawToRight(toRights);

  animateJump(jumpers);

  animateTilt(tilts);
};

switchModeBtn.addEventListener("click", (e) => {
  e.preventDefault();

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
  gsap.to(theme, {
    width: getWindowDiag() * 2,
    duration: 0.2,
    ease: "power3.out",
  });
});

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

  // gsap.to(element, {
  //   rotationX: angY,
  //   rotationY: angX * -1,
  //   duration: 0.15,
  //   ease: "none",
  // });

  const toRotationX = gsap.quickTo(element, "rotationX", {
    duration: 0.15,
    ease: "none",
  });

  const toRotationY = gsap.quickTo(element, "rotationY", {
    duration: 0.15,
    ease: "none",
  });

  toRotationX(angY);
  toRotationY(angX * -1);
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
  const isDark = mode == "dark";

  gsap.to(theme, {
    width: isDark ? rad : 0,
    backgroundColor: isDark ? "#fff" : "#000",
    duration: 0.8,
    ease: "power3.out",
  });

  gsap.to(switchModeBtn.children, {
    rotationX: isDark ? 90 : 0,
    duration: 0.2,
    ease: "none",
  });

  document.body.classList.toggle("dark", isDark);

  switchModeBtn.setAttribute("aria-pressed", String(isDark));
};

const animateJump = (elements: NodeListOf<Element>) => {
  elements.forEach((element) => {
    const jumpTween = gsap.to(element.children, {
      y: -25,
      duration: 0.15,
      ease: "expo.out",
      paused: true,
    });

    element.addEventListener("mouseenter", () => {
      jumpTween.play();
    });

    element.addEventListener("mouseleave", () => {
      jumpTween.reverse();
    });
  });
};

const animateFadeIn = (elements: NodeListOf<Element>) => {
  elements.forEach((element) => {
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

const animateDrawToRight = (elements: NodeListOf<Element>) => {
  gsap.from(elements, {
    width: 0,
    duration: 1,
    ease: "none",
    delay: 0.5,
  });
};

const animateTilt = (elements: NodeListOf<Element>) => {
  elements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      rotateElement(e as MouseEvent, element);
    });

    element.addEventListener("mouseleave", () => {
      resetRotation(element);
    });
  });
};

const animateResize = () => {
  const widthTo = gsap.quickTo(theme, "width", {
    duration: 0.2,
    ease: "power3.out",
  });

  window.addEventListener("resize", () => {
    widthTo(getWindowDiag() * 2);
  });
};

const animateCursor = () => {
  const xSetter = gsap.quickSetter(cursor, "x", "px");
  const ySetter = gsap.quickSetter(cursor, "y", "px");

  window.addEventListener("mousemove", (e) => {
    xSetter(e.x);
    ySetter(e.y);
  });
};

const registerCursorFocusables = (elements: NodeListOf<Element>) => {
  const tl = gsap.timeline({ paused: true });
  tl.to(cursor, { scale: 2, duration: 0.15, ease: "power2.out" });

  elements.forEach((element) => {
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
