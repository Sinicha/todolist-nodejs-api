'use strict';
const expect = require('chai').expect;
const EsManager = require("../../../api/database/manager");


describe('Check Elasticsearch manager', function () {
    describe('Check Elasticsearch Manager init exist', function () {
        it('Should error if not pass ', function () {
            let esManager = new EsManager();
            expect(esManager).to.instanceOf(EsManager);
        });
    });

    describe('Check Elasticsearch Manager init client is not empty', function () {
        it('Should error if not pass ', function () {
            let client = new EsManager().getClient();
            expect(client).to.not.be.null.and.to.not.be.undefined;
        });
    });

    describe('Check Elasticsearch Manager init client once', function () {
        it('Should error if not pass ', function () {
            let client1 = new EsManager().getClient();
            let client2 = new EsManager().getClient();

            expect(client1).to.equal(client2);
        });
    });
});
