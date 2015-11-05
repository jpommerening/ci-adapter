import expect from 'expect.js';
import { Adapter } from '../lib/adapter';

describe( 'An Adapter', function() {
  const adapter = new Adapter();

  it( 'has a getBuilders() method', function() {
    expect(adapter.getBuilders).to.be.a(Function);
  } );
  it( 'has a getBuilds() method', function() {
    expect(adapter.getBuilds).to.be.a(Function);
  } );
  it( 'has a getBuildDetails() method', function() {
    expect(adapter.getBuildDetails).to.be.a(Function);
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

  describe( '#getBuilds(builder)', function() {
    it( 'returns a Promise …', function() {
      expect(adapter.getBuilds({})).to.be.a(Promise);
    } );
    it( '… resolving to a list of builds', function() {
      return adapter.getBuilds({}).then(function(builds) {
        expect(builds).to.be.an(Array);
      });
    } );
  } );

  describe( '#getBuildDetails(build)', function() {
    it( 'returns a Promise …', function() {
      expect(adapter.getBuildDetails({})).to.be.a(Promise);
    } );
    it( '… resolving to an object with build details', function() {
      return adapter.getBuildDetails({}).then(function(details) {
        expect(details).to.be.an(Object);
      });
    } );
  } );

} );
