// main.js — entry point
import { initApp } from './app.js';

// Hide scroll container until Enter is clicked
const scrollContainer = document.getElementById('scroll-container');
if (scrollContainer) scrollContainer.style.display = 'none';

initApp().catch(console.error);
