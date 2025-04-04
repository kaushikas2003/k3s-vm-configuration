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
    hostname = "citadel";
    username = "Kaushikas2003";
    hashedPassword = "";
  };
  # Sets up nixvim
  editor.enable = true;
}
