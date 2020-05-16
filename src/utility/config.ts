import {merge, over} from "lodash-es";
import {useState, useEffect} from "react";

export default class config<T> {
    default : T;
    user : T;
    override : T;
    final = () : T => {
        return merge({}, this.default, this.user, this.override);
    };
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