# Design sources

`og.svg` is the social preview image. Render it to `public/og.png` after a change:

```
fonts="$(nix build --no-link --print-out-paths nixpkgs#jetbrains-mono)/share/fonts"
nix shell nixpkgs#resvg -c resvg --skip-system-fonts --use-fonts-dir "$fonts" design/og.svg public/og.png
```
