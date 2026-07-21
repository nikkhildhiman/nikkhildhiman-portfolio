require('@babel/register')({ presets: ['@babel/preset-env', '@babel/preset-react'] });
try {
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  // Need to mock window and document for GSAP
  global.window = { matchMedia: () => ({ matches: false }), addEventListener: () => {}, removeEventListener: () => {}, innerWidth: 1024, innerHeight: 768 };
  global.document = { querySelectorAll: () => [], getElementById: () => ({}), createElement: () => ({ style: {} }), body: { style: {} } };
  
  const App = require('./src/App.jsx').default;
  console.log("App loaded successfully");
  renderToString(React.createElement(App));
  console.log("App rendered successfully");
} catch(e) {
  console.error("RENDER ERROR:", e);
}
