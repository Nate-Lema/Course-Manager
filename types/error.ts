export class ErrorWithStatus extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.status = status;
  }
}
