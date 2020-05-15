import {merge} from "lodash";
import {useState, useEffect} from "react";

export default class config<T> {
    default : T;
    user : T;
    override : T;
    final = () : T => {
        return merge({}, this.default, this.user, this.override);
    };
}