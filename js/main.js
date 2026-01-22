// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables
    const header = document.getElementById("header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");
    const themeToggle = document.getElementById("theme-toggle");
    const backToTop = document.getElementById("back-to-top");
    const skillsFilter = document.querySelectorAll(".skills-filter .filter-btn");
    const skillCards = document.querySelectorAll(".skill-card");
    const projectFilter = document.querySelectorAll(
        ".project-filter .filter-btn"
    );
    const projectCards = document.querySelectorAll(".project-card");
    let isMenuOpen = false;
    let mouseX = 0;
    let mouseY = 0;

    // Check for saved theme
    if (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.body.classList.add("dark-mode");
    }

    // Header scroll effect
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
            if (window.scrollY > 500) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        } else {
            header.classList.remove("scrolled");
            backToTop.classList.remove("visible");
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener("click", function () {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            // Create mobile menu if it doesn't exist
            if (!document.querySelector(".mobile-menu")) {
                const mobileMenu = document.createElement("div");
                mobileMenu.className = "mobile-menu";

                // Clone nav links
                const navLinksList = document
                    .querySelector(".nav-links")
                    .cloneNode(true);
                mobileMenu.appendChild(navLinksList);

                document.body.appendChild(mobileMenu);

                // Add event listeners to new links
                mobileMenu.querySelectorAll("a").forEach((link) => {
                    link.addEventListener("click", closeMobileMenu);
                });
            }

            document.querySelector(".mobile-menu").classList.add("active");
            document.body.classList.add("menu-open");

            // Transform hamburger to X
            const spans = menuToggle.querySelectorAll("span");
            spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
            spans[1].style.opacity = "0";
            spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
        } else {
            closeMobileMenu();
        }
    });

    // Close mobile menu function
    function closeMobileMenu() {
        isMenuOpen = false;
        document.querySelector(".mobile-menu").classList.remove("active");
        document.body.classList.remove("menu-open");

        // Revert X back to hamburger
        const spans = menuToggle.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
    }

    // Theme toggle
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Save preference to localStorage
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition =
                    targetElement.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });

                // If mobile menu is open, close it
                if (isMenuOpen) {
                    closeMobileMenu();
                }

                // Update active nav link
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                });
                this.classList.add("active");
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener("scroll", function () {
        let current = "";
        const sections = document.querySelectorAll("section");

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - header.offsetHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (
                window.pageYOffset >= sectionTop &&
                window.pageYOffset < sectionTop + sectionHeight
            ) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // Skills filter
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                }
            });
        },
        { threshold: 0.2 }
    );

    skillCards.forEach(card => observer.observe(card));

    // Filtering logic
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;

            skillCards.forEach(card => {
                const match =
                    filter === "all" || card.dataset.category === filter;

                card.style.display = match ? "block" : "none";
            });
        });
    });


    // Projects filter
    projectFilter.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons
            projectFilter.forEach((btn) => btn.classList.remove("active"));

            // Add active class to clicked button
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");

            // Show/hide project cards based on filter
            projectCards.forEach((card) => {
                if (filter === "all" || card.getAttribute("data-category") === filter) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // Animation on scroll
    function initAOS() {
        const elements = document.querySelectorAll("[data-aos]");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("aos-animate");
                    } else {
                        entry.target.classList.remove("aos-animate");
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        elements.forEach((element) => {
            observer.observe(element);
        });
    }

    // Initialize AOS
    initAOS();

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ========== CUSTOM CURSOR ==========
    // Only create custom cursor on desktop
    if (window.innerWidth >= 769) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';
        document.body.appendChild(cursorDot);

        let cursorX = 0;
        let cursorY = 0;
        let cursorDotX = 0;
        let cursorDotY = 0;

        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursorDotX += (mouseX - cursorDotX) * 0.3;
            cursorDotY += (mouseY - cursorDotY) * 0.3;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorDot.style.left = cursorDotX + 'px';
            cursorDot.style.top = cursorDotY + 'px';

            requestAnimationFrame(updateCursor);
        }

        updateCursor();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'var(--primary-color)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--primary-color)';
            });
        });
    }

    // ========== CURSOR TRAIL EFFECT ==========
    // Only on desktop
    if (window.innerWidth >= 769) {
        let trailCount = 0;
        document.addEventListener('mousemove', (e) => {
            if (trailCount % 3 === 0) { // Create trail every 3rd movement for performance
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
                document.body.appendChild(trail);

                setTimeout(() => {
                    if (trail.parentNode) {
                        trail.parentNode.removeChild(trail);
                    }
                }, 500);
            }
            trailCount++;
        });
    }

    // ========== SCROLL JACKING ==========
    let currentSection = 0;
    const allSections = document.querySelectorAll('section');
    let isScrollJacking = false;

    function scrollToSection(index) {
        if (isScrollJacking || index < 0 || index >= allSections.length) return;

        isScrollJacking = true;
        currentSection = index;
        const targetSection = allSections[index];
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isScrollJacking = false;
        }, 1000);
    }



    // Update current section on scroll
    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset + window.innerHeight / 2;
        allSections.forEach((section, index) => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                currentSection = index;
            }
        });
    });

    // ========== CURSOR-BASED INTERACTIONS ==========
    // Only on desktop
    if (window.innerWidth >= 769) {
        // Magnetic effect on buttons and cards
        const magneticElements = document.querySelectorAll('.btn, .skill-card, .project-card');

        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const moveX = x * 0.1;
                const moveY = y * 0.1;

                element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0) scale(1)';
            });
        });

        // Tilt effect on cards
        const tiltElements = document.querySelectorAll('.skill-card, .project-card');

        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        // Glow effect on hover
        document.querySelectorAll('.skill-card, .project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // Initialize skill progress bars animation
    function animateSkillBars() {
        const skillElements = document.querySelectorAll(".skill-card");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target.querySelector(".progress");
                        const percentage =
                            entry.target.querySelector(".skill-level").textContent;
                        progressBar.style.width = percentage;
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        skillElements.forEach((element) => {
            observer.observe(element);
        });
    }

    // Initialize skill bars animation
    animateSkillBars();

    // CV Download functionality - Updated to use actual PDF
    const downloadButtons = document.querySelectorAll(
        "#download-cv, #download-cv-main, #modal-download-cv"
    );

    downloadButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            // Method 1: Direct PDF file download (recommended)
            downloadPDFFile();

            // Show success message
            showNotification("CV download started!", "success");
        });
    });

    // Method 1: Download actual PDF file
    function downloadPDFFile() {
        const link = document.createElement("a");
        link.href = "./assets/KrishCV.pdf"; // Path to your PDF file
        link.download = "KrishCV.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Method 2: Alternative - Open PDF in new tab
    function openPDFInNewTab() {
        window.open("./assets/KrishCV.pdf", "_blank");
    }

    // Method 3: Embed PDF in modal for preview
    function showPDFPreview() {
        const modal = document.getElementById("cv-modal");
        const modalBody = modal.querySelector(".modal-body");

        // Clear existing content
        modalBody.innerHTML = `
      <div class="pdf-container">
        <embed src="./assets/KrishCV.pdf" type="application/pdf" width="100%" height="500px">
        <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
          If the PDF doesn't display, <a href="./assets/KrishCV.pdf" target="_blank" style="color: var(--primary-color);">click here to open it in a new tab</a>.
        </p>
      </div>
    `;

        modal.style.display = "block";
    }

    // Update the view CV button to show PDF preview
    const viewCVButton = document.getElementById("view-cv");
    viewCVButton.addEventListener("click", (e) => {
        e.preventDefault();
        showPDFPreview();
    });

    // CV Modal functionality
    const cvModal = document.getElementById("cv-modal");
    const closeModal = document.getElementById("close-modal");

    closeModal.addEventListener("click", () => {
        cvModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === cvModal) {
            cvModal.style.display = "none";
        }
    });

    // Notification system
    function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
          position: fixed;
          top: 100px;
          right: 20px;
          padding: 1rem 1.5rem;
          border-radius: 5px;
          color: white;
          font-weight: 500;
          z-index: 2000;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s ease;
      `;

        if (type === "success") {
            notification.style.background = "#10b981";
        } else if (type === "error") {
            notification.style.background = "#ef4444";
        } else {
            notification.style.background = "#3b82f6";
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateX(0)";
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateX(100%)";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});