export default class DRErrors {
    static incorrectType(message?: string): never {
        throw new Error(message ?? "Incorrect type was encountered");
    }
}
