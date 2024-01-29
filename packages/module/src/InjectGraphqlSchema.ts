import {Inject} from "@pallad/container";
import {referenceForStack} from "./GraphQLSchemaStackAnnotation";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function InjectGraphqlSchema(stack?: string) {
	return Inject(
		referenceForStack(stack)
	);
}
