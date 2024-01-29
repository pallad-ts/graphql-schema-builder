import {createAnnotationFactory, reference} from "@pallad/container";

export const graphQLSchemaStackAnnotation = createAnnotationFactory(
	'graphql-schema-builder-stack',
	(stack?: string) => ({stack})
);

export function referenceForStack<T extends string>(stack?: T) {
	return reference.annotation(
		graphQLSchemaStackAnnotation
			.andPredicate(
				annotation => annotation.stack === stack
			) as (value: unknown) => value is (GraphQLSchemaStackAnnotation & { stack: T })
	);
}

export type GraphQLSchemaStackAnnotation = ReturnType<typeof graphQLSchemaStackAnnotation>;
