(function () {
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var reveals = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }
})();

(function () {
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var triggers = document.querySelectorAll(".img-zoom");
  var lastFocused = null;

  function openLightbox(trigger) {
    var img = trigger.querySelector("img");
    if (!img) return;

    lastFocused = trigger;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    var figure = trigger.closest("figure");
    var caption = figure ? figure.querySelector("figcaption") : null;
    lightboxCaption.textContent = caption
      ? caption.textContent.replace(/\s*—\s*cliquer pour agrandir\s*$/, "")
      : "";

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(trigger);
    });
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-close")) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
})();

(function () {
  var button = document.querySelector(".copy-email");
  if (!button) return;

  var email = button.getAttribute("data-email");
  var defaultLabel = button.textContent;

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      /* copy unsupported, ignore */
    }
    document.body.removeChild(textarea);
  }

  function showCopied() {
    button.textContent = "Adresse copiée";
    button.setAttribute("data-copied", "true");
    setTimeout(function () {
      button.textContent = defaultLabel;
      button.removeAttribute("data-copied");
    }, 2000);
  }

  button.addEventListener("click", function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopied, function () {
        fallbackCopy(email);
        showCopied();
      });
    } else {
      fallbackCopy(email);
      showCopied();
    }
  });
})();
