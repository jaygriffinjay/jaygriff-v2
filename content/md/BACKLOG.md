## Open

- [ ] iOS Safari: bottom margin not responding to media query on real iPhone — `Container.module.css` `@media (max-width: 639px)` not taking effect. Possible causes: CSS cache, `min-h-svh` on SidebarProvider, safe area insets, viewport width mismatch.
- [ ] Sync script: handle rename + content change — currently only detects renames when content hash matches. Add prune step to delete DB rows whose `file_path` no longer exists on disk.

## Done
