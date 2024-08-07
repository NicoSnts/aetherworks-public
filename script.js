document.addEventListener("DOMContentLoaded", function () {
  console.log("Aetherworks JS v1.7");

  /* Video players */

  /* Initialize the player with ID 'player' */
  const playerElement = document.querySelector("#player");
  if (playerElement) {
    new Plyr(playerElement, {
      title: "Aetherworks Studio Experiences",
      fullscreen: {
        iosNative: true,
      },
      vimeo: {
        controls: false,
      },
    });
  }

  /* Initialize all players with the class 'testimonial_video_player' */
  const playerElements = document.querySelectorAll(".testimonial_video_player");
  playerElements.forEach((element) => {
    new Plyr(element, {
      fullscreen: {
        enabled: false,
      },
      vimeo: {
        controls: false,
      },
    });
  });
});

/* Animate text filling */

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Animate Text Color
  function animateTextColor() {
    const elements = document.querySelectorAll('[data-animate-text="true"]');

    elements.forEach((element) => {
      const spans = element.querySelectorAll(".text-color-primary");
      const secondaryColor = window.getComputedStyle(element).color;
      const primaryColor = window.getComputedStyle(spans[0]).color;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 70%", // Trigger a bit later
          end: "top 20%",
          scrub: true,
          markers: false, // Set to true for debugging
        },
      });

      spans.forEach((span) => {
        const splitText = new SplitType(span, { types: "words" });

        // Wrap each word in a span with the class 'word-wrapper'
        splitText.words.forEach((word) => {
          const wordWrapper = document.createElement("span");
          wordWrapper.classList.add("word-wrapper");
          wordWrapper.innerHTML = word.innerHTML;
          word.innerHTML = "";
          word.appendChild(wordWrapper);
        });

        // Split the words into characters for animation
        splitText.words.forEach((wordWrapper) => {
          const splitWord = new SplitType(wordWrapper, { types: "chars" });
          tl.fromTo(
            splitWord.chars,
            { color: secondaryColor }, // Initial color
            { color: primaryColor, duration: 1, stagger: 0.05 }, // Final color
            "-=0.5" // Overlap with previous animation for smooth sequence
          );
        });
      });
    });
  }

  /* Custom Cursor Functionality */

  function setupCustomCursor() {
    if (!("ontouchstart" in window || navigator.maxTouchPoints)) {
      const cursor = document.querySelector(".cursor");
      const cursorDot = document.querySelector(".cursor_dot");
      const navbar = document.getElementById("navbar");

      let isLocked = false;
      const magneticEffectVelocity = 0.3;
      const cursorPadding = 0.2; // Fixed padding in rem
      const additionalPadding = 0.8; // Additional padding for links without border-radius in rem
      const additionalBorderRadius = "0.3rem"; // Border-radius for links without border-radius

      function handleMouseDown() {
        if (!isLocked) gsap.to(cursor, { scale: 0.9, duration: 0.1 });
      }

      function handleMouseUp() {
        if (!isLocked) gsap.to(cursor, { scale: 1, duration: 0.1 });
      }

      function handleMouseMove(event) {
        if (!isLocked) {
          gsap.to(cursor, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.1,
            ease: "power2.out",
          });
        }
      }

      function handleLinkMouseEnter(event) {
        if (navbar.contains(event.currentTarget)) return;

        isLocked = true;
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const styles = window.getComputedStyle(target);
        let borderRadius = styles.getPropertyValue("border-radius") || "0.2rem";
        let padding = cursorPadding;
        if (borderRadius === "0px" || borderRadius === "") {
          padding = additionalPadding;
          borderRadius = additionalBorderRadius;
        }
        cursorDot.style.borderRadius = borderRadius;
        cursor.classList.add("lock");
        gsap.to(cursor, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: `calc(${rect.width}px + ${padding}rem)`,
          height: `calc(${rect.height}px + ${padding}rem)`,
          duration: 0.1,
          ease: "power2.out",
        });
        gsap.to(target, {
          scale: 1.05,
          duration: 0.1,
          ease: "power2.out",
        });
      }

      function handleLinkMouseMove(event) {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const offsetX = (event.clientX - rect.left - rect.width / 2) * magneticEffectVelocity;
        const offsetY = (event.clientY - rect.top - rect.height / 2) * magneticEffectVelocity;
        gsap.to(cursor, {
          x: rect.left + rect.width / 2 + offsetX,
          y: rect.top + rect.height / 2 + offsetY,
          duration: 0.1,
          ease: "power2.out",
        });
        gsap.to(target, {
          x: offsetX,
          y: offsetY,
          duration: 0.1,
          ease: "power2.out",
        });
      }

      function handleLinkMouseLeave(event) {
        if (navbar.contains(event.currentTarget)) return;

        isLocked = false;
        const target = event.currentTarget;
        cursorDot.style.borderRadius = "50%";
        gsap.to(cursor, {
          width: "1em",
          height: "1em",
          x: event.clientX,
          y: event.clientY,
          duration: 0.1,
          ease: "power2.out",
        });
        gsap.to(target, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.1,
          ease: "power2.out",
        });
        setTimeout(() => {
          if (!isLocked) cursor.classList.remove("lock");
        }, 100);
      }

      function handleTextMouseOver() {
        cursorDot.style.borderRadius = "2px";
        gsap.to(cursor, {
          width: "0.2em",
          height: "1.5em",
          duration: 0.1,
          ease: "power2.out",
        });
      }

      function handleTextMouseOut() {
        cursorDot.style.borderRadius = "50%";
        gsap.to(cursor, {
          width: "1em",
          height: "1em",
          duration: 0.1,
          ease: "power2.out",
        });
      }

      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMove);

      document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("mouseenter", handleLinkMouseEnter);
        link.addEventListener("mousemove", handleLinkMouseMove);
        link.addEventListener("mouseleave", handleLinkMouseLeave);
      });

      document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, textarea, input").forEach((elem) => {
        elem.addEventListener("mouseover", handleTextMouseOver);
        elem.addEventListener("mouseout", handleTextMouseOut);
      });
    }
  }

  /* Horizontal scroll HOW Section*/
  function setupHorizontalScroll() {
    const globalWrapperSelector = ".section_how";
    const cardsWrapperSelector = ".how_horizontal-scroll-content-cards";
    const panelSelector = ".step_card";
    const scrollVelocity = 2; // Adjusted for smoother scroll

    const panels = gsap.utils.toArray(panelSelector);
    const totalPanels = panels.length;
    const globalWrapper = document.querySelector(globalWrapperSelector);
    const cardsWrapper = document.querySelector(cardsWrapperSelector);

    // Calculate the total width of the cards wrapper and the necessary scroll distance
    const cardsWrapperWidth = cardsWrapper.scrollWidth;
    const globalWrapperWidth = globalWrapper.clientWidth;
    const scrollDistance = cardsWrapperWidth - globalWrapperWidth + 0.1 * globalWrapperWidth;

    // GSAP Timeline for horizontal scroll
    gsap
      .timeline({
        scrollTrigger: {
          trigger: globalWrapper,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: scrollVelocity,
          pin: true,
        },
      })
      .to(cardsWrapper, {
        x: -scrollDistance,
        ease: "none",
        willChange: "transform",
      });
  }

  // Footer Background Animation
  function setupFooterBackgroundAnimation() {
    const footer = document.querySelector("#footer");

    if (footer) {
      const footerHeight = footer.offsetHeight;

      // GSAP Timeline for background image scroll
      gsap
        .timeline({
          scrollTrigger: {
            trigger: footer,
            start: "top bottom", // Start when the top of the footer hits the bottom of the viewport
            end: `+=${footerHeight}`, // End after the height of the footer section
            scrub: 1.5, // Adjust this value to control the scroll speed
          },
        })
        .to(footer, {
          backgroundPosition: "0% 120%", // Move background position from -25% 120% to 0% 120%
          ease: "power2.inOut", // Smooth easing for the main scroll
        });
    }
  }

  /* Get month and display new booking text */
  function updateBookingMonth() {
    const bookingMonthElement = document.getElementById("booking-month");

    const today = new Date();
    const dayOfMonth = today.getDate();
    const currentMonth = today.getMonth();
    const nextMonth = (currentMonth + 1) % 12;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    if (dayOfMonth <= 15) {
      bookingMonthElement.textContent = months[currentMonth];
    } else {
      bookingMonthElement.textContent = months[nextMonth];
    }
  }

  /* Easter Egg Click button */
  function initializeEasterEgg() {
    // Initial text states
    const textStates = ["Really??", "If you insist ...", "I am not sure yet"];
    let clickCount = 0;

    // Function to handle button clicks
    document.getElementById("not-sure").addEventListener("click", function (event) {
      // Prevent default action on click
      event.preventDefault();

      // Update button text
      if (clickCount < textStates.length - 1) {
        this.textContent = textStates[clickCount];
        clickCount++;
      } else {
        // Redirect to the href attribute on the third click
        window.location.href = this.href;
      }
    });
  }

  /*Cal element-click embed code begins */

  (function (C, A, L) {
    let p = function (a, ar) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", { origin: "https://cal.com" });
  Cal("ui", {
    styles: { branding: { brandColor: "#000000" } },
    hideEventTypeDetails: false,
    layout: "month_view",
  });

  function initializeCalUI() {
    // Add event listener to open modal on key press
    document.addEventListener("keydown", function (event) {
      if (event.key === "b" || event.key === "B") {
        const calButton = document.querySelector('[data-cal-link="aetherworks/discovery-call"]');
        if (calButton) {
          calButton.click();
        } else {
          Cal("show"); // Ensure to call the modal directly if the button is not present
        }
      }
    });
  }

  /* Prevent any click on the certain buttons if mobile device detected. */

  function isMobileOrTablet() {
    // Check for mobile or tablet using navigator.userAgent
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }

  function preventClickOnMobileOrTablet(elementId) {
    const element = document.getElementById(elementId);
    if (isMobileOrTablet() && element) {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Click prevented on mobile or tablet device.");
      });
    }
  }

  /* Initialize all functions */
  initializeCalUI();
  animateTextColor();
  setupCustomCursor();
  setupHorizontalScroll();
  setupFooterBackgroundAnimation();
  updateBookingMonth();
  initializeEasterEgg();
  preventClickOnMobileOrTablet("logo-footer");
});

window.addEventListener("resize", setupHorizontalScroll);
