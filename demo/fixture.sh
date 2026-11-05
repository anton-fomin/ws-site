#!/bin/sh
# Builds the sample workspace the demo tape records, under the given directory:
#
#   <dir>/remotes/api.git, web.git   two "remote" repositories, each with a
#                                    justfile whose `dev` recipe prints like a dev server
#   <dir>/acme/                      the empty workspace root the tape starts in
#   <dir>/config.yaml, tmux.conf,    a global ws config, a plain tmux setup and
#   bashrc                           a plain shell prompt,
#                                    so nothing of the recording machine leaks in
#
# No network: the remotes are local bare repositories.
set -eu

dir=${1:?usage: fixture.sh <dir>}
mkdir -p "$dir/remotes" "$dir/acme"

remote() {
	name=$1
	dev=$2
	work="$dir/src/$name"
	git init -q -b main "$work"
	printf '# %s\n' "$name" > "$work/README.md"
	printf 'dev:\n%s\n' "$dev" > "$work/justfile"
	git -C "$work" add .
	git -C "$work" -c user.name=demo -c user.email=demo@example.com commit -q -m "Initial commit"
	git clone -q --bare "$work" "$dir/remotes/$name.git"
}

remote api '    @echo "listening on :8080"
    @sleep 1.2
    @echo "GET /health 200 (2 ms)"
    @sleep 1.5
    @echo "POST /login 200 (41 ms)"
    @sleep 30'

remote web '    @sleep 0.4
    @echo "VITE v7.1.0  ready in 312 ms"
    @echo "  ➜  Local:   http://localhost:5173/"
    @sleep 2.2
    @echo "page reload src/routes/login.svelte"
    @sleep 30'

rm -rf "$dir/src"

# tmux on its own server (WS_TMUX_CMD in the tape), never the multiplexer
# the recording happens to be started from.
cat > "$dir/config.yaml" <<'YAML'
mux:
  backend: tmux
integrations:
  zoxide:
    enabled: false
YAML

cat > "$dir/bashrc" <<'BASH'
PS1='\[\e[1;32m\]\W\[\e[0m\] $ '
BASH

cat > "$dir/tmux.conf" <<TMUX
set -g status-style "bg=#161b22,fg=#e6edf3"
set -g window-status-current-style "bg=#3fb950,fg=#04260f,bold"
set -g status-left "#[fg=#3fb950,bold] #S "
set -g status-left-length 30
set -g status-right ""
# A plain shell rather than your own rc files.
set -g default-command "bash --rcfile $dir/bashrc --noprofile"
TMUX
