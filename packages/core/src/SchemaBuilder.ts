import {SchemaComposer} from "graphql-compose";

export interface SchemaBuilder {
    (composer: SchemaComposer<any>): Promise<void> | void;
}