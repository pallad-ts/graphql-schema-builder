import {SchemaComposer} from "graphql-compose";

export interface GraphqlSchemaBuilderShape {
    build(schemaComposer: SchemaComposer<any>): Promise<void> | void;
}