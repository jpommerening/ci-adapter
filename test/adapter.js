import expect from 'expect.js';
import { Adapter } from '../src/adapter';

describe( 'An Adapter', function() {
  const adapter = new Adapter();

  it( 'has a getInfo() method', function() {
    expect(adapter.getInfo).to.be.a(Function);
  } );
  it( 'has a getBuilders() method', function() {
    expect(adapter.getBuilders).to.be.a(Function);
  } );
  it( 'has a getBuilds() method', function() {
    expect(adapter.getBuilds).to.be.a(Function);
  } );

  describe( '#getInfo()', function() {
    it( 'returns a Promise …', function() {
      expect(adapter.getInfo()).to.be.a(Promise);
    } );
    it( '… resolving to an object with information about the adapter', function() {
      return adapter.getInfo().then(function(details) {
        expect(details).to.be.an(Object);
      });
    } );
  } );

  describe( '#getBuilder(name)', function() {
  } );

  describe( '#getBuild(name, number)', function() {
  } );

  describe( '#getBuilders()', function() {
    it( 'returns a Promise …', function() {
      expect(adapter.getBuilders()).to.be.a(Promise);
    } );
    it( '… resolving to a list of builders', function() {
      return adapter.getBuilders().then(function(builders) {
        expect(builders).to.be.an(Array);
      });
    } );
  } );

  describe( '#getBuilds(name)', function() {
    it( 'returns a Promise …', function() {
      expect(adapter.getBuilds('builder')).to.be.a(Promise);
    } );
    it( '… resolving to a list of builds', function() {
      return adapter.getBuilds('builder').then(function(builds) {
        expect(builds).to.be.an(Array);
      });
    } );
  } );

  describe( '#getAllBuilds()', function() {
    it( 'returns a Promise …', function() {
      expect(adapter.getAllBuilds()).to.be.a(Promise);
    } );
    it( '… resolving to a list of builds', function() {
      return adapter.getAllBuilds().then(function(builds) {
        expect(builds).to.be.an(Array);
      });
    } );
  } );

} );
