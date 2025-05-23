{
  disko.devices = {
    disk.main = {
      device = "/dev/disk/by-id/ata-VBOX_HARDDISK_VB66928c71-7100f75f";
      type = "disk";
      content = {
        type = "gpt";
        partitions = {
          ESP = {
            name = "ESP";
            size = "256M";
            type = "EF00";
            content = {
              type = "filesystem";
              format = "vfat";
              mountpoint = "/boot";
            };
          };
          luks = {
            size = "100%";
            content = {
              type = "luks";
              name = "eins";
              settings.allowDiscards = true;
              content = {
                type = "btrfs";
                extraArgs = ["-f"];
                subvolumes = {
                  "/nix" = {
                    mountpoint = "/nix";
                    mountOptions = [
                      "noatime"
                      "nodiratime"
                      "compress=zstd"
                      "ssd"
                    ];
                  };
                  "/persist" = {
                    mountpoint = "/persist";
                    mountOptions = [
                      "noatime"
                      "nodiratime"
                      "compress=zstd"
                      "ssd"
                    ];
                  };
                  "/root" = {
                    mountpoint = "/";
                    mountOptions = [
                      "noatime"
                      "nodiratime"
                      "compress=zstd"
                      "ssd"
                    ];
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}
