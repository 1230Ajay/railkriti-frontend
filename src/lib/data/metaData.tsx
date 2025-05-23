import { Contact } from "lucide-react";

class BaseMetaData {
  protected pageGroup: string;
  protected favIcon: string = "/favicon.ico";

  constructor(pageGroup: string) {
    this.pageGroup = pageGroup;
  }

  getMetaData() {
    return {
      Dashboard: {
        title: `Dashboard | ${this.pageGroup}`,
        description: "All devices can be monitored from here",
        icons: { icon: this.favIcon },
      },
      Alert: {
        title: `Alert | ${this.pageGroup}`,
        description: "Alerts can be set up by authenticated users",
        icons: { icon: this.favIcon },
      },
      Devices: {
        title: `Devices | ${this.pageGroup}`,
        description: "All WLMS devices can be managed from this page",
        icons: { icon: this.favIcon },
      },
      Report: {
        title: `Report | ${this.pageGroup}`,
        description: "Reports can be generated from here for devices",
        icons: { icon: this.favIcon },
      },
      Contact: {
        title: `Contact | ${this.pageGroup}`,
        description: "User can contact tp team",
        icons: { icon: this.favIcon },
      },
      Log:{
        title: `Log | ${this.pageGroup}`,
        description: "User can contact tp team",
        icons: { icon: this.favIcon },
      }
    };
  }
}

// Extending the BaseMetaData class for specific page groups
export class SaathiMetaData extends BaseMetaData {
  constructor() {
    super("SAATHI");
  }
}

export class RailTaapMetaData extends BaseMetaData {
  constructor() {
    super("RAILTAAP");
  }
}

export class TankWlmsMetaData extends BaseMetaData {
  constructor() {
    super("Tn-WLMS");
  }
}

export class TrackWlmsMetaData extends BaseMetaData {
  constructor() {
    super("Tr-WLMS");
  }
}

export class BrWlmsMetaData extends BaseMetaData {
  constructor() {
    super("Br-WLMS");
  }
}


export class VinimayMetaData extends BaseMetaData {
  constructor() {
    super("Vinimay");
  }
}


export class WindMSMetaData extends BaseMetaData {
  constructor() {
    super("PAWAN SUTRA");
  }
}
