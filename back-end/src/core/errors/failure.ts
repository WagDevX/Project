export class Failure {
  error_code: string;
  error_description: string;
  status_code: number;

  constructor({
    error_code,
    error_description,
    status_code,
  }: {
    error_code: string;
    error_description: string;
    status_code: number;
  }) {
    this.error_code = error_code;
    this.error_description = error_description;
    this.status_code = status_code;
  }

  toJsonRes() {
    return {
      error_code: this.error_code,
      error_description: this.error_description,
    };
  }
}
