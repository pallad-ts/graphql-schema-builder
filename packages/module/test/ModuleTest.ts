import {Engine, StandardActions} from "@pallad/modules";
import {Container, create} from "alpha-dic";
import {Module} from "@src/Module";
import * as sinon from 'sinon';
import {annotation} from "@src/annotation";
import {References} from "@src/References";
import {TypeRef} from "alpha-dic/compiled/TypeRef";
import {SchemaComposer} from "@pallad/graphql-schema-builder";

describe('Module', () => {

    let schemaBuilder1: sinon.SinonStub;
    let schemaBuilder2: {build: sinon.SinonStub};
    let schemaBuilder3: sinon.SinonStub;
    let container: Container;
    let engine: Engine<{container: Container}>;

    beforeEach(() => {
        container = create();
        engine = new Engine({container});
        schemaBuilder1 = sinon.stub();
        schemaBuilder2 = {
            build: sinon.stub()
        };

        schemaBuilder3 = sinon.stub();

        container.definitionWithValue(schemaBuilder1)
            .annotate(annotation(100));

        container.definitionWithValue(schemaBuilder2)
            .annotate(annotation());

        container.definitionWithValue(schemaBuilder3)
            .annotate(annotation(-10));
    })

    it('basic test', async () => {
        engine.registerModule(new Module());
        await engine.runAction(StandardActions.INITIALIZATION);
        const result = await container.get(References.SCHEMA);


        const schemaComposerMatch = sinon.match.instanceOf(SchemaComposer);
        sinon.assert.calledWithMatch(
            schemaBuilder1,
            schemaComposerMatch
        );

        sinon.assert.calledWithMatch(
            schemaBuilder2.build,
            schemaComposerMatch
        );

        sinon.assert.calledWithMatch(
            schemaBuilder3,
            schemaComposerMatch
        );

        sinon.assert.callOrder(
            schemaBuilder3,
            schemaBuilder2.build,
            schemaBuilder1
        );

        const def = container.findByName(References.SCHEMA);

        expect(def!.type)
            .toEqual(TypeRef.createFromType(SchemaComposer));

        expect(result)
            .toBeInstanceOf(SchemaComposer);
    });

    it('custom schema composer', async () => {
        const composer = new SchemaComposer();
        engine.registerModule(new Module(composer));
        await engine.runAction(StandardActions.INITIALIZATION);
        const result = await container.get(References.SCHEMA);

        sinon.assert.calledWithExactly(
            schemaBuilder1,
            composer
        );

        sinon.assert.calledWithExactly(
            schemaBuilder2.build,
            composer
        );

        sinon.assert.calledWithExactly(
            schemaBuilder3,
            composer
        );

        sinon.assert.callOrder(
            schemaBuilder3,
            schemaBuilder2.build,
            schemaBuilder1
        );

        expect(result)
            .toStrictEqual(composer);
    });

    it('throws error if once of schema builder is not a function or has a shape of builder', async () => {

        container.definitionWithValue({foo: 'bar'})
            .annotate(annotation());

        engine.registerModule(new Module());
        await engine.runAction(StandardActions.INITIALIZATION);

        return expect(container.get(References.SCHEMA))
            .rejects
            .toThrowErrorMatchingSnapshot();
    })
});