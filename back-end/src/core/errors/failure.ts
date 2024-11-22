export class Failure {
  constructor(public error_code: string, public error_message: string, public status_code: number) {}

  toJsonRes() {
    return {
      error_code: this.error_code,
      error_message: this.error_message,
      status_code: this.status_code,
    };
  }
}
