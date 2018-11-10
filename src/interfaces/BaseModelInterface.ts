import { ModelsInterface } from "./ModelsInterface";

export interface BaseModelInterface {
  prototype?;
  associateModel?(models: ModelsInterface): void;
}
