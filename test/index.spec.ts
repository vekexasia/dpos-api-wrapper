import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as express from 'express';
import * as http from 'http';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import {loader} from '../src/apis/loader';
import {transport} from '../src/apis/transport';
import {APIWrapper, dposAPI as origDPOSAPI} from '../src/index';

const { expect } = chai;
chai.use(chaiAsPromised);

const apiStub     = {
  accounts       : sinon.stub().returns({}),
  blocks         : sinon.stub().returns({}),
  dapps          : sinon.stub().returns({}),
  delegates      : sinon.stub().returns({}),
  loader         : sinon.spy(loader), // keeping this to test requester
  multiSignatures: sinon.stub().returns({}),
  peers          : sinon.stub().returns({}),
  signatures     : sinon.stub().returns({}),
  transactions   : sinon.stub().returns({}),
  transport      : sinon.spy(transport), // keeping this to test requester with noApiPrefix
}
const index       = proxyquire('../src/index', { './apis/': apiStub }) as  { dposAPI: typeof origDPOSAPI };
const { dposAPI } = index;

const subpackages = ['accounts', 'blocks', 'dapps', 'delegates', 'loader', 'multiSignatures', 'peers', 'signatures', 'transactions'];
const functions   = ['buildTransport', 'transport'];

describe('dposAPI', () => {
  it('should have field nodeAddress', () => {
    expect(dposAPI.nodeAddress).to.be.string;
  });
  it('should have fn newWrapper', () => {
    expect(dposAPI.newWrapper).to.be.a('function');
  });

  subpackages.forEach((subPac) => {
    it(`should have called .${subPac}`, () => {
      expect(apiStub[subPac].calledOnce).is.true;
    });
  });

  functions.forEach((fn) => {
    it(`should have .${fn}() defined and function`, () => {

      expect(dposAPI[fn]).to.exist;
      expect(dposAPI[fn]).to.be.a('function');
    });
  });

  describe('newWrapper', () => {
    let wrapp: APIWrapper;
    beforeEach(() => {
      wrapp = dposAPI.newWrapper('http://localhost.com');
    });
    it('should create a newWrapper with all the subpackages defined', () => {
      subpackages.forEach((sp) => expect(wrapp[sp]).to.exist);
      functions.forEach((sp) => expect(wrapp[sp]).to.exist);
    });
  });

  describe('buildTransport', () => {
    let wrapp: APIWrapper;
    let versionStub: sinon.SinonStub;
    let statusStub: sinon.SinonStub;
    beforeEach(() => {
      versionStub    = sinon.stub().returns(Promise.resolve({ version: '0.1.0' }));
      statusStub     = sinon.stub().returns(Promise.resolve({ nethash: 'nethash' }));
      apiStub.peers  = sinon.stub().returns({ version: versionStub });
      apiStub.blocks = sinon.stub().returns({ getStatus: statusStub });
      wrapp          = dposAPI.newWrapper('http://localhost.com');

    });
    it('should call version and statusStub', async () => {
      await wrapp.buildTransport();
      expect(versionStub.calledOnce).is.true;
      expect(statusStub.calledOnce).is.true;
    });
    it('should call version and statusStub only once', async () => {
      await wrapp.buildTransport();
      await wrapp.buildTransport();
      expect(versionStub.calledOnce).is.true;
      expect(statusStub.calledOnce).is.true;
    });
    it('should call version status twice if flushCache is true', async () => {
      await wrapp.buildTransport();
      await wrapp.buildTransport(true);
      expect(versionStub.callCount).is.eq(2);
      expect(statusStub.callCount).is.eq(2);
    });
  });

  describe('requester proxy', () => {
    let app: express.Application;
    let server: http.Server;
    beforeEach(() => {
      app            = express();
      server         = app.listen(9090);
      dposAPI.nodeAddress = 'http://localhost:9090';
    });
    afterEach(() => {
      server.close();
    });
    it('should fail if non 2xx', async () => {
      app.use((req, res) => res.status(500).end());
      await expect(dposAPI.loader.status()).to.be.rejectedWith('500');
    });
    it('should fail if success if false and return error if present', async () => {
      app.use((req, res) => res.send({ success: false, error: 'some error' }).end());
      await expect(dposAPI.loader.status()).to.be.rejectedWith('some error');
    });
    it('should fail if success if false and return message if error is not present', async () => {
      app.use((req, res) => res.send({ success: false, message: 'some message error' }).end());
      await expect(dposAPI.loader.status()).to.be.rejectedWith('some message error');
    });
    it('should return the info to the callback if provided', async () => {
      app.use((req, res) => res.send({ success: false, message: 'some message error' }).end());
      const cback = sinon.stub();
      await expect(dposAPI.loader.status(cback)).to.be.rejectedWith('some message error');
      expect(cback.calledOnce).is.true;
      expect(cback.firstCall.args[0]).to.exist;
      expect(cback.firstCall.args[0]).to.be.instanceof(Error);
      expect(cback.firstCall.args[0].message).to.be.eq('some message error');
    });
    it('should not throw if all is fine both in cback and promise style', async () => {
      const data = { success: true, vekexasia: 'is available for hire' };
      app.use((req, res) => res.send(data).end());
      const cback = sinon.stub();
      await expect(dposAPI.loader.status(cback)).to.not.be.rejected;
      expect(cback.calledOnce).is.true;
      expect(cback.firstCall.args[0]).to.not.be.instanceof(Error);
      expect(cback.firstCall.args[1]).to.be.deep.eq(data);
      expect(await dposAPI.loader.status()).to.be.deep.eq(data);
    });
    it('should correctly not use the api Prefix if in transport api', async () => {
      const data = { success: true, vekexasia: 'is available for hire' };
      let theReq:express.Request;
      app.use((req, res) => {
        res.send(data).end();
        theReq = req;
      });
      await dposAPI.transport({nethash: 'nethash'} as any).getHeight();
      expect(theReq).to.exist;
      expect(theReq.url).to.be.eq('/peer/height');
      // Not on the purpose of this test but it also checks the headers are passed
      expect(theReq.header('nethash')).to.be.deep.eq('nethash');
    });
  });
});
