# The Landing page demo. Re-record when ws changes visibly (see demo/README.md):
#
#   nix develop -c vhs demo/demo.tape
#
# Writes public/demo/demo.webm and public/demo/poster.png.

Output public/demo/demo.webm

Require ws
Require tmux
Require just
Require git

Set Shell bash
Set FontFamily "JetBrains Mono, JetBrainsMono Nerd Font Mono, monospace"
Set FontSize 19
Set Width 960
Set Height 600
Set Padding 20
Set TypingSpeed 40ms
Set Theme { "name": "ws", "background": "#010409", "foreground": "#e6edf3", "cursor": "#3fb950", "selection": "#30363d", "black": "#484f58", "red": "#ff7b72", "green": "#3fb950", "yellow": "#d29922", "blue": "#58a6ff", "magenta": "#bc8cff", "cyan": "#39c5cf", "white": "#b1bac4", "brightBlack": "#6e7681", "brightRed": "#ffa198", "brightGreen": "#56d364", "brightYellow": "#e3b341", "brightBlue": "#79c0ff", "brightMagenta": "#d2a8ff", "brightCyan": "#56d4dd", "brightWhite": "#ffffff" }

Hide
# Started from inside tmux or herdr, ws would open the session there instead.
Type `unset TMUX TMUX_PANE HERDR_ENV HERDR_PANE_ID HERDR_SOCKET_PATH HERDR_WORKSPACE_ID HERDR_TAB_ID HERDR_BIN_PATH` Enter
Type `export DEMO=$(mktemp -d /tmp/ws.XXXX) && demo/fixture.sh "$DEMO" && cd "$DEMO/acme"` Enter
Type `export WS_CONFIG="$DEMO/config.yaml" WS_TMUX_CMD="tmux -L ws-demo -f $DEMO/tmux.conf" && source "$DEMO/bashrc" && clear` Enter
Sleep 500ms
Show

Type "ws init --repo ../remotes/api.git --repo ../remotes/web.git"
Sleep 400ms
Enter
Sleep 1.5s

Type "ws fetch"
Sleep 300ms
Enter
Sleep 1.5s

Type "ws switch feature/login"
Sleep 400ms
Enter
Sleep 2.5s

Type "ls"
Sleep 300ms
Enter
Sleep 800ms

Type "ws run dev"
Sleep 300ms
Enter
Sleep 3s
Screenshot public/demo/poster.png
Sleep 2s
Ctrl+C
Sleep 1.5s

Hide
Type `tmux -L ws-demo kill-server` Enter
Sleep 500ms
Type `rm -rf "$DEMO"` Enter
