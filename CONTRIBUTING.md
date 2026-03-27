# Adding a new module

All module definitions live in a single file: `src/modules.ts`. To add a new module:

1. **Open `src/modules.ts`** and add a new entry to the `modules` array.

2. **Fill in every field:**

   | Field | Type | Notes |
   |-------|------|-------|
   | `id` | `string` | Unique kebab-case identifier (e.g. `"lsp-mode"`) |
   | `label` | `string` | Short human-readable name shown in the UI |
   | `description` | `string` | One or two sentences explaining what the module does |
   | `required` | `boolean` | Set `true` only for modules that every user needs |
   | `dependsOn` | `string?` | ID of a module that must also be enabled |
   | `order` | `number` | Integer controlling output order in `init.el` — pick a unique value |
   | `elisp` | `string` | The actual Emacs Lisp code, as a template literal |

3. **Write production-quality elisp.** Include brief comments explaining what each setting does. Use `use-package` for external packages. Assume the `use-package` and `basics` modules are always present.

4. **Set the `order` field carefully.** Lower numbers appear earlier in the generated file. Modules that depend on others should have a higher order number than their dependency.

5. **If your module depends on another**, set `dependsOn` to that module's `id`. The generator will automatically enable the parent when a user enables your module.

6. **Run the tests** to make sure dependency resolution and output ordering still work:

   ```bash
   npm test
   ```

7. **Check the preview** by running `npm run dev` and toggling your new module.

That's it — the UI picks up the new module automatically.
