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
                tVar: null,
                myValue: 2
            };

            const Model = class model extends AbstractModel {
                constructor() {
                    super();
                    this.tVar = undefined;
                    this.myValue = undefined;
                }
            }
            Model._collectionName = "modelname";

            let abstractRepository = new AbstractRepository(Model);

            let model = new Model();
            model.id = 1;
            model.myValue = 2;
            const obj = abstractRepository.modelToObject(model);

            expect(obj).to.deep.equal(exceptObj);
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
            model.id = 1;
            model.myValue = 2;
            const obj = abstractRepository.modelToObject(model, true);

            expect(obj).to.deep.equal(exceptObj);
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
                    this.myValue = undefined;
                }
            }
            SecondModel._collectionName = "modeltwo";

            // Init sub model
            let subModel = new FirstModel();
            subModel.id = 2;
            subModel.subVal = "This";

            // Init root model
            let rootModel = new SecondModel();
            rootModel.id = 1;
            rootModel.myValue = subModel;

            let abstractRepository = new AbstractRepository(FirstModel);
            const obj = abstractRepository.modelToObject(rootModel, true);

            expect(obj).to.deep.equal(exceptObj);
        });
    });
});
