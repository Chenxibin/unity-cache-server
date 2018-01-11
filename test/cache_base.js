const tmp = require('tmp');
const fs = require('fs-extra');
const { CacheBase, PutTransaction } = require('../lib/cache/cache_base');
const assert = require('assert');
const _ = require('lodash');
const path = require('path');
const randomBuffer = require('./test_utils').randomBuffer;
const consts = require('../lib/constants');

describe("Cache: Base Class", () => {
    let cache;

    let opts = {
        cachePath: tmp.tmpNameSync({}),
    };

    beforeEach(() => {
        cache = new CacheBase();
    });

    describe("static get properties", () => {
        it("should return an empty object", () => {
            assert(_.isEmpty(CacheBase.properties));
        });
    });

    describe("get _optionsPath", () => {
        it("should return 'Cache.options'", () => {
            assert(cache._optionsPath === 'Cache.options');
        });
    });

    describe("get _options", () => {
        it("should return an object with options for all built-in cache modules", () => {
            let cacheOptions = cache._options;
            assert(typeof(cacheOptions) === 'object');
            assert(cacheOptions.hasOwnProperty('cache_fs'));
            assert(cacheOptions.hasOwnProperty('cache_membuf'));
        });

        it("should apply option overrides", () => {
            cache._optionOverrides = {
                $testVal: { nested: { option: true } }
            };

            let cacheOptions = cache._options;
            assert(cacheOptions.hasOwnProperty('$testVal'));
            assert(cacheOptions.$testVal.nested.option === true);
        });
    });

    describe("get _cachePath", () => {
        it("should return null if there is no cachePath option set", () => {
            assert(cache._cachePath === null);
        });

        it("should return the exact value of cachePath if cachePath is an absolute path", () => {
            cache._optionOverrides = opts;
            assert(cache._cachePath === opts.cachePath);
        });

        it("should return a subdirectory path relative to the app root if cachePath is not an abosolute path", () => {
            cache._optionOverrides = {
                cachePath: "abc123"
            };

            assert(cache._cachePath === path.join(path.dirname(require.main.filename), "abc123"));
        });
    });

    describe("init", () => {

        after(() => {
            return fs.remove(opts.cachePath);
        });

        it("should create the cache working directory if it doesn't exist", () => {
            return cache.init(opts)
                .then(() => fs.access(opts.cachePath));
        });
    });

    describe("shutdown", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            return cache.shutdown()
                .then(() => { throw new Error("Expected error!"); }, () => {});
        });
    });

    describe("getFileInfo", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            return cache.getFileInfo()
                .then(() => { throw new Error("Expected error!"); }, () => {});
        });
    });

    describe("getFileStream", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            return cache.getFileStream()
                .then(() => { throw new Error("Expected error!"); }, () => {});
        });
    });

    describe("createPutTransaction", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            return cache.createPutTransaction()
                .then(() => { throw new Error("Expected error!"); }, () => {});
        });
    });

    describe("endPutTransaction", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            return cache.endPutTransaction()
                .then(() => { throw new Error("Expected error!"); }, () => {});
        });
    });

    describe("registerClusterWorker", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            let error;
            try {
                cache.registerClusterWorker();
            }
            catch(err) {
                error = err;
            }
            finally {
                assert(error);
            }
        });
    });
});

describe("PutTransaction: Base Class", () => {
    let guid = randomBuffer(consts.GUID_SIZE);
    let hash = randomBuffer(consts.HASH_SIZE);
    let trx = new PutTransaction(guid, hash);

    describe("get guid", () => {
        it("should return the guid passed to the constructor", () => {
            assert(guid.compare(trx.guid) === 0);
        });
    });

    describe("get hash", () => {
        it("should return the hash passed to the constructor", () => {
            assert(hash.compare(trx.hash) === 0);
        });
    });

    describe("get files", () => {
        it("should return an empty array", () => {
            assert(trx.files.length === 0);
        });
    });

    describe("finalize", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            return trx.finalize()
                .then(() => { throw new Error("Expected error!"); }, () => {});
        });
    });

    describe("getWriteStream", () => {
        it("should require override implementation in subclasses by returning an error", () => {
            return trx.getWriteStream('i', 0)
                .then(() => { throw new Error("Expected error!"); }, () => {});
        });
    });
});