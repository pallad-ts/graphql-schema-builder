import { GraphQLSchemaBuilder } from "@src/GraphQLSchemaBuilder";
import { Service } from "@pallad/container";
import { GraphQLSchemaBuilderService } from "@src/GraphQLSchemaBuilderService";
import { graphQLSchemaBuilderAnnotation } from "@src/GraphQLSchemaBuilderAnnotation";
import { Definition } from "@pallad/container/compiled/Definition";

describe("decorators", () => {
	describe("GraphQLSchemaBuilder", () => {
		it("default", () => {
			@GraphQLSchemaBuilder()
			@Service()
			class Foo {}

			const def = Definition.fromClassWithDecorator(Foo);

			expect(def.annotations).toEqual([graphQLSchemaBuilderAnnotation()]);
		});

		it("custom order", () => {
			@GraphQLSchemaBuilder({ order: 1 })
			@Service()
			class Foo {}

			const def = Definition.fromClassWithDecorator(Foo);

			expect(def.annotations).toEqual([
				graphQLSchemaBuilderAnnotation({ order: 1 }),
			]);
		});

		it("with stack name", () => {
			@GraphQLSchemaBuilder({ order: 1, stack: "foo" })
			@Service()
			class Foo {}

			const def = Definition.fromClassWithDecorator(Foo);

			expect(def.annotations).toEqual([
				graphQLSchemaBuilderAnnotation({ order: 1, stack: "foo" }),
			]);
		});

		it("with stack names", () => {
			@GraphQLSchemaBuilder({ order: 1, stack: ["foo", "bar"] })
			@Service()
			class Foo {}

			const def = Definition.fromClassWithDecorator(Foo);

			expect(def.annotations).toEqual([
				graphQLSchemaBuilderAnnotation({
					order: 1,
					stack: ["foo", "bar"],
				}),
			]);
		});
	});

	describe("GraphQLSchemaBuilderService", () => {
		it("default", () => {
			@GraphQLSchemaBuilderService()
			class Foo {}

			const def = Definition.fromClassWithDecorator(Foo);

			expect(def.annotations).toEqual([graphQLSchemaBuilderAnnotation()]);
		});

		it("custom order", () => {
			@GraphQLSchemaBuilderService({ order: 5 })
			class Foo {}

			const def = Definition.fromClassWithDecorator(Foo);

			expect(def.annotations).toEqual([
				graphQLSchemaBuilderAnnotation({ order: 5 }),
			]);
		});

		it("custom name", () => {
			const name = "huehue";

			@GraphQLSchemaBuilderService({ name })
			class Foo {}

			const def = Definition.fromClassWithDecorator(Foo);

			expect(def.annotations).toEqual([graphQLSchemaBuilderAnnotation()]);

			expect(def.name).toEqual(name);
		});
	});
});
