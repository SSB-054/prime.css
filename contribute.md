# Contributing to prime.css

Hey there! Thanks for considering contributing to prime.css. We're building something simple but meaningful here, and we'd love your help.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/surajsinghbisht054/prime.css.git`
3. Create a branch: `git checkout -b your-feature-name`

## What We Need Help With

- **Component Development**: Building simple, native-feeling HTML components
- **Documentation**: Clear, concise docs with practical examples
- **Testing**: Browser compatibility testing and edge case discovery
- **Performance**: Keeping things fast and lightweight
- **Bug Fixes**: Finding and squashing bugs

## Guidelines

## Follow Core Principles
- HTML-First: Works directly with HTML elements - no special classes or frameworks to learn
- Browser-Native: Embraces and enhances native browser components
- Minimalistic: Every feature has to earn its place
- Vanilla JS only - no frameworks/libraries
- Keep functions small and focused
- Use modern JS features (we're not supporting ancient browsers)
- Avoid creating unnecessary abstractions

```javascript
// Good
function toggleAccordion(element) {
  element.classList.toggle('active');
}

// Avoid
class AccordionManager {
  constructor() {
    this.state = {};
    // ... unnecessary complexity
  }
}
```

### Documentation
- Include examples with your code
- Explain why, not just what
- Keep it concise

## Submitting Changes

1. Write clear commit messages
2. Push to your fork
3. Open a PR with a clear description of the changes
4. Respond to any feedback

## Need Help?

Open an issue or start a discussion. We're building this together.

## Code of Conduct

- Be kind and respectful
- Focus on the code, not the person
- Help others learn
- Stay focused on simplicity

## Credit

We believe in giving credit where it's due. If you're adapting code from another project (under MIT license), mention it in your PR.

---

That's it! No lengthy processes, no bureaucracy - just good code and good collaboration.