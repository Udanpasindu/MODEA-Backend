export class AppError extends Error {
    status;
    code;
    issues;
    constructor(status, code, message, issues) {
        super(message);
        this.status = status;
        this.code = code;
        this.issues = issues;
    }
}
