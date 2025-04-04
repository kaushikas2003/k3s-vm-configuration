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
    hostname = "pushover";
    username = "Kaushikas2003";
    hashedPassword = "$6$93T3Bmjp7k4pN1SG$PVbieMJwcSx0RlSCc8TSDYhjtAB8D0FXQocGofpVyIgWQLWyhyueow/hOG7ewm5P36eotz0WzCxW6V04KFCuj1";
  };
  editor = {
    enable = true;
  };
  virtualisation.virtualbox.guest.enable = true;
}
