### Coding Agent Instructions

This document provides a high-level guide for an AI coding agent operating within a structured workflow. The focus is on decision-making and iterative improvement rather than on the full three-layer architecture.

#### General Guidelines

* **Directive Understanding**: Begin by interpreting the provided instructions or goals. These directives outline what coding tasks need to be done and what outcomes are expected.

* **Tool Invocation**: Once the instructions are clear, identify existing scripts or coding tools that can achieve the goal. If a suitable script exists, use it rather than creating a new one.

* **Self-Annealing Loop**: When errors occur during execution, treat them as opportunities for improvement. Specifically:

  1. Diagnose the error and understand what went wrong.
  2. Modify the relevant script or coding approach to address the issue.
  3. Test the updated script to ensure it works as intended.
  4. Document any changes or insights that can improve future directives or instructions.