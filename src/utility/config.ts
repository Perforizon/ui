import {merge} from "lodash-es";
import {useState, useRef, MutableRefObject} from "react";


export default class config<T> {
    default : T;
    user : T;
    override : T;
    final : T;
    finalize = () : T => {
        this.final = merge({}, this.default, this.user, this.override);
        return this.final;
    };
}
export class MutableConfigRef<T> {
    private _current : MutableRefObject<T>;
    constructor() {
        this._current = useRef<T>();
    }
    merge(val : T)
    {
        merge({}, this._current.current, val);
    }
    get current() {
        return this._current.current;
    }
    set current(value : T) {
        this._current.current = value;
    }
}
export function useConfigRef<T>() {
    return new MutableConfigRef<T>();
}
export class configPrimitive<T> {
    default : T;
    user : T;
    override : T;
    final = () : T => {
        if (this.override != undefined)
            return this.override;
        else if (this.user != undefined)
            return this.user;
        else    
            return this.default;
    };
    useFinal = () => {
        return useState<T>(this.final());
    }
}