# AI Coding Mentor Pro 💎

AI Coding Mentor Pro is an award-winning, production-grade SaaS code auditing and education platform. Powered by Google's modern Gemini API, it provides developers with a high-fidelity senior mentor experience directly in their web browser.

## 🌟 Key Features

- **Integrated VS Code Experience (Monaco Editor)**: Features auto-indent, bracket matching, syntax highlighting, and inline metrics for an elegant development workspace.
- **Side-by-Side Expert Refactoring**: Generates fully functional, optimized, and refactored code blocks that developers can inspect, compare, and copy instantly.
- **Deep Code Auditing Grid**:
  - **Logical Bug Detection**: Identifies performance sinkholes, infinite iteration loops, or functional logic gaps.
  - **Static Threat Security Auditing**: Flags SQL injections, command injections, authentication risks, or credentials leakage.
  - **Big-O Complexity Metrics**: Computes exact time/space complex curves under the hood.
  - **Learning Resources**: Suggests direct specifications, documentation topics, and references with brief outlines.
- **Fully Responsive dark-mode layout**: Built with a sleek glassmorphic desktop-grade grid, high-contrast typography, and smooth transitions.
- **Hardware-Accelerated interactive background**: Canvas-driven floating neural structure that reacts dynamically to window resize and mouse gestures.
- **Option for Custom Credentials (Local Storage backed)**: Users can configure their own custom API keys directly in the nav head, falling back securely to the system's sandbox secret payload.

## 📁 Modular Project Structure

```text
├── index.html                   # Core mounting viewport with loaded static fonts
├── server.ts                    # Full-Stack Express and Gemini integration router
├── package.json                 # Dependency manifests with custom tsx/esbuild build engines
├── src/
│   ├── main.tsx                 # Core bundle mount point
│   ├── App.tsx                  # Master responsive SaaS dashboard
│   ├── index.css                # Global styles and custom Tailwind theme settings
│   ├── types.ts                 # Strongly-typed schemas for mentor response payload
│   ├── data/
│   │   └── snippets.ts          # Curated buggy demo cases (JS, Rust, Python, etc.)
│   └── components/
│       ├── HeaderNav.tsx        # Navigation header with api key options
│       ├── ParticlesBackground.tsx # Interactive background canvas
│       ├── MetricCircle.tsx     # Animated SVG progress metrics
│       └── AdvisorPanel.tsx     # Display insights, bug grids, and side-by-side refactoring
```

## 🛠️ Secure full-stack Architecture

Unlike insecure client-side implementations, AI Coding Mentor Pro adopts a robust full-stack architecture keeping API keys hidden from the browser:
1. All client commands are communicated to `/api/analyze` on our Express layer.
2. The server initializes the secure `@google/genai` SDK using `process.env.GEMINI_API_KEY`.
3. Validated JSON Schemas are passed to the Gemini model to safeguard parsing constraints.

---
Built with professional passion for the global software development community.
