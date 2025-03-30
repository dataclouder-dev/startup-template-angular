/**
 * Types for Live2D model parameters and parts
 */

/**
 * Interface representing the parameters of a Live2D model
 */
export interface ModelParameters {
  /** Total number of parameters */
  count: number;
  /** Array of parameter IDs */
  ids: string[];
  /** Array of minimum values for each parameter */
  minimumValues: number[];
  /** Array of maximum values for each parameter */
  maximumValues: number[];
  /** Array of default values for each parameter */
  defaultValues: number[];
  /** Array of current values for each parameter */
  currentValues: number[];
}

/**
 * Interface representing the parts of a Live2D model
 */
export interface ModelParts {
  /** Total number of parts */
  count: number;
  /** Array of part IDs */
  ids: string[];
  /** Array of opacity values for each part */
  opacities: number[];
  /** Array of parent indices for each part */
  parentIndices: number[];
}
