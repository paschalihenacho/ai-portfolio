function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(isDark));
    const text = toggle.querySelector(".theme-toggle-text");
    if (text) {
      text.textContent = isDark ? "Light" : "Dark";
    }
  }
}

function initThemeToggle() {
  const savedTheme = localStorage.getItem("theme");
  const preferredDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const initialTheme = savedTheme || (preferredDark ? "dark" : "light");

  applyTheme(initialTheme);

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark")
      ? "light"
      : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });
}

function revealOnScroll() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || "";
  }
}

function setHref(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.href = value;
  }
}

async function loadPortfolio() {
  const response = await fetch("./resume.json");

  if (!response.ok) {
    throw new Error(`Failed to load resume.json: ${response.status}`);
  }

  const data = await response.json();

  document.title = `${data.name} | ${data.seoTitle || "Portfolio"}`;

  const initials = data.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  setText("brand-mark", initials);
  setText("nav-name", data.name);
  setText("hero-title", data.title);
  setText("hero-tagline", data.tagline);
  setText("hero-summary", data.summary);
  setText("about-summary", data.about);
  setText("profile-name", data.name);
  setText("profile-label", data.profileLabel);
  setText("profile-summary-short", data.profileSummaryShort);

  const profileImage = document.getElementById("profile-image");
  if (profileImage) {
    profileImage.src = data.portrait;
    profileImage.alt = `Portrait of ${data.name}`;
  }

  setHref("github-link", data.contact.github);
  setHref("linkedin-link", data.contact.linkedin);
  setHref("email-link", `mailto:${data.contact.email}`);
  setHref("linkedin-contact-link", data.contact.linkedin);
  setHref("github-contact-link", data.contact.github);

  const resumeDownload = document.getElementById("resume-download");
  if (resumeDownload && data.resumeFile) {
    resumeDownload.href = data.resumeFile;
  }

  if (data.cta) {
    setText("cta-primary", data.cta.primary || "Explore Projects");
    setText("cta-secondary", data.cta.secondary || "Get In Touch");
    setText("resume-download", data.cta.resume || "Download Resume");
  }

  const highlightsContainer = document.getElementById("hero-highlights");
  if (highlightsContainer && Array.isArray(data.highlights)) {
    highlightsContainer.innerHTML = data.highlights
      .map(
        (item, index) => `
          <div class="reveal reveal-delay-${Math.min(index + 1, 3)}">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
          </div>
        `,
      )
      .join("");
  }

  const panelGrid = document.getElementById("panel-grid");
  if (panelGrid && Array.isArray(data.heroCards)) {
    panelGrid.innerHTML = data.heroCards
      .map(
        (item, index) => `
          <div class="mini-card reveal reveal-delay-${(index % 3) + 1}">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </div>
        `,
      )
      .join("");
  }

  const skillsContainer = document.getElementById("skills-grid");
  if (skillsContainer && Array.isArray(data.skills)) {
    skillsContainer.innerHTML = data.skills
      .map(
        (group, index) => `
          <article class="skills-card reveal reveal-delay-${(index % 3) + 1}">
            <div class="skills-card-header">
              <h3>${group.category}</h3>
            </div>

            <div class="skills-list">
              ${group.items
                .map(
                  (skill) => `
                    <div class="skill-bar">
                      <div class="skill-header">
                        <span>${skill.name}</span>
                        <span>${skill.level}%</span>
                      </div>
                      <div class="skill-track">
                        <div class="skill-fill" style="width: ${skill.level}%"></div>
                      </div>
                    </div>
                  `,
                )
                .join("")}
            </div>
          </article>
        `,
      )
      .join("");
  }

  const projectsContainer = document.getElementById("projects-grid");
  if (projectsContainer && Array.isArray(data.projects)) {
    projectsContainer.innerHTML = data.projects
      .map(
        (project, index) => `
          <article class="project-card ${index === 0 ? "featured-project" : ""} reveal reveal-delay-${(index % 3) + 1}">
            <div class="project-top">
              <p class="project-type">${project.type}</p>
              <h3>${project.name}</h3>
            </div>
            <p class="project-copy">${project.description}</p>
            <div class="project-tags">
              ${project.stack.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </article>
        `,
      )
      .join("");
  }

  const experienceContainer = document.getElementById("experience-list");
  if (experienceContainer && Array.isArray(data.experience)) {
    experienceContainer.innerHTML = data.experience
      .map(
        (job, index) => `
          <article class="experience-item reveal reveal-delay-${(index % 3) + 1}">
            <div class="experience-meta">
              <span class="experience-years">${job.period}</span>
              <h3>${job.role}</h3>
              <p>${job.company}${job.location ? ` · ${job.location}` : ""}</p>
            </div>
            <div class="experience-details">
              <ul>
                ${job.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
              </ul>
            </div>
          </article>
        `,
      )
      .join("");
  }

  const educationContainer = document.getElementById("education-list");
  if (educationContainer && Array.isArray(data.education)) {
    educationContainer.innerHTML = data.education
      .map(
        (item, index) => `
          <div class="stack-item reveal reveal-delay-${(index % 3) + 1}">
            <strong>${item.degree}</strong>
            <span>${item.school}</span>
            <p>${item.year}</p>
          </div>
        `,
      )
      .join("");
  }

  const certificationsContainer = document.getElementById(
    "certifications-list",
  );
  if (certificationsContainer && Array.isArray(data.certifications)) {
    certificationsContainer.innerHTML = data.certifications
      .map(
        (item, index) => `
          <div class="stack-item reveal reveal-delay-${(index % 3) + 1}">
            <strong>${item.name}</strong>
            <span>${item.issuer}</span>
            <p>${item.year}</p>
          </div>
        `,
      )
      .join("");
  }

  setText("contact-location", data.contact.location);
  setText("contact-email", data.contact.email);
  setText("contact-phone", data.contact.phone);
  setText("footer-copy", `© ${new Date().getFullYear()} ${data.name}`);

  revealOnScroll();
  initThemeToggle();
}

loadPortfolio().catch((error) => {
  console.error(error);

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div style="padding: 1rem; margin: 1rem; border: 1px solid #fecaca; background: #fef2f2; color: #991b1b; border-radius: 12px; font-family: sans-serif;">
        Unable to load portfolio data. Make sure <strong>resume.json</strong> is in the same folder as <strong>index.html</strong>.
      </div>
    `,
  );

  initThemeToggle();
});
