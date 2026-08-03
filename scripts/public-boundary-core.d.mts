export interface PublicBoundaryFinding {
  readonly file: string;
  readonly rule: string;
  readonly detail: string;
}

export function validatePublicBoundary(rootDirectory: string): PublicBoundaryFinding[];
