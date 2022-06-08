import {createAnnotationFactory} from "alpha-dic";

export interface AnnotationOptions {
	stack?: string | string[],
	order?: number
}

export const graphQLSchemaBuilderAnnotation = createAnnotationFactory(
	'graphql-schema-builder',
	(options?: AnnotationOptions) => {
		return {
			order: options?.order ?? 10,
			stack: options?.stack ? (Array.isArray(options.stack) ? options.stack : [options.stack]) : undefined
		}
	});

export type GraphQLSchemaBuilderAnnotation = ReturnType<typeof graphQLSchemaBuilderAnnotation>;
