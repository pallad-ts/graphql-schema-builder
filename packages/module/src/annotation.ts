import {createAnnotationFactory} from "alpha-dic";

export const annotation = createAnnotationFactory('graphql-schema-builder', (order?: number) => ({order: order ?? 10}));

export type Annotation = ReturnType<typeof annotation>;