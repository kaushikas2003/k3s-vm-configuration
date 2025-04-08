{
  description = "My NixOS Project";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    agenix = {
      url = "github:ryantm/agenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    disko = {
      url = "github:nix-community/disko";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    impermanence.url = "github:nix-community/impermanence";
    lanzaboote = {
      url = "github:nix-community/lanzaboote";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    microvm = {
      url = "github:astro/microvm.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixvim = {
      url = "github:nix-community/nixvim";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs = inputs@{ self, nixpkgs, ... }: let
    systems = [ "x86_64-linux" ];
    forAllSystems = nixpkgs.lib.genAttrs systems;
    nixosSystem = hostname: nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = { inherit inputs; };
      modules = [
        ./profiles/${hostname}
        # Optional: enable experimental features globally
        # { nix.settings.experimental-features = [ "nix-command" "flakes" ]; }
      ];
    };
  in {
    packages = forAllSystems (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        packageSet = if builtins.pathExists ./pkgs then
          import ./pkgs pkgs
        else
          {};
      in packageSet // {
        # Add a default package
        default = pkgs.writeShellScriptBin "k3s-vm-config" ''
          echo "K3s VM Configuration Tool"
          echo "Available configurations:"
          echo " - singularity"
          echo " - pathfinder"
          echo " - citadel"
          echo ""
          echo "Use: nixos-rebuild switch --flake .#<config-name>"
        '';
      }
    );
    formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.alejandra);
    overlays = if builtins.pathExists ./overlays then import ./overlays { inherit inputs; } else {};
    nixosModules = import ./modules;
    nixosConfigurations = {
      citadel = nixosSystem "citadel";
      pathfinder = nixosSystem "pathfinder";
      singularity = nixosSystem "singularity";
    };
    diskoConfigurations = {
      singularity = inputs.disko.lib.mkFlake {
        inherit inputs;
        system = "x86_64-linux";
        configuration = ./profiles/singularity/disko.nix;
      };
      pathfinder = inputs.disko.lib.mkFlake {
        inherit inputs;
        system = "x86_64-linux";
        configuration = ./profiles/pathfinder/disko.nix;
      };
      pushover = inputs.disko.lib.mkFlake {
        inherit inputs;
        system = "x86_64-linux";
        configuration = ./profiles/pushover/disko.nix;
      };
    };
    # You can also add a default app
    apps = forAllSystems (system: {
      default = {
        type = "app";
        program = "${self.packages.${system}.default}/bin/k3s-vm-config";
      };
    });
  };
}
