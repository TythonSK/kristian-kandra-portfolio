export function initSkills() {
  const desktopSkills = matchMedia('(min-width: 761px)');
  function arrangeSkills() {
    document.querySelectorAll('.skills-list details').forEach((detail, index) => {
      detail.open = desktopSkills.matches || index === 0;
    });
  }
  arrangeSkills();
  desktopSkills.addEventListener('change', arrangeSkills);
}
