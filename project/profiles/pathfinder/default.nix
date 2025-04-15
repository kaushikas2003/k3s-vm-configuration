{inputs, ...}: {
  # You can import other NixOS modules here
  imports = [
    inputs.self.nixosModules.base
    inputs.self.nixosModules.editor

    ./disko.nix
  ];

  # Sets up sane defaults.
  base = {
    enable = true;
    hostname = "pathfinder";
    username = "";
    hashedPassword = "";
  };
  editor = {
    enable = true;
  };
}
