import {GraphQLSchemaBuilder} from "@src/GraphQLSchemaBuilder";
import {getDefinitionForClass, reference, Service} from "alpha-dic";
import {annotation} from "@src/annotation";
import {GraphQLSchemaBuilderService} from "@src/GraphQLSchemaBuilderService";
import {InjectGraphqlSchema} from "@src/InjectGraphqlSchema";
import {References} from "@src/References";

describe('decorators', () => {
    describe('GraphQLSchemaBuilder', () => {

        it('default', () => {
            @GraphQLSchemaBuilder()
            @Service()
            class Foo {

            }

            const def = getDefinitionForClass(Foo);

            expect(def.annotations)
                .toEqual([
                    annotation()
                ]);
        })

        it('custom order', () => {
            @GraphQLSchemaBuilder(1)
            @Service()
            class Foo {

            }

            const def = getDefinitionForClass(Foo);

            expect(def.annotations)
                .toEqual([
                    annotation(1)
                ]);
        })
    });

    describe('GraphQLSchemaBuilderService', () => {

        it('default', () => {
            @GraphQLSchemaBuilderService()
            class Foo {

            }

            const def = getDefinitionForClass(Foo);

            expect(def.annotations)
                .toEqual([
                    annotation()
                ]);
        });

        it('custom order', () => {
            @GraphQLSchemaBuilderService({order: 5})
            class Foo {

            }

            const def = getDefinitionForClass(Foo);

            expect(def.annotations)
                .toEqual([
                    annotation(5)
                ]);
        });

        it('custom name', () => {
            const name = 'huehue';

            @GraphQLSchemaBuilderService({name})
            class Foo {

            }

            const def = getDefinitionForClass(Foo);

            expect(def.annotations)
                .toEqual([
                    annotation()
                ]);

            expect(def.name)
                .toEqual(name);
        });
    });

    it('InjectGraphQLSchema', () => {
        @Service()
        class Foo {
            constructor(@InjectGraphqlSchema() readonly schema: any) {
            }
        }

        const def = getDefinitionForClass(Foo);
        expect(def.args)
            .toEqual([
                reference(References.SCHEMA)
            ]);
    });
});