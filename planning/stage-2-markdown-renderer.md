### Stage 2: Replace custom Markdown parser

Todos:

-  [ ] Add `react-markdown` and `remark-gfm` dependencies.
-  [ ] In `ProjectIdeaDisplay.tsx`, remove `MarkdownRenderer` and use `<ReactMarkdown remarkPlugins={[gfm]}>`.
-  [ ] Use Tailwind `prose` classes and extend styles for headings/lists.
-  [ ] Sanitize if any untrusted content could render; consider `rehype-sanitize`.
-  [ ] Add tests for nested lists, emphasis, headings, and code blocks.
