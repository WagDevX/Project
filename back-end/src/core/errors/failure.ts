export class Failure {
  error_code: string;
  error_message: string;
  status_code: number;

  constructor({ error_code, error_message, status_code }: { error_code: string; error_message: string; status_code: number }) {
    this.error_code = error_code;
    this.error_message = error_message;
    this.status_code = status_code;
  }

  toJsonRes() {
    return {
      error_code: this.error_code,
      error_message: this.error_message,
    };
  }
}
