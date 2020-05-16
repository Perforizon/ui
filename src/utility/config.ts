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
export class configRef<T> {
  
    private _default : MutableRefObject<T>;
    private _user : MutableRefObject<T>;
    private _override : MutableRefObject<T>;
    private _final : MutableRefObject<T>;
    constructor() {
        this._default = useRef<T>();
        this._user = useRef<T>();
        this._override = useRef<T>();
        this._final = useRef<T>();
    }
    finalize = () => {
        this._final.current = merge({}, this.default, this.user, this.override);
    }
    get default() {return this._default.current}
    get user() {return this._user.current}
    get override() {return this._default.current}
    get final() {return this._final.current}
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