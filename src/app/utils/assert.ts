export class AssertException extends Error {
    constructor(message = 'Assertion failed') {
        super(message);
        this.name = 'AssertException';
    }
}

export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new AssertException(message);
    }
}
