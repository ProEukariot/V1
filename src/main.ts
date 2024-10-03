import gsap from "gsap";

const cursor = document.getElementById("cursor");
const focusables = document.getElementsByClassName("focusable");
const toRights = document.getElementsByClassName("to-right");
const fadeIns = document.getElementsByClassName("overlay-wrapper");
const jumpers = document.getElementsByClassName("jumper");

gsap.registerPlugin(ScrollTrigger);

window.onload = () => {
  Array.from(fadeIns).forEach((element) => {
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

  gsap.from(toRights, {
    width: 0,
    duration: 1,
    ease: "none",
    delay: 0.5,
  });
};

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
});

const tl = gsap.timeline({ paused: true });
tl.to(cursor, { scale: 2, duration: 0.15, ease: "power2.out" });

Array.from(focusables).forEach((element) => {
  element.addEventListener("mouseenter", () => {
    tl.play();
    cursor?.classList.add("focus");
  });

  element.addEventListener("mouseleave", () => {
    tl.reverse();
    cursor?.classList.remove("focus");
  });
});

Array.from(jumpers).forEach((element) => {
  element.addEventListener("mouseenter", () => {
    gsap.to(element.children, {
      y: -25,
      duration: 0.15,
      ease: "expo.in",
    });
  });

  element.addEventListener("mouseleave", () => {
    gsap.to(element.children, { y: 0, duration: 0.15, ease: "expo.in" });
  });
});

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  if (cursor) cursor.classList.add("hidden");
}
