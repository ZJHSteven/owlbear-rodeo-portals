import OBR, {Theme} from "@owlbear-rodeo/sdk";

export type OBR = Omit<typeof OBR, "theme"> & { theme: Theme };
