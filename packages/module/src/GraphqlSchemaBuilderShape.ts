import {SchemaComposer} from "@pallad/graphql-schema-builder";

export interface GraphqlSchemaBuilderShape<T extends SchemaComposer<any>> {
	build(schemaComposer: T): Promise<void> | void;
}
