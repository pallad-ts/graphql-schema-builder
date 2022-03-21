import {Inject, reference} from "alpha-dic";
import {References} from "./References";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function InjectGraphqlSchema() {
	return Inject(reference(References.SCHEMA));
}
