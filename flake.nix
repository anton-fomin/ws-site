{
  description = "ws-site — the website for ws at ws.fomin.space";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAll = f: nixpkgs.lib.genAttrs systems (s: f nixpkgs.legacyPackages.${s});
    in {
      devShells = forAll (pkgs: {
        default = pkgs.mkShell {
          # vhs records the landing page demo; see demo/README.md.
          packages = with pkgs; [ nodejs_22 pnpm git vhs tmux just bashInteractive ];
        };
      });
    };
}
