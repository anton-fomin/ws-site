# The terminal demo

`demo.tape` is a [VHS](https://github.com/charmbracelet/vhs) recording of
`ws init`, `ws fetch`, `ws switch feature/login` opening a tmux session, and
`ws run dev` in both repositories. It renders `public/demo/demo.webm` and the
poster frame `public/demo/poster.png` the Landing page shows until the video
loads. Both are committed; re-record by hand when `ws` changes visibly, roughly
once per release.

`fixture.sh` builds the sample workspace in a temporary directory: two local
bare repositories, `api` and `web`, whose `justfile` `dev` recipes print like
dev servers. Nothing is fetched from the network, and the recording uses its
own tmux server and `ws` config, so nothing of your setup shows.

```
# a ws binary on PATH, e.g. a release build of ../ws
PATH="$PWD/../ws/target/release:$PATH" nix develop -c vhs demo/demo.tape
```

JetBrains Mono (or its Nerd Font build) has to be installed as a system font for the recording.

The README of `ws` shows a short GIF, `docs/demo.gif` in that repository, cut from the WebM
(`ws switch` to `ws run dev`, 10 frames a second, 720 pixels wide, under 200 KB). Re-cut it
whenever the video is re-recorded:

```
ffmpeg -ss 7 -t 9.5 -i public/demo/demo.webm \
  -vf "fps=10,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=48[p];[b][p]paletteuse=dither=none" \
  -loop 0 ../ws/docs/demo.gif
```
