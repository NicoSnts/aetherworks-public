document.addEventListener("DOMContentLoaded", function () {
  console.log("Aetherworks JS v1.93");

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

      // Set the z-index of the cursor to ensure it is above other elements
      cursor.style.zIndex = "999";

      // Separate magnetic effect velocities
      const magneticEffectVelocityX = 0.1; // Subtle horizontal magnetism
      const magneticEffectVelocityY = 0.3; // Stronger vertical magnetism

      // Track if the cursor is currently hovering over a button
      let isHovering = false;

      document.addEventListener("mousemove", (event) => {
        if (!isHovering) {
          gsap.to(cursor, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.1,
            ease: "power2.out",
          });
        }
      });

      document.querySelectorAll("a").forEach((link) => {
        let rect = null;

        link.addEventListener("mouseenter", (event) => {
          if (navbar && navbar.contains(link)) return; // Skip links inside the navbar

          isHovering = true;
          rect = event.currentTarget.getBoundingClientRect();

          // Make cursor slightly larger, light effect with subtle inversion, and add blur
          gsap.to(cursor, {
            width: `${rect.height}px`,
            height: `${rect.height}px`,
            background: "rgba(255, 255, 255, 0.1)", // Light color effect
            filter: "blur(10px)",
            borderRadius: "50%", // Maintain circular shape
            mixBlendMode: "lighten", // Subtle light effect without full inversion
            duration: 0.3,
            opacity: 0.5,
            ease: "power2.out",
          });

          // Center the cursor on the button
          gsap.to(cursor, {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        link.addEventListener("mousemove", (event) => {
          if (rect) {
            // Calculate the magnetic pull based on cursor position within the button
            const offsetX = (event.clientX - rect.left - rect.width / 2) * magneticEffectVelocityX;
            const offsetY = (event.clientY - rect.top - rect.height / 2) * magneticEffectVelocityY;

            // Move the button slightly towards the cursor
            gsap.to(event.currentTarget, {
              x: offsetX,
              y: offsetY,
              duration: 0.1,
              ease: "power2.out",
            });

            // Move the cursor within the button area as well
            gsap.to(cursor, {
              x: event.clientX + offsetX,
              y: event.clientY + offsetY,
              duration: 0.1,
              ease: "power2.out",
            });
          }
        });

        link.addEventListener("mouseleave", () => {
          if (navbar && navbar.contains(link)) return; // Skip links inside the navbar

          isHovering = false;

          // Reset cursor to its original size, position, remove light effect, blur, and blend mode
          gsap.to(cursor, {
            width: "1em",
            height: "1em",
            background: "none",
            filter: "none",
            mixBlendMode: "normal", // Reset the blend mode to default
            duration: 0.3,
            opacity: 1,
            ease: "power2.out",
          });

          // Reset button position
          gsap.to(event.currentTarget, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, textarea, input").forEach((elem) => {
        elem.addEventListener("mouseover", () => {
          cursorDot.style.borderRadius = "2px"; // Set border-radius to 2px for text elements
          gsap.to(cursor, {
            width: "0.2em",
            height: "1.5em",
            duration: 0.1,
            ease: "power2.out",
          });
        });

        elem.addEventListener("mouseout", () => {
          cursorDot.style.borderRadius = "50%"; // Reset to the default border-radius
          gsap.to(cursor, {
            width: "1em",
            height: "1em",
            duration: 0.1,
            ease: "power2.out",
          });
        });
      });
    }
  }

  /*
  //
  // Footer Background Animation
  //
  */

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
  setupFooterBackgroundAnimation();
  updateBookingMonth();
  initializeEasterEgg();
  preventClickOnMobileOrTablet("logo-footer");
});
