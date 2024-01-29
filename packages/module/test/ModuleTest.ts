import { Engine, StandardActions } from "@pallad/modules";
import { Container, Definition } from "@pallad/container";
import { Module } from "@src/Module";
import * as sinon from "sinon";
import { SchemaComposer } from "@pallad/graphql-schema-builder";
import { graphQLSchemaBuilderAnnotation } from "@src/GraphQLSchemaBuilderAnnotation";

describe("Module", () => {
	let schemaBuilder1: sinon.SinonStub;
	let schemaBuilder2: { build: sinon.SinonStub };
	let schemaBuilder3: sinon.SinonStub;
	let container: Container;
	let engine: Engine<{ container: Container }>;

	beforeEach(() => {
		container = new Container();
		engine = new Engine({ container });
		schemaBuilder1 = sinon.stub();
		schemaBuilder2 = {
			build: sinon.stub(),
		};

		schemaBuilder3 = sinon.stub();

		container.registerDefinition(
			Definition.useValue(schemaBuilder1).annotate(
				graphQLSchemaBuilderAnnotation({ order: 100 }),
			),
		);

		container.registerDefinition(
			Definition.useValue(schemaBuilder2).annotate(
				graphQLSchemaBuilderAnnotation(),
			),
		);

		container.registerDefinition(
			Definition.useValue(schemaBuilder3).annotate(
				graphQLSchemaBuilderAnnotation({ order: -10 }),
			),
		);
	});

	it("basic test", async () => {
		engine.registerModule(new Module());
		await engine.runAction(StandardActions.INITIALIZATION);
		const result = await Module.getSchemaForStack(container);

		const schemaComposerMatch = sinon.match.instanceOf(SchemaComposer);
		sinon.assert.calledWithMatch(schemaBuilder1, schemaComposerMatch);

		sinon.assert.calledWithMatch(schemaBuilder2.build, schemaComposerMatch);

		sinon.assert.calledWithMatch(schemaBuilder3, schemaComposerMatch);

		sinon.assert.callOrder(
			schemaBuilder3,
			schemaBuilder2.build,
			schemaBuilder1,
		);

		expect(result).toBeInstanceOf(SchemaComposer);
	});

	it("custom schema composer", async () => {
		const composer = new SchemaComposer();
		engine.registerModule(
			new Module({
				baseSchemaComposer: composer,
			}),
		);
		await engine.runAction(StandardActions.INITIALIZATION);
		const result = await Module.getSchemaForStack(container);

		sinon.assert.calledWithExactly(schemaBuilder1, composer);

		sinon.assert.calledWithExactly(schemaBuilder2.build, composer);

		sinon.assert.calledWithExactly(schemaBuilder3, composer);

		sinon.assert.callOrder(
			schemaBuilder3,
			schemaBuilder2.build,
			schemaBuilder1,
		);

		expect(result).toStrictEqual(composer);
	});

	it("throws error if once of schema builder is not a function or has a shape of builder", async () => {
		container.registerDefinition(
			Definition.useValue({ foo: "bar" }).annotate(
				graphQLSchemaBuilderAnnotation(),
			),
		);

		engine.registerModule(new Module());
		await engine.runAction(StandardActions.INITIALIZATION);

		return expect(
			Module.getSchemaForStack(container),
		).rejects.toThrowErrorMatchingSnapshot();
	});

	it("creates definitions for only defined stacks", async () => {
		engine.registerModule(
			new Module({
				stacks: ["foo", "bar"],
			}),
		);
		await engine.runAction(StandardActions.INITIALIZATION);

		await expect(
			Module.getSchemaForStack(container, "foo"),
		).resolves.toBeTruthy();

		await expect(
			Module.getSchemaForStack(container, "bar"),
		).resolves.toBeTruthy();

		expect(() => {
			Module.getSchemaForStack(container, "zee");
		}).toThrowErrorMatchingSnapshot();
	});

	it("takes only schema builders that are suitable for given stack", async () => {
		engine.registerModule(
			new Module({
				stacks: ["foo", "bar"],
			}),
		);
		const schemaBuilder1 = sinon.stub();
		container.registerDefinition(
			Definition.useValue(schemaBuilder1).annotate(
				graphQLSchemaBuilderAnnotation({ stack: "zee" }),
			),
		);

		const schemaBuilder2 = sinon.stub();
		container.registerDefinition(
			Definition.useValue(schemaBuilder2).annotate(
				graphQLSchemaBuilderAnnotation({ stack: "foo" }),
			),
		);

		const schemaBuilder3 = sinon.stub();
		container.registerDefinition(
			Definition.useValue(schemaBuilder3).annotate(
				graphQLSchemaBuilderAnnotation({ stack: "foo" }),
			),
		);

		const allSchemaBuilder = sinon.stub();
		container.registerDefinition(
			Definition.useValue(allSchemaBuilder).annotate(
				graphQLSchemaBuilderAnnotation(),
			),
		);

		await engine.runAction(StandardActions.INITIALIZATION);

		await expect(
			Module.getSchemaForStack(container, "foo"),
		).resolves.toBeTruthy();

		sinon.assert.notCalled(schemaBuilder1);
		sinon.assert.calledOnce(schemaBuilder2);
		sinon.assert.calledOnce(schemaBuilder3);
		sinon.assert.calledOnce(allSchemaBuilder);
	});
});
