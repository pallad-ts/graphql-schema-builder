import {SchemaBuilder} from "./SchemaBuilder";
import {SchemaComposer} from "graphql-compose";

export async function buildSchema(builders: SchemaBuilder[], composer?: SchemaComposer<any>) {
    const finalComposer = composer ?? new SchemaComposer();

    for (const builder of builders) {
        await builder(finalComposer);
    }

    return finalComposer;
}