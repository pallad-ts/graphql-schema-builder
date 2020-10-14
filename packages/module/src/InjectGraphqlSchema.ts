import {Inject, reference} from "alpha-dic";
import {References} from "./References";

export function InjectGraphqlSchema() {
    return Inject(reference(References.SCHEMA));
}