export default class PromiseWithResolvers<T> {
    private _promise: Promise<T>;

    private _resolve!: (value: T) => void;
    get resolve() { return this._resolve }

    private _reject!: (value: T) => void;
    get reject() { return this._reject }

    constructor() {
        this._promise = new Promise((res, rej) => { this._resolve = res; this._reject = rej; });
    }

    // Default promise :)
    then<TResult1 = T, TResult2 = never>(onFulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onRejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2> {
        return this._promise.then(onFulfilled, onRejected);
    }

    catch<TResult = never>(onRejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<T | TResult> {
        return this._promise.catch(onRejected);
    }

    finally(onFinally?: () => void): Promise<T> {
        return this._promise.finally(onFinally);
    }
}