import {Module as _Module, StandardActions} from '@pallad/modules';
import {Container} from "alpha-dic";
import {References} from "./References";
import {buildSchema, SchemaBuilder, SchemaComposer} from "@pallad/graphql-schema-builder";
import {annotation, Annotation} from "./annotation";
import * as is from 'predicates';
import {TypeRef} from "alpha-dic/compiled/TypeRef";
import {GraphqlSchemaBuilderShape} from "./GraphqlSchemaBuilderShape";


const isBuilderShape = is.struct({
    build: is.func
});

function hasBuilderShape(value: any): value is GraphqlSchemaBuilderShape {
    return isBuilderShape(value);
}

export class Module extends _Module<{ container: Container }> {
    constructor(private schemaComposer?: SchemaComposer<any>) {
        super('@pallad/graphql-schema-builder-module');
    }

    init() {
        this.registerAction(StandardActions.INITIALIZATION, ({container}) => {
            let typeRef = TypeRef.createFromType(SchemaComposer)!;
            if (this.schemaComposer) {
                const typeRefFromValue = TypeRef.createFromValue(this.schemaComposer);
                if (typeRefFromValue) {
                    typeRef = typeRefFromValue;
                }
            }

            container.definitionWithFactory(References.SCHEMA, async () => {
                const buildersWithAnnotations: Array<[SchemaBuilder | GraphqlSchemaBuilderShape, Annotation]> = await container.getByAnnotation(annotation.predicate, true);
                const builders = buildersWithAnnotations.sort(([, ann1], [, ann2]) => {
                    return ann1.order - ann2.order;
                })
                    .map(([builder]) => {
                        if (is.func(builder)) {
                            return builder;
                        }

                        if (hasBuilderShape(builder)) {
                            return builder.build.bind(builder);
                        }

                        throw new Error('One of Graphql schema builders is not a function or has a shape for GraphqlSchemaBuilderShape');
                    });
                return buildSchema(builders, this.schemaComposer);
            })
                .markType(typeRef);
        });
    }
}