{inputs, ...}: {
  imports = [
    ../../modules/base/default.nix
    ../../modules/editor/default.nix
    ../../modules/k3svm/default.nix
    ../../modules/mediastack/default.nix
    ../../modules/proxy/default.nix
    #inputs.self.nixosModules.selfhosted
    ./disko.nix
  ];

  # Base configuration options
  base = {
    enable = true;
    hostname = "singularity";
    username = "Kaushikas2003";
    hashedPassword = "$6$93T3Bmjp7k4pN1SG$PVbieMJwcSx0RlSCc8TSDYhjtAB8D0FXQocGofpVyIgWQLWyhyueow/hOG7ewm5P36eotz0WzCxW6V04KFCuj1";
  };

  # Editor (neovim) configuration
  editor = {
    enable = true;
  };

  # K3s Virtual Machine cluster configuration
  k3svm = {
    enable = false;
    # Network configuration
    tapHost = "enp0s3";

    # VM resource configuration
    numberOfVMs = 3; # Default: 3
    cpusPerVM = 4; # Default: 4
    memoryPerVM = 4096; # Default: 4096 MB
    storagePerVM = 128000; # Default: 25600 MB

    # Tailscale configuration
    tailscale = {
      enable = true; # Enable Tailscale auto-authentication
      authkey = "tskey-auth-knCwkMh1fR11CNTRL-PjwvSQb6k7UeiGd89Cni6URJCRXy9BDFY"; # Your Tailscale auth key
      domain = "tailc3bbb6.ts.net";
    };
    domain = "nanosec.dev";
  };

  # Media stack configuration (arr* applications)
  mediastack = {
    enable = false;
  };

  # Proxy configuration
  proxy = {
    enable = false;
  };

  # Selfhosted stack configuration (commented out in original)
  #selfhosted = {
  #  enable = false;
  #  domain = config.age.secrets.domain.path;
  #  mail.brevo = {
  #    user = config.age.secrets.brevo-user.path;
  #    passwordFile = config.age.secrets.brevo-password.path;
  #  };
  #};
}
