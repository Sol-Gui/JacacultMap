{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_22
  ];

  shellHook = ''
    export npm_config_cache="$PWD/.npm-cache"
    mkdir -p "$npm_config_cache"

    echo "JacacultMap-Backend development shell"
    echo "Node: $(node --version)"
    echo "npm:  $(npm --version)"
    echo ""
    echo "Run: npm ci"
    echo "Run: npm start"
    echo "Run: npm run dev"
  '';
}
