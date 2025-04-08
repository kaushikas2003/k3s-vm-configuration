{
  disko.devices = {
    nodev."/" = {
      fsType = "tmpfs";
      mountOptions = [ "defaults" "size=16G" "mode=755" ];
    };
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
          nix = {
            size = "100%";
            name = "nix";
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
                "/data" = {
                  mountpoint = "/data";
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
    disk.media = {
      device = "/dev/disk/by-id/ata-VBOX_HARDDISK_VB66928c71-7100f75f";
      type = "disk";
      content = {
        type = "gpt";
        partitions = {
          media = {
            size = "100%";
            name = "media";
            content = {
              type = "filesystem";
              format = "ext4";
              mountpoint = "/media";
              mountOptions = [
                "noatime"
                "nodiratime"
                "discard"
              ];
            };
          };
        };
      };
    };
  };
}
