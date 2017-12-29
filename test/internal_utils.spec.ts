// import realAxios from 'axios';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import {transport} from '../src/apis/transport';
import {addTransportBuilder, requester} from '../src/internal_utils';

const { expect } = chai;
chai.use(chaiAsPromised);

// const index       = proxyquire(() => require('../src/index', { './apis/': apiStub, axios}) as  { dposAPI: typeof origDPOSAPI };

const dftOpts = { timeout: 10000 };
describe('internal_utils', () => {
  describe('requester', () => {

    it('should return a fn', () => {
      expect(requester(null, null, null)).to.be.a('function');
    });

    it('should return a fn that calls axios', () => {
      const stub = sinon.stub().returns(Promise.resolve({ data: { success: true } }));
      expect(requester(stub as any, null, dftOpts)({} as any, undefined))
      expect(stub.calledOnce).is.true;
    });

    it('should return a fn that calls axios with correct nodeAddress+url', () => {
      const stub = sinon.stub().returns(Promise.resolve({ data: { success: true } }));

      expect(requester(stub as any, 'http://vekexasia.rules', dftOpts)({} as any, undefined))
      expect(stub.firstCall.args[0].url).to.contain('http://vekexasia.rules');
    });

    it('should return a fn that calls axios with correct nodeAddress+url', () => {
      const stub = sinon.stub().returns(Promise.resolve({ data: { success: true } }));

      expect(requester(stub as any, 'http://vekexasia.rules', dftOpts)({ path: '/hey' } as any, undefined))
      expect(stub.firstCall.args[0].url).to.be.eq('http://vekexasia.rules/api/hey');
    });

    it('should return a fn that calls axios with correct nodeAddress+url without Api Prefix', () => {
      const stub = sinon.stub().returns(Promise.resolve({ data: { success: true } }));

      expect(requester(stub as any, 'http://vekexasia.rules', dftOpts)({ path: '/hey', noApiPrefix: true } as any, undefined))
      expect(stub.firstCall.args[0].url).to.be.eq('http://vekexasia.rules/hey');
    });

    it('should wrap error if promise rejected for some reason', async () => {
      const stub = sinon.stub().returns(Promise.reject('Error'));
      await expect(requester(stub as any, 'http://vekexasia.rules', dftOpts)({
        path       : '/hey',
        noApiPrefix: true
      } as any, undefined))
        .to.be.rejectedWith('Error');
    });

    it('should wrap error if request ok but API fail', async () => {
      const stub = sinon.stub().returns(Promise.resolve({ data: { success: false, error: 'Error' } }));
      await expect(requester(stub as any, 'http://vekexasia.rules', dftOpts)({
        path       : '/hey',
        noApiPrefix: true
      } as any, undefined))
        .to.be.rejectedWith('Error');
    });

    it('should wrap error message if request ok but API fail and no error present', async () => {
      const stub = sinon.stub().returns(Promise.resolve({ data: { success: false, message: 'Error' } }));
      await expect(requester(stub as any, 'http://vekexasia.rules', dftOpts)({
        path       : '/hey',
        noApiPrefix: true
      } as any, undefined))
        .to.be.rejectedWith('Error');
    });

    it('should propagate success to cback also', async () => {
      const data      = { success: true, hey: 'hi' };
      const stub      = sinon.stub().returns(Promise.resolve({ data }));
      const cbackStub = sinon.stub();
      await requester(stub as any, 'http://vekexasia.rules', dftOpts)({ path: '/hey', noApiPrefix: true } as any, cbackStub);

      expect(cbackStub.calledOnce).is.true;
      expect(cbackStub.firstCall.args[0]).not.exist;
      expect(cbackStub.firstCall.args[1]).deep.eq(data);
    });

    it('should propagate error to cback also', async () => {
      const cbackStub = sinon.stub();
      const stub      = sinon.stub().returns(Promise.resolve({ data: { success: false, error: 'Error' } }));
      await expect(requester(stub as any, 'http://vekexasia.rules', dftOpts)({
        path       : '/hey',
        noApiPrefix: true,
      } as any, cbackStub))
        .to.be.rejectedWith('Error');

      expect(cbackStub.calledOnce).is.true;
      expect(cbackStub.firstCall.args[0]).to.exist;
      expect(cbackStub.firstCall.args[0]).to.be.instanceof(Error);
      expect(cbackStub.firstCall.args[0].message).to.be.eq('Error');
    });

  });

  describe('addTransportBuilder', () => {
    let obj;
    beforeEach(() => {
      obj = {
        blocks: {
          getStatus: sinon.stub().returns(Promise.resolve({ nethash: 'nethash' })),
        },
        peers : {
          version: sinon.stub().returns(Promise.resolve({ version: '1.0.0' })),
        },
      };
    });
    it('should augment obj with buildTransport fn', () => {
      addTransportBuilder(obj, null);
      expect(obj.buildTransport).to.exist;
      expect(obj.buildTransport).to.be.a('function');
    });
    describe('buildTransport', () => {
      it('should call peers and blocks related functions', async () => {
        addTransportBuilder(obj, null);
        await obj.buildTransport();
        expect(obj.blocks.getStatus.calledOnce).is.true;
        expect(obj.peers.version.calledOnce).is.true;
      });
      it('shouldnt call creation functions twice if called with flushCache false or undefined', async () => {
        addTransportBuilder(obj, null);
        await obj.buildTransport();
        await obj.buildTransport();
        await obj.buildTransport(false);
        expect(obj.blocks.getStatus.calledOnce).is.true;
        expect(obj.peers.version.calledOnce).is.true;
      });
      it('should call creation functions more than once if flushCache is true', async () => {
        addTransportBuilder(obj, null);
        await obj.buildTransport();
        await obj.buildTransport(true);
        expect(obj.blocks.getStatus.callCount).is.eq(2);
        expect(obj.peers.version.callCount).is.eq(2);
      });
    })
  });
});
