import {SchemaComposer} from "@pallad/graphql-schema-builder";

export interface GraphqlSchemaBuilderShape {
    build(schemaComposer: SchemaComposer<any>): Promise<void> | void;
}