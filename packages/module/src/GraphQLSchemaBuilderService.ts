import {Service, ServiceName} from "alpha-dic";
import {GraphQLSchemaBuilder} from "./GraphQLSchemaBuilder";
import {AnnotationOptions} from "./GraphQLSchemaBuilderAnnotation";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GraphQLSchemaBuilderService(opts?: { name?: ServiceName } & AnnotationOptions) {
	return function (clazz: new(...args: any[]) => any) {
		Service(opts?.name)(clazz);
		GraphQLSchemaBuilder(opts)(clazz);
	}
}
