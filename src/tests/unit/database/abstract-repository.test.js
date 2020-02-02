const expect = require('chai').expect;
const AbstractRepository = require('../../../api/database/abstract-repository');
const AbstractModel = require("../../../api/database/abstract-model");


describe('Check abstractRepository Class', function () {
    // Constructor
    describe('Check Constructor don\'t accept empty model', function () {
        it('Should error if not pass', function () {
            let errorCatch;
            try {
                abstractRepository = new AbstractRepository();
            } catch (e) {
                errorCatch = e;
            }

            const isInstance = errorCatch instanceof TypeError;
            expect(isInstance).to.equal(true);
        });
    });

    describe('Check Constructor don\'t accept model with empty _collectionName', function () {
        it('Should error if not pass', function () {
            const Model = class model extends AbstractModel {
                // No need field on this test
            }
            Model._collectionName = "";

            let errorCatch;
            try {
                abstractRepository = new AbstractRepository(Model);
            } catch (e) {
                errorCatch = e;
            }

            const isInstanceOfTypeError = errorCatch instanceof TypeError;
            expect(isInstanceOfTypeError).to.equal(true);
        });
    });

    describe('Check Constructor accept model with _collectionName not empty', function () {
        it('Should error if not pass', function () {
            const Model = class model extends AbstractModel {
                // No need field on this test
            }
            Model._collectionName = "modelname";

            let abstractRepository = new AbstractRepository(Model);
            expect(typeof abstractRepository).to.equal("object");
        });
    });

    // method: modelToObject
    describe('Check modelToObject don\'t accept empty model', function () {
        it('Should error if not pass', function () {
            const Model = class model extends AbstractModel {
                // No need field on this test
            }
            Model._collectionName = "modelname";

            let abstractRepository = new AbstractRepository(Model);
            let errorCatch;
            try {
                abstractRepository.modelToObject();
            } catch (e) {
                errorCatch = e;
            }

            const isInstanceOfTypeError = errorCatch instanceof Error;
            expect(isInstanceOfTypeError).to.equal(true);
        });
    });

    describe('Check modelToObject map to object in save', function () {
        it('Should error if not pass', function () {
            const exceptObj = {
                id: 1,
                myValue: 2
            };

            const Model = class model extends AbstractModel {
                constructor() {
                    super();
                }
            }
            Model._collectionName = "modelname";

            let abstractRepository = new AbstractRepository(Model);

            let model = new Model();
            model.id = exceptObj.id;
            model.myValue = exceptObj.myValue;
            const obj = abstractRepository.modelToObject(model);

            expect(obj).to.have.property('id', 1);
            expect(obj).to.have.property('myValue', 2);
            expect(obj).to.have.property('created_at').to.be.an('number');
            expect(obj).to.have.property('updated_at').to.be.an('number');
        });
    });

    describe('Check modelToObject map to object in update', function () {
        it('Should error if not pass', function () {
            const exceptObj = {
                id: 1,
                myValue: 2
            };

            const Model = class model extends AbstractModel {
                constructor() {
                    super();
                    this.tVar = undefined;
                }
            }
            Model._collectionName = "modelname";

            let abstractRepository = new AbstractRepository(Model);

            let model = new Model();
            model.id = exceptObj.id;
            model.myValue = exceptObj.myValue;
            model.created_at = null;
            const obj = abstractRepository.modelToObject(model, true);

            expect(obj).to.have.property('id', 1);
            expect(obj).to.have.property('myValue', 2);
            expect(obj).to.have.property('tVar').to.be.null;
            expect(obj).to.have.property('created_at').to.be.null;
            expect(obj).to.have.property('updated_at').to.be.an('number');
        });
    });

    describe('Check modelToObject map to object with subobject', function () {
        it('Should error if not pass', function () {
            const exceptObj = {
                id: 1,
                myValue: {
                    id: 2,
                    subVal: "This"
                }
            };

            // Model 1
            const FirstModel = class model extends AbstractModel {
                constructor() {
                    super();
                    this.subVal = undefined;
                }
            }
            FirstModel._collectionName = "modelone";

            // Model 2
            const SecondModel = class model extends AbstractModel {
                constructor() {
                    super();
                }
            }
            SecondModel._collectionName = "modeltwo";

            // Init sub model
            let subModel = new SecondModel();
            subModel.id = exceptObj.myValue.id;
            subModel.subVal = exceptObj.myValue.subVal;

            // Init root model
            let rootModel = new FirstModel();
            rootModel.id = exceptObj.id;
            rootModel.myValue = subModel;

            let abstractRepository = new AbstractRepository(FirstModel);
            const obj = abstractRepository.modelToObject(rootModel, true);

            expect(obj).to.have.property('id', exceptObj.id);
            expect(obj).to.have.nested.property('myValue').deep.equal(exceptObj.myValue);
            expect(obj).to.have.property('created_at').to.be.null;
            expect(obj).to.have.property('updated_at').to.be.an('number');
        });
    });
});
