import {Service, ServiceName} from "alpha-dic";
import {GraphQLSchemaBuilder} from "./GraphQLSchemaBuilder";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GraphQLSchemaBuilderService(opts?: { order?: number, name?: ServiceName }) {
	return function (clazz: new(...args: any[]) => any) {
		Service(opts?.name)(clazz);
		GraphQLSchemaBuilder(opts?.order)(clazz);
	}
}
