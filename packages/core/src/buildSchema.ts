import {SchemaBuilder} from "./SchemaBuilder";
import {SchemaComposer} from "graphql-compose";

export async function buildSchema<T extends SchemaComposer<any>>(builders: Iterable<SchemaBuilder<T>>, composer?: T) {
	const finalComposer = composer ?? new SchemaComposer() as T;

	for (const builder of builders) {
		await builder(finalComposer);
	}

	return finalComposer;
}
