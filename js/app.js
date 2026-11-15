import { initLanguage } from './language.js';
import { initProjects } from './projects.js';
import { initNavigation } from './navigation.js';
import { initContact } from './contact.js';
import { initMotion } from './motion.js';
import { initSkills } from './skills.js';

// Apply the saved language before rendering translated UI and motion controls.
initLanguage();
initProjects();
initNavigation();
initContact();
initMotion();
initSkills();
