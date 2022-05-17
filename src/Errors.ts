// TODO: think about logging erros, not invoking them
export default class DRErrors {
    static incorrectType(type?: any, message?: string): never {
        throw new Error(
            message ?? `Incorrect type ${type ? '"' + typeof type + '"' : ""} was encountered`,
        );
    }
}
