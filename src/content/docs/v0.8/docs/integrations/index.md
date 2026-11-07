---
title: Integrations
editUrl: https://github.com/anton-fomin/ws/edit/main/docs/integrations/index.md
slug: v0.8/docs/integrations
---

`git` is the only thing `ws` needs. Everything else it drives is an
integration: each one comes into play when its program is on `PATH` and is
left out otherwise, and none of them can fail a switch — a problem is a
warning. `ws` shells out rather than linking libraries — the Nix closure is
just glibc, and the musl build links nothing at all — so these are the
programs it looks for:

| | |
|---|---|
| `tmux` or `herdr` | the session over the branch directory, see [Multiplexers](multiplexers/); without either, `ws` prints the branch directory |
| `fzf` | the picker of `ws pick`, see [fzf and zoxide](fzf-zoxide/) |
| `zoxide` | directory registration and `ws pick --global` |
| `yarn`, `pnpm`, `npm`, `uv` | [package manager](package-managers/) installs, and package.json [tasks](../tasks/) |
| `just`, `task` | the task sources of [`ws run`](../tasks/) |

[Local files](local-files/) need no program, only a directory. `ws status`
lists which integrations are active on this machine.
