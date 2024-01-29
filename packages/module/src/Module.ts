import { Module as _Module, StandardActions } from "@pallad/modules";
import { Container, Definition } from "@pallad/container";
import {
	buildSchema,
	SchemaBuilder,
	SchemaComposer,
} from "@pallad/graphql-schema-builder";
import * as is from "predicates";
import { GraphqlSchemaBuilderShape } from "./GraphqlSchemaBuilderShape";
import {
	graphQLSchemaStackAnnotation,
	referenceForStack,
} from "./GraphQLSchemaStackAnnotation";
import {
	graphQLSchemaBuilderAnnotation,
	GraphQLSchemaBuilderAnnotation,
} from "./GraphQLSchemaBuilderAnnotation";

const isBuilderShape = is.struct({
	build: is.func,
});

function hasBuilderShape(value: any): value is GraphqlSchemaBuilderShape<any> {
	return isBuilderShape(value);
}

function getSchemaBuilderAnnotationPredicateForStack(stack?: string) {
	if (stack) {
		return graphQLSchemaBuilderAnnotation.andPredicate(
			(x: GraphQLSchemaBuilderAnnotation) => {
				return (
					(!!x.stack && x.stack.includes(stack)) ||
					x.stack === undefined
				);
			},
		) as (
			value: unknown,
		) => value is GraphQLSchemaBuilderAnnotation & { stack: string };
	}
	return graphQLSchemaBuilderAnnotation.predicate;
}

export class Module extends _Module<{ container: Container }> {
	constructor(private options?: Module.Options) {
		super("@pallad/graphql-schema-builder-module");
	}

	#getDefinitionForStack(container: Container, stack: string | undefined) {
		return Definition.useFactory(async () => {
			const buildersAnnotationPredicate =
				getSchemaBuilderAnnotationPredicateForStack(stack);
			const buildersWithAnnotations: Array<
				[
					SchemaBuilder<any> | GraphqlSchemaBuilderShape<any>,
					GraphQLSchemaBuilderAnnotation,
				]
			> = await container.resolveByAnnotation(
				buildersAnnotationPredicate,
			);
			const builders = buildersWithAnnotations
				.sort(([, ann1], [, ann2]) => {
					return ann1.order - ann2.order;
				})
				.map(([builder]) => {
					if (is.func(builder)) {
						return builder;
					}

					if (hasBuilderShape(builder)) {
						return builder.build.bind(builder);
					}

					throw new Error(
						"One of Graphql schema builders is not a function or has a shape for GraphqlSchemaBuilderShape",
					);
				});
			return buildSchema(
				builders,
				this.options?.baseSchemaComposer || new SchemaComposer(),
			);
		}).annotate(graphQLSchemaStackAnnotation(stack));
	}

	init() {
		this.registerAction(StandardActions.INITIALIZATION, ({ container }) => {
			const stacks = this.getStacksToInitialize();

			for (const stack of stacks) {
				container.registerDefinition(
					this.#getDefinitionForStack(container, stack),
				);
			}
		});
	}

	private getStacksToInitialize(): Array<string | undefined> {
		if (this.options?.stacks) {
			return this.options.stacks;
		}

		return [undefined];
	}

	static getSchemaForStack(container: Container, stack?: string) {
		const reference = referenceForStack(stack);
		return reference.resolve(container);
	}
}

export namespace Module {
	export interface Options {
		baseSchemaComposer?: SchemaComposer<any>;
		stacks?: string[];
	}
}
