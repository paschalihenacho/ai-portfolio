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

  document.getElementById("brand-mark").textContent = initials;
  document.getElementById("nav-name").textContent = data.name;
  document.getElementById("hero-title").textContent = data.title;
  document.getElementById("hero-tagline").textContent = data.tagline;
  document.getElementById("hero-summary").textContent = data.summary;
  document.getElementById("about-summary").textContent = data.about;
  document.getElementById("profile-name").textContent = data.name;
  document.getElementById("profile-label").textContent = data.profileLabel;
  document.getElementById("profile-summary-short").textContent =
    data.profileSummaryShort;

  const profileImage = document.getElementById("profile-image");
  profileImage.src = data.portrait;
  profileImage.alt = `Portrait of ${data.name}`;

  document.getElementById("github-link").href = data.contact.github;
  document.getElementById("linkedin-link").href = data.contact.linkedin;

  const highlightsContainer = document.getElementById("hero-highlights");
  highlightsContainer.innerHTML = data.highlights
    .map(
      (item) => `
        <div>
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </div>
      `,
    )
    .join("");

  const panelGrid = document.getElementById("panel-grid");
  panelGrid.innerHTML = data.heroCards
    .map(
      (item) => `
        <div class="mini-card">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `,
    )
    .join("");

  const skillsContainer = document.getElementById("skills-grid");
  skillsContainer.innerHTML = data.skills
    .map(
      (section) => `
      <article class="feature-card">
        <h3>${section.title}</h3>
        <p>${section.items.join(", ")}</p>
      </article>
    `,
    )
    .join("");

  const projectsContainer = document.getElementById("projects-grid");
  projectsContainer.innerHTML = data.projects
    .map(
      (project, index) => `
        <article class="project-card ${index === 0 ? "featured-project" : ""}">
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

  const experienceContainer = document.getElementById("experience-list");
  experienceContainer.innerHTML = data.experience
    .map(
      (job) => `
        <article class="experience-item">
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

  const educationContainer = document.getElementById("education-list");
  educationContainer.innerHTML = data.education
    .map(
      (item) => `
        <div class="stack-item">
          <strong>${item.degree}</strong>
          <span>${item.school}</span>
          <p>${item.year}</p>
        </div>
      `,
    )
    .join("");

  const certificationsContainer = document.getElementById(
    "certifications-list",
  );
  certificationsContainer.innerHTML = data.certifications
    .map(
      (item) => `
        <div class="stack-item">
          <strong>${item.name}</strong>
          <span>${item.issuer}</span>
          <p>${item.year}</p>
        </div>
      `,
    )
    .join("");

  document.getElementById("contact-location").textContent =
    data.contact.location;
  document.getElementById("contact-email").textContent = data.contact.email;
  document.getElementById("contact-phone").textContent = data.contact.phone;

  document.getElementById("email-link").href = `mailto:${data.contact.email}`;
  document.getElementById("linkedin-contact-link").href = data.contact.linkedin;
  document.getElementById("github-contact-link").href = data.contact.github;

  document.getElementById("footer-copy").textContent =
    `© ${new Date().getFullYear()} ${data.name}`;
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
});
