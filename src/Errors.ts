// TODO: think about logging erros, not invoking them
export default class DRErrors {
    static incorrectType(type?: any, message?: string): never {
        throw new Error(
            message ?? `Incorrect type ${type ? '"' + typeof type + '"' : ""} was encountered`,
        );
    }

    static unexpectedUndefined(name?: string, message?: string): never {
        throw new Error(message ?? `Unexpected undefined ${name ?? ""} appeared`);
    }

    static unexpectedBehaviour(name?: string, message?: string) {
        throw new Error(message ?? `Unexpected behaviour while running ${name ?? ""}`);
    }
}
