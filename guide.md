You are an AI assistant.

Your responsibility is to **always generate clean, reusable, scalable, and maintainable code** that strictly follows the project structure, conventions, and best practices defined below.

---

## 🏗️ PROJECT OVERVIEW

- **Framework**: Angular (modern, standalone components)
- **Language**: TypeScript (strict mode)
- **Architecture**: Feature-based, scalable, modular
- **Styling**: Tailwind CSS + Design Tokens (theme variables)
- **State Management**: Signals (Angular Signals)
- **Routing**: Angular Router with Guards
- **HTTP**: HttpClient + Interceptors
- **Auth**: Session-based / Token-based (extensible)
- **Goal**: Easy to scale, easy to maintain, easy to onboard new developers

---

## Static data using as JSON and fetching with http

## 📁 PROJECT STRUCTURE (MANDATORY)

Always follow this structure unless explicitly told otherwise:

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── core.module.ts (if needed)
│
│   ├── shared/
│   │   ├── components/
│   │   │   ├── button/
│   │   │   ├── input-field/
│   │   │   └── modal/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── shared.module.ts (optional)
│
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.routes.ts
│   │   ├── dashboard/
│   │   └── profile/
│
│   ├── app.routes.ts
│   └── app.component.ts
│
├── environment/
│   ├── environment.dev.ts
│   └── environment.prod.ts
│
├── assets/
│   └── fonts/
│
└── styles/
    ├── theme.css
    └── globals.css
```

---

## 🧩 COMPONENT RULES

When generating components:

- Use **standalone components**
- Use **`input()` and `signal()`**, not `@Input()`
- Components must be:

  - Dumb / presentational **unless stated otherwise**
  - Reusable
  - Style-agnostic where possible

### ✅ Example Pattern

```ts
readonly isLoading = input<boolean>(false);
readonly value = input<string>('');
```

❌ Never tightly couple components to business logic.

---

## 🔐 AUTHENTICATION & GUARDS

- Authentication state must be:

  - Stored in `sessionStorage` (or configurable)
  - Exposed via **Angular signals**

- Guards must:

  - Use `UrlTree`, not `navigate()`
  - Redirect unauthenticated users to `/login`

### Guard Rule

```ts
return isAuthenticated ? true : router.createUrlTree(["/login"]);
```

---

## 🌐 SERVICES RULES

All services must:

- Be `@Injectable({ providedIn: 'root' })`
- Handle:

  - Errors gracefully
  - Side effects in `tap`

- Never manipulate UI directly
- Expose **Observable APIs**

---

## 🎨 STYLING & UI SYSTEM

- Use Tailwind utility classes
- Use **design tokens** from `theme.css`
- Never hardcode colors if a token exists
- UI must be:

  - Accessible
  - Responsive
  - Mobile-first

Example token usage:

```css
--color-brand: #0e613d;
--color-brand-strong: #0a4b2f;
```

---

## ♻️ REUSABILITY FIRST

Before writing new code, always ask:

1. Can this be a shared component?
2. Can this logic live in a service?
3. Can this be abstracted for reuse?

❗ Duplication is considered a bug.

---

## 📈 SCALABILITY PRINCIPLES

All generated code must:

- Support future features
- Avoid tight coupling
- Use clear naming
- Be easy to refactor
- Be readable by a mid-level developer

Assume:

- The project will grow to **100+ components**
- Multiple developers will work on it

---

## 🧠 AI BEHAVIOR RULES (VERY IMPORTANT)

<!-- - Always explain **why** a solution is chosen -->

- Always prefer **best practices**
<!-- - Always assume **production environment** -->
- Never generate quick hacks
- Never break existing structure
- Always remind yourself:

  > "This is a reusable, scalable SaaS project"

If something is unclear, ask **one clear clarification question**.

---

## ✅ OUTPUT EXPECTATION

Your output should be:

- Clean
- Structured
- Well-commented (when necessary)
- Ready to copy-paste into the project
- Aligned with this document at all times

Failure to follow this guide is considered an incorrect solution.
