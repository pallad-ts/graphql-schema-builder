import {SchemaComposer} from "graphql-compose";

export interface SchemaBuilder<T extends SchemaComposer<any>> {
	(composer: T): Promise<void> | void;
}
