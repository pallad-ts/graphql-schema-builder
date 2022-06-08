import {createAnnotationFactory, reference} from "alpha-dic";

export const graphQLSchemaStackAnnotation = createAnnotationFactory(
	'graphql-schema-builder-stack',
	(stack?: string) => ({stack})
);

export function referenceForStack(stack?: string) {
	return reference.annotation(
		graphQLSchemaStackAnnotation
			.andPredicate(
				annotation => annotation.stack === stack
			)
	);
}

export type GraphQLSchemaStackAnnotation = ReturnType<typeof graphQLSchemaStackAnnotation>;
