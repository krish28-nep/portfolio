document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("header");
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".nav-links");
  const themeToggle = document.getElementById("theme-toggle");
  const backToTop = document.getElementById("back-to-top");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canAnimate = !reducedMotion && typeof window.gsap !== "undefined";

  document.querySelectorAll(".project-img img").forEach((image) => {
    image.loading = "lazy";
    image.decoding = "async";
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark-mode");
  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  });

  const closeMenu = () => {
    const mobileMenu = document.querySelector(".mobile-menu");
    mobileMenu?.classList.remove("active");
    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", "true");
      mobileMenu.inert = true;
    }
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-controls", "mobile-navigation");
  menuToggle?.addEventListener("click", () => {
    let mobileMenu = document.querySelector(".mobile-menu");
    if (!mobileMenu && primaryNav) {
      mobileMenu = document.createElement("div");
      mobileMenu.className = "mobile-menu";
      mobileMenu.id = "mobile-navigation";
      mobileMenu.setAttribute("aria-label", "Mobile navigation");
      mobileMenu.setAttribute("aria-hidden", "true");
      mobileMenu.inert = true;
      mobileMenu.append(primaryNav.cloneNode(true));
      mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
      body.append(mobileMenu);
    }
    const opening = !mobileMenu?.classList.contains("active");
    mobileMenu?.classList.toggle("active", opening);
    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", String(!opening));
      mobileMenu.inert = !opening;
    }
    body.classList.toggle("menu-open", opening);
    menuToggle.setAttribute("aria-expanded", String(opening));
    if (opening) mobileMenu?.querySelector("a")?.focus();
    if (opening && canAnimate && mobileMenu) gsap.fromTo(mobileMenu.querySelectorAll("li"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: .06, duration: .32, ease: "power2.out" });
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => anchor.addEventListener("click", (event) => {
    const selector = anchor.getAttribute("href");
    const target = selector ? document.querySelector(selector) : null;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    closeMenu();
  }));

  let ticking = false;
  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 24);
    backToTop?.classList.toggle("visible", y > 600);
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { window.requestAnimationFrame(updateScrollUI); ticking = true; } }, { passive: true });
  updateScrollUI();

  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const navObserver = new IntersectionObserver((entries) => {
    const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (active) navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${active.target.id}`));
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0, .2, .5] });
  document.querySelectorAll("section[id]").forEach((section) => navObserver.observe(section));

  const applyFilter = (buttons, cards) => buttons.forEach((button) => button.addEventListener("click", () => {
    buttons.forEach((item) => item.classList.toggle("active", item === button));
    const visible = cards.filter((card) => button.dataset.filter === "all" || card.dataset.category === button.dataset.filter);
    cards.forEach((card) => { card.hidden = !visible.includes(card); });
    if (canAnimate) gsap.fromTo(visible, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .045, overwrite: true, ease: "power2.out" });
  }));
  applyFilter([...document.querySelectorAll(".skills-filter .filter-btn")], [...document.querySelectorAll(".skill-card")]);
  applyFilter([...document.querySelectorAll(".project-filter .filter-btn")], [...document.querySelectorAll(".project-card")]);

  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = "notification success";
    notification.textContent = message;
    body.append(notification);
    if (canAnimate) gsap.fromTo(notification, { autoAlpha: 0, x: 22 }, { autoAlpha: 1, x: 0, duration: .25, onComplete: () => gsap.to(notification, { autoAlpha: 0, x: 22, duration: .25, delay: 2.4, onComplete: () => notification.remove() }) });
    else setTimeout(() => notification.remove(), 2800);
  };
  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = "./assets/KrishCV.pdf";
    link.download = "KrishCV.pdf";
    link.click();
    showNotification("CV download started");
  };
  document.querySelectorAll("#download-cv, #download-cv-main, #modal-download-cv").forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); downloadPDF(); }));

  const modal = document.getElementById("cv-modal");
  const closeModal = () => { if (modal) modal.style.display = "none"; };
  document.getElementById("view-cv")?.addEventListener("click", () => {
    if (!modal) return;
    modal.querySelector(".modal-body").innerHTML = '<div class="pdf-container"><embed src="./assets/KrishCV.pdf" type="application/pdf" width="100%" height="500" title="Krish Sitikhu CV"><p>PDF not visible? <a href="./assets/KrishCV.pdf" target="_blank" rel="noopener">Open it in a new tab.</a></p></div>';
    modal.style.display = "block";
  });
  document.getElementById("close-modal")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });

  if (!canAnimate) return;
  gsap.registerPlugin(ScrollTrigger);
  const initThreeBackdrop = () => {
    const host = document.querySelector(".three-canvas");
    if (!host || !window.THREE || window.innerWidth <= 768) return () => {};

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 0, 4.2);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    host.append(renderer.domElement);

    const sculpture = new THREE.Group();
    const sphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.98, 2),
      new THREE.MeshBasicMaterial({ color: 0xed705b, wireframe: true, transparent: true, opacity: .68 })
    );
    sculpture.add(sphere);
    sculpture.position.set(1.1, -.08, 0);
    scene.add(sculpture);

    const render = () => renderer.render(scene, camera);
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      render();
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const flipTrigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: .7,
      animation: gsap.timeline().to(sculpture.rotation, { x: Math.PI * 1.15, y: Math.PI * 1.7, ease: "none" }).to(sculpture.position, { y: -.45, ease: "none" }, 0),
      onUpdate: render
    });
    return () => {
      flipTrigger.kill();
      window.removeEventListener("resize", resize);
      sphere.geometry.dispose();
      sphere.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  };
  const initSectionThree = () => {
    const sections = [...document.querySelectorAll("section[id]")].filter((section) => section.id !== "home");
    if (!window.THREE || window.innerWidth <= 768 || !sections.length) return () => {};

    const hosts = sections.map((section) => {
      const host = document.createElement("div");
      host.className = "three-section-canvas";
      host.setAttribute("aria-hidden", "true");
      section.append(host);
      return host;
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.z = 4;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    const geometries = [
      new THREE.IcosahedronGeometry(1.05, 2),
      new THREE.OctahedronGeometry(1.05, 2),
      new THREE.TorusGeometry(.85, .23, 12, 48),
      new THREE.TorusKnotGeometry(.78, .16, 90, 12),
      new THREE.DodecahedronGeometry(1.0, 1)
    ];
    const colors = [0xed705b, 0xe8ae4e, 0xed705b, 0xe8ae4e, 0xed705b];
    const material = new THREE.MeshBasicMaterial({ color: colors[0], wireframe: true, transparent: true, opacity: .58 });
    const object = new THREE.Mesh(geometries[0], material);
    object.position.set(1.25, 0, 0);
    scene.add(object);
    let activeIndex = -1;
    const render = () => renderer.render(scene, camera);
    const resize = () => {
      const target = hosts[activeIndex] || hosts[0];
      const { width, height } = target.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      render();
    };
    const activate = (index) => {
      if (activeIndex === index) return;
      activeIndex = index;
      const host = hosts[index];
      host.append(renderer.domElement);
      object.geometry = geometries[index % geometries.length];
      material.color.setHex(colors[index % colors.length]);
      gsap.killTweensOf(object.rotation);
      gsap.set(object.rotation, { x: -.45, y: -.7, z: 0 });
      gsap.to(object.rotation, { x: Math.PI * 1.45, y: Math.PI * 1.8, z: .32, duration: 1.4, ease: "power2.out", onUpdate: render });
      resize();
    };
    const triggers = sections.map((section, index) => ScrollTrigger.create({
      trigger: section,
      start: "top 68%",
      end: "bottom 32%",
      onEnter: () => activate(index),
      onEnterBack: () => activate(index)
    }));
    activate(0);
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", resize);
      geometries.forEach((geometry) => geometry.dispose());
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      hosts.forEach((host) => host.remove());
    };
  };
  let destroyThree = () => {};
  let destroySectionThree = () => {};
  const context = gsap.context(() => {
    destroyThree = initThreeBackdrop();
    destroySectionThree = initSectionThree();
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from("#header", { y: -20, autoAlpha: 0, duration: .55 })
      .from(".hero-text h1", { y: 36, autoAlpha: 0, duration: .8 }, "-=.2")
      .from(".hero-text p", { y: 20, autoAlpha: 0, duration: .55 }, "-=.5")
      .from(".hero-buttons .btn", { y: 16, autoAlpha: 0, stagger: .09, duration: .45 }, "-=.35")
      .from(".social-links a", { autoAlpha: 0, scale: .75, stagger: .06, duration: .35 }, "-=.2")
      .from(".profile-picture", { autoAlpha: 0, scale: .88, rotate: -3, duration: .9 }, "<");
    gsap.utils.toArray(".section-header").forEach((heading) => gsap.from(heading.children, { y: 24, autoAlpha: 0, stagger: .09, duration: .55, ease: "power2.out", scrollTrigger: { trigger: heading, start: "top 82%", once: true } }));
    gsap.utils.toArray(".about-text, .about-info, .contact-info, .contact-form, .timeline-column").forEach((block) => gsap.from(block, { y: 28, autoAlpha: 0, duration: .65, ease: "power2.out", scrollTrigger: { trigger: block, start: "top 86%", once: true } }));
    gsap.utils.toArray(".skills-grid, .projects-grid").forEach((grid) => {
      const isProjectsGrid = grid.classList.contains("projects-grid");
      const entrance = { autoAlpha: 0, duration: .5, stagger: .055, ease: "power2.out", scrollTrigger: { trigger: grid, start: "top 80%", once: true } };
      if (isProjectsGrid) Object.assign(entrance, { y: 26, rotateX: 9, transformPerspective: 800 });
      gsap.from(grid.querySelectorAll(isProjectsGrid ? ".project-card" : ".skill-card"), entrance);
    });
    document.querySelectorAll(".progress").forEach((bar) => gsap.fromTo(bar, { width: 0 }, { width: bar.style.width, duration: .8, ease: "power2.out", scrollTrigger: { trigger: bar, start: "top 88%", once: true } }));
    gsap.to(".profile-picture", { yPercent: -7, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointerenter", () => gsap.to(card, { y: -5, duration: .25, ease: "power2.out" }));
      card.addEventListener("pointerleave", () => gsap.to(card, { y: 0, duration: .3, ease: "power2.out" }));
    });
  });
  window.addEventListener("beforeunload", () => { destroyThree(); destroySectionThree(); context.revert(); }, { once: true });
});
