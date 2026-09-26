// main.js — entry point
import { initApp } from './app.js';

initApp().catch(err => {
  console.error(err);
  document.body.classList.add('is-failed');
});
