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
    skillsFilter.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons
            skillsFilter.forEach((btn) => btn.classList.remove("active"));

            // Add active class to clicked button
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");

            // Show/hide skill cards based on filter
            skillCards.forEach((card) => {
                if (filter === "all" || card.getAttribute("data-category") === filter) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
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